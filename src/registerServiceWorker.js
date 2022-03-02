import { register } from 'register-service-worker';

if (!process.env.IS_ELECTRON) {
  register(`${process.env.BASE_URL}service-work.js`, {
    ready() {},
    registered() {},
    cached() {},
    updatefound() {},
    updated() {},
    offline() {},
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}