import router from '../router';
import store from '../store';

let baseUrl;

export async function $fetch (url, options) {
  const finalOptions = Object.assign({}, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }, options);

  const response = await fetch(`${baseUrl}${url}`, finalOptions);

  if (response.ok) {
    return await response.json();
  } else if (response.status === 403) {
    // If the session is no longer valid
    // We logout
    store.dispatch('logout');

  } else {
    const message = await response.text();
    const error = new Error(message);
    error.response = response;
    throw error;
  }
}

export default {
  install (Vue, options) {
    baseUrl = options.baseUrl;

    Vue.prototype.$fetch = $fetch;
  }
}
