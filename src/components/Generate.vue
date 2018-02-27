<template>
	<div>
		<h1>Gerar nova vaga</h1>
		<form @submit.prevent="generate">
			<select name="area" v-model="area">
				<option value="">Selecionar a área</option>
				<option value="front">Front-end</option>
				<option value="back">Back-end</option>
				<option value="android">Android</option>
				<option value="ios">iOS</option>
			</select>
			<select name="level" v-model="level">
				<option value="">Selecionar o nível</option>
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
			area: '',
			level: '',
			errorMessage: '',
			successMessage: '',
		};
	},
	methods: {
		generate() {
			this.loading = true;

			const { area, level } = this;
			const data = { area, level };
			const validation = this.validate(data);

			if (validation.valid) {
				this.errorMessage = '';
				firebaseApp.database().ref('/vacancies').push(data)
					.then((res) => {
						this.errorMessage = '';
						this.successMessage = `Vaga registrada com sucesso! Agora é só divulgar o link 'https://eokoe-teste.firebaseapp.com/?vacancy=${res.key}'.`;
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
