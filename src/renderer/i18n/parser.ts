import { Language } from '../../shared/types'

// 将 electron getLocale、浏览器的 navigator.language 返回的语言信息，转换为应用的 locale
export function parseLocale(locale: string): Language {
  return 'zh-Hans'
}
