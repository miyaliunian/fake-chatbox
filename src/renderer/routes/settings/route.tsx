import Page from '@/components/Page'
import { useIsSmallScreen } from '@/hooks/useScreenChange'
import platform from '@/platform'
import { featureFlags } from '@/utils/feature-flags'
import { Box, Flex, Stack, Text } from '@mantine/core'
import { IconButton, Box as MuiBox, useTheme } from '@mui/material'
import {
  IconAdjustmentsHorizontal,
  IconBox,
  IconCategory,
  IconChevronRight,
  IconCircleDottedLetterM,
  IconKeyboard,
  IconMessages,
  IconWorldWww,
} from '@tabler/icons-react'
import { createFileRoute, Link, Outlet, useCanGoBack, useRouter, useRouterState } from '@tanstack/react-router'
import clsx from 'clsx'
import { ChevronLeft } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Toaster } from 'sonner'

const ITEMS = [
  {
    key: 'provider',
    label: 'Model Provider',
    icon: <IconCategory className="w-full h-full" />,
  },
  {
    key: 'default-models',
    label: 'Default Models',
    icon: <IconBox className="w-full h-full" />,
  },
  {
    key: 'web-search',
    label: 'Web Search',
    icon: <IconWorldWww className="w-full h-full" />,
  },
  // ...(featureFlags.mcp
  //   ? [
  //       {
  //         key: 'mcp',
  //         label: 'MCP',
  //         icon: <IconCircleDottedLetterM className="w-full h-full" />,
  //       },
  //     ]
  //   : []),
  {
    key: 'chat',
    label: 'Chat Settings',
    icon: <IconMessages className="w-full h-full" />,
  },
  ...(platform.type === 'mobile'
    ? []
    : [
        {
          key: 'hotkeys',
          label: 'Keyboard Shortcuts',
          icon: <IconKeyboard className="w-full h-full" />,
        },
      ]),
  {
    key: 'general',
    label: 'General Settings',
    icon: <IconAdjustmentsHorizontal className="w-full h-full" />,
  },
]

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const router = useRouter()
  const routerState = useRouterState()
  const canGoBack = useCanGoBack()
  const key = routerState.location.pathname.split('/')[2]
  const isSmallScreen = useIsSmallScreen()
  const theme = useTheme()

  // 左侧面板宽度状态管理
  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('settings-left-panel-width')
      return saved ? parseInt(saved, 10) : 256
    }
    return 256
  })
  const [isDragging, setIsDragging] = useState(false)

  // 保存宽度到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('settings-left-panel-width', leftPanelWidth.toString())
    }
  }, [leftPanelWidth])

  // 拖拽处理函数
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isSmallScreen) return // 小屏幕禁用拖拽

      e.preventDefault()
      setIsDragging(true)

      const startX = e.clientX
      const startWidth = leftPanelWidth

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX
        const newWidth = Math.max(200, Math.min(500, startWidth + deltaX)) // 限制宽度范围 200-500px
        setLeftPanelWidth(newWidth)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [isSmallScreen, leftPanelWidth]
  )

  // 添加拖拽时的样式
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  return (
    <Page
      title={t('Settings')}
      left={
        isSmallScreen && routerState.location.pathname !== '/settings' && canGoBack ? (
          <MuiBox onClick={() => router.history.back()}>
            <IconButton
              sx={
                isSmallScreen
                  ? {
                      borderColor: theme.palette.action.hover,
                      borderStyle: 'solid',
                      borderWidth: 1,
                    }
                  : {}
              }
            >
              <ChevronLeft size="20" />
            </IconButton>
          </MuiBox>
        ) : undefined
      }
    >
      <Flex flex={1} h="100%">
        {(!isSmallScreen || routerState.location.pathname === '/settings') && (
          <>
            <Stack
              p={isSmallScreen ? 0 : 'xs'}
              gap={isSmallScreen ? 0 : 'xs'}
              style={{
                width: isSmallScreen ? '100%' : leftPanelWidth,
                minWidth: isSmallScreen ? 'auto' : 200,
                maxWidth: isSmallScreen ? 'auto' : 500,
              }}
              className={clsx(
                'border-solid border-0 overflow-auto',
                isSmallScreen ? 'border-r-0' : 'border-r border-[var(--mantine-color-chatbox-border-primary-outline)]'
              )}
            >
              {ITEMS.map((item) => (
                <Link
                  disabled={routerState.location.pathname.startsWith(`/settings/${item.key}`)}
                  key={item.key}
                  to={`/settings/${item.key}` as any}
                  className={clsx(
                    'no-underline',
                    isSmallScreen
                      ? 'border-solid border-0 border-b border-[var(--mantine-color-chatbox-border-primary-outline)]'
                      : ''
                  )}
                >
                  <Flex
                    component="span"
                    gap="xs"
                    p="md"
                    align="center"
                    c={item.key === key ? 'chatbox-brand' : 'chatbox-secondary'}
                    bg={item.key === key ? 'var(--mantine-color-chatbox-brand-light)' : 'transparent'}
                    className="cursor-pointer select-none rounded-md hover:!bg-[var(--mantine-color-chatbox-brand-outline-hover)]"
                  >
                    <Box component="span" flex="0 0 auto" w={20} h={20} mr="xs">
                      {item.icon}
                    </Box>
                    <Text flex={1} lineClamp={1} span={true} className="!text-inherit">
                      {t(item.label)}
                    </Text>
                    {isSmallScreen && (
                      <IconChevronRight size={20} className="!text-[var(--mantine-color-chatbox-tertiary-outline)]" />
                    )}
                  </Flex>
                </Link>
              ))}
            </Stack>

            {/* 拖拽分隔条 - 仅在非小屏幕时显示 */}
            {!isSmallScreen && (
              <Box
                w={4}
                h="100%"
                onMouseDown={handleMouseDown}
                className={clsx(
                  'cursor-col-resize transition-colors duration-200 flex-shrink-0',
                  isDragging ? 'bg-blue-400' : 'bg-transparent hover:bg-blue-200'
                )}
                style={{
                  borderLeft: isDragging ? '1px solid #3b82f6' : 'none',
                }}
              />
            )}
          </>
        )}

        {!(isSmallScreen && routerState.location.pathname === '/settings') && (
          <Box flex={1} className="overflow-auto">
            <Outlet />
          </Box>
        )}
      </Flex>
      <Toaster richColors position="bottom-center" />
    </Page>
  )
}
