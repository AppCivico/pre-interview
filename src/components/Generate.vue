<template>
	<div>
		<h1>Gerar novo teste</h1>
		<form @submit.prevent="generate">
			<input type="text" v-model="name" placeholder="Nome">
			<input type="email" v-model="email" placeholder="E-mail">
			<select name="level" v-model="level">
				<option value="">Selecionar o nível do candidato</option>
				<option value="junior">Júnior</option>
				<option value="medium">Pleno</option>
				<option value="senior">Senior</option>
			</select>
			<button type="submit" :disabled="loading">Gerar</button>
		</form>
		<hr>
		<p v-if="errorMessage !== ''">{{ errorMessage }}</p>
		<p v-if="successMessage !== ''">{{ successMessage }}</p>
	</div>
</template>

<script>
import { firebaseApp } from '../firebase';

export default {
	name: 'Generate',
	data() {
		return {
			loading: false,
			name: '',
			email: '',
			level: '',
			errorMessage: '',
			successMessage: '',
		};
	},
	methods: {
		generate() {
			this.loading = true;

			const { name, email, level } = this;
			const data = { name, email, level };
			const validation = this.validate(data);

			if (validation.valid) {
				this.errorMessage = '';
				firebaseApp.database().ref('/candidates').push(data)
					.then((res) => {
						this.errorMessage = '';
						this.successMessage = `Usuário registrado com sucesso com id "${res.key}". Agora é só enviar um e-mail para "${email}"" com o convite para o teste!`;
						this.loading = false;
					})
					.catch((err) => {
						this.errorMessage = `Erro no registro: ${err}`;
						this.loading = false;
					});
			} else {
				this.errorMessage = `Erro na validação: ${validation.errors.map(item => `O campo '${item.field}' tem o erro: ${item.error}`)}`;
				this.loading = false;
			}
		},
		validate(fields) {
			const keys = Object.keys(fields);
			const errors = [];
			let valid = true;

			// eslint-disable-next-line
			keys.map((item) => {
				if (fields[item] === '') {
					valid = false;
					errors.push({
						field: item,
						error: 'Campo obrigatório',
					});
				}
			});

			return { valid, errors };
		},
	},
};
</script>
