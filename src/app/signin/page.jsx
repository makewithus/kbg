"use client";
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Animation states
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    return () => setFadeIn(false);
  }, []);

  // Reset form when toggling between signin and signup
  useEffect(() => {
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setFullName("");
    setPhoneNumber("");
  }, [isSignIn]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;
            
            if (role === 'admin') {
              router.push('/admin/dashboard');
            } else if (role === 'user') {
              router.push('/dashboard/user');
            } else {
              console.warn('Unknown role:', role);
              // Default to user dashboard if role is undefined or unknown
              router.push('/dashboard/user');
            }
          } else {
            console.warn('User document not found, creating default user document');
            // Create a default user document if it doesn't exist
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              fullName: user.displayName || '',
              phoneNumber: '',
              role: 'user',
              createdAt: new Date(),
            });
            router.push('/dashboard/user');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to user dashboard on error
          router.push('/dashboard/user');
        }
      } else {
        console.log('No user is signed in.');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignIn) {
        // Sign In Logic
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        setSuccess("Login successful! Redirecting to dashboard...");
        
        // Get user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          
          if (role === "admin") {
            setTimeout(() => router.push("/dashboard/admin"), 1500);
          } else {
            setTimeout(() => router.push("/dashboard/user"), 1500);
          }
        } else {
          console.log("No user document found, creating default...");
          // Create default user document
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            fullName: user.displayName || '',
            phoneNumber: '',
            role: "user",
            createdAt: new Date(),
          });
          setTimeout(() => router.push("/dashboard/user"), 1500);
        }
      } else {
        // Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Update auth profile
        await updateProfile(user, { displayName: fullName });

        // Create user document in Firestore
        const userData = {
          uid: user.uid,
          email: user.email,
          fullName,
          phoneNumber,
          role: "user", // Default role for new users
          createdAt: new Date(),
        };

        await setDoc(doc(db, "users", user.uid), userData);

        setSuccess("Account created successfully! Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard/user"), 1500);
      }
    } catch (error) {
      console.error("Auth error:", error.message);
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email address format.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/email-already-in-use":
          setError("Email is already in use by another account.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;
        default:
          setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {isSignIn ? "Welcome back" : "Create account"}
            </h1>
            <div className="flex">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSignIn ? "bg-[#7F1C75]" : "bg-gray-300"
                } mr-1`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${
                  !isSignIn ? "bg-[#7F1C75]" : "bg-gray-300"
                }`}
              ></div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded-lg flex items-start">
              <CheckCircle
                size={20}
                className="text-green-500 mr-3 mt-0.5 flex-shrink-0"
              />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            {/* Full Name - Only for signup */}
            {!isSignIn && (
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75] transition-all text-gray-800 bg-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Phone Number - Only for signup */}
            {!isSignIn && (
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+91 9956784585"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75] transition-all text-gray-800 bg-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75] transition-all text-gray-800 bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F1C75] focus:border-[#7F1C75] transition-all text-gray-800 bg-white"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  )}
                </button>
              </div>
              {!isSignIn && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Forgot Password - Only for signin */}
            {isSignIn && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#401B71] hover:text-[#7F1C75] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center w-full py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#7F1C75] to-[#401B71] hover:from-[#401B71] hover:to-[#7F1C75] shadow-sm hover:shadow"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <>
                  {isSignIn ? "Sign In" : "Create Account"}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-1 font-medium text-[#401B71] hover:text-[#7F1C75] transition-colors"
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p className="mb-2">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-[#401B71] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#401B71] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            &copy; {new Date().getFullYear()} KBG Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}