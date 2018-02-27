import Vue from 'vue';
import Vuex from 'vuex';
import { firebaseApp } from '../firebase';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		eokoeUser: {},
		candidate: '',
		vacancy: {},
	},
	actions: {
		SAVE_EOKOE_USER({ commit }, data) {
			return new Promise((resolve) => {
				commit('SET_EOKOE_USER', { data });
				resolve();
			});
		},
		SAVE_CANDIDATE({ commit }, data) {
			commit('SET_CANDIDATE', { data });
		},
		// eslint-disable-next-line
		LOAD_VACANCY({ commit }, id) {
			const vacancySnapshot = firebaseApp.database().ref(`vacancies/${id}`);
			vacancySnapshot.once('value').then((snapshot) => {
				const vacancy = snapshot.val();
				console.log('vaga', vacancy);
				setTimeout(() => {
					if (vacancy) {
						console.log('tem');
						commit('SET_VACANCY', { vacancy });
					} else {
						console.log('nao tem');
						commit('SET_VACANCY', { erro: 'caralho' });
					}
				}, 1000);
			});
		},
	},
	mutations: {
		SET_EOKOE_USER(state, { data }) {
			state.eokoeUser = data;
		},
		SET_VACANCY(state, { data }) {
			console.log('data', data);
			state.vacancy = {
				area: 'front',
				level: 'junior',
			};
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
