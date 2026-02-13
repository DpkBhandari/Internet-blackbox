import { Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import bg from "../../assets/bg.png";
import google from "../../assets/google.png";
import facebook from "../../assets/facebook.png";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="min-h-screen bg-mainBg dark:bg-dark-mainBg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-cardBg dark:bg-dark-cardBg shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2 relative order-2 md:order-1">
          <img
            src={bg}
            alt="Register illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col gap-5 order-1 md:order-2">
          {/* Brand */}
          <Link
            to="/"
            className="text-xl font-semibold text-text-primary dark:text-dark-text-primary hover:text-accent transition-colors duration-200"
          >
            Internet Blackbox
          </Link>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary">
              Get Started
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm sm:text-base">
              Create your account to continue
            </p>
          </div>

          {/* Login Link */}
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 dark:text-blue-400 underline decoration-blue-600 dark:decoration-blue-400 underline-offset-4 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Login here
            </Link>
          </p>

          {/* Form */}
          <form className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-text-primary dark:text-dark-text-primary"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary"
                  size={18}
                />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 border border-border dark:border-dark-border rounded-lg bg-mainBg dark:bg-dark-mainBg text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary dark:placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-text-primary dark:text-dark-text-primary"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary"
                  size={18}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 border border-border dark:border-dark-border rounded-lg bg-mainBg dark:bg-dark-mainBg text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary dark:placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-text-primary dark:text-dark-text-primary"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  className="w-full pl-10 pr-12 py-2.5 border border-border dark:border-dark-border rounded-lg bg-mainBg dark:bg-dark-mainBg text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary dark:placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-text-primary dark:text-dark-text-primary"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-2.5 border border-border dark:border-dark-border rounded-lg bg-mainBg dark:bg-dark-mainBg text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary dark:placeholder:text-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 mt-1">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="mt-1 w-4 h-4 rounded border-border dark:border-dark-border text-accent focus:ring-2 focus:ring-accent"
              />
              <label
                htmlFor="terms"
                className="text-sm text-text-secondary dark:text-dark-text-secondary"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-semibold text-blue-600 dark:text-blue-400 underline decoration-blue-600 dark:decoration-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-semibold text-blue-600 dark:text-blue-400 underline decoration-blue-600 dark:decoration-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 bg-accent hover:bg-accent-hover text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border dark:bg-dark-border"></div>
            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
              OR
            </span>
            <div className="flex-1 h-px bg-border dark:bg-dark-border"></div>
          </div>

          {/* Social Signup */}
          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-3 border border-border dark:border-dark-border py-2.5 rounded-lg hover:bg-mainBg dark:hover:bg-dark-mainBg text-text-primary dark:text-dark-text-primary font-medium transition-all duration-200 active:scale-[0.98]">
              <img src={google} alt="Google logo" className="w-5 h-5" />
              <span className="hidden sm:inline">Sign up with Google</span>
              <span className="sm:hidden">Google</span>
            </button>

            <button className="flex items-center justify-center gap-3 border border-border dark:border-dark-border py-2.5 rounded-lg hover:bg-mainBg dark:hover:bg-dark-mainBg text-text-primary dark:text-dark-text-primary font-medium transition-all duration-200 active:scale-[0.98]">
              <img src={facebook} alt="Facebook logo" className="w-5 h-5" />
              <span className="hidden sm:inline">Sign up with Facebook</span>
              <span className="sm:hidden">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
