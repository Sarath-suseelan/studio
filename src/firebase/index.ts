'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase services.
 */
export function initializeFirebase() {
  const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_API_KEY');
  
  if (!isConfigured) {
    console.warn(
      'Firebase is not yet configured. Please update src/firebase/config.ts with your ' +
      'project configuration from the Firebase Console.'
    );
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  
  return { app, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
