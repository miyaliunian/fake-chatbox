export default {
  input: ['src/renderer/**/*.{js,jsx,ts,tsx}'],
  output: 'src/renderer/i18n/locales/$LOCALE/$NAMESPACE.json',
  locales: ['zh-Hans'],
  createOldCatalogs: false,
  keepRemoved: true,
  pluralSeparator: false,
  keySeparator: false,
  namespaceSeparator: false,
  sort: true,
}
