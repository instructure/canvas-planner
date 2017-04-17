/* global expect */

import i18n from '../index'
import formatMessage from '../../format-message'

describe('i18n', () => {
  it('sets up locale for future formateMessages', () => {
    i18n.init('enflip')
    expect(formatMessage('Canvas Planner')).toEqual('(ﾉಥ益ಥ）ﾉɹǝuuɐlԀ sɐʌuɐƆ')
  })
})
