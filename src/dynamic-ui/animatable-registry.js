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

import _ from 'lodash';

export class AnimatableRegistry {
  constructor () {
    this.registries = {
      day: {},
      group: {},
      item: {},
    };
  }

  validateType (type) {
    if (!['day', 'group', 'item'].find((t) => t === type)) {
      throw new Error(`invalid registry type ${type}`);
    }
  }

  register (type, component, index, itemIds) {
    this.validateType(type);
    const registry = this.registries[type];
    if (component) {
      itemIds.forEach(itemId => registry[itemId] = {component, index, itemIds});
    } else {
      itemIds.forEach(itemId => delete registry[itemId]);
    }
  }

  getFirstComponent (type, itemIds) {
    this.validateType(type);
    const registry = this.registries[type];
    const minItemId = _.minBy(itemIds, itemId => registry[itemId].index);
    return registry[minItemId];
  }

  getLastComponent (type, itemIds) {
    this.validateType(type);
    const registry = this.registries[type];
    const maxItemId = _.maxBy(itemIds, itemId => registry[itemId].index);
    return registry[maxItemId];
  }
}
