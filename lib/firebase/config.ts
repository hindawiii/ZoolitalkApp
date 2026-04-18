import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if Firebase is properly configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'undefined' &&
  firebaseConfig.projectId !== 'undefined'
)

// Connection status tracking
export type FirebaseConnectionStatus = 'unconfigured' | 'connecting' | 'connected' | 'error'
let connectionStatus: FirebaseConnectionStatus = isFirebaseConfigured ? 'connecting' : 'unconfigured'
let connectionError: string | null = null

export function getFirebaseConnectionStatus(): { status: FirebaseConnectionStatus; error: string | null } {
  return { status: connectionStatus, error: connectionError }
}

// Initialize Firebase only once (singleton pattern for Next.js)
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

function initializeFirebase(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    console.warn('[v0] Firebase not configured - missing environment variables. Using demo mode.')
    connectionStatus = 'unconfigured'
    return null
  }

  try {
    if (getApps().length > 0) {
      app = getApp()
    } else {
      app = initializeApp(firebaseConfig)
    }
    
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    
    connectionStatus = 'connected'
    console.log('[v0] Firebase initialized successfully:', {
      projectId: firebaseConfig.projectId,
      configured: true
    })
    
    return app
  } catch (error) {
    connectionStatus = 'error'
    connectionError = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Firebase initialization error:', connectionError)
    return null
  }
}

// Initialize on module load
initializeFirebase()

// Safe export of Firebase services (null if not configured)
export { app, auth, db, storage }

// Helper to check if Firestore is available
export function isFirestoreAvailable(): boolean {
  return db !== null && isFirebaseConfigured
}

export default app
