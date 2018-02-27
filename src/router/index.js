import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Questions from '@/components/Questions';
import Login from '@/components/Login';
import Generate from '@/components/Generate';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
		},
		{
			path: '/questions',
			name: 'Questions',
			component: Questions,
		},
		{
			path: '/login',
			name: 'Login',
			component: Login,
		},
		{
			path: '/generate',
			name: 'Generate',
			component: Generate,
			meta: { requiresAuth: true },
		},
	],
});
