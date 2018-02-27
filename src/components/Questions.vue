<template>
	<div>
	<h1>Questões</h1>
		<div v-if="currentQuestion.title">
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
			</div>
		</div>
	</div>
</template>

<script>
import questionsLibrary from '../questions';

export default {
	name: 'Questions',
	data() {
		return {
			answer: '',
			answers: {},
			current: 0,
			finish: false,
			loading: false,
		};
	},
	computed: {
		candidate() {
			return this.$store.state.candidate;
		},
		questions() {
			return questionsLibrary.filter(question => question.level === this.candidate.level);
		},
		currentQuestion() {
			return this.questions[this.current];
		},
	},
	mounted() {
		this.getLocalstorage();
	},
	methods: {
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
			console.log(JSON.stringify(this.answers));
		},
		saveLocalstorage() {
			if (window.localStorage) {
				localStorage.setItem('eokoe-teste-answers', JSON.stringify(this.answers));
			}
		},
		getLocalstorage() {
			if (window.localStorage) {
				const answers = localStorage.getItem('eokoe-teste-answers');
				if (answers) {
					this.answers = JSON.parse(answers);
					this.answer = this.answers[`question_${this.currentQuestion.id}`].answer;
				}
			}
		},
	},
};
</script>
