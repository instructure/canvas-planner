import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import Day from '../index';

it('renders the base component with required props', () => {
  const wrapper = shallow(
    <Day timeZone="America/Denver" day="2017-04-25" alwaysRender />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders the friendly name in large text when it is today', () => {
  const today = moment();

  const wrapper = shallow(
    <Day timeZone="America/Denver" day={today.format('YYYY-MM-DD')} />
  );
  expect(wrapper.find('Typography').first().props().size).toEqual('large');
});

it('renders the friendlyName in medium text when it is not today', () => {
  const yesterday = moment().add(1, 'days');
  const wrapper = shallow(
    <Day timeZone="America/Denver" day={yesterday.format('YYYY-MM-DD')} />
  );
  expect(wrapper.find('Typography').first().props().size).toEqual('medium');
});

it('groups itemsForDay based on context id', () => {
  const items = [{
    title: 'Black Friday',
    context: {
      id: 128
    }
  }, {
    title: 'San Juan',
    context: {
      id: 256
    }
  }, {
    title: 'Roll for the Galaxy',
    context: {
      id: 256
    }
  }];

  const wrapper = shallow(
    <Day timeZone="America/Denver" day="2017-04-25" itemsForDay={items} />
  );
  const groupedItems = wrapper.state('groupedItems');
  expect(groupedItems[128].length).toEqual(1);
  expect(groupedItems[256].length).toEqual(2);
});

it('renders grouping correctly when having itemsForDay', () => {
  const items = [{
    title: 'Black Friday',
    context: {
      id: 128,
      url:"http://www.non_default_url.com"
    }
  }, {
    title: 'San Juan',
    context: {
      id: 256,
      url:"http://www.non_default_url.com"
    }
  }, {
    title: 'Roll for the Galaxy',
    context: {
      id: 256,
      url:"http://www.non_default_url.com"
    }
  }];

  const wrapper = shallow(
    <Day timeZone="America/Denver" day="2017-04-25" itemsForDay={items} />
  );
  expect(wrapper).toMatchSnapshot();
});
it('groups itemsForDay that have no context into the "Notes" category', () => {
  const items = [{
    title: 'Black Friday',
    context: {
      id: 128
    }
  }, {
    title: 'San Juan',
    context: {
      id: 256
    }
  }, {
    title: 'Roll for the Galaxy',
    context: {
      id: 256
    }
  }, {
    title: 'Get work done!'
  }];

  const wrapper = shallow(
    <Day timeZone="America/Denver" day="2017-04-25" itemsForDay={items} />
  );
  const groupedItems = wrapper.state('groupedItems');
  expect(groupedItems.Notes.length).toEqual(1);
});

it('groups itemsForDay that come in on prop changes', () => {
  const items = [{
    title: 'Black Friday',
    context: {
      id: 128
    }
  }, {
    title: 'San Juan',
    context: {
      id: 256
    }
  }];

  const wrapper = shallow(
    <Day timeZone="America/Denver" day="2017-04-25" itemsForDay={items} />
  );
  let groupedItems = wrapper.state('groupedItems');
  expect(Object.keys(groupedItems).length).toEqual(2);

  const newItemsForDay = items.concat([{
    title: 'Roll for the Galaxy',
    context: {
      id: 256
    }
  }, {
    title: 'Get work done!'
  }]);

  wrapper.setProps({ itemsForDay: newItemsForDay });
  groupedItems = wrapper.state('groupedItems');
  expect(Object.keys(groupedItems).length).toEqual(3);
});

it('forwards takeFocusRef to its first grouping', () => {
  const mockTakeFocusRef = jest.fn();
  const items = [{
    title: 'Black Friday',
    context: {
      id: 128
    }
  }, {
    title: 'San Juan',
    context: {
      id: 256
    }
  }];

  const wrapper = shallow(
    <Day takeFocusRef={mockTakeFocusRef} timeZone="Asia/Tokyo" day="2017-04-25" itemsForDay={items} />
  );
  expect(wrapper.find('Grouping').at(0).props().takeFocusRef).toBe(mockTakeFocusRef);
  expect(wrapper.find('Grouping').at(1).props().takeFocusRef).not.toBeDefined();
});

it('renders nothing when there are no items and the date is outside of two weeks', () => {
  const date = moment.tz("Asia/Tokyo").add(15, 'days');
  const wrapper = shallow(
    <Day timeZone="Asia/Tokyo" day={date.format('YYYY-MM-DD')} itemsForDay={[]} />
  );
  expect(wrapper.type()).toBeNull();
});

it('renders when there are no items but within two weeks', () => {
  const date = moment.tz("Asia/Tokyo").add(13, 'days');
  const wrapper = shallow(
    <Day timeZone="Asia/Tokyo" day={date.format('YYYY-MM-DD')} itemsForDay={[]} />
  );
  expect(wrapper).toMatchSnapshot();
});
