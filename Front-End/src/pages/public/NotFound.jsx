import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--color-mainBg)] dark:bg-[var(--color-dark-mainBg)]">
      <div className="text-center max-w-lg w-full">
        {/* 404 Number with animation */}
        <h1 className="text-8xl sm:text-9xl font-bold text-[var(--color-accent)] animate-pulse">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white font-medium transition-all duration-200"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Optional: Help text */}
        <p className="mt-8 text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
          Need help? Visit our{" "}
          <Link
            to="/dashboard"
            className="text-[var(--color-accent)] hover:underline font-medium"
          >
            dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
