<template>
	<div>
	<h1>Questões</h1>
		<div v-if="currentQuestion">
			<form @submit.prevent="saveAnswer">
				<h2>{{ currentQuestion.title }}</h2>
				<textarea
					name="answer"
					v-model="answer"
					cols="30"
					rows="10"
					placeholder="Digite sua resposta aqui">
				</textarea>
				<button type="submit" v-if="!finish">Salvar resposta</button>
			</form>
			<div>
				<button type="button" @click="goBack">Voltar</button>
				<hr>
				<p v-if="!finish">Pergunta {{ current + 1 }} de {{ questions.length }}</p>
				<template v-if="finish">
					<h3>Tem certeza que deseja enviar suas respostas?</h3>
					<button
						type="button"
						@click="sendQuestions"
						:disabled="loading"
					>
						Sim, enviar respostas
					</button>
				</template>

				<hr>
				<p v-if="errorMessage !== ''">{{ errorMessage }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { firebaseApp } from '../firebase';
import questionsLibrary from '../questions';

export default {
	name: 'Questions',
	props: {
		id: [String, Number],
	},
	data() {
		return {
			answer: '',
			answers: {},
			current: 0,
			errorMessage: '',
			finish: false,
			loading: false,
			vacancy: {},
			checked: false,
		};
	},
	mounted() {
		if (this.candidate === '') {
			// eslint-disable-next-line
			alert('É necessário informar o e-mail');
			this.$router.push({
				path: '/',
				query: { vacancy: this.id },
			});
		} else {
			firebaseApp.auth().signInAnonymously()
				.then(() => {
					this.loadVacancy();
					this.getLocalstorage();
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					// eslint-disable-next-line
					console.error(`Ocorreu um erro, mais detalhes: ${errorMessage}. Código: ${errorCode}`);
				});
		}
	},
	computed: {
		candidate() {
			return this.$store.state.candidate;
		},
		questions() {
			return questionsLibrary.filter(question => question.level === this.vacancy.level
				&& question.area === this.vacancy.area);
		},
		currentQuestion() {
			return this.questions[this.current];
		},
	},
	methods: {
		loadVacancy() {
			if (!this.checked) {
				const ref = firebaseApp.database().ref(`answers/${this.id}`);
				ref.orderByChild('candidate').equalTo(this.candidate).once('value').then((snap) => {
					if (snap.exists()) {
						// eslint-disable-next-line
						alert('Questionário já respondido!');
						this.$router.push({
							path: '/',
							query: { vacancy: this.id },
						});
					} else {
						const vacancySnapshot = firebaseApp.database().ref(`vacancies/${this.id}`);
						vacancySnapshot.once('value').then((snapshot) => {
							const vacancy = snapshot.val();
							if (vacancy) {
								this.vacancy = vacancy;
							} else {
								// eslint-disable-next-line
								alert('Vaga não encontrada!');
								this.$router.push({
									path: '/',
									query: { vacancy: this.id },
								});
							}
						});
					}
				});
				this.checked = true;
			}
		},
		saveAnswer() {
			// save answer
			this.answers[`question_${this.currentQuestion.id}`] = {
				title: this.currentQuestion.title,
				answer: this.answer,
			};
			this.saveLocalstorage();
			// change current question
			this.changeCurrent('next');
			// clean textarea
			this.cleanTextarea();
		},
		goBack() {
			this.changeCurrent('prev');
			if (this.answers[`question_${this.currentQuestion.id}`]) {
				this.answer = this.answers[`question_${this.currentQuestion.id}`].answer;
			}
		},
		changeCurrent(type) {
			if (type === 'next' && this.current < this.questions.length - 1) {
				this.current = this.current + 1;
			} else if (type === 'prev' && this.current > 0) {
				this.finish = false;
				this.current = this.current - 1;
			} else if (type === 'next' && this.current === this.questions.length - 1) {
				this.finish = true;
			}
		},
		cleanTextarea() {
			if (this.answers[`question_${this.currentQuestion.id}`]) {
				this.answer = this.answers[`question_${this.currentQuestion.id}`].answer;
			} else {
				this.answer = '';
			}
		},
		sendQuestions() {
			this.loading = true;
			const data = {
				candidate: this.candidate,
				answers: this.answers,
			};
			firebaseApp.database().ref(`/answers/${this.id}`).push(data)
				.then(() => {
					// eslint-disable-next-line
					alert('Suas repostas foram salvas com sucesso! Entraremos em contato assim que possível!');
					this.$router.push({
						path: '/',
						query: { vacancy: this.id },
					});
				})
				.catch((err) => {
					this.errorMessage = `Erro no registro: ${err}`;
					this.loading = false;
				});
		},
		saveLocalstorage() {
			if (window.localStorage) {
				localStorage.setItem('eokoe-teste-answers', JSON.stringify(this.answers));
			}
		},
		getLocalstorage() {
			if (window.localStorage) {
				const answers = localStorage.getItem('eokoe-teste-answers');
				if (answers !== null && answers !== '') {
					this.answers = JSON.parse(answers);
					this.answer = this.answers[`question_${this.currentQuestion.id}`].answer;
				}
			}
		},
	},
};
</script>
