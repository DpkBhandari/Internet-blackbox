import {
  Shield,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle2,
  Eye,
  Database,
  Users,
  Globe,
  Code2,
  Terminal,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

function Landing() {
  const stats = [
    { value: "256-bit", label: "Encryption" },
    { value: "99.9%", label: "Uptime" },
    { value: "< 100ms", label: "Response Time" },
    { value: "24/7", label: "Security" },
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Military-Grade Security",
      description:
        "End-to-end encryption with JWT authentication and bcrypt hashing keeps your data impenetrable.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Performance",
      description:
        "Optimized React architecture delivers instant responses and seamless interactions across all devices.",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Complete Privacy",
      description:
        "Zero-knowledge architecture ensures only you can access your data. Not even we can see it.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Universal Access",
      description:
        "Access your vault from anywhere, on any device, with automatic synchronization.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Scalable Storage",
      description:
        "MongoDB-powered backend scales effortlessly as your data grows without compromising speed.",
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Developer-First API",
      description:
        "RESTful architecture with comprehensive documentation for seamless integration.",
    },
  ];

  const techStack = [
    "React 18",
    "Node.js",
    "Express",
    "MongoDB",
    "JWT",
    "Tailwind CSS",
  ];

  return (
    <div className="min-h-screen bg-mainBg dark:bg-dark-mainBg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 dark:from-dark-accent/10 dark:via-transparent dark:to-dark-accent/20 pointer-events-none"></div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 dark:bg-dark-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-soft/20 dark:bg-dark-accent-soft/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover bg-clip-text text-transparent">
              Blackbox
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/about"
              className="hidden sm:inline-block text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-text-primary dark:text-dark-text-primary hover:text-accent dark:hover:text-dark-accent transition-colors"
            >
              Sign In
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-40">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-soft/50 dark:bg-dark-accent-soft/50 rounded-full mb-8 backdrop-blur-sm border border-accent/20 dark:border-dark-accent/30">
              <Sparkles className="w-4 h-4 text-accent dark:text-dark-accent" />
              <span className="text-sm font-medium text-accent dark:text-dark-accent">
                Production-Ready Security Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary dark:text-dark-text-primary mb-6 leading-tight">
              Your Digital Vault.
              <br />
              <span className="bg-gradient-to-r from-accent via-accent-hover to-accent dark:from-dark-accent dark:via-dark-accent-hover dark:to-dark-accent bg-clip-text text-transparent">
                Unbreakable.
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary dark:text-dark-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade security meets intuitive design. Store, manage,
              and protect your sensitive data with military-level encryption and
              zero-knowledge architecture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-cardBg dark:bg-dark-cardBg text-text-primary dark:text-dark-text-primary rounded-xl font-semibold text-lg border-2 border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-accent dark:text-dark-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-soft/10 to-transparent dark:via-dark-accent-soft/20 rounded-3xl pointer-events-none"></div>

          <div className="relative text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Built for Security Professionals
            </h2>
            <p className="text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              Every feature engineered with security-first principles and modern
              development standards.
            </p>
          </div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>

                <div className="w-14 h-14 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center mb-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-gradient-to-br from-accent/10 via-accent-soft/20 to-accent/10 dark:from-dark-accent/20 dark:via-dark-accent-soft/30 dark:to-dark-accent/20 rounded-3xl p-8 sm:p-12 lg:p-16 border border-accent/20 dark:border-dark-accent/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 dark:bg-dark-accent/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-soft/30 dark:bg-dark-accent-soft/40 rounded-full blur-3xl"></div>

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-black/30 rounded-full mb-6 backdrop-blur-sm">
                  <Code2 className="w-4 h-4 text-accent dark:text-dark-accent" />
                  <span className="text-sm font-medium text-accent dark:text-dark-accent">
                    Modern Tech Stack
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
                  Built with Industry-Leading Technologies
                </h2>
                <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
                  Powered by a carefully curated stack of battle-tested
                  technologies. From React's component architecture to MongoDB's
                  flexible storage, every choice optimized for security,
                  performance, and developer experience.
                </p>

                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white dark:bg-dark-cardBg rounded-lg text-text-primary dark:text-dark-text-primary font-medium border border-border dark:border-dark-border shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-dark-cardBg rounded-2xl p-6 shadow-2xl border border-dark-border">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-danger"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="text-success">
                      $ npm install internet-blackbox
                    </div>
                    <div className="text-dark-text-secondary">
                      <span className="text-accent">✓</span> Installing
                      dependencies...
                    </div>
                    <div className="text-dark-text-secondary">
                      <span className="text-accent">✓</span> Setting up
                      authentication...
                    </div>
                    <div className="text-dark-text-secondary">
                      <span className="text-accent">✓</span> Configuring
                      security layers...
                    </div>
                    <div className="text-success font-semibold mt-4">
                      ✓ Ready to deploy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Security You Can Trust
            </h2>
            <p className="text-xl text-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              Compliance-ready architecture with industry-standard security
              protocols.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-success/10 to-success/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                OWASP Compliant
              </h3>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Following OWASP Top 10 security guidelines for web application
                protection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-accent/20 dark:from-dark-accent/20 dark:to-dark-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-accent dark:text-dark-accent" />
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                End-to-End Encryption
              </h3>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                256-bit AES encryption ensures your data remains private and
                secure.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-warning/10 to-warning/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-warning" />
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-3">
                Zero-Knowledge
              </h3>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                We can't access your data. Only you hold the encryption keys.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]"></div>

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Secure Your Data?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of users who trust Internet Blackbox for their
                digital security needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-accent hover:bg-gray-50 rounded-xl font-semibold text-lg shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  Learn More
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
                    to="/about"
                    className="text-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-dark-accent transition-colors"
                  >
                    About
                  </Link>
                </li>
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

export default Landing;
