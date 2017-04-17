import formatMessage from '../format-message'
import locales from './indexLocales'

export default {
  init: function init (locale) {
    document.documentElement.lang = locale
    formatMessage.setup({
      locale,
      missingTranslation: 'ignore',
      translations: locales,
      generateId: require('format-message-generate-id/underscored_crc32'),
    })
  },
}
