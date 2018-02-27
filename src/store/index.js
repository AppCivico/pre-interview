import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		eokoeUser: {},
		candidate: {},
	},
	actions: {
		SAVE_EOKOE_USER({ commit }, data) {
			commit('SET_EOKOE_USER', { data });
		},
		SAVE_CANDIDATE({ commit }, data) {
			commit('SET_CANDIDATE', { data });
		},
	},
	mutations: {
		SET_EOKOE_USER(state, { data }) {
			state.eokoeUser = data;
		},
		SET_CANDIDATE(state, { data }) {
			state.candidate = data;
			if (window.localStorage) {
				localStorage.setItem('candidate', JSON.stringify(data));
			}
		},
	},
});

export default store;
