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

import {Animator} from '../animator';

function mockVelocity (opts = {}) {
  return jest.fn();
}

function mockElement (opts = {}) {
  return {
    getBoundingClientRect: jest.fn(),
    focus: jest.fn(),
    ...opts
  };
}

function mockWindow (opts = {}) {
  const queue = [];
  return {
    queue,
    scroll: jest.fn(),
    requestAnimationFrame: (fn) => queue.push(fn),
    runAnimationFrames: () => {
      queue.forEach((fn) => fn());
      queue.length = 0;
    },
  };
}

function mockDocument (opts = {}) {
  return {
    documentElement: opts.documentElement || {
      getBoundingClientRect: jest.fn(),
    }
  };
}

function makeAnimator (opts = {}) {
  const mocks = {
    velocity: mockVelocity(opts),
    window: mockWindow(opts),
    document: mockDocument(opts),
    ...opts,
  };
  const animator = new Animator(mocks);
  return { animator, mocks };
}

it('focuses elements', () => {
  const {animator, mocks} = makeAnimator();
  const elt = mockElement();
  animator.focusElement(elt);
  expect(elt.focus).not.toHaveBeenCalled();
  mocks.window.runAnimationFrames();
  expect(elt.focus).toHaveBeenCalled();
});

it('scrolls to elements with offset', () => {
  const {animator, mocks} = makeAnimator();
  const elt = mockElement();
  animator.scrollTo(elt, 5);
  expect(mocks.velocity).not.toHaveBeenCalled();
  mocks.window.runAnimationFrames();
  expect(mocks.velocity).toHaveBeenCalledWith(elt, 'scroll', expect.objectContaining({offset: -5}));
});

it('maintains scroll position of element', () => {
  const {animator, mocks} = makeAnimator();
  const elt = mockElement();
  elt.getBoundingClientRect
    .mockReturnValueOnce({top: 42, left: 0, bottom: 43, right: 42})
    .mockReturnValueOnce({top: 52, left: 0, bottom: 53, right: 42});
  mocks.document.documentElement.getBoundingClientRect.mockReturnValueOnce({
    top: -5, left: 0, bottom: 123, right: 50,
  });
  animator.maintainViewportPosition(elt);
  expect(mocks.window.scroll).not.toHaveBeenCalled();
  mocks.window.runAnimationFrames();
  // 15 = 52 - (-5) - 42
  expect(mocks.window.scroll).toHaveBeenCalledWith(0, 15);
});

it('does focus action before other operations', () => {
  const {animator, mocks} = makeAnimator();
  const elt = mockElement();
  animator.scrollTo(elt, 42);
  animator.focusElement(elt);
  expect(mocks.window.queue.length).toBe(2);
  expect(elt.focus).not.toHaveBeenCalled();
  mocks.window.queue[0]();
  expect(elt.focus).toHaveBeenCalled();
  expect(mocks.window.scroll).not.toHaveBeenCalled();
  mocks.window.queue[1]();
  expect(mocks.velocity).toHaveBeenCalledWith(elt, 'scroll', expect.anything());
});
