import { zipWith, pick, compose } from 'lodash'
import { TIMEOUT } from './config'

const SET_INFO = 'SET_INFO'

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
    case SET_INFO:
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

const parseCPU = ({
  usage: {
    user,
    kernel,
    total,
  }
}) => ({
  user,
  kernel,
  total,
})

//const parseMemory = ({
//  
//})

const getCPUInfo = new Promise((resolve, reject) => {
  try {
    chrome.system.cpu.getInfo(resolve)
  } catch (err) {
    reject(err)
  }
})

const getMemoryInfo = new Promise((resolve, reject) => {
  try {
    chrome.system.memory.getInfo(resolve)
  } catch (err) {
    reject(err)
  }
})

export const getInfo = () => dispatch => Promise
  .all([getCPUInfo, getMemoryInfo])
  .then(([cpu, memory]) => {
    dispatch({
      type: SET_INFO,
      cpu,
      memory,
    })

    setTimeout(compose(dispatch, getInfo), TIMEOUT)
  })
