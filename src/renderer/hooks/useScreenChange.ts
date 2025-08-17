import { useTheme, useMediaQuery } from '@mui/material'
import { useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { useEffect } from 'react'

export default function useScreenChange() {
  const setShowSidebar = useSetAtom(atoms.showSidebarAtom)
  const realIsSmallScreen = useIsSmallScreen()
  useEffect(() => {
    setShowSidebar(!realIsSmallScreen)
  }, [realIsSmallScreen])
}

export function useIsSmallScreen() {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return isSmallScreen
}

export function useScreenDownToMD() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('md'))
}

export function useIsLargeScreen() {
  const theme = useTheme()
  return !useMediaQuery(theme.breakpoints.down('lg'))
}

export function useSidebarWidth() {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  const lg = useMediaQuery(theme.breakpoints.up('lg'))
  const xl = useMediaQuery(theme.breakpoints.up('xl'))

  // 根据屏幕大小返回默认值，但这些值可以被用户拖动覆盖
  if (xl) {
    return 280
  } else if (lg) {
    return 240
  } else if (md) {
    return 220
  } else if (sm) {
    return 200
  } else {
    return 240
  }
}

// 新的hook用于获取用户自定义的侧边栏宽度
export function useCustomSidebarWidth() {
  // 这个需要导入atom，我们稍后在需要的地方直接使用useAtomValue
  return useSidebarWidth() // 暂时返回默认值，实际使用时会被替换
}

export function useInputBoxHeight(): { min: number; max: number } {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  // const lg = useMediaQuery(theme.breakpoints.up('lg'))
  const xl = useMediaQuery(theme.breakpoints.up('xl'))
  if (xl) {
    return { min: 96, max: 480 }
  } else if (md) {
    return { min: 72, max: 384 }
  } else if (sm) {
    return { min: 56, max: 288 }
  } else {
    return { min: 32, max: 192 }
  }
}
