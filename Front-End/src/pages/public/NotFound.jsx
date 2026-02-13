import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-mainBg dark:bg-dark-mainBg">
      <div className="text-center max-w-2xl w-full">
        {/* 404 Number */}
        <div className="relative inline-block">
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-extrabold text-accent animate-pulse select-none">
            404
          </h1>
          <div className="absolute inset-0 text-8xl sm:text-9xl lg:text-[12rem] font-extrabold text-accent blur-2xl opacity-30 animate-pulse select-none">
            404
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary dark:text-dark-text-primary">
          Oops! Page Not Found
        </h2>

        {/* Message */}
        <p className="mt-4 text-base sm:text-lg text-text-secondary dark:text-dark-text-secondary max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Search Suggestion Box */}
        <div className="mt-12 p-6 bg-cardBg dark:bg-dark-cardBg border border-border dark:border-dark-border rounded-lg shadow-sm">
          <div className="flex items-center justify-center gap-2 text-text-secondary dark:text-dark-text-secondary mb-3">
            <Search size={18} />
            <span className="text-sm font-medium">
              Looking for something specific?
            </span>
          </div>

          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            Try visiting our{" "}
            <Link
              to="/dashboard"
              className="font-semibold text-blue-600 dark:text-blue-400 underline decoration-blue-600 dark:decoration-blue-400 underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              dashboard
            </Link>{" "}
            or{" "}
            <Link
              to="/contact"
              className="font-semibold text-blue-600 dark:text-blue-400 underline decoration-blue-600 dark:decoration-blue-400 underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              contact support
            </Link>
            .
          </p>
        </div>

        {/* Decorative Dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
