export const signOut = async () => {
  // Clear any stored tokens/credentials
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Redirect to login page
  window.location.href = '/login';
};
