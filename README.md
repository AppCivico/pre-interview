# Trump aqui

> Ambiente de teste para candidatos a vagas na Eokoe/AppCívico

## Vue Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Firebase deploy

1 - Create `src/config.js` file.

```js
const config = {
	apiKey: '',
	authDomain: '',
	databaseURL: '',
	projectId: '',
	storageBucket: '',
	messagingSenderId: '',
};

export default config;

```

2 - Run `firebase deploy --only hosting`

## Roadmap

* Make it beautiful;
* Edit questions library to use a .json and read markdown;
* Alert `trampos@eokoe.com` when new answer is submitted;

