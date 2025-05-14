
import { useContext } from 'react';
// Assuming AuthContext is exported from '@/contexts/AuthContext'
// Adjust the import path if your AuthContext.tsx is located elsewhere.
import { AuthContext } from '@/contexts/AuthContext'; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
