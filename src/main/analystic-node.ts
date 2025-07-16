/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2025-07-16 11:16:27
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2025-07-16 16:56:49
 * @FilePath: /chatbox/src/main/analystic-node.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as store from './store-node'
import { app } from 'electron'
import { ofetch } from 'ofetch'

// Measurement Protocol 参考文档
// https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?hl=zh-cn&client_type=gtag
// https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag&hl=zh-cn#required_parameters

// 事件名、参数名，必须是字母、数字、下划线的组合

const measurement_id = `G-B365F44W6E`
const api_secret = `pRnsvLo-REWLVzV_PbKvWg`

export async function event(name: string, params: any = {}) {
  const clientId = store.getConfig().uuid
  const res = await ofetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`,
    {
      method: 'POST',
      body: {
        user_id: clientId,
        client_id: clientId,
        events: [
          {
            name: name,
            params: {
              app_name: '算大师',
              app_version: app.getVersion(),
              chatbox_platform_type: 'desktop',
              chatbox_platform: 'desktop',
              app_platform: process.platform,
              ...params,
            },
          },
        ],
      },
    }
  )
  return res
}
