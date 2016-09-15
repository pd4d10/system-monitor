import { compose } from 'redux'
import { TIMEOUT } from '../config'

const SET_MEMORY = 'SET_MEMORY'

export default function reducer(state = {
  total: 1,
  available: 1,
}, action = {}) {
  switch (action.type) {
    case SET_MEMORY:
      return {
        ...state,
        total: action.total,
        available: action.available,
      }
    default:
      return state
  }
}

export const getMemoryInfo = () => dispatch => {
  chrome.system.memory.getInfo(({
    capacity: total,
    availableCapacity: available,
  }) => {
    dispatch({
      type: SET_MEMORY,
      total,
      available,
    })
    
    //setTimeout(compose(dispatch, getMemoryInfo), TIMEOUT)
  })
}
