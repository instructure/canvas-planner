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
  title: 'Board Games',
  updateTodo: () => {}
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

it('renders to do items correctly', () => {
  const props = {
    items: [{
      id: "700",
      title: 'To Do 700',
      date: '2017-06-16T05:06:07-06:00',
      context: null,
    }],
    timeZone: "America/Denver",
    color: null,
    id: null,
    url: null,
    title: null,
    updateTodo: () => {}
  };
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

  expect(wrapper.find('PlannerItem')).toHaveLength(1);
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
  expect(wrapper.find('PlannerItem')).toHaveLength(2);
});

it('renders completed items when they have the show property', () => {
  const props = getDefaultProps();
  props.items[0].show = true;
  props.items[0].completed = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('PlannerItem')).toHaveLength(2);
});

it('does not render a CompletedItemsFacade when showCompletedItems state is true', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  wrapper.setState({ showCompletedItems: true });
  expect(wrapper.find('CompletedItemsFacade')).toHaveLength(0);
});

it('renders an activity notification when there are things in the past with status badges', () => {
  const props = getDefaultProps();
  props.items[0].status = ["graded"];
  props.isInPast = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('Badge')).toHaveLength(1);
});

it('does not render an activity badge when things in the past have no status', () => {
  const props = getDefaultProps();
  props.items[0].status = [];
  props.isInPast = true;
  const wrapper = shallow(
    <Grouping {...props} />
  );
  expect(wrapper.find('Badge')).toHaveLength(0);
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

describe('toggleCompletion', () => {
  it('binds the toggleCompletion method to item', () => {
    const mock = jest.fn();
    const props = getDefaultProps();
    const wrapper = mount(
      <Grouping
        {...props}
        toggleCompletion={mock}
      />
    );
    wrapper.find('input').first().simulate('change');
    expect(mock).toHaveBeenCalledWith(props.items[0]);
  });
});
