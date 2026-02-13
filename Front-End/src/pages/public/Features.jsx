import {
  Shield,
  Lock,
  Zap,
  Eye,
  Database,
  Globe2,
  Terminal,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Code2,
  RefreshCw,
  Bell,
  FileText,
  Clock,
  Smartphone,
  Cloud,
} from "lucide-react";
import { Link } from "react-router-dom";

function Features() {
  const heroFeatures = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Military-Grade Encryption",
      description:
        "256-bit AES encryption protects your data at rest and in transit. Every byte is encrypted before leaving your device.",
      highlight: "256-bit AES",
    },
    {
      icon: <Lock className="w-10 h-10" />,
      title: "Zero-Knowledge Architecture",
      description:
        "We can't access your data even if we wanted to. Only you hold the encryption keys to your digital vault.",
      highlight: "Zero Access",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Lightning Performance",
      description:
        "Sub-100ms response times with optimized React architecture and intelligent caching strategies.",
      highlight: "< 100ms",
    },
  ];

  const coreFeatures = [
    {
      icon: <Terminal className="w-6 h-6" />,
      category: "Authentication",
      title: "JWT-Based Security",
      description:
        "Stateless token authentication with automatic refresh, session timeout, and multi-device management.",
      features: [
        "Token-based auth",
        "Auto session timeout",
        "Secure refresh tokens",
        "Multi-device control",
      ],
    },
    {
      icon: <Database className="w-6 h-6" />,
      category: "Data Management",
      title: "Encrypted Storage",
      description:
        "MongoDB-powered backend with encrypted connections, automatic backups, and query optimization.",
      features: [
        "Encrypted at rest",
        "Auto backups",
        "Fast queries",
        "Scalable storage",
      ],
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      category: "Access Control",
      title: "Protected Routes",
      description:
        "Role-based access control with granular permissions and real-time authorization verification.",
      features: [
        "RBAC system",
        "Route guards",
        "Permission levels",
        "Access logs",
      ],
    },
    {
      icon: <Eye className="w-6 h-6" />,
      category: "Privacy",
      title: "Complete Anonymity",
      description:
        "No tracking, no analytics, no third-party scripts. Your activity remains completely private.",
      features: [
        "Zero tracking",
        "No analytics",
        "Private browsing",
        "GDPR compliant",
      ],
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      category: "User Experience",
      title: "Responsive Design",
      description:
        "Seamless experience across all devices with mobile-first design and dark mode support.",
      features: [
        "Mobile optimized",
        "Dark mode",
        "PWA ready",
        "Touch friendly",
      ],
    },
    {
      icon: <Bell className="w-6 h-6" />,
      category: "Monitoring",
      title: "Real-Time Alerts",
      description:
        "Instant notifications for security events, login attempts, and suspicious activities.",
      features: [
        "Login alerts",
        "Security events",
        "Activity tracking",
        "Custom rules",
      ],
    },
  ];

  const securityFeatures = [
    {
      title: "Input Validation",
      description:
        "Server-side validation on all inputs prevents injection attacks and malformed data.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      title: "XSS Protection",
      description:
        "Content Security Policy and input sanitization block cross-site scripting attacks.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      title: "CSRF Tokens",
      description:
        "Token-based validation prevents cross-site request forgery attacks.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      title: "Rate Limiting",
      description:
        "Request throttling prevents brute force attacks and DDoS attempts.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      title: "Password Hashing",
      description:
        "bcrypt with 12 salt rounds ensures passwords are never stored in plain text.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      title: "HTTPS Encryption",
      description:
        "TLS/SSL encryption for all data transmission between client and server.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  const techFeatures = [
    {
      category: "Frontend",
      items: [
        { name: "React 18", desc: "Component-based architecture" },
        { name: "Tailwind CSS", desc: "Utility-first styling" },
        { name: "React Router", desc: "Client-side routing" },
        { name: "Vite", desc: "Lightning-fast builds" },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", desc: "JavaScript runtime" },
        { name: "Express.js", desc: "Web framework" },
        { name: "JWT", desc: "Token authentication" },
        { name: "bcrypt", desc: "Password hashing" },
      ],
    },
    {
      category: "Database",
      items: [
        { name: "MongoDB", desc: "NoSQL database" },
        { name: "Mongoose", desc: "Object modeling" },
        { name: "Indexing", desc: "Query optimization" },
        { name: "Replication", desc: "High availability" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-mainBg dark:bg-dark-mainBg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent dark:from-dark-accent/20 pointer-events-none"></div>

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
              to="/about"
              className="hidden sm:inline-block text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/security"
              className="hidden sm:inline-block text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              Security
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-soft/50 dark:bg-dark-accent-soft/50 rounded-full mb-8 backdrop-blur-sm border border-accent/20 dark:border-dark-accent/30">
              <Sparkles className="w-4 h-4 text-accent dark:text-dark-accent" />
              <span className="text-sm font-medium text-accent dark:text-dark-accent">
                Complete Feature Overview
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-text-primary dark:text-dark-text-primary">
                Everything You Need.
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-accent-hover to-accent dark:from-dark-accent dark:via-dark-accent-hover dark:to-dark-accent bg-clip-text text-transparent">
                Nothing You Don't.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary dark:text-dark-text-secondary leading-relaxed">
              Powerful security features combined with intuitive design. Built
              for professionals who demand both protection and performance.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {heroFeatures.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-soft/20 dark:from-dark-accent/30 dark:to-dark-accent-soft/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border group-hover:border-accent dark:group-hover:border-dark-accent transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center mb-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="inline-block px-3 py-1 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-full mb-4">
                    <span className="text-sm font-bold text-accent dark:text-dark-accent">
                      {feature.highlight}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Core Capabilities
            </h2>
            <p className="text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Every feature engineered with security and user experience as top
              priorities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-lg flex items-center justify-center text-accent dark:text-dark-accent group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="text-xs font-mono text-text-secondary dark:text-dark-text-secondary bg-mainBg dark:bg-dark-mainBg px-3 py-1 rounded-full">
                    {feature.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-text-secondary dark:text-dark-text-secondary"
                    >
                      <div className="w-1.5 h-1.5 bg-accent dark:bg-dark-accent rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-cardBg to-accent-soft/10 dark:from-dark-cardBg dark:to-dark-accent-soft/20 rounded-3xl p-8 sm:p-12 border border-border dark:border-dark-border shadow-2xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-soft/50 dark:bg-dark-accent-soft/50 rounded-full mb-6">
                <Shield className="w-4 h-4 text-accent dark:text-dark-accent" />
                <span className="text-sm font-medium text-accent dark:text-dark-accent">
                  Security First
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
                OWASP-Compliant Security
              </h2>
              <p className="text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
                Following industry best practices to protect against the most
                critical web vulnerabilities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-mainBg dark:bg-dark-mainBg rounded-xl p-6 border border-border dark:border-dark-border"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center text-success">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary dark:text-dark-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-full mb-6">
              <Code2 className="w-4 h-4 text-accent dark:text-dark-accent" />
              <span className="text-sm font-medium text-accent dark:text-dark-accent">
                Technology Stack
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Built with Modern Technologies
            </h2>
            <p className="text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Leveraging battle-tested frameworks and libraries for reliability
              and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {techFeatures.map((section, index) => (
              <div
                key={index}
                className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border"
              >
                <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-lg mr-3"></div>
                  {section.category}
                </h3>
                <div className="space-y-4">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-text-primary dark:text-dark-text-primary">
                          {item.name}
                        </div>
                        <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                          {item.desc}
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Experience Maximum Security?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands who trust Internet Blackbox for their digital
                security needs.
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
                  to="/security"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  View Security Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border dark:border-dark-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
                  Internet Blackbox
                </span>
              </div>
              <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                Secure digital information management platform built with
                industry-leading technologies.
              </p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                © 2024 Internet Blackbox. Academic Project.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-dark-accent transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-dark-accent transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-dark-accent transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-dark-accent transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-dark-accent transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Features;
