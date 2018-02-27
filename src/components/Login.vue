<template>
	<div>
		<h1>Login da eokoe</h1>
		<p>Este login é reservado para os colaboradores da Eokoe.
		Se você esta aqui para fazer o teste, faça seu login <router-link to="/">aqui.</router-link></p>
		<button type="button" @click="login">Entrar</button>
		<p v-if="errorMessage !== ''">{{ errorMessage }}</p>
	</div>
</template>

<script>
import Firebase from 'firebase';
import { firebaseApp } from '../firebase';

export default {
	name: 'Login',
	data() {
		return {
			errorMessage: '',
		};
	},
	methods: {
		login() {
			const provider = new Firebase.auth.GoogleAuthProvider();

			firebaseApp.auth().signInWithPopup(provider).then((result) => {
				const user = result.user;

				// check if user if from eokoe
				if (user.email.indexOf('@eokoe.com') >= 0) {
					this.$store.dispatch('SAVE_EOKOE_USER', user);
					this.$router.push({ path: '/generate' });
				} else {
					this.errorMessage = 'Seu e-mail não é autorizado para este acesso';
				}
			}).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				this.errorMessage = `Ocorreu um erro, mais detalhes: ${errorMessage}. Código: ${errorCode}`;
			});
		},
	},
};
</script>
