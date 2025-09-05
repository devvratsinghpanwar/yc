"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  // We'll let the server actions handle errors, but this state is here if you need it for client-side errors.
  // const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // --- VALIDATION LOGIC ---
  const passwordRequirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Contains an uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains a lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains a number', met: /\d/.test(password) }
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  return (
    <section className="pink_container bg-pink-100 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md transition-all duration-500">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-pink-200">
          <h1 className="text-3xl font-extrabold text-center text-pink-600 mb-2">
            {isSigningUp ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {isSigningUp
              ? "Join our community to start pitching your ideas."
              : "Login to continue your journey."}
          </p>

          <form action={isSigningUp ? signup : login} className="flex flex-col gap-4">
            {/* --- SIGN UP FIELDS --- */}
            {isSigningUp && (
              <>
                {/* Full Name (Required) */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="input_field"
                    placeholder="e.g., Jane Doe"
                  />
                </div>

                {/* Username (Required) */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="input_field"
                    placeholder="e.g., janedoe99"
                  />
                </div>
              </>
            )}

            {/* --- COMMON FIELDS (Email & Password) --- */}
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input_field"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input_field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* --- MORE SIGN UP FIELDS --- */}
            {isSigningUp && (
              <>
                {/* Confirm Password (Below Password) */}
                <div className="flex flex-col gap-1 relative">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={confirmPasswordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`input_field pr-10 ${
                        confirmPassword && !doPasswordsMatch ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex={-1}
                    >
                      {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && !doPasswordsMatch && (
                     <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
                  )}
                </div>

                {/* Password Strength Requirements */}
                {password && (
                  <div className="mt-2 space-y-1.5">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle
                          className={`w-4 h-4 transition-colors ${req.met ? 'text-green-500' : 'text-gray-400'}`}
                        />
                        <span className={`transition-colors ${req.met ? 'text-gray-700' : 'text-gray-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Bio (Optional) */}
                 <div className="flex flex-col gap-1 mt-2">
                  <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio (Optional)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="input_field h-24"
                    placeholder="Tell us a little about yourself..."
                  />
                </div>
              </>
            )}

            {/* --- ACTION BUTTON --- */}
            <div className="mt-4">
              <button
                type="submit"
                className="primary_btn w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                // Disable button if signing up and validation fails
                disabled={isSigningUp && (!isPasswordValid || !doPasswordsMatch)}
              >
                {isSigningUp ? "Create Account" : "Log In"}
              </button>
            </div>
          </form>

          {/* --- TOGGLE BETWEEN FORMS --- */}
          <p className="text-center mt-6 text-sm text-gray-700">
            {isSigningUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSigningUp(!isSigningUp)}
              className="text-pink-600 hover:underline font-semibold transition"
            >
              {isSigningUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}