import { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [message, setMessage] = useState({ type: '', text: '' }); // Handles both errors and success messages

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      if (isRegistering) {
        if (!username.trim()) {
          setMessage({ type: 'error', text: "Please enter a username." });
          return;
        }
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: "Passwords do not match." });
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (err) {
      console.error("Firebase Email Auth Error:", err);
      setMessage({ type: 'error', text: err.message.replace('Firebase: ', '') });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess();
    } catch (err) {
      console.error("Firebase Google Auth Error:", err);
      setMessage({ type: 'error', text: err.message.replace('Firebase: ', '') });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ type: 'error', text: "Please type your email into the box first." });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ type: 'success', text: "Success! Check your inbox for a password reset link." });
    } catch (err) {
      setMessage({ type: 'error', text: err.message.replace('Firebase: ', '') });
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl w-full max-w-md flex flex-col items-center border border-white/10 shadow-2xl">
      <div className="text-4xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-white mb-6">
        {isRegistering ? 'Create your Vault' : 'Unlock your Vault'}
      </h2>
      
      {/* Dynamic Message Box for Errors and Successes */}
      {message.text && (
        <div className={`p-3 rounded-lg w-full text-sm mb-4 text-center font-medium border ${message.type === 'error' ? 'bg-red-500/20 text-red-200 border-red-500/30' : 'bg-green-500/20 text-green-200 border-green-500/30'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleEmailAuth} className="w-full space-y-4">
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

        {/* The Forgot Password Button */}
        {!isRegistering && (
          <button 
            type="button" 
            onClick={handleForgotPassword}
            className="w-full text-center text-sm text-white/50 hover:text-white mt-2 transition-colors"
          >
            Forgot your password?
          </button>
        )}
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