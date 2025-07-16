import {
  Alert,
  Badge,
  Button,
  Flex,
  Modal,
  Paper,
  PasswordInput,
  Progress,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import {
  IconArrowRight,
  IconBulb,
  IconCircleCheckFilled,
  IconCircleMinus,
  IconCirclePlus,
  IconExclamationCircle,
  IconExternalLink,
  IconEye,
  IconHelp,
  IconRefresh,
  IconRestore,
  IconTool,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { type ModelProvider, ModelProviderEnum } from 'src/shared/types'
import useChatboxAIModels from '@/hooks/useChatboxAIModels'
import { useProviderSettings, useSettings } from '@/hooks/useSettings'
import { trackingEvent } from '@/packages/event'
import { getLicenseDetailRealtime } from '@/packages/remote'
import platform from '@/platform'
import { languageAtom } from '@/stores/atoms'
import * as premiumActions from '@/stores/premiumActions'

const useLicenseDetail = (licenseKey: string) => {
  const { data: licenseDetail, ...others } = useQuery({
    queryKey: ['license-detail', licenseKey],
    queryFn: async () => {
      const res = await getLicenseDetailRealtime({ licenseKey })
      return res
    },
    enabled: !!licenseKey,
  })

  return {
    licenseDetail,
    ...others,
  }
}

export const Route = createFileRoute('/settings/provider/chatbox-ai')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const language = useAtomValue(languageAtom)
  const providerId: ModelProvider = ModelProviderEnum.ChatboxAI
  const { providerSettings, setProviderSettings } = useProviderSettings(providerId)
  const { settings } = useSettings()

  const [licenseKey, setLicenseKey] = useState(settings.licenseKey || '')

  const activated = premiumActions.useAutoValidate()
  const [activating, setActivating] = useState(false)
  const [activateError, setActivateError] = useState<string>()

  const { allChatboxAIModels, chatboxAIModels, refetch: refetchChatboxAIModels } = useChatboxAIModels()
  const deleteModel = (modelId: string) => {
    setProviderSettings({
      excludedModels: [...(providerSettings?.excludedModels || []), modelId],
    })
  }

  const resetModels = () => {
    setProviderSettings({
      models: [],
      excludedModels: [],
    })
  }

  const activate = async () => {
    try {
      setActivating(true)
      setActivateError(undefined)
      const result = await premiumActions.activate(licenseKey || '')
      if (!result.valid) {
        setActivateError(result.error)
      }
    } catch (e: any) {
      setActivateError(e?.message || 'unknow error')
    } finally {
      setActivating(false)
    }
  }

  // 自动激活
  useEffect(() => {
    if (
      licenseKey &&
      licenseKey.length >= 36 &&
      !settings.licenseInstances?.[licenseKey] // 仅当 license key 还没激活
    ) {
      console.log('auto activate')
      activate()
    }
  }, [licenseKey])

  const [showFetchedModels, setShowFetchedModels] = useState(false)
  const handleFetchModels = () => {
    refetchChatboxAIModels()
    setShowFetchedModels(true)
  }

  const { licenseDetail } = useLicenseDetail(settings.licenseKey || '')

  return (
    <Stack gap="xxl">
      <Flex gap="xs" align="center">
        <Title order={3} c="chatbox-secondary">
          算大师
        </Title>
        {/* <Button
          variant="transparent"
          c="chatbox-tertiary"
          px={0}
          h={24}
          onClick={() => platform.openLink('https://chatboxai.app')}
        >
          <IconExternalLink size={24} />
        </Button> */}

        {/* <Flex gap="xxs" align="center" className="ml-auto" c="chatbox-brand">
          <IconHelp size={16} />
          <Text
            component="a"
            c="chatbox-brand"
            className="!underline"
            href={`https://chatboxai.app/redirect_app/how_to_use_license/${language}`}
            target="_blank"
          >
            {t('How to use?')}
          </Text>
        </Flex> */}
      </Flex>

      <Stack gap="xl">
        <Stack gap="xxs">
          <Flex justify="space-between" align="center">
            <Text span fw="600">
              {t('Model')}
            </Text>
            <Flex gap="sm" align="center" justify="flex-end">
              <Button
                variant="light"
                color="chatbox-gray"
                c="chatbox-secondary"
                size="compact-xs"
                px="sm"
                onClick={resetModels}
                leftSection={<IconRestore size={12} />}
              >
                {t('Reset')}
              </Button>

              <Button
                variant="light"
                color="chatbox-gray"
                c="chatbox-secondary"
                size="compact-xs"
                px="sm"
                onClick={handleFetchModels}
                leftSection={<IconRefresh size={12} />}
              >
                {t('Fetch')}
              </Button>
            </Flex>
          </Flex>

          <Stack
            gap={0}
            p="xxs"
            className="border-solid border rounded-sm min-h-[100px] border-[var(--mantine-color-chatbox-border-primary-outline)]"
          >
            {chatboxAIModels.map((model) => (
              <Flex
                key={model.modelId}
                gap="xs"
                align="center"
                p="sm"
                px="xs"
                className="border-solid border-0 border-b last:border-b-0 border-[var(--mantine-color-chatbox-border-primary-outline)]"
              >
                <Text
                  component="span"
                  size="sm"
                  flex="0 1 auto"
                  c={model.labels?.includes('recommended') ? 'chatbox-brand' : undefined}
                >
                  {model.nickname || model.modelId}
                </Text>

                {model.labels?.includes('pro') && (
                  <Badge color="chatbox-brand" size="xs" variant="light">
                    Pro
                  </Badge>
                )}

                <Flex flex="0 0 auto" gap="xs" align="center">
                  {model.capabilities?.includes('reasoning') && (
                    <Tooltip label={t('Reasoning')}>
                      <Text span c="chatbox-warning" className="flex items-center">
                        <IconBulb size={20} />
                      </Text>
                    </Tooltip>
                  )}
                  {model.capabilities?.includes('vision') && (
                    <Tooltip label={t('Vision')}>
                      <Text span c="chatbox-brand" className="flex items-center">
                        <IconEye size={20} />
                      </Text>
                    </Tooltip>
                  )}
                  {model.capabilities?.includes('tool_use') && (
                    <Tooltip label={t('Tool Use')}>
                      <Text span c="chatbox-success" className="flex items-center">
                        <IconTool size={20} />
                      </Text>
                    </Tooltip>
                  )}
                </Flex>

                <Flex flex="0 0 auto" gap="xs" align="center" className="ml-auto">
                  {/* <Button
                    variant="transparent"
                    c="chatbox-tertiary"
                    p={0}
                    h="auto"
                    size="xs"
                    bd={0}
                    onClick={() => editModel(model)}
                  >
                    <IconSettings size={20} />
                  </Button> */}

                  <Button
                    variant="transparent"
                    c="chatbox-error"
                    p={0}
                    h="auto"
                    size="compact-xs"
                    bd={0}
                    onClick={() => deleteModel(model.modelId)}
                  >
                    <IconCircleMinus size={20} />
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Stack>
        </Stack>
      </Stack>

      <Modal
        keepMounted={false}
        opened={showFetchedModels}
        onClose={() => setShowFetchedModels(false)}
        title={t('Edit Model')}
        centered={true}
      >
        <Stack gap="md">
          {allChatboxAIModels?.map((model) => (
            <Flex key={model.modelId} align="center" gap="xs">
              <Text
                component="span"
                size="sm"
                flex="0 1 auto"
                c={model.labels?.includes('recommended') ? 'chatbox-brand' : undefined}
              >
                {model.nickname || model.modelId}
              </Text>
              {model.labels?.includes('pro') && (
                <Badge color="chatbox-brand" size="xs" variant="light">
                  Pro
                </Badge>
              )}

              <Flex flex="0 0 auto" gap="xs" align="center">
                {model.capabilities?.includes('reasoning') && (
                  <Tooltip label={t('Reasoning')}>
                    <IconBulb size={20} className="text-[var(--mantine-color-chatbox-warning-text)]" />
                  </Tooltip>
                )}
                {model.capabilities?.includes('vision') && (
                  <Tooltip label={t('Vision')}>
                    <IconEye size={20} className="text-[var(--mantine-color-chatbox-brand-text)]" />
                  </Tooltip>
                )}
                {model.capabilities?.includes('tool_use') && (
                  <Tooltip label={t('Tool Use')}>
                    <IconTool size={20} className="text-[var(--mantine-color-chatbox-success-text)]" />
                  </Tooltip>
                )}
              </Flex>

              {!providerSettings?.excludedModels?.includes(model.modelId) ? (
                <Button
                  variant="transparent"
                  p={0}
                  h="auto"
                  size="xs"
                  bd={0}
                  className="ml-auto"
                  onClick={() =>
                    setProviderSettings({
                      excludedModels: [...(providerSettings?.excludedModels || []), model.modelId],
                    })
                  }
                >
                  <IconCircleMinus size={20} className="text-[var(--mantine-color-chatbox-error-text)]" />
                </Button>
              ) : (
                <Button
                  variant="transparent"
                  p={0}
                  h="auto"
                  size="xs"
                  bd={0}
                  className="ml-auto"
                  onClick={() =>
                    setProviderSettings({
                      excludedModels: (providerSettings?.excludedModels || []).filter((m) => m !== model.modelId),
                    })
                  }
                >
                  <IconCirclePlus size={20} className="text-[var(--mantine-color-chatbox-success-text)]" />
                </Button>
              )}
            </Flex>
          ))}
        </Stack>
      </Modal>
    </Stack>
  )
}
