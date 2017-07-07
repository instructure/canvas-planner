/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import { FocusStore } from '../focusStore';

describe('setItemToFocus', () => {
  it('throws if you try setting something that does not have a focus method', () => {
    const focusStore = new FocusStore();
    expect(() => {
      focusStore.setItemToFocus({});
    }).toThrow();
  });

  it('sets the itemToFocus', () => {
    const focusStore = new FocusStore();
    const fakeElement = { focus () {} };
    focusStore.setItemToFocus(fakeElement);
    expect(focusStore.itemToFocus).toEqual(fakeElement);
  });
});

describe('focus', () => {
  it('calls the focus method of the itemToFocus', () => {
    const focusStore = new FocusStore();
    const fakeElement = {
      focus: jest.fn()
    };
    focusStore.setItemToFocus(fakeElement);
    focusStore.focus();
    expect(fakeElement.focus).toHaveBeenCalled();
  });

  it('throws if nothing has been set to be focused', () => {
    const focusStore = new FocusStore();
    expect(() => {
      focusStore.focus();
    }).toThrow();
  });

  it('sets the itemToFocus to null after being called', () => {
    const focusStore = new FocusStore();
    const fakeElement = {
      focus: jest.fn()
    };
    focusStore.setItemToFocus(fakeElement);
    focusStore.focus();
    expect(focusStore.itemToFocus).toBe(null);
  });
});
