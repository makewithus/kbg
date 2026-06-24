"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create user in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update user profile with display name
      await updateProfile(user, {
        displayName: fullName
      });

      // 3. Store additional data in Firestore - USE THE ROLE STATE VARIABLE
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: fullName,
        phoneNumber: phoneNumber,
        role: role, // ✅ Use the state variable instead of hardcoded string
        createdAt: new Date(),
      });

      console.log("User registered successfully!");
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          minLength={6}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border p-2 rounded"
          required
        />
        
        {/* Uncomment if you want role selection */}
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          className="border p-2 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        
        <button 
          type="submit" 
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Register"}
        </button>
      </form>
    </div>
  );
}