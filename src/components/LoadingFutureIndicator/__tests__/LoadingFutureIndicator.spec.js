import React from 'react';
import {shallow} from 'enzyme';
import LoadingFutureIndicator from '../index';

it('renders load more by default', () => {
  const wrapper = shallow(<LoadingFutureIndicator />);
  expect(wrapper).toMatchSnapshot();
});

it('renders loading when indicated', () => {
  const wrapper = shallow(<LoadingFutureIndicator loadingFuture />);
  expect(wrapper).toMatchSnapshot();
});

it('renders all future items loaded regardless of other props', () => {
  const wrapper = shallow(<LoadingFutureIndicator loadingFuture allFutureItemsLoaded />);
  expect(wrapper).toMatchSnapshot();
});

it('invokes the callback when the waypoint is triggered', () => {
  const mockLoad = jest.fn();
  const wrapper = shallow(<LoadingFutureIndicator onLoadMore={mockLoad} />);
  wrapper.instance().handleWaypoint();
  expect(mockLoad).toHaveBeenCalledWith();
});

it('invokes the callback when loading more button is clicked', () => {
  const mockLoad = jest.fn();
  const wrapper = shallow(<LoadingFutureIndicator onLoadMore={mockLoad} />);
  wrapper.find('Button').simulate('click');
  expect(mockLoad).toHaveBeenCalledWith({setFocusAfterLoad: true});
});
