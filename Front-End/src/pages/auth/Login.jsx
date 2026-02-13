import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import bg from "../../assets/bg.png";
import google from "../../assets/google.png";
import facebook from "../../assets/facebook.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen bg-mainBg dark:bg-dark-mainBg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-cardBg dark:bg-dark-cardBg shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
          <Link
            to="/"
            className="text-xl font-semibold text-text-primary dark:text-dark-text-primary hover:text-accent transition-colors duration-200"
          >
            Internet Blackbox
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-dark-text-primary">
              Welcome Back
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm sm:text-base">
              Login to continue your journey
            </p>
          </div>

          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 dark:text-blue-400 underline decoration-blue-600 dark:decoration-blue-400 underline-offset-4 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Create now
            </Link>
          </p>

          <form className="flex flex-col gap-4">
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-text-primary dark:text-dark-text-primary"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className="mt-2 bg-accent hover:bg-accent-hover text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Login Now
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border dark:bg-dark-border"></div>
            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
              OR
            </span>
            <div className="flex-1 h-px bg-border dark:bg-dark-border"></div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-3 border border-border dark:border-dark-border py-2.5 rounded-lg hover:bg-mainBg dark:hover:bg-dark-mainBg text-text-primary dark:text-dark-text-primary font-medium transition-all duration-200 active:scale-[0.98]">
              <img src={google} alt="Google logo" className="w-5 h-5" />
              <span className="hidden sm:inline">Continue with Google</span>
              <span className="sm:hidden">Google</span>
            </button>

            <button className="flex items-center justify-center gap-3 border border-border dark:border-dark-border py-2.5 rounded-lg hover:bg-mainBg dark:hover:bg-dark-mainBg text-text-primary dark:text-dark-text-primary font-medium transition-all duration-200 active:scale-[0.98]">
              <img src={facebook} alt="Facebook logo" className="w-5 h-5" />
              <span className="hidden sm:inline">Continue with Facebook</span>
              <span className="sm:hidden">Facebook</span>
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={bg}
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

export default Login;
