import axios from 'axios';
import configureAxios from '../configureAxios';

it('sets the proper defaults on the axios object', () => {
  configureAxios(axios);
  expect(axios.defaults.xsrfCookieName).toBe('_csrf_token');
  expect(axios.defaults.xsrfHeaderName).toBe('X-CSRF-Token');
  expect(axios.defaults.headers.common['Accept']).toMatch('application/json+canvas-string-ids');
  expect(axios.defaults.headers.common['X-Requested-With']).toBe('XMLHttpRequest');
});
