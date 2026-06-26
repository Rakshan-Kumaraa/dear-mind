import { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile // NEW: Allows us to save the username to the account
} from 'firebase/auth';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(''); // NEW STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // NEW STATE
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegistering) {
        // NEW: Validation checks before sending to Firebase
        if (!username.trim()) {
          setError("Please enter a username.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        // Create the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save the username to their new Firebase profile
        await updateProfile(userCredential.user, { displayName: username });
        
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (err) {
      console.error("Firebase Email Auth Error:", err);
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err) {
      console.error("Firebase Google Auth Error:", err);
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl w-full max-w-md flex flex-col items-center border border-white/10 shadow-2xl">
      <div className="text-4xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-white mb-6">
        {isRegistering ? 'Create your Vault' : 'Unlock your Vault'}
      </h2>
      
      {error && (
        <div className="bg-red-500/20 text-red-200 p-3 rounded-lg w-full text-sm mb-4 border border-red-500/30 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailAuth} className="w-full space-y-4">
        {/* Conditionally render Username only during registration */}
        {isRegistering && (
          <input 
            type="text" placeholder="Username" required
            className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--accent-start)] transition-colors"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
        )}
        
        <input 
          type="email" placeholder="Email address" required
          className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--accent-start)] transition-colors"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        
        <input 
          type="password" placeholder="Password" required
          className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--accent-start)] transition-colors"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />

        {/* Conditionally render Confirm Password only during registration */}
        {isRegistering && (
          <input 
            type="password" placeholder="Confirm Password" required
            className="w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[var(--accent-start)] transition-colors"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white font-bold transition-all shadow-lg hover:opacity-90 mt-2">
          {isRegistering ? 'Sign Up' : 'Enter Vault'}
        </button>
      </form>

      <div className="flex items-center w-full my-6 gap-4 opacity-50">
        <div className="h-px bg-white flex-1"></div>
        <span className="text-sm font-medium">or</span>
        <div className="h-px bg-white flex-1"></div>
      </div>

      <button type="button" onClick={handleGoogleSignIn} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center justify-center gap-3 border border-white/10">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
        Sign in with Google
      </button>

      <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="mt-6 text-white/50 hover:text-white text-sm transition-colors font-medium">
        {isRegistering ? 'Already have an account? Log in' : 'Need an account? Sign up'}
      </button>
    </div>
  );
}