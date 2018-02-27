import Firebase from 'firebase';
import firebaseConfig from '../config';

// eslint-disable-next-line
export const firebaseApp = Firebase.initializeApp(firebaseConfig);

