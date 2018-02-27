// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFire from 'vuefire';

import App from './App';
import router from './router';
import store from './store';

import './firebase/index';

Vue.config.productionTip = false;
Vue.use(VueFire);

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth) &&
		(!store.state.eokoeUser.email)) {
		window.console.log('Não autorizado!');
		next({
			path: '/',
			query: { redirect: to.fullPath },
		});
	} else {
		next();
	}
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>',
});
