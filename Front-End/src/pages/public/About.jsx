import {
  Shield,
  Lock,
  Code2,
  Database,
  Zap,
  Globe2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  Layers,
  GitBranch,
} from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-mainBg dark:bg-dark-mainBg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent dark:from-dark-accent/20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-soft/20 via-transparent to-transparent dark:from-dark-accent-soft/30 pointer-events-none"></div>

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-border dark:border-dark-border">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
              Blackbox
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-soft/50 dark:bg-dark-accent-soft/50 rounded-full mb-8 backdrop-blur-sm border border-accent/20 dark:border-dark-accent/30">
              <Sparkles className="w-4 h-4 text-accent dark:text-dark-accent" />
              <span className="text-sm font-medium text-accent dark:text-white">
                Final Year Project | BCA 2025-2026
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-text-primary dark:text-dark-text-primary">
                Building the Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-accent-hover to-accent dark:from-dark-accent dark:via-dark-accent-hover dark:to-dark-accent bg-clip-text text-transparent">
                Digital Security
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary dark:text-dark-text-secondary leading-relaxed mb-12">
              A production-grade platform demonstrating modern security
              practices, scalable architecture, and exceptional user experience
              through cutting-edge web technologies.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 px-4 py-2 bg-cardBg dark:bg-dark-cardBg rounded-lg border border-border dark:border-dark-border">
                <Lock className="w-4 h-4 text-success" />
                <span className="text-text-primary dark:text-dark-text-primary font-medium">
                  JWT Authentication
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-cardBg dark:bg-dark-cardBg rounded-lg border border-border dark:border-dark-border">
                <Shield className="w-4 h-4 text-accent dark:text-dark-accent" />
                <span className="text-text-primary dark:text-dark-text-primary font-medium">
                  256-bit Encryption
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-cardBg dark:bg-dark-cardBg rounded-lg border border-border dark:border-dark-border">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-text-primary dark:text-dark-text-primary font-medium">
                  React 18 + Node.js
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-full mb-6">
                <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-accent dark:text-dark-accent">
                  The Challenge
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
                Solving Real Security Problems
              </h2>

              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center">
                    <span className="text-danger font-bold text-lg">01</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-2">
                      Data Breach Epidemic
                    </h3>
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                      Traditional storage lacks robust encryption and access
                      controls, leaving sensitive information vulnerable to
                      unauthorized access and cyber attacks.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                    <span className="text-warning font-bold text-lg">02</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-2">
                      Authentication Weaknesses
                    </h3>
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                      Many platforms use weak authentication systems vulnerable
                      to brute-force attacks, credential stuffing, and session
                      hijacking.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 dark:bg-dark-accent/10 rounded-xl flex items-center justify-center">
                    <span className="text-accent dark:text-dark-accent font-bold text-lg">
                      03
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-2">
                      Security vs Usability
                    </h3>
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                      Existing solutions sacrifice user experience for security,
                      creating complex interfaces that discourage adoption and
                      proper usage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-soft/20 dark:from-dark-accent/30 dark:to-dark-accent-soft/40 rounded-3xl blur-3xl"></div>
              <div className="relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-danger rounded-full"></div>
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                  </div>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary font-mono">
                    security-metrics.json
                  </span>
                </div>

                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center justify-between p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                    <span className="text-text-secondary dark:text-dark-text-secondary">
                      Encryption Standard
                    </span>
                    <span className="text-success font-semibold">
                      256-bit AES
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                    <span className="text-text-secondary dark:text-dark-text-secondary">
                      Authentication
                    </span>
                    <span className="text-success font-semibold">
                      JWT + bcrypt
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                    <span className="text-text-secondary dark:text-dark-text-secondary">
                      OWASP Compliance
                    </span>
                    <span className="text-success font-semibold">Top 10 ✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                    <span className="text-text-secondary dark:text-dark-text-secondary">
                      Security Score
                    </span>
                    <span className="text-success font-semibold">A+</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-success">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">
                      All security checks passed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent dark:text-dark-accent" />
              <span className="text-sm font-medium text-accent dark:text-dark-accent">
                Our Solution
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Enterprise-Grade Architecture
            </h2>
            <p className="text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Multi-layered security combined with modern development practices
              delivers both protection and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -inset-px bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur -z-10"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center mb-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  Bulletproof Authentication
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                  JWT-based stateless authentication with bcrypt password
                  hashing and secure session management with automatic timeout.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    Token-based authorization
                  </li>
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    12-round bcrypt hashing
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -inset-px bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur -z-10"></div>

              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center mb-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  Three-Tier Architecture
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                  Clean separation between presentation, business logic, and
                  data layers ensures maintainability and scalability.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    React component-based UI
                  </li>
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    RESTful API design
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -inset-px bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur -z-10"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center mb-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  Defense in Depth
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                  Multiple security layers including input validation, XSS
                  prevention, CSRF protection, and rate limiting.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    OWASP Top 10 compliance
                  </li>
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    Real-time threat detection
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -inset-px bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur -z-10"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center mb-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform">
                  <Globe2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  Universal Accessibility
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                  Mobile-first responsive design with dark mode support ensures
                  seamless experience across all devices.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    PWA-ready architecture
                  </li>
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    WCAG 2.1 compliant
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -inset-px bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur -z-10"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center mb-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform">
                  <Database className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  Scalable Data Layer
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                  MongoDB with Mongoose ODM provides flexible document storage
                  with encrypted connections and optimized queries.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    Automatic backups
                  </li>
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    Query optimization
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-2xl">
              <div className="absolute -inset-px bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur -z-10"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center mb-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  Optimized Performance
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                  Code splitting, lazy loading, and efficient state management
                  deliver sub-100ms response times.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    Lighthouse score 95+
                  </li>
                  <li className="flex items-center text-text-secondary dark:text-dark-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2" />
                    CDN-ready assets
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-cardBg to-accent-soft/10 dark:from-dark-cardBg dark:to-dark-accent-soft/20 rounded-3xl p-8 sm:p-12 border border-border dark:border-dark-border shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent-soft/50 dark:bg-dark-accent-soft/50 rounded-full mb-6">
                  <Code2 className="w-4 h-4 text-accent dark:text-dark-accent" />
                  <span className="text-sm font-medium text-accent dark:text-dark-accent">
                    Technology Stack
                  </span>
                </div>

                <h2 className="text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
                  Built with Modern Technologies
                </h2>
                <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8">
                  Every technology choice optimized for security, performance,
                  and developer experience using battle-tested frameworks and
                  libraries.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-mainBg dark:bg-dark-mainBg rounded-xl p-4 border border-border dark:border-dark-border">
                    <div className="text-accent dark:text-dark-accent font-semibold mb-1">
                      Frontend
                    </div>
                    <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      React 18 • Tailwind CSS
                    </div>
                  </div>
                  <div className="bg-mainBg dark:bg-dark-mainBg rounded-xl p-4 border border-border dark:border-dark-border">
                    <div className="text-accent dark:text-dark-accent font-semibold mb-1">
                      Backend
                    </div>
                    <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      Node.js • Express.js
                    </div>
                  </div>
                  <div className="bg-mainBg dark:bg-dark-mainBg rounded-xl p-4 border border-border dark:border-dark-border">
                    <div className="text-accent dark:text-dark-accent font-semibold mb-1">
                      Database
                    </div>
                    <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      MongoDB • Mongoose
                    </div>
                  </div>
                  <div className="bg-mainBg dark:bg-dark-mainBg rounded-xl p-4 border border-border dark:border-dark-border">
                    <div className="text-accent dark:text-dark-accent font-semibold mb-1">
                      Security
                    </div>
                    <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      JWT • bcrypt
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dark-cardBg rounded-2xl p-6 shadow-2xl border border-dark-border">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-xs text-dark-text-secondary font-mono ml-auto">
                    package.json
                  </span>
                </div>

                <div className="space-y-3 font-mono text-sm">
                  <div className="text-dark-text-secondary">
                    <span className="text-accent">"dependencies"</span>: {"{"}
                  </div>
                  <div className="pl-4 text-dark-text-secondary">
                    <span className="text-success">"react"</span>:{" "}
                    <span className="text-warning">"^18.2.0"</span>,
                  </div>
                  <div className="pl-4 text-dark-text-secondary">
                    <span className="text-success">"express"</span>:{" "}
                    <span className="text-warning">"^4.18.2"</span>,
                  </div>
                  <div className="pl-4 text-dark-text-secondary">
                    <span className="text-success">"mongoose"</span>:{" "}
                    <span className="text-warning">"^8.0.0"</span>,
                  </div>
                  <div className="pl-4 text-dark-text-secondary">
                    <span className="text-success">"jsonwebtoken"</span>:{" "}
                    <span className="text-warning">"^9.0.2"</span>
                  </div>
                  <div className="text-dark-text-secondary">{"}"}</div>
                </div>

                <div className="mt-6 flex items-center space-x-2 text-success text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>npm install completed ✓</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-full mb-6">
              <GitBranch className="w-4 h-4 text-accent dark:text-dark-accent" />
              <span className="text-sm font-medium text-accent dark:text-dark-accent">
                Future Roadmap
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Continuous Evolution
            </h2>
            <p className="text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Planned enhancements to expand functionality and strengthen
              security posture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Two-Factor Auth",
                desc: "SMS & authenticator app support",
              },
              {
                title: "Email Verification",
                desc: "Token-based email validation",
              },
              { title: "File Storage", desc: "Encrypted document management" },
              { title: "Mobile App", desc: "React Native iOS & Android" },
              { title: "API Access", desc: "OAuth 2.0 integration" },
              { title: "Real-time Sync", desc: "WebSocket collaboration" },
              { title: "Audit Logs", desc: "Comprehensive activity tracking" },
              { title: "AI Security", desc: "Anomaly detection system" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-cardBg dark:bg-dark-cardBg rounded-xl p-6 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-lg group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-accent dark:text-dark-accent bg-accent-soft/30 dark:bg-dark-accent-soft/30 px-2 py-1 rounded">
                    Phase {Math.floor(index / 2) + 1}
                  </span>
                  <ArrowRight className="w-4 h-4 text-text-secondary dark:text-dark-text-secondary group-hover:text-accent dark:group-hover:text-dark-accent group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-cardBg to-accent-soft/10 dark:from-dark-cardBg dark:to-dark-accent-soft/20 rounded-3xl p-8 sm:p-12 border border-border dark:border-dark-border shadow-2xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-accent-soft/50 dark:bg-dark-accent-soft/50 rounded-full mb-6">
                <Users className="w-4 h-4 text-accent dark:text-dark-accent" />
                <span className="text-sm font-medium text-accent dark:text-dark-accent">
                  Development Team
                </span>
              </div>
              <h2 className="text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
                Built by Students, For Students
              </h2>
              <p className="text-lg text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                A collaborative effort demonstrating full-stack expertise and
                modern development practices.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-mainBg dark:bg-dark-mainBg rounded-2xl p-8 border border-border dark:border-dark-border">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg">
                  DB
                </div>
                <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                  Deepak Channabasappa Bhandari
                </h3>
                <p className="text-accent dark:text-dark-accent font-semibold mb-4">
                  Full Stack Developer
                </p>
                <div className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  <div className="flex items-center justify-between">
                    <span>PRN</span>
                    <span className="font-mono">04423000187</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Class</span>
                    <span className="font-medium">TYBCA Division A</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Focus</span>
                    <span className="font-medium">Backend & Security</span>
                  </div>
                </div>
              </div>

              <div className="bg-mainBg dark:bg-dark-mainBg rounded-2xl p-8 border border-border dark:border-dark-border">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg">
                  VW
                </div>
                <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                  Vijay Netaji Waghmode
                </h3>
                <p className="text-accent dark:text-dark-accent font-semibold mb-4">
                  Full Stack Developer
                </p>
                <div className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  <div className="flex items-center justify-between">
                    <span>PRN</span>
                    <span className="font-mono">04423000169</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Class</span>
                    <span className="font-medium">TYBCA Division A</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Focus</span>
                    <span className="font-medium">Frontend & UX</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Academic Year 2025-2026 • Bachelor of Computer Applications
                (BCA) - Final Year Project
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Experience the Security Revolution
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                See how modern architecture and security practices come together
                in a production-ready platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-accent hover:bg-gray-50 rounded-xl font-semibold text-lg shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
