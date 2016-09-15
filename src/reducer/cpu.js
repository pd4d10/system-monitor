import { zipWith } from 'lodash'
import { compose } from 'redux'
import { TIMEOUT } from '../config'

const SET_CPU = 'SET_CPU'

const minus = (a, b) => a - b

export default function reducer(state = {
  modelName: '',
  processors: [],
}, action = {}) {
  switch (action.type) {
    case SET_CPU:
      return {
        ...state,
        modelName: action.modelName,
        processors: zipWith(action.processors, state.processors, minus),
      }
    default:
      return state
  }
}

const parseCPUProcessInfo = ({
  usage: {
    user,
    kernel,
    total,
  }
}) => ({
  user: user / total,
  kernel: kernel / total,
})

export const getCPUInfo = () => dispatch => {
  chrome.system.cpu.getInfo(({
    modelName,
    processors,
  }) => {
    dispatch({
      type: SET_CPU,
      modelName,
      processors: processors.map(parseCPUProcessInfo)
    })

    setTimeout(compose(dispatch, getCPUInfo), TIMEOUT)
  })
}
