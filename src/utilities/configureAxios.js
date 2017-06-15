export default function (axiosInstance) {
  // Add CSRF stuffs to make Canvas happy when we are making requests with axios
  axiosInstance.defaults.xsrfCookieName = '_csrf_token';
  axiosInstance.defaults.xsrfHeaderName = 'X-CSRF-Token';

  // Handle stringified IDs for JSON responses
  var originalDefaults = axiosInstance.defaults.headers.common['Accept'];
  axiosInstance.defaults.headers.common['Accept'] = 'application/json+canvas-string-ids, ' + originalDefaults;

  // Rails checks this header to decide if a request is an xhr request
  axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  return axiosInstance;
}
