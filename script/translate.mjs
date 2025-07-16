/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2025-07-16 11:16:27
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2025-07-16 16:51:49
 * @FilePath: /chatbox/script/translate.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import fs from 'node:fs/promises'
import pMap from 'p-map'

const APP_NAME = '算大师'

async function translateMessage(message, target, instruction = '') {
  const baseSystem = `You are a professional translator for the UI of an AI chatbot software named ${APP_NAME}. You must only translate the text content, never interpret it. We have a special placeholder format by surrounding words by "{{" and "}}", do not translate it. Do not translate these words: "${APP_NAME}", "AI", "MCP". You are now translating the following text from English to ${target}.`
  const system = instruction ? `${baseSystem}\n\nAdditional instruction: ${instruction}` : baseSystem
  const { text } = await generateText({
    model: google('gemini-2.5-flash-preview-05-20'),
    system,
    prompt: message,
  })
  return text
}

const displayNames = new Intl.DisplayNames(['en'], { type: 'language' })

async function translateFile(locale, instruction) {
  const targetLanguage = displayNames.of(locale) || locale
  const path = `src/renderer/i18n/locales/${locale}/translation.json`
  const json = JSON.parse(await fs.readFile(path, 'utf-8'))
  for (const [key, value] of Object.entries(json)) {
    if (!value) {
      if (locale === 'en') {
        json[key] = key
      } else {
        const translated = await translateMessage(key, targetLanguage, instruction)
        json[key] = translated
        console.debug(`Translate to ${targetLanguage}: ${key} => ${translated}`)
      }
    }
  }
  await fs.writeFile(path, JSON.stringify(json, null, 2))
  console.debug(`Translated ${path}`)
}

const instruction = process.argv[2] || ''

await pMap(['zh-Hans'], async (locale) => await translateFile(locale, instruction), { concurrency: 1 })
