import React from 'react';
import { signOut } from '../utils/auth';

export const SignOutButton: React.FC = () => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Sign Out
    </button>
  );
};
