import {switchApi, getList, getStatus, getData} from '@/api/home'

// state
const state = () => ({
  lamp: false, // 灯源状态
  list: []
})

// mutations
const mutations = {
  setLamp(state, token) {
    state.lamp = token
  },
  setList(state, data) {
    state.list = data
  },
  setStatus(state, data) {
    state.status = data
  },
  setData(state, data) {
    state.echartsData = data
  }
}


// actions
const actions = {
  // 开关灯
  lamp({commit}, params) {
    return new Promise((resolve, reject) => {
      switchApi(params)
        .then(res => {
          commit('setLamp', true)
          resolve(res)
        })
        .catch((res) => {
          reject(res)
        })
    })
  },
  // 获取表格数据
  getList({commit}, params) {
    return new Promise((resolve, reject) => {
      getList(params)
        .then(res => {
          commit('setList', res.data)
          resolve(res)
        })
        .catch((res) => {
          reject(res)
        })
    })
  },
  // 获取设备状态
  getStatus({commit}, params) {
    return new Promise((resolve, reject) => {
      getStatus(params)
        .then(res => {
          commit('setStatus', res.data)
          resolve(res)
        })
        .catch((res) => {
          reject(res)
        })
    })
  },

  // 获取图表数据
  getData({commit}, params) {
    return new Promise((resolve, reject) => {
      getData(params)
        .then(res => {
          commit('setData', res.data)
          resolve(res)
        })
        .catch((res) => {
          reject(res)
        })
    })
  }
}


export default {
  namespaced: true,
  state,
  actions,
  mutations
}