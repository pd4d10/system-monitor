import { combineReducers } from 'redux'
import cpu from './cpu'
import memory from './memory'

export default combineReducers({
  cpu,
  memory
})
