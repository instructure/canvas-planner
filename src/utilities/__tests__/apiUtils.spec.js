import { translateAPIData } from '../apiUtils';

describe('translateAPIData', () => {
  it('extracts and transforms the proper data for a quiz response', () => {
    const apiResponse = {
      context_type: "Course",
      course_id: "1",
      type: "submitting",
      ignore: `/api/v1/users/self/todo/assignment_10/submitting?permanent=0`,
      ignore_permanently: `/api/v1/users/self/todo/assignment_10/submitting?permanent=1`,
      visible_in_planner: true,
      planner_override: null,
      assignment: {
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
        name: "How to make friends",
        submission_types: [ "online_quiz" ],
        has_submitted_submissions: false,
        due_date_required: false,
        max_name_length: 255,
        in_closed_grading_period: false,
        is_quiz_assignment: true,
        muted: false,
        html_url: `/courses/1/assignments/10`,
        quiz_id: "1",
        anonymous_submissions: false,
        published: true,
        only_visible_to_overrides: false,
        locked_for_user: false,
        submissions_download_url: `/courses/1/quizzes/1/submissions?zip=1`
      },
      html_url: `/courses/1/assignments/10#submit`
    };

    const courses = [{
      id: '1',
      shortName: 'blah',
      image: 'blah_url',
      color: '#abffaa',
    }];

    const result = translateAPIData(apiResponse, courses);

    expect(result).toMatchObject({
      context: {
        type: 'Course',
        id: '1',
        title: 'blah',
        image_url: 'blah_url',
        color: '#abffaa'
      },
      id: '10',
      date: '2017-05-19T05:59:59Z',
      type: 'Quiz',
      title: 'How to make friends',
      completed: false,
      points: 100
    });
  });

  it('extracts and transforms the proper data for a discussion response', () => {
    const apiResponse = {
      context_type: "Course",
      course_id: "1",
      type: "submitting",
      ignore: `/api/v1/users/self/todo/assignment_10/submitting?permanent=0`,
      ignore_permanently: `/api/v1/users/self/todo/assignment_10/submitting?permanent=1`,
      visible_in_planner: true,
      planner_override: null,
      assignment: {
        id: "10",
        description: "<p>Lorem ipsum etc.</p>",
        due_at: "2017-05-19T05:59:59Z",
        unlock_at: null,
        lock_at: null,
        points_possible: 40,
        grading_type: "points",
        assignment_group_id: "2",
        grading_standard_id: null,
        created_at: "2017-05-15T16:32:33Z",
        updated_at: "2017-05-15T16:32:34Z",
        peer_reviews: false,
        automatic_peer_reviews: false,
        position: 3,
        grade_group_students_individually: false,
        anonymous_peer_reviews: false,
        group_category_id: null,
        post_to_sis: false,
        moderated_grading: false,
        omit_from_final_grade: false,
        intra_group_peer_reviews: false,
        secure_params: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
        course_id: "1",
        name: "How to make enemies",
        submission_types: [ "discussion_topic" ],
        has_submitted_submissions: true,
        due_date_required: false,
        max_name_length: 255,
        in_closed_grading_period: false,
        is_quiz_assignment: false,
        muted: false,
        html_url: `/courses/1/assignments/10`,
        discussion_topic: {
          id: "1",
          title: "How to make enemies",
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
          message: "<p>Some prompt</p>"
        },
        published: true,
        only_visible_to_overrides: false,
        locked_for_user: false,
        submissions_download_url: `/courses/1/assignments/10/submissions?zip=1`
      },
      html_url: `/courses/1/assignments/10#submit`
    };

    const courses = [{
      id: '1',
      shortName: 'blah',
      image: 'blah_url',
      color: '#abffaa',
    }];

    const result = translateAPIData(apiResponse, courses);

    expect(result).toMatchObject({
      context: {
        type: 'Course',
        id: '1',
        title: 'blah',
        image_url: 'blah_url',
        color: '#abffaa'
      },
      id: '10',
      date: '2017-05-19T05:59:59Z',
      type: 'Discussion',
      title: 'How to make enemies',
      completed: true,
      points: 40
    });
  });

  it('extracts and transforms the proper data for a assignment response', () => {
    const apiResponse = {
      context_type: "Course",
      course_id: "1",
      type: "submitting",
      ignore: `/api/v1/users/self/todo/assignment_10/submitting?permanent=0`,
      ignore_permanently: `/api/v1/users/self/todo/assignment_10/submitting?permanent=1`,
      visible_in_planner: true,
      planner_override: null,
      assignment: {
        id: "10",
        description: "<p>Lorem ipsum etc.</p>",
        due_at: "2017-05-19T05:59:59Z",
        unlock_at: null,
        lock_at: null,
        points_possible: 50,
        grading_type: "points",
        assignment_group_id: "2",
        grading_standard_id: null,
        created_at: "2017-05-12T15:05:48Z",
        updated_at: "2017-05-12T15:05:48Z",
        peer_reviews: false,
        automatic_peer_reviews: false,
        position: 1,
        grade_group_students_individually: false,
        anonymous_peer_reviews: false,
        group_category_id: null,
        post_to_sis: false,
        moderated_grading: false,
        omit_from_final_grade: false,
        intra_group_peer_reviews: false,
        secure_params: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
        course_id: "1",
        name: "How to be neutral",
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
        published: true,
        only_visible_to_overrides: false,
        locked_for_user: false,
        submissions_download_url: `/courses/1/assignments/10/submissions?zip=1`
      },
      html_url: `/courses/1/assignments/10#submit`
    };

    const courses = [{
      id: '1',
      shortName: 'blah',
      image: 'blah_url',
      color: '#abffaa',
    }];

    const result = translateAPIData(apiResponse, courses);

    expect(result).toMatchObject({
      context: {
        type: 'Course',
        id: '1',
        title: 'blah',
        image_url: 'blah_url',
        color: '#abffaa'
      },
      id: '10',
      date: '2017-05-19T05:59:59Z',
      type: 'Assignment',
      title: 'How to be neutral',
      completed: false,
      points: 50
    });
  });


});
