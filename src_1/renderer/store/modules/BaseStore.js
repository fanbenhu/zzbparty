/*
 * @Author: Firen
 * @Date: 2021-12-05 13:56:45
 * @Github: https://github.com/firen-top
 * @Blog: https://firen.top
 * @LastEditTime: 2021-12-05 22:08:38
 * @Description: 
 */
const state = {
    cur_user: 0,
    party : [],
}

const mutations = {
    INIT_USER (state,payload) {
        console.log(state)
        console.log(payload)
        state.cur_user = state.cur_user
    },

    INIT_PARTY (state,payload) {
        console.log(state)
        console.log(payload)
        state.party = state.party
    },

}

const actions = {
    init_user ({ commit },payload) {
        commit('INIT_USER',payload)
    },
    init_party ({ commit,state }) {
        commit('INIT_PARTY',state)
    },

    adminLog ({ commit }, payload) {
        console.log(commit)
        console.log(payload)
    }
}

export default {
    state,
    mutations,
    actions
}
