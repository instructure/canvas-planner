import React from 'react';
import {shallow} from 'enzyme';
import {SmartDay, getLastUnseenDayKeyWithNewActivity} from '../index';
import moment from 'moment-timezone';
import {formatDayKey} from '../../../utilities/dateUtils';

describe('getLastUnseenDayKeyWithNewActivity', () => {
  it ('finds a new activity item', () => {
    const result = getLastUnseenDayKeyWithNewActivity({
      days: [
        ['2017-05-01', [
          {status: {}},
          {status: {new_grades: true}},
        ]],
      ],
    });
    expect(result).toBe('2017-05-01');
  });

  it ('returns nothing if no new activity item', () => {
    const result = getLastUnseenDayKeyWithNewActivity({
      days: [
        ['2017-05-01', [
          {status: {}},
          {status: {}},
        ]],
      ],
    });
    expect(result).toBeNull();
  });

  it ('does not find a new activity item on today', () => {
    const todayKey = formatDayKey(moment());
    const result = getLastUnseenDayKeyWithNewActivity({
      days: [
        [todayKey, [
          {status: {}},
          {status: {new_grades: true}},
        ]],
      ],
    });
    expect(result).toBeNull();
  });

  it ('does not find a new activity item in the future', () => {
    const tomorrowKey = formatDayKey(moment().add(1, 'days'));
    const result = getLastUnseenDayKeyWithNewActivity({
      days: [
        [tomorrowKey, [
          {status: {}},
          {status: {new_grades: true}},
        ]],
      ],
    });
    expect(result).toBeNull();
  });
});

describe('SmartDay', () => {
  it('forwards properties to Day', () => {
    const wrapper = shallow(<SmartDay day="2017-06-19" timeZone="UTC" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('calls animate scroll on mounting if the day key matches', () => {
    const scrollMock = jest.fn();
    const wrapper = shallow(<SmartDay
      day="2017-06-19"
      timeZone="UTC"
      animateScroll={scrollMock}
      newActivityTargetDayKey="2017-06-19"
      stickyOffset={42}
      seekingNewActivity />);
    // enzyme doesn't handle functional refs even with mount, so we have to do this ourselves
    wrapper.instance().rootElement = 'some element';
    wrapper.instance().componentDidMount();
    expect(scrollMock).toHaveBeenCalledWith('some element', 42);
  });

  it('requires seekingNewActivity to scroll', () => {
    const scrollMock = jest.fn();
    const wrapper = shallow(<SmartDay
      day="2017-06-19"
      timeZone="UTC"
      animateScroll={scrollMock}
      newActivityTargetDayKey="2017-06-19"
      stickyOffset={42}
      seekingNewActivity={false} />);
    // enzyme doesn't handle functional refs even with mount, so we have to do this ourselves
    wrapper.instance().rootElement = 'some element';
    wrapper.instance().componentDidMount();
    expect(scrollMock).not.toHaveBeenCalled();
  });

  it('requires day key to match target to scroll', () => {
    const scrollMock = jest.fn();
    const wrapper = shallow(<SmartDay
      day="2017-06-19"
      timeZone="UTC"
      animateScroll={scrollMock}
      newActivityTargetDayKey="2017-06-10"
      stickyOffset={42}
      seekingNewActivity />);
    // enzyme doesn't handle functional refs even with mount, so we have to do this ourselves
    wrapper.instance().rootElement = 'some element';
    wrapper.instance().componentDidMount();
    expect(scrollMock).not.toHaveBeenCalled();
  });


});
