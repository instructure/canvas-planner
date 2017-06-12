import moment from 'moment-timezone';
import { transformApiToInternalItem, transformInternalToApiItem } from '../apiUtils';

const courses = [{
  id: '1',
  shortName: 'blah',
  image: 'blah_url',
  color: '#abffaa',
}];

function makeApiResponse (overrides = {}, assignmentOverrides = {}) {
  return {
    id: "10",
    context_type: "Course",
    course_id: "1",
    type: "submitting",
    ignore: `/api/v1/users/self/todo/assignment_10/submitting?permanent=0`,
    ignore_permanently: `/api/v1/users/self/todo/assignment_10/submitting?permanent=1`,
    visible_in_planner: true,
    planner_override: null,
    html_url: `/courses/1/assignments/10#submit`,
    plannable_type: 'assignment',
    plannable: makeAssignment(),
    submissions: false,
    ...overrides,
  };
}

function makeAssignment (overrides = {}) {
  return {
    id: "10",
    description: "<p>Lorem ipsum etc.</p>",
    due_at: "2017-05-19T05:59:59Z",
    unlock_at: null,
    lock_at: null,
    points_possible: 100,
    grading_type: "points",
    assignment_group_id: "2",
    grading_standard_id: null,
    created_at: "2017-05-15T14:36:03Z",
    updated_at: "2017-05-15T16:20:35Z",
    peer_reviews: false,
    automatic_peer_reviews: false,
    position: 2,
    grade_group_students_individually: false,
    anonymous_peer_reviews: false,
    group_category_id: null,
    post_to_sis: false,
    moderated_grading: false,
    omit_from_final_grade: false,
    intra_group_peer_reviews: false,
    secure_params: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
    course_id: "1",
    name: "",
    submission_types: [
      "online_text_entry",
      "online_upload"
    ],
    has_submitted_submissions: false,
    due_date_required: false,
    max_name_length: 255,
    in_closed_grading_period: false,
    is_quiz_assignment: false,
    muted: false,
    html_url: `/courses/1/assignments/10`,
    quiz_id: "1",
    anonymous_submissions: false,
    published: true,
    only_visible_to_overrides: false,
    locked_for_user: false,
    submissions_download_url: `/courses/1/quizzes/1/submissions?zip=1`,
    ...overrides,
  };
}

function makeDiscussionTopic (overrides = {}) {
  return {
    id: "1",
    title: "",
    last_reply_at: "2017-05-15T16:32:34Z",
    delayed_post_at: null,
    posted_at: "2017-05-15T16:32:34Z",
    assignment_id: 10,
    root_topic_id: null,
    position: null,
    podcast_has_student_posts: false,
    discussion_type: "side_comment",
    lock_at: null,
    allow_rating: false,
    only_graders_can_rate: false,
    sort_by_rating: false,
    user_name: "clay@instructure.com",
    discussion_subentry_count: 0,
    permissions: {
      attach: false,
      update: false,
      reply: true,
      delete: false
    },
    require_initial_post: null,
    user_can_see_posts: true,
    podcast_url: null,
    read_state: "unread",
    unread_count: 0,
    subscribed: false,
    topic_children: [],
    attachments: [],
    published: true,
    can_unpublish: false,
    locked: false,
    can_lock: false,
    comments_disabled: false,
    author: {
      id: "1",
      display_name: "Carl Chudyk",
      avatar_image_url: "http://canvas.instructure.com/images/messages/avatar-50.png",
      html_url: `/courses/1/users/1`
    },
    html_url: `/courses/1/discussion_topics/10`,
    url: `/courses/1/discussion_topics/10`,
    pinned: false,
    group_category_id: null,
    can_group: true,
    locked_for_user: false,
    message: "<p>Some prompt</p>",
    ...overrides,
  };
}

describe('transformApiToInternalItem', () => {
  it('extracts and transforms the proper data for responses containing a status', () => {
    const apiResponse = makeApiResponse({
      submissions: {
        graded: true,
        has_feedback: true
      }
    });

    const result = transformApiToInternalItem(apiResponse, courses, 'UTC');

    expect(result.status).toEqual({
      graded: true,
      has_feedback: true
    });
  });

  it('extracts and transforms the proper data for a quiz response', () => {
    const apiResponse = makeApiResponse({
      plannable_type: 'quiz',
      plannable: makeAssignment({
        name: 'How to make friends',
        submission_types: [ 'online_quiz' ],
      })
    });
    const result = transformApiToInternalItem(apiResponse, courses, 'UTC');
    expect(result).toMatchSnapshot();
  });

  it('extracts and transforms the proper data for a discussion response', () => {
    const apiResponse = makeApiResponse({
      plannable_type: 'discussion_topic',
      plannable: makeDiscussionTopic({
        title: "How to make enemies",
        points_possible: 40,
        todo_date: "2017-05-19T05:59:59Z",
      })
    });
    const result = transformApiToInternalItem(apiResponse, courses, 'UTC');
    expect(result).toMatchSnapshot();
  });

  it('extracts and transforms the proper data for a assignment response', () => {
    const apiResponse = makeApiResponse({
      plannable_type: 'assignment',
      plannable: makeAssignment({
        points_possible: 50,
        name: "How to be neutral",
      }),
    });
    const result = transformApiToInternalItem(apiResponse, courses, 'UTC');
    expect(result).toMatchSnapshot();
  });

  it('adds the dateBucketMoment field', () => {
    const apiResponse = makeApiResponse({
      plannable_type: 'assignment',
      plannable: makeAssignment({
        due_at: moment.tz('2017-05-24', 'Asia/Tokyo'),
      })
    });
    const result = transformApiToInternalItem(apiResponse, courses, 'Europe/Paris');
    const expectedBucket = moment.tz('2017-05-23', 'Europe/Paris');
    expect(result.dateBucketMoment.isSame(expectedBucket)).toBeTruthy();
  });

  it('handles items without context (notes to self)', () => {
    const apiResponse = makeApiResponse();
    delete apiResponse.context;
    delete apiResponse.context_type;
    delete apiResponse.course_id;
    const result = transformApiToInternalItem(apiResponse, courses, 'Europe/Paris');
    expect(result).toMatchObject({id: '10'});
  });

  it('throws if the timezone parameter is missing', () => {
    expect(() => transformApiToInternalItem({}, [])).toThrow();
  });
});

describe('transformInternalToApiItem', () => {
  it('transforms items without a context', () => {
    const internalItem = {
      id: '42',
      date: '2017-05-25',
      title: 'an item',
      details: 'item details',
    };
    const result = transformInternalToApiItem(internalItem);
    expect(result).toMatchObject({
      id: '42',
      assignment: {
        id: '42',
        due_at: '2017-05-25',
        name: 'an item',
        description: 'item details',
      }
    });
  });

  it('transforms context information', () => {
    const internalItem = {
      context: {
        id: '42',
      },
    };
    expect(transformInternalToApiItem(internalItem)).toMatchObject({
      context_type: 'Course',
      course_id: '42',
    });
  });
});
