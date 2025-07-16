import { initializeApp, cert } from 'firebase-admin/app';
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

initializeApp({
    credential:  admin.credential.applicationDefault(),
});

const clientApp = initializeClientApp(firebaseConfig);

const firestore = getFirestore();

// Configure Firestore settings to ignore undefined properties
firestore.settings({
    ignoreUndefinedProperties: true
});

const clientAuth = getAuth(clientApp);

// @ts-ignore
export { admin, firestore, clientAuth };
