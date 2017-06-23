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
import changeCase from 'change-case';
import {AnimatableRegistry} from './animatable-registry';
import {Animator} from './animator';
import {isNewActivityItem} from '../utilities/statusUtils';

export class DynamicUiManager {
  constructor (animator = new Animator()) {
    this.animator = animator;
    this.animatableRegistry = new AnimatableRegistry();
    this.animationPlan = {};
    this.stickyOffset = 0;
  }

  setStickyOffset (offset) {
    this.stickyOffset = offset;
  }

  registerAnimatable = (type, component, index, itemIds) => {
    this.animatableRegistry.register(type, component, index, itemIds);
  }

  clearAnimationPlan () {
    this.animationPlan = {};
  }

  animationWillScroll () {
    return this.animationPlan.scrollToLastNewActivity ||
      this.animationPlan.focusLastNewItem
    ;
  }

  preTriggerUpdates = (fixedElement) => {
    const animationPlan = this.animationPlan;
    if (!animationPlan.ready) return;

    if (fixedElement && this.animationWillScroll()) {
      this.animator.maintainViewportPosition(fixedElement);
    }
  }

  triggerUpdates = () => {
    const animationPlan = this.animationPlan;
    if (!animationPlan.ready) return;

    if (this.animationPlan.scrollToLastNewActivity) {
      this.triggerNewActivityAnimations();
    } else if (this.animationPlan.focusLastNewItem) {
      this.triggerFocusLastNewItem();
    } else if (this.animationPlan.focusFirstNewItem) {
      this.triggerFocusFirstNewItem();
    }

    this.clearAnimationPlan();
  }

  triggerFocusFirstNewItem () {
    const {itemIds: newDayItemIds} =
      this.animatableRegistry.getFirstComponent('day', this.animationPlan.newItemIds);
    const {component: firstNewGroup, itemIds: firstGroupItemIds} =
      this.animatableRegistry.getFirstComponent('group', newDayItemIds);

    let focusable = firstNewGroup.getFocusable();
    if (focusable == null) {
      const {component: firstNewGroupItem} = this.animatableRegistry.getFirstComponent('item', firstGroupItemIds);
      focusable = firstNewGroupItem.getFocusable();
    }

    this.animator.focusElement(focusable);
  }

  triggerFocusLastNewItem () {
    const {itemIds: newDayItemIds} =
      this.animatableRegistry.getLastComponent('day', this.animationPlan.newItemIds);
    const {component: lastNewGroup, itemIds: newGroupItemIds} =
      this.animatableRegistry.getLastComponent('group', newDayItemIds);
    const {component: lastNewItem} =
      this.animatableRegistry.getLastComponent('item', newGroupItemIds);
    this.animator.focusElement(lastNewItem.getFocusable());
    this.animator.scrollTo(lastNewGroup.getScrollable(), this.stickyOffset);
  }

  triggerNewActivityAnimations () {
    if (!this.animationPlan.scrollToLastNewActivity) return;
    const newActivityItems = this.animationPlan.newItems.filter(item => isNewActivityItem(item));
    const newActivityItemIds = newActivityItems.map(item => item.uniqueId);
    if (newActivityItemIds.length === 0) return;

    let {itemIds: newActivityDayItemIds} =
      this.animatableRegistry.getLastComponent('day', newActivityItemIds);
    // only want groups in the day that have new activity items
    newActivityDayItemIds = _.intersection(newActivityDayItemIds, newActivityItemIds);

    const {component: newActivityGroup, itemIds: newActivityGroupItemIds} =
      this.animatableRegistry.getLastComponent('group', newActivityDayItemIds);

    const {component: newActivityItem} =
      this.animatableRegistry.getLastComponent('item', newActivityGroupItemIds);

    this.animator.focusElement(newActivityItem.getFocusable());
    this.animator.scrollTo(newActivityGroup.getScrollable(), this.stickyOffset);
  }

  handleAction = (action) => {
    const handlerSuffix = changeCase.pascal(action.type);
    const handlerName = `handle${handlerSuffix}`;
    const handler = this[handlerName];
    if (handler) handler(action);
  }

  handleStartLoadingItems = (action) => {
    this.animationPlan.focusFirstNewItem = true;
  }

  handleGettingFutureItems = (action) => {
    this.animationPlan.focusFirstNewItem = true;
  }

  handleAllFutureItemsLoaded = (action) => {
    this.clearAnimationPlan();
  }

  handleGettingPastItems = (action) => {
    if (action.payload.seekingNewActivity) {
      this.animationPlan.scrollToLastNewActivity = true;
    } else {
      this.animationPlan.focusLastNewItem = true;
    }
  }

  handleGotItemsSuccess = (action) => {
    const newItems = action.payload.internalItems;
    if (!newItems.length) return;
    this.animationPlan.ready = true;

    this.animationPlan.newItems = newItems;
    this.animationPlan.newItemIds = newItems.map(item => item.uniqueId);

    const sortedItems = _.sortBy(newItems, item => item.date);
    this.animationPlan.firstNewItem = sortedItems[0];
    this.animationPlan.lastNewItem = sortedItems[sortedItems.length - 1];
  }
}
