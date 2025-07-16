/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2025-07-16 11:16:27
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2025-07-16 16:56:46
 * @FilePath: /chatbox/src/main/autoLauncher.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import AutoLaunch from 'auto-launch'
import { getSettings } from './store-node'

// 开机自启动
let _autoLaunch: AutoLaunch | null = null

export function get() {
  if (!_autoLaunch) {
    _autoLaunch = new AutoLaunch({ name: '算大师' })
  }
  return _autoLaunch
}

export async function sync() {
  const autoLaunch = get()
  const settings = getSettings()
  const isEnabled = await autoLaunch.isEnabled()
  if (!isEnabled && settings.autoLaunch) {
    await autoLaunch.enable()
    return
  }
  if (isEnabled && !settings.autoLaunch) {
    await autoLaunch.disable()
    return
  }
}

export async function ensure(enable: boolean) {
  const autoLaunch = get()
  const isEnabled = await autoLaunch.isEnabled()
  if (!isEnabled && enable) {
    await autoLaunch.enable()
    return
  }
  if (isEnabled && !enable) {
    await autoLaunch.disable()
    return
  }
}
