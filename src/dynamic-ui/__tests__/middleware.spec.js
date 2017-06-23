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

import {createDynamicUiMiddleware as createMiddleware} from '../middleware';

function createManager () {
  return {
    handleAction: jest.fn(),
  };
}

it('notifies manager of actions', () => {
  const mockManager = createManager();
  const mockAction = {some: 'action'};
  createMiddleware(mockManager)({})(jest.fn())({some: 'action'});
  expect(mockManager.handleAction).toHaveBeenCalledWith(mockAction);
});

it('behaves as middleware', () => {
  const mockManager = createManager();
  const mockNext = jest.fn(() => 'next result');
  const result = createMiddleware(mockManager)({})(mockNext)({});
  expect(result).toEqual('next result');
});
