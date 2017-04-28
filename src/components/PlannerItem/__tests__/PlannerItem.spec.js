import React from 'react';
import 'instructure-ui/lib/themes/canvas';
import { shallow } from 'enzyme';
import PlannerItem from '../index';

function defaultProps (option) {
  return {
      color: '#d71f85',
      id: 1,
      associated_item: option.associated_item || "Assignment",
      date: option.date,
      courseName: 'A Course about being Diffrient',
      completed: !!option.completed,
      title: option.title || "This Assignment is about awesome stuff",
      points: option.points,
      toggleCompletion: () => {}
  };
}

function noteProps (option) {
  return {
      id: 22,
      associated_item: null,
      date: option.date,
      courseName: option.courseName,
      completed: !!option.completed,
      title: option.title || "A note about note taking",
      toggleCompletion: () => {}
  };
}

it('renders correctly', () => {
  const wrapper = shallow(
    <PlannerItem {...defaultProps({points: 35, date: new Date('December 17, 2011 03:30:00')})} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Quiz correctly with everything', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Quiz',
          completed: true,
          title: "I am a Quiz",
          points: 4,
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Quiz correctly with just points', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Quiz',
          completed: false,
          title: "I am a Quiz",
          points: 2,
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Quiz correctly without right side content', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Quiz',
          completed: false,
          title: "I am a Quiz",
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Quiz correctly with just date', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Quiz',
          completed: false,
          title: "I am a Quiz",
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Assignment correctly with everything', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Assignment',
          completed: true,
          title: "I am a Assignment",
          points: 4,
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Assignment correctly with just points', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Assignment',
          completed: false,
          title: "I am a Assignment",
          points: 2,
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Assignment correctly without right side content', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Assignment',
          completed: false,
          title: "I am a Assignment",
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Assignment correctly with just date', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Assignment',
          completed: false,
          title: "I am a Assignment",
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Discussion correctly with everything', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Discussion',
          completed: true,
          title: "I am a Discussion",
          points: 4,
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Discussion correctly with just points', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Discussion',
          completed: false,
          title: "I am a Discussion",
          points: 2,
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Discussion correctly without right side content', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Discussion',
          completed: false,
          title: "I am a Discussion",
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Discussion correctly with just date', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Discussion',
          completed: false,
          title: "I am a Discussion",
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Announcement correctly with everything', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Announcement',
          completed: true,
          title: "I am a Announcement",
          points: 4,
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Announcement correctly with just points', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Announcement',
          completed: false,
          title: "I am a Announcement",
          points: 2,
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Announcement correctly without right side content', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Announcement',
          completed: false,
          title: "I am a Announcement",
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Announcement correctly with just date', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Announcement',
          completed: false,
          title: "I am a Announcement",
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Calendar Event correctly with everything', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Calendar Event',
          completed: true,
          title: "I am a Calendar Event",
          points: 4,
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Calendar Event correctly with just points', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Calendar Event',
          completed: false,
          title: "I am a Calendar Event",
          points: 2,
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Calendar Event correctly without right side content', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Calendar Event',
          completed: false,
          title: "I am a Calendar Event",
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Calendar Event correctly with just date', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Calendar Event',
          completed: false,
          title: "I am a Calendar Event",
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Page correctly with everything', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Page',
          completed: true,
          title: "I am a Page",
          points: 4,
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Page correctly with just points', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Page',
          completed: false,
          title: "I am a Page",
          points: 2,
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Page correctly without right side content', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Page',
          completed: false,
          title: "I am a Page",
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Page correctly with just date', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...defaultProps(
        {
          associated_item: 'Page',
          completed: false,
          title: "I am a Page",
          date: new Date('December 17, 2011 03:30:00'),
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Note correctly with everything', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...noteProps(
        {
          completed: true,
          title: "I am a Note",
          date: new Date('December 17, 2011 03:30:00'),
          courseName: 'Math 101'
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

it('renders Note correctly without Course', () => {
  const wrapper = shallow(
    <PlannerItem {
      ...noteProps(
        {
          associated_item: 'Note',
          completed: false,
          title: "I am a Note",
        })
    } />
  );
  expect(wrapper).toMatchSnapshot();
});

