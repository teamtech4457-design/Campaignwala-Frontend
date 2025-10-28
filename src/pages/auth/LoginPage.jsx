"use client";
import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login({ phoneNumber, password });
      // Navigation will be handled automatically by useAuth hook
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* ---------- LEFT SECTION (Desktop Only) ---------- */}
      <div className="hidden md:flex md:w-1/2 bg-muted/30 flex-col items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <svg
              className="w-10 h-10"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="8" fill="#FF9500" />
              <text
                x="20"
                y="26"
                fontSize="20"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
              >
                C
              </text>
            </svg>
            <h2 className="text-3xl font-bold text-foreground">Campaign Waala</h2>
          </div>

          {/* Image */}
          <div className="mb-8 w-64 mx-auto">
            <img
              src="https://leads.freelancerwaala.com/new_year.gif"
              alt="Campaign"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Welcome text */}
          <h3 className="text-2xl font-bold text-foreground mb-4 text-left">
            Welcome to Campaign Waala!
          </h3>

          <div className="space-y-4 text-left">
            <p className="text-muted-foreground leading-relaxed">
              Ready to transform leads into success? Dive into your daily tasks,
              make those calls, and celebrate your victories! Check out your
              profile along the way.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Ready to boost your career? Join Campaign Waala today! Get
              Started.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- RIGHT SECTION (Login Form) ---------- */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="md:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Campaign Waala
            </h1>
            <div className="flex items-center justify-center gap-2">
              <LogIn size={28} className="text-primary" />
              <p className="text-2xl font-bold text-foreground">Login</p>
            </div>
          </div>

          {/* --------- FORM --------- */}
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-lg shadow-lg p-8 space-y-6 border border-border"
          >
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-background text-foreground font-medium placeholder:text-muted-foreground"
                required
                pattern="[0-9]{10}"
                maxLength="10"
              />
              <p className="text-xs text-muted-foreground mt-1">Admin: 9876543210 | User: 9876543211</p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-background text-foreground font-medium placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Admin: admin123 | User: user123</p>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:opacity-80 transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-muted-foreground">
                Don&apos;t have an account yet?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:opacity-80 transition"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
  
}
