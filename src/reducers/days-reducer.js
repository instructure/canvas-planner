import { handleActions } from 'redux-actions';

import { groupBy, merge } from 'lodash';

export default handleActions({
  GOT_ITEMS_SUCCESS: (state, action) => {
    const dayGrouping = groupBy(action.payload, 'date');
    return merge(state, dayGrouping)
  }
}, {});
