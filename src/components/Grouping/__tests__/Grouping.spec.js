import React from 'react';
import { shallow, mount } from 'enzyme';
import Grouping from '../index';

const getDefaultProps = () => ({
  items: [{
    id: "5",
    title: 'San Juan',
    date: '2017-04-25T05:06:07-08:00',
    context: {
      url: 'example.com',
      color: "#5678",
      id: 256
    }
  }, {
    id: "6",
    date: '2017-04-25T05:06:07-08:00',
    title: 'Roll for the Galaxy',
    context: {
      color: "#5678",
      id: 256
    }
  }],
  timeZone: "America/Denver",
  color: "#5678",
  id: 256,
  url: 'example.com',
  title: 'Board Games'
});

it('renders the base component with required props', () => {
  const wrapper = shallow(
    <Grouping {...getDefaultProps()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('grouping contains link pointing to course url', () => {
  const props = getDefaultProps();
  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper).toMatchSnapshot();
});

it('does not render completed items by default', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;
  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('PlannerItem').length).toBe(1);
});

it('renders a CompletedItemsFacade when completed items are present by default', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper).toMatchSnapshot();
});

it('renders completed items when the facade is clicked', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;

  const wrapper = mount(
    <Grouping {...props} />
  );

  wrapper.instance().handleFacadeClick();
  expect(wrapper.find('PlannerItem').length).toBe(2);
});

it('does not render a CompletedItemsFacade when showCompletedItems state is true', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  wrapper.setState({ showCompletedItems: true });
  expect(wrapper.find('CompletedItemsFacade').length).toBe(0);
});

it('renders an activity notification when there are things in the past with status badges', () => {
  const props = getDefaultProps();
  props.items[0].status = ["graded"];
  props.isInPast = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('Badge').length).toBe(1);
});

it('invokes the takeFocusRef (if passed) on a focusable element', () => {
  const mockTakeFocus = jest.fn();
  mount(<Grouping {...getDefaultProps()} takeFocusRef={mockTakeFocus} />);
  expect(mockTakeFocus).toHaveBeenCalledWith(expect.anything());
});
describe('handleFacadeClick', () => {
  it('sets focus to the groupingLink when called', () => {
    const wrapper = mount(
      <Grouping {...getDefaultProps()} />
    );
    wrapper.instance().handleFacadeClick();
    expect(document.activeElement).toBe(wrapper.instance().groupingLink);
  });

  it('calls preventDefault on an event if given one', () => {
    const wrapper = mount(
      <Grouping {...getDefaultProps()} />
    );
    const fakeEvent = {
      preventDefault: jest.fn()
    };
    wrapper.instance().handleFacadeClick(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });
});
