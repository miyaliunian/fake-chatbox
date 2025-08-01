import NiceModal from '@ebay/nice-modal-react'
import { ActionIcon, Avatar, Button, Divider, Flex, ScrollArea, Stack, Text } from '@mantine/core'
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react'
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type CopilotDetail, createMessage, type Session } from 'src/shared/types'
import { v4 as uuidv4 } from 'uuid'
import InputBox, { type InputBoxPayload } from '@/components/InputBox'
// import HomepageIcon from '@/components/icons/HomepageIcon'
// import HomepageIcon from '../static/1024.png'
import HomepageIcon from '../static/masterLogo.png'
import Page from '@/components/Page'
import { useMyCopilots, useRemoteCopilots } from '@/hooks/useCopilots'
import { useIsSmallScreen } from '@/hooks/useScreenChange'
import { useSettings } from '@/hooks/useSettings'
import platform from '@/platform'
import { chatSessionSettingsAtom } from '@/stores/atoms'
import * as sessionActions from '@/stores/sessionActions'
import { initEmptyChatSession } from '@/stores/sessionActions'
import { createSession } from '@/stores/sessionStorageMutations'
import { delay } from '@/utils'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { t } = useTranslation()
  const isSmallScreen = useIsSmallScreen()

  const [chatSessionSettings] = useAtom(chatSessionSettingsAtom)
  const { settings } = useSettings()

  const [session, setSession] = useState<Session>({
    id: 'new',
    ...initEmptyChatSession(),
  })

  // 添加状态来跟踪是否有用户交互
  const [hasInteracted, setHasInteracted] = useState(false)

  // 理论上 initEmptyChatSession 的时候就已经读取了chatSessionSettingsAtom的值了，但是由于atom是异步的，冷启动的时候大概率会拿到一个空值，所以这里再设置一次
  useEffect(() => {
    setSession((old) => ({
      ...old,
      settings: {
        ...old.settings,
        maxContextMessageCount: settings.maxContextMessageCount || 6,
        temperature: settings.temperature || undefined,
        topP: settings.topP || undefined,
        ...(settings.defaultChatModel
          ? {
              provider: settings.defaultChatModel.provider,
              modelId: settings.defaultChatModel.model,
            }
          : chatSessionSettings),
      },
    }))
  }, [chatSessionSettings, settings])

  const selectedModel = useMemo(() => {
    if (session.settings?.provider && session.settings.modelId) {
      return {
        provider: session.settings.provider,
        modelId: session.settings.modelId,
      }
    }
  }, [session])

  const { copilots: myCopilots } = useMyCopilots()
  const { copilots: remoteCopilots } = useRemoteCopilots()
  const selectedCopilotId = useMemo(() => session?.copilotId, [session?.copilotId])
  const selectedCopilot = useMemo(
    () =>
      myCopilots.find((c: CopilotDetail) => c.id === selectedCopilotId) ||
      remoteCopilots.find((c: CopilotDetail) => c.id === selectedCopilotId),
    [myCopilots, remoteCopilots, selectedCopilotId]
  )
  useEffect(() => {
    setSession((old) => ({
      ...old,
      picUrl: selectedCopilot?.picUrl,
      name: selectedCopilot?.name || '新会话',
      messages: selectedCopilot
        ? [
            {
              id: uuidv4(),
              role: 'system',
              contentParts: [
                {
                  type: 'text',
                  text: selectedCopilot.prompt,
                },
              ],
            },
          ]
        : initEmptyChatSession().messages,
    }))
  }, [selectedCopilot])

  const routerState = useRouterState()
  useEffect(() => {
    const { copilotId } = routerState.location.search as any
    if (copilotId) {
      setSession((old) => ({ ...old, copilotId }))
    }
  }, [routerState.location.search])

  const handleSubmit = async ({
    needGenerating = true,
    input = '',
    pictureKeys = [],
    attachments = [],
    links = [],
    webBrowsing = false,
  }: InputBoxPayload) => {
    const newSession = await createSession({
      name: session.name,
      type: 'chat',
      picUrl: session.picUrl,
      messages: session.messages,
      copilotId: session.copilotId,
      settings: session.settings,
    })

    sessionActions.switchCurrentSession(newSession.id)

    const newMessage = createMessage('user', input)
    if (pictureKeys && pictureKeys.length > 0) {
      newMessage.contentParts.push(...pictureKeys.map((k) => ({ type: 'image' as const, storageKey: k })))
    }
    // FIXME: submitNewUserMessage内部会使用到getSession，getSession读取了一个动态的atom，是异步的，所以暂时通过延时来解决，否则会导致无法生成消息
    await delay(200)

    await sessionActions.submitNewUserMessage({
      currentSessionId: newSession.id,
      newUserMsg: newMessage,
      needGenerating,
      attachments,
      links,
      webBrowsing,
    })
    return true
  }

  return (
    <Page title="">
      <div className="p-0 flex flex-col h-full">
        {!hasInteracted ? (
          // 默认居中布局
          <div className="flex flex-col justify-center items-center h-full px-4 transition-all duration-300 ease-in-out">
            <Stack align="center" justify="center" gap={isSmallScreen ? 'lg' : 'xl'} className="w-full max-w-4xl">
              <Stack align="center" gap="sm">
                <img src={HomepageIcon} className="w-24 h-6 mr-2 align-middle inline-block object-contain" />
                {/* <HomepageIcon className="h-8" /> */}
                <Text fw="600" size={isSmallScreen ? 'sm' : 'xl'}>
                  {t('What can I help you with today?')}
                </Text>
              </Stack>

              {session.copilotId ? (
                <Stack gap="sm" className="w-full">
                  <Flex align="center" gap="sm" justify="center">
                    <CopilotItem name={session.name || '新会话'} picUrl={session.picUrl} selected />
                    <ActionIcon
                      size={32}
                      radius={16}
                      c="chatbox-tertiary"
                      bg="#F1F3F5"
                      onClick={() => setSession((old) => ({ ...old, copilotId: undefined }))}
                    >
                      <IconX size={24} />
                    </ActionIcon>
                  </Flex>

                  <Text c="chatbox-secondary" className="line-clamp-5 text-center">
                    {session.messages[0]?.contentParts
                      ?.map((part) => (part.type === 'text' ? part.text : ''))
                      .join('') || ''}
                  </Text>
                </Stack>
              ) : (
                <div className="w-full">
                  <CopilotPicker onSelect={(copilot) => setSession((old) => ({ ...old, copilotId: copilot?.id }))} />
                </div>
              )}

              <div className="w-full">
                <InputBox
                  variant="centered"
                  sessionType="chat"
                  sessionId="new"
                  model={selectedModel}
                  onSelectModel={(p, m) =>
                    setSession((old) => ({
                      ...old,
                      settings: {
                        ...(old.settings || {}),
                        provider: p,
                        modelId: m,
                      },
                    }))
                  }
                  onClickSessionSettings={async () => {
                    const res: Session = await NiceModal.show('session-settings', {
                      session,
                      disableAutoSave: true,
                    })
                    if (res) {
                      setSession((old) => ({
                        ...old,
                        ...res,
                      }))
                    }
                    return true
                  }}
                  onSubmit={(payload) => {
                    setHasInteracted(true)
                    return handleSubmit(payload)
                  }}
                />
              </div>
            </Stack>
          </div>
        ) : (
          // 提问后的布局（原始布局）
          <>
            <Stack align="center" justify="center" gap="sm" flex={1}>
              <img src={HomepageIcon} className="h-8" />
              <Text fw="600" size={isSmallScreen ? 'sm' : 'md'}>
                {t('What can I help you with today?')}
              </Text>
            </Stack>

            <Stack gap="sm">
              {session.copilotId ? (
                <Stack mx="md" gap="sm">
                  <Flex align="center" gap="sm">
                    <CopilotItem name={session.name || '新会话'} picUrl={session.picUrl} selected />
                    <ActionIcon
                      size={32}
                      radius={16}
                      c="chatbox-tertiary"
                      bg="#F1F3F5"
                      onClick={() => setSession((old) => ({ ...old, copilotId: undefined }))}
                    >
                      <IconX size={24} />
                    </ActionIcon>
                  </Flex>

                  <Text c="chatbox-secondary" className="line-clamp-5">
                    {session.messages[0]?.contentParts
                      ?.map((part) => (part.type === 'text' ? part.text : ''))
                      .join('') || ''}
                  </Text>
                </Stack>
              ) : (
                <CopilotPicker onSelect={(copilot) => setSession((old) => ({ ...old, copilotId: copilot?.id }))} />
              )}

              <InputBox
                sessionType="chat"
                sessionId="new"
                model={selectedModel}
                onSelectModel={(p, m) =>
                  setSession((old) => ({
                    ...old,
                    settings: {
                      ...(old.settings || {}),
                      provider: p,
                      modelId: m,
                    },
                  }))
                }
                onClickSessionSettings={async () => {
                  const res: Session = await NiceModal.show('session-settings', {
                    session,
                    disableAutoSave: true,
                  })
                  if (res) {
                    setSession((old) => ({
                      ...old,
                      ...res,
                    }))
                  }
                  return true
                }}
                onSubmit={handleSubmit}
              />
            </Stack>
          </>
        )}
      </div>
    </Page>
  )
}

const MAX_COPILOTS_TO_SHOW = 10

const CopilotPicker = ({ selectedId, onSelect }: { selectedId?: string; onSelect?(copilot?: CopilotDetail): void }) => {
  const { t } = useTranslation()
  const isSmallScreen = useIsSmallScreen()
  const navigate = useNavigate()
  const { copilots: myCopilots } = useMyCopilots()
  const { copilots: remoteCopilots } = useRemoteCopilots()

  const copilots = useMemo(
    () =>
      myCopilots.length >= MAX_COPILOTS_TO_SHOW
        ? myCopilots
        : [
            ...myCopilots,
            ...(myCopilots.length && remoteCopilots.length ? [undefined] : []),
            ...remoteCopilots
              .filter((c: CopilotDetail) => !myCopilots.map((mc: CopilotDetail) => mc.id).includes(c.id))
              .slice(0, MAX_COPILOTS_TO_SHOW - myCopilots.length - 1),
          ],
    [myCopilots, remoteCopilots]
  )

  const showMoreButton = useMemo(
    () => copilots.length < myCopilots.length + remoteCopilots.length,
    [copilots.length, myCopilots.length, remoteCopilots.length]
  )

  const viewportRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 })

  return (
    !!copilots.length && (
      <Stack mx="md" gap="xs">
        <Flex align="center" justify="space-between">
          <Text size="xxs" c="chatbox-tertiary">
            {t('My Copilots').toUpperCase()}
          </Text>

          {!isSmallScreen && (
            <Flex align="center" gap="sm">
              <ActionIcon
                variant="transparent"
                color="chatbox-tertiary"
                // onClick={() => setPage((p) => Math.max(p - 1, 0))}
                onClick={() => {
                  if (viewportRef.current) {
                    // const scrollWidth = viewportRef.current.scrollWidth
                    const clientWidth = viewportRef.current.clientWidth
                    const newScrollPosition = Math.max(scrollPosition.x - clientWidth, 0)
                    viewportRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' })
                    onScrollPositionChange({ x: newScrollPosition, y: 0 })
                  }
                }}
              >
                <IconChevronLeft size={16} />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="chatbox-tertiary"
                // onClick={() => setPage((p) => p + 1)}
                onClick={() => {
                  if (viewportRef.current) {
                    const scrollWidth = viewportRef.current.scrollWidth
                    const clientWidth = viewportRef.current.clientWidth
                    const newScrollPosition = Math.min(scrollPosition.x + clientWidth, scrollWidth - clientWidth)
                    viewportRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' })
                    onScrollPositionChange({ x: newScrollPosition, y: 0 })
                  }
                }}
              >
                <IconChevronRight size={16} />
              </ActionIcon>
            </Flex>
          )}
        </Flex>

        <ScrollArea
          type={platform.type === 'mobile' ? 'never' : 'hover'}
          scrollbars="x"
          offsetScrollbars="x"
          mx={-16}
          viewportRef={viewportRef}
          onScrollPositionChange={onScrollPositionChange}
        >
          <Flex wrap="nowrap" gap="xs" px={16} className="haha">
            {copilots.map((copilot) =>
              copilot ? (
                <CopilotItem
                  key={copilot.id}
                  name={copilot.name}
                  picUrl={copilot.picUrl}
                  selected={selectedId === copilot.id}
                  onClick={() => {
                    onSelect?.(copilot)
                  }}
                />
              ) : (
                <Divider key="divider" orientation="vertical" my="xs" mx="xxs" />
              )
            )}

            {showMoreButton && (
              <CopilotItem
                name={t('View All Copilots')}
                noAvatar={true}
                selected={false}
                onClick={() =>
                  navigate({
                    to: '/copilots',
                  })
                }
              />
            )}
          </Flex>
        </ScrollArea>
      </Stack>
    )
  )
}

const CopilotItem = ({
  name,
  picUrl,
  selected,
  onClick,
  noAvatar = false,
}: {
  name: string
  picUrl?: string
  selected?: boolean
  onClick?(): void
  noAvatar?: boolean
}) => {
  const isSmallScreen = useIsSmallScreen()
  return (
    <Flex
      align="center"
      gap={isSmallScreen ? 'xxs' : 'xs'}
      py="xs"
      px={isSmallScreen ? 'xs' : 'md'}
      bd={selected ? 'none' : '1px solid var(--mantine-color-chatbox-border-primary-outline)'}
      bg={selected ? 'var(--mantine-color-chatbox-brand-light)' : 'transparent'}
      className={clsx(
        'cursor-pointer shrink-0 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]',
        isSmallScreen ? 'rounded-full' : 'rounded-md'
      )}
      onClick={onClick}
    >
      {!noAvatar && (
        <Avatar src={picUrl} color="chatbox-brand" size={isSmallScreen ? 20 : 24}>
          {name.slice(0, 1)}
        </Avatar>
      )}
      <Text fw="600" c={selected ? 'chatbox-brand' : 'chatbox-primary'}>
        {name}
      </Text>
    </Flex>
  )
}
