import React from 'react';
import 'instructure-ui/lib/themes/canvas';
import { shallow } from 'enzyme';
import moment from 'moment';
import Day from '../index';

it('renders the base component with required props', () => {
  const wrapper = shallow(
    <Day timeZone="America/Denver" day="2017-04-25" />
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
  const wrapper = shallow(
    <Day timeZone="America/Denver" day="2017-04-25" />
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
