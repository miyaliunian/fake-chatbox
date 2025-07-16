/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2025-07-16 11:16:27
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2025-07-16 21:05:16
 * @FilePath: /chatbox/src/renderer/hooks/useSettings.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ProviderSettings, Settings } from 'src/shared/types'
import { useAtom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'
import { useCallback } from 'react'
import { settingsAtom } from '@/stores/atoms'

export const useSettings = () => {
  const [settings, _setSettings] = useAtom(settingsAtom)

  const setSettings = useCallback((update: Partial<Settings> | ((prev: Settings) => Partial<Settings>)) => {
    _setSettings((prev) => {
      const val = typeof update === 'function' ? update(prev) : update
      return {
        ...prev,
        ...val,
      }
    })
  }, [])

  return {
    settings,
    setSettings,
  }
}

export const useProviderSettings = (providerId: string) => {
  const { settings, setSettings } = useSettings()

  const providerSettings = settings.providers?.[providerId]

  const setProviderSettings = (
    val: Partial<ProviderSettings> | ((prev: ProviderSettings | undefined) => Partial<ProviderSettings>)
  ) => {
    setSettings((currentSettings) => {
      const currentProviderSettings = currentSettings.providers?.[providerId] || {}
      const newProviderSettings = typeof val === 'function' ? val(currentProviderSettings) : val

      return {
        providers: {
          ...(currentSettings.providers || {}),
          [providerId]: {
            ...currentProviderSettings,
            ...newProviderSettings,
          },
        },
      }
    })
  }

  return {
    providerSettings,
    setProviderSettings,
  }
}

// https://jotai.org/docs/extensions/immer
export const useImmerSettings = () => {
  return useImmerAtom(settingsAtom)
}
