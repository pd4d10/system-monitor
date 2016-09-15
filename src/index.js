import React from 'react'
import ReactDOM from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import Container from './container'
import reducers from './reducer'

const middlewares = [thunk]

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(logger())
}

const store = createStore(reducers, applyMiddleware(...middlewares))

ReactDOM.render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.querySelector('#content')
)
