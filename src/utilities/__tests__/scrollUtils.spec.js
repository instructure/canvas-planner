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
import {registerScrollEvents, maintainViewportPosition} from '../scrollUtils';

it('registers proper events', () => {
  const mockWindow = {
    addEventListener: jest.fn(),
  };
  registerScrollEvents(jest.fn(), mockWindow);
  expect(mockWindow.addEventListener.mock.calls[0][0]).toBe('wheel');
  expect(mockWindow.addEventListener.mock.calls[1][0]).toBe('keydown');
});

describe('animations', () => {
  it ('maintains the viewport position', () => {
    const mocks = {
      element: {
        getBoundingClientRect: jest.fn()
          .mockImplementationOnce(() => ({top: 123}))
          .mockImplementationOnce(() => ({top: 234}))
      },
      document: {
        documentElement: {
          getBoundingClientRect: jest.fn(() => ({top: -50})),
        },
      },
      window: {
        requestAnimationFrame: jest.fn((fn) => fn()),
        scroll: jest.fn(),
      }
    };
    maintainViewportPosition(mocks.element, mocks);
    expect(mocks.window.scroll).toHaveBeenCalledWith(0, (234 - (-50) - 123));
  });
});

describe('wheel events', () => {
  it('invokes the callback and preventDefault when a wheel event happens at the top of the page', () => {
    const mockWindow = {
      addEventListener: jest.fn(),
      pageYOffset: 0,
    };
    const mockCb = jest.fn();
    const mockPreventDefault = jest.fn();
    registerScrollEvents(mockCb, mockWindow);
    const wheelHandler = mockWindow.addEventListener.mock.calls[0][1];
    wheelHandler({deltaY: -42, preventDefault: mockPreventDefault});
    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockCb).toHaveBeenCalled();
  });

  it('leading debounces the scroll callback', () => {
    const mockWindow = {
      addEventListener: jest.fn(),
      pageYOffset: 0,
    };
    const mockCb = jest.fn();
    registerScrollEvents(mockCb, mockWindow);
    const wheelHandler = mockWindow.addEventListener.mock.calls[0][1];
    wheelHandler({deltaY: -42, preventDefault: jest.fn()});
    wheelHandler({deltaY: -42, preventDefault: jest.fn()});
    expect(mockCb).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the callback when the window is not scrolled to the top', () => {
    const mockWindow = {
      addEventListener: jest.fn(),
      pageYOffset: 42,
    };
    const mockCb = jest.fn();
    const mockPreventDefault = jest.fn();
    registerScrollEvents(mockCb, mockWindow);
    const wheelHandler = mockWindow.addEventListener.mock.calls[0][1];
    wheelHandler({deltaY: -42, preventDefault: mockPreventDefault});
    expect(mockPreventDefault).not.toHaveBeenCalled();
    expect(mockCb).not.toHaveBeenCalled();
  });
});

describe('key events', () => {
  it('invokes the callback and preventDefault when a wheel event happens at the top of the page', () => {
    const mockWindow = {
      addEventListener: jest.fn(),
      pageYOffset: 0,
    };
    const mockCb = jest.fn();
    const mockPreventDefault = jest.fn();
    registerScrollEvents(mockCb, mockWindow);
    const keyHandler = mockWindow.addEventListener.mock.calls[1][1];
    keyHandler({key: 'ArrowUp', preventDefault: mockPreventDefault});
    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockCb).toHaveBeenCalled();
  });

  it('does not invoke the callback or preventDefault on other keys', () => {
    const mockWindow = {
      addEventListener: jest.fn(),
      pageYOffset: 0,
    };
    const mockCb = jest.fn();
    const mockPreventDefault = jest.fn();
    registerScrollEvents(mockCb, mockWindow);
    const keyHandler = mockWindow.addEventListener.mock.calls[1][1];
    keyHandler({key: 'Home', preventDefault: mockPreventDefault});
    expect(mockPreventDefault).not.toHaveBeenCalled();
    expect(mockCb).not.toHaveBeenCalled();
  });

  it('does not invoke the callback if window is not at the top', () => {
    const mockWindow = {
      addEventListener: jest.fn(),
      pageYOffset: 42,
    };
    const mockCb = jest.fn();
    const mockPreventDefault = jest.fn();
    registerScrollEvents(mockCb, mockWindow);
    const keyHandler = mockWindow.addEventListener.mock.calls[1][1];
    keyHandler({key: 'ArrowUp', preventDefault: mockPreventDefault});
    expect(mockPreventDefault).not.toHaveBeenCalled();
    expect(mockCb).not.toHaveBeenCalled();
  });
});
