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

const clientApp = initializeClientApp(firebaseConfig);

// Initialize Firebase Admin SDK
if (process.env.NODE_ENV === 'production') {
    // In Cloud Run, use Application Default Credentials (ADC)
    initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
} else {
    // For local development, use environment variables
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
    } else {
        console.error('Firebase credentials not found. Please set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL environment variables.');
        throw new Error('Firebase credentials not configured');
    }
}

const firestore = getFirestore();

// Configure Firestore settings to ignore undefined properties
firestore.settings({
    ignoreUndefinedProperties: true
});

const clientAuth = getAuth(clientApp);

// @ts-ignore
export { admin, firestore, clientAuth };
