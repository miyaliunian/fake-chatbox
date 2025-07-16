import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import zhHans from './locales/zh-Hans/translation.json'
import changelogZhHans from './changelogs/changelog_zh_Hans'

i18n.use(initReactI18next).init({
  resources: {
    'zh-Hans': {
      translation: zhHans,
    },
  },
  fallbackLng: 'zh-Hans',

  interpolation: {
    escapeValue: false,
  },

  detection: {
    caches: [],
  },
})

export default i18n

export function changelog() {
  return changelogZhHans
}
