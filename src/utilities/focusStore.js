/**
 * Handles focusing elements when needed between different places
 */
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
export class FocusStore {
  itemToFocus = null;

  setItemToFocus (item) {
    if (typeof item.focus !== "function") {
      throw new Error('Focus Store: You can only set items to focus that have a focus method.');
    }
    this.itemToFocus = item;
  }

  focus () {
    if (this.itemToFocus == null) {
      throw new Error('Focus Store: You need to set an item before it can be focused.');
    }

    // TODO: Make less hacky this: currently is a bandaid over the scrolling when saving a todo issue
    var save = document.body.scrollTop;
    this.itemToFocus.focus();
    document.body.scrollTop = save;

    this.itemToFocus = null;
  }
}

const focusStore = new FocusStore();
export default focusStore;
