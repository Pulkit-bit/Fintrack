export function authErrorMessage(code) {
  if (!code) return 'An unknown error occurred. Please try again.';
  code = code.startsWith('auth/') ? code : `auth/${code}`;

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/invalid-password':
      return 'Email or password is incorrect.';
    case 'auth/user-not-found':
      return 'No account found for this email.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check connection and retry.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using another sign-in method.';
    default:
      return 'Unable to sign in. Please try again.';
  }
}
