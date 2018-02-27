<template>
	<div>
		<h1>Eokoe/Appcívico - Testes</h1>
		<h2>Welcome!</h2>
		<h3>Estamos muito felizes pelo seu interesse em fazer parte da nossa equipe!</h3>
		<p>Não se preocupe, esse teste foi desenvolvido para avaliar seu atual conhecimento,
		não para desclassificar você.</p>
		<p>A partir do momento do login, você terá 40 minutos para completar o seu teste.</p>
		<p>Tentamos fazer o máximo para garantir que você não tenha problemas se houver algum
		problema de conexão, mas caso algum problema aconteça, entre em contato conosco nos
		explicando o que ocorreu, ok?</p>
		<p><strong>Boa sorte!</strong></p>

		<hr>

		<form @submit.prevent="login">
			<input type="email" v-model.trim="email" placeholder="Informe o seu e-mail">
			<button type="submir" :disabled="loading">Começar!</button>
		</form>
		<p v-if="errorMessage !== ''">{{ errorMessage }}</p>
	</div>
</template>

<script>
import { firebaseApp } from '../firebase';

export default {
	name: 'Home',
	data() {
		return {
			loading: false,
			email: '',
			errorMessage: '',
		};
	},
	methods: {
		login() {
			this.loading = true;
			const { email } = this;
			if (email === '') {
				this.loading = false;
				this.errorMessage = 'Informe o seu e-mail para dar início ao teste!';
			} else {
				this.checkCandidate(email);
			}
		},
		checkCandidate(email) {
			console.log('check');
			const ref = firebaseApp.database().ref('candidates');
			ref.orderByChild('email').equalTo(email).on('child_added', (snapshot) => {
				const res = snapshot.val();
				console.log(res);
				if (res) {
					this.$store.dispatch('SAVE_CANDIDATE', res);
					this.$router.push({ path: '/questions' });
				} else {
					this.loading = false;
					this.errorMessage = 'Seu e-mail não foi localizado no nosso cadastro. Entre em contato informando o problema.';
				}
			});
		},
	},
};
</script>
