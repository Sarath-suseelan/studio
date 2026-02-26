'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData, 
  queryEqual 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  const [state, setState] = useState(factory);
  const ref = useRef(state);

  useEffect(() => {
    const next = factory();
    const isQuery = (obj: any): obj is Query => obj && typeof obj === 'object' && 'type' in obj && (obj.type === 'query' || obj.type === 'collection');
    
    const isEqual = isQuery(next) && isQuery(ref.current) 
      ? queryEqual(next, ref.current) 
      : next === ref.current;

    if (!isEqual) {
      ref.current = next;
      setState(next);
    }
  }, deps);

  return state;
}

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as T));
        setData(items);
        setLoading(false);
      },
      async (err) => {
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query?.path?.toString() || 'unknown',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [query]);

  return { data, loading, error };
}
