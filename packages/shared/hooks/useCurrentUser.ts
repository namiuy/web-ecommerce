import { useEffect, useState } from 'react';
import { User } from '../entities/user';
import { onAuthStateChange } from '../services/firebase';
import lscache from 'lscache';
import { get } from '../utils/fetcher';

/**
 * Hook to manage current user state across the application
 * Syncs with Firebase Auth and localStorage
 */
export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first for immediate render
    const cachedUser = lscache.get('user');
    if (cachedUser) {
      setUser(cachedUser);
      setIsLoading(false);
    }

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Fetch user data from BFF
          const userData = await get<any>(`/api/users/${firebaseUser.uid}`, {}, true);

          // Check if user is logged in and synced
          if (userData && userData.is_logged_in && !userData.needs_sync && !userData.error) {
            // Map BFF response to User entity
            const mappedUser: User = {
              id: userData.uid,
              first_name: userData.full_name?.split(' ')[0] || '',
              last_name: userData.full_name?.split(' ').slice(1).join(' ') || '',
              email: userData.email,
              password: '', // Not needed on frontend
              personId: userData.user_id?.toString() || '0', // PersonId from database
              roles: userData.roles || []
            };

            // Update localStorage and state
            lscache.set('user', mappedUser);
            setUser(mappedUser);
          } else {
            // User not synced, not logged in, or error - clear state
            lscache.remove('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          lscache.remove('user');
          setUser(null);
        }
      } else {
        // User is signed out
        lscache.remove('user');
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading };
};
