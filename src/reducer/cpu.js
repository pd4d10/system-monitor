import { zipWith, pick } from 'lodash'
import { compose } from 'redux'
import { TIMEOUT } from '../config'

const SET_CPU = 'SET_CPU'

const minus = (a, b = {
  user: 0,
  kernel: 0,
  total: 0,
}) => ({
  user: a.user - b.user,
  kernel: a.kernel - b.kernel,
  total: a.total - b.total,
})


export default function reducer(state = {
  modelName: '',
  processors: [],
}, action = {}) {
  switch (action.type) {
    case SET_CPU:
      return {
        ...state,
        modelName: action.modelName,
        processors: zipWith(action.processors, state.oldProcessors, minus),
        oldProcessors: action.processors,
      }
    default:
      return state
  }
}

const parseCPUProcessInfo = ({ usage }) => pick(usage, ['user', 'kernel', 'total'])

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

    //setTimeout(compose(dispatch, getCPUInfo), TIMEOUT)
  })
}
