'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  type QueryConstraint,
  type DocumentData,
  type WhereFilterOp,
  serverTimestamp,
} from 'firebase/firestore'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { db, auth } from './config'

// ============ AUTH UTILITIES ============

interface AuthState {
  user: User | null
  loading: boolean
  error: Error | null
}

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setState({ user, loading: false, error: null })
      },
      (error) => {
        setState({ user: null, loading: false, error })
      }
    )

    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error as Error }))
      throw error
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error as Error }))
      throw error
    }
  }, [])

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error: error as Error }))
      throw error
    }
  }, [])

  return { ...state, signIn, signUp, signOut }
}

// ============ FIRESTORE UTILITIES ============

export interface QueryOptions {
  whereConditions?: Array<{
    field: string
    operator: WhereFilterOp
    value: unknown
  }>
  orderByField?: string
  orderDirection?: 'asc' | 'desc'
  limitCount?: number
}

/**
 * Get all documents from a collection with optional query constraints
 */
export async function getDocuments<T = DocumentData>(
  collectionName: string,
  options?: QueryOptions
): Promise<Array<T & { id: string }>> {
  const collectionRef = collection(db, collectionName)
  const constraints: QueryConstraint[] = []

  if (options?.whereConditions) {
    for (const condition of options.whereConditions) {
      constraints.push(where(condition.field, condition.operator, condition.value))
    }
  }

  if (options?.orderByField) {
    constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'))
  }

  if (options?.limitCount) {
    constraints.push(limit(options.limitCount))
  }

  const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Array<T & { id: string }>
}

/**
 * Get a single document by ID
 */
export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, collectionName, docId)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as T & { id: string }
}

/**
 * Add a new document to a collection
 */
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  const collectionRef = collection(db, collectionName)
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Update an existing document
 */
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  const docRef = doc(db, collectionName, docId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a document
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId)
  await deleteDoc(docRef)
}

/**
 * Subscribe to real-time updates for a collection
 */
export function useCollection<T = DocumentData>(
  collectionName: string,
  options?: QueryOptions
): { data: Array<T & { id: string }>; loading: boolean; error: Error | null } {
  const [data, setData] = useState<Array<T & { id: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const collectionRef = collection(db, collectionName)
    const constraints: QueryConstraint[] = []

    if (options?.whereConditions) {
      for (const condition of options.whereConditions) {
        constraints.push(where(condition.field, condition.operator, condition.value))
      }
    }

    if (options?.orderByField) {
      constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'))
    }

    if (options?.limitCount) {
      constraints.push(limit(options.limitCount))
    }

    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Array<T & { id: string }>
        setData(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, options?.orderByField, options?.orderDirection, options?.limitCount])

  return { data, loading, error }
}

/**
 * Subscribe to real-time updates for a single document
 */
export function useDocument<T = DocumentData>(
  collectionName: string,
  docId: string | null
): { data: (T & { id: string }) | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<(T & { id: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!docId) {
      setData(null)
      setLoading(false)
      return
    }

    const docRef = doc(db, collectionName, docId)

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({
            id: snapshot.id,
            ...snapshot.data(),
          } as T & { id: string })
        } else {
          setData(null)
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  return { data, loading, error }
}
