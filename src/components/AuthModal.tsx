import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Briefcase,
  AtSign,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
  LogIn
} from 'lucide-react';
import { AuthUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  onShowToast: (toast: { type: 'success' | 'error' | 'info'; title: string; description?: string }) => void;
}

const PROFESSIONS = [
  'Student / طالب علم',
  'Teacher / استاد',
  'Urdu Writer / Poet (شاعر / ادیب)',
  'Calligrapher / خطاط',
  'Journalist / صحافی',
  'Researcher / محقق',
  'Content Creator / تخلیق کار',
  'Translator / مترجم',
  'Other Professional'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profession, setProfession] = useState('Urdu Writer / Poet (شاعر / ادیب)');
  
  // Password detection & visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Retrieve user registered accounts from persistence
  const getRegisteredAccounts = (): Array<AuthUser & { password?: string }> => {
    const saved = localStorage.getItem('officeweb_user_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {}
    }
    return [];
  };

  // Reset form completely whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setAuthMode('signin');
      setEmail('');
      setPassword('');
      setAuthError(null);
      setShowPassword(false);
      setName('');
      setUsername('');
      setProfession('Urdu Writer / Poet (شاعر / ادیب)');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Quick Google Sign Up / Login
  const handleGoogleLoginStart = () => {
    const defaultEmail = email.trim() || 'abdullahshahid.20100@gmail.com';
    const cleanEmail = defaultEmail.toLowerCase();
    const derivedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const derivedUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'user';

    const registeredAccounts = getRegisteredAccounts();
    const existing = registeredAccounts.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      onLoginSuccess(existing);
      onShowToast({
        type: 'success',
        title: 'Google Connected 🟢',
        description: `Welcome back, ${existing.name}!`
      });
      onClose();
    } else {
      // Pre-fill signup form for direct completion
      setEmail(cleanEmail);
      setName(derivedName);
      setUsername(derivedUsername);
      setAuthMode('signup');
      onShowToast({
        type: 'info',
        title: 'Google Email Connected',
        description: 'Please set your password and complete registration.'
      });
    }
  };

  // Direct Sign Up Handler
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || 'user_' + Date.now().toString().slice(-4);
    const cleanPassword = password.trim();
    const cleanName = name.trim() || 'User';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('براہ کرم درست ای میل درج کریں۔ (Please enter a valid email)');
      return;
    }

    if (!cleanPassword) {
      setAuthError('براہ کرم پاس ورڈ درج کریں۔ (Please create a password)');
      return;
    }

    const newUser: AuthUser = {
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      profession: profession || 'Urdu Writer / Poet (شاعر / ادیب)'
    };

    // Save in registered accounts
    const registeredAccounts = getRegisteredAccounts();
    const existingIdx = registeredAccounts.findIndex(
      (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername
    );

    if (existingIdx >= 0) {
      registeredAccounts[existingIdx] = {
        ...newUser,
        password: cleanPassword
      };
    } else {
      registeredAccounts.push({
        ...newUser,
        password: cleanPassword
      });
    }

    localStorage.setItem('officeweb_user_accounts', JSON.stringify(registeredAccounts));

    onLoginSuccess(newUser);
    onShowToast({
      type: 'success',
      title: `Welcome, ${cleanName}! 🎉`,
      description: `Account created successfully (@${cleanUsername}).`
    });
    onClose();
  };

  // Direct Sign In Handler with strict password checking
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIdentifier = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      setAuthError('براہ کرم ای میل یا یوزر نام درج کریں۔ (Please enter email or username)');
      return;
    }

    if (!cleanPassword) {
      setAuthError('براہ کرم پاس ورڈ درج کریں۔ (Please enter password)');
      return;
    }

    const registeredAccounts = getRegisteredAccounts();
    const existingAccount = registeredAccounts.find(
      (u) => u.email.toLowerCase() === cleanIdentifier || u.username.toLowerCase() === cleanIdentifier
    );

    // 1. Check if account exists
    if (!existingAccount) {
      setAuthError('اس ای میل یا یوزر نام کا اکاؤنٹ موجود نہیں ہے۔ نیا اکاؤنٹ بنانے کے لیے اوپر "Sign Up" پر کلک کریں۔');
      onShowToast({
        type: 'error',
        title: 'Account Not Found (اکاؤنٹ نہیں ملا)',
        description: 'No account registered with this email/username. Please Sign Up.'
      });
      return;
    }

    // 2. Strict password validation
    const expectedPassword = existingAccount.password || '';
    if (!expectedPassword || expectedPassword !== cleanPassword) {
      setAuthError('غلط پاس ورڈ ہے! براہ کرم اپنے اکاؤنٹ کا درست پاس ورڈ درج کریں۔ (Wrong password! Enter correct password)');
      onShowToast({
        type: 'error',
        title: 'Wrong Password (غلط پاس ورڈ)',
        description: 'Wrong password entered. Please enter the correct password for your account.'
      });
      return;
    }

    // 3. Success
    setAuthError(null);
    const authenticatedUser: AuthUser = {
      name: existingAccount.name || 'Urdu Author',
      username: existingAccount.username || 'user',
      email: existingAccount.email,
      profession: existingAccount.profession || 'Urdu Writer / Poet (شاعر / ادیب)'
    };

    onLoginSuccess(authenticatedUser);
    onShowToast({
      type: 'success',
      title: 'Logged In Successfully 🟢',
      description: `Welcome back, ${authenticatedUser.name}!`
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 z-10 border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  {authMode === 'signin' ? 'Log In to ABS Office' : 'Create New Account'}
                </h2>
                <p className="text-xs text-gray-500">
                  {authMode === 'signin'
                    ? 'Enter your email & account password'
                    : 'Fill details to register your account'}
                </p>
              </div>
            </div>
            <button
              id="btn-close-auth-modal"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher: Log In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl my-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In (لاگ ان)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up (نیا اکاؤنٹ)</span>
            </button>
          </div>

          {/* Google Quick Connect Button */}
          <div className="mb-4">
            <button
              id="btn-google-login"
              type="button"
              onClick={handleGoogleLoginStart}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl font-medium text-xs text-gray-700 shadow-2xs transition active:scale-98 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google (گوگل سے لاگ ان کریں)</span>
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="h-[1px] bg-gray-200 flex-1" />
              <span className="text-[10px] font-semibold uppercase text-gray-400">
                {authMode === 'signin' ? 'or log in with email' : 'or register with email'}
              </span>
              <div className="h-[1px] bg-gray-200 flex-1" />
            </div>
          </div>

          {/* Form: SIGN IN */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email or Username / ای میل یا یوزر نام
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    id="input-auth-email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter email or username"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password / پاس ورڈ
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    id="input-auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter account password"
                    className={`w-full pl-9 pr-10 py-2 rounded-lg text-sm transition focus:outline-none ${
                      authError
                        ? 'bg-red-50/60 border-2 border-red-500 text-red-900 focus:ring-2 focus:ring-red-300'
                        : 'bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Error Alert */}
                {authError && (
                  <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-900">غلط معلومات (Authentication Error)</p>
                      <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">
                        {authError}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                id="btn-auth-signin"
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-xs transition cursor-pointer"
              >
                Log In (لاگ ان کریں)
              </button>

              <div className="pt-1 text-center text-xs text-gray-600">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError(null);
                  }}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Create Account (نیا اکاؤنٹ بنائیں)
                </button>
              </div>
            </form>
          )}

          {/* Form: SIGN UP */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name / نام
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                    <input
                      id="input-signup-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Username / یوزر نام
                  </label>
                  <div className="relative">
                    <AtSign className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                    <input
                      id="input-signup-username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="username"
                      className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address / ای میل
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    id="input-signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Create Password / پاس ورڈ
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    id="input-signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Profession / پیشہ
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  <select
                    id="select-signup-profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    {PROFESSIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {authError && (
                <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                id="btn-signup-submit"
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-xs transition mt-1 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Account & Sign In (رجسٹر کریں)</span>
              </button>

              <div className="pt-1 text-center text-xs text-gray-600">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError(null);
                  }}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Log In (لاگ ان)
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

