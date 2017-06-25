import * as Raven from 'raven-js'

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://e3d974c0d62b4731a833b73a124eb4d9@sentry.io/183546').install()
}
