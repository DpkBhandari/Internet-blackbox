import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Database,
  Globe2,
  Terminal,
  Zap,
  FileText,
  Users,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function Security() {
  const securityLayers = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Authentication Security",
      description:
        "Multi-layered authentication with industry-standard protocols",
      features: [
        {
          name: "JWT Tokens",
          desc: "Stateless authentication with 24-hour expiration",
        },
        { name: "bcrypt Hashing", desc: "12-round password encryption" },
        {
          name: "Session Management",
          desc: "Automatic timeout and refresh mechanisms",
        },
        { name: "Rate Limiting", desc: "Brute force attack prevention" },
      ],
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Security",
      description: "End-to-end encryption for all stored information",
      features: [
        {
          name: "256-bit AES Encryption",
          desc: "Military-grade data encryption",
        },
        {
          name: "Encrypted Connections",
          desc: "TLS/SSL for all transmissions",
        },
        { name: "Secure Backups", desc: "Automated encrypted backups" },
        { name: "Data Isolation", desc: "User data separation" },
      ],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Application Security",
      description: "Protection against common web vulnerabilities",
      features: [
        { name: "XSS Prevention", desc: "Content Security Policy enforcement" },
        { name: "CSRF Protection", desc: "Token-based request validation" },
        { name: "Input Validation", desc: "Server-side sanitization" },
        { name: "SQL Injection", desc: "Parameterized queries" },
      ],
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Privacy Protection",
      description: "Zero-knowledge architecture for complete privacy",
      features: [
        { name: "Zero-Knowledge", desc: "We can't access your data" },
        { name: "No Tracking", desc: "Zero analytics or tracking scripts" },
        { name: "GDPR Compliant", desc: "Full privacy regulation compliance" },
        { name: "Data Ownership", desc: "You own and control your data" },
      ],
    },
  ];

  const complianceStandards = [
    {
      name: "OWASP Top 10",
      status: "Compliant",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      name: "GDPR",
      status: "Compliant",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      name: "ISO 27001",
      status: "Ready",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      name: "SOC 2",
      status: "In Progress",
      icon: <Activity className="w-5 h-5" />,
    },
  ];

  const threatProtection = [
    {
      threat: "Brute Force Attacks",
      protection: "Rate limiting with exponential backoff",
      status: "Protected",
    },
    {
      threat: "DDoS Attacks",
      protection: "Request throttling and IP filtering",
      status: "Protected",
    },
    {
      threat: "Session Hijacking",
      protection: "Secure cookies and token rotation",
      status: "Protected",
    },
    {
      threat: "Man-in-the-Middle",
      protection: "HTTPS/TLS encryption enforced",
      status: "Protected",
    },
    {
      threat: "SQL Injection",
      protection: "Parameterized queries with Mongoose ODM",
      status: "Protected",
    },
    {
      threat: "XSS Attacks",
      protection: "Content Security Policy and sanitization",
      status: "Protected",
    },
  ];

  const auditLog = [
    {
      timestamp: "2024-02-13 14:32:15",
      event: "Login Success",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      timestamp: "2024-02-13 14:28:42",
      event: "Password Changed",
      ip: "192.168.1.100",
      status: "success",
    },
    {
      timestamp: "2024-02-13 14:15:03",
      event: "Failed Login Attempt",
      ip: "203.0.113.45",
      status: "warning",
    },
    {
      timestamp: "2024-02-13 13:58:21",
      event: "New Device Login",
      ip: "192.168.1.100",
      status: "info",
    },
  ];

  return (
    <div className="min-h-screen bg-mainBg dark:bg-dark-mainBg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent dark:from-dark-accent/20 pointer-events-none"></div>

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
              to="/features"
              className="hidden sm:inline-block text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="hidden sm:inline-block text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              About
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
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full mb-8">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">
                Bank-Grade Security
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-text-primary dark:text-dark-text-primary">
                Security That
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent via-accent-hover to-accent dark:from-dark-accent dark:via-dark-accent-hover dark:to-dark-accent bg-clip-text text-transparent">
                Never Sleeps
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary dark:text-dark-text-secondary leading-relaxed mb-8">
              Multi-layered defense architecture protecting your data 24/7 with
              military-grade encryption and zero-knowledge privacy.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 px-4 py-2 bg-cardBg dark:bg-dark-cardBg rounded-lg border border-border dark:border-dark-border">
                <Lock className="w-4 h-4 text-success" />
                <span className="text-text-primary dark:text-dark-text-primary font-medium">
                  256-bit Encryption
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-cardBg dark:bg-dark-cardBg rounded-lg border border-border dark:border-dark-border">
                <Shield className="w-4 h-4 text-accent dark:text-dark-accent" />
                <span className="text-text-primary dark:text-dark-text-primary font-medium">
                  OWASP Compliant
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-cardBg dark:bg-dark-cardBg rounded-lg border border-border dark:border-dark-border">
                <Eye className="w-4 h-4 text-warning" />
                <span className="text-text-primary dark:text-dark-text-primary font-medium">
                  Zero-Knowledge
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
              Defense in Depth
            </h2>
            <p className="text-xl text-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
              Multiple independent security layers ensure your data remains
              protected even if one layer is compromised.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityLayers.map((layer, index) => (
              <div
                key={index}
                className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border hover:border-accent dark:hover:border-dark-accent transition-all duration-300 hover:shadow-2xl"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-xl flex items-center justify-center text-accent dark:text-dark-accent">
                    {layer.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                      {layer.title}
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      {layer.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {layer.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-text-primary dark:text-dark-text-primary">
                          {feature.name}
                        </div>
                        <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                          {feature.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-cardBg to-accent-soft/10 dark:from-dark-cardBg dark:to-dark-accent-soft/20 rounded-3xl p-8 sm:p-12 border border-border dark:border-dark-border shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
                Threat Protection Matrix
              </h2>
              <p className="text-xl text-text-secondary dark:text-dark-text-secondary">
                Comprehensive defense against all major attack vectors
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border dark:border-dark-border">
                    <th className="text-left py-4 px-4 text-text-primary dark:text-dark-text-primary font-bold">
                      Threat Type
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary dark:text-dark-text-primary font-bold">
                      Protection Method
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary dark:text-dark-text-primary font-bold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {threatProtection.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-border dark:border-dark-border hover:bg-mainBg dark:hover:bg-dark-mainBg transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="font-medium text-text-primary dark:text-dark-text-primary">
                            {item.threat}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-text-secondary dark:text-dark-text-secondary">
                        {item.protection}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{item.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
                Compliance & Certifications
              </h2>
              <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-8">
                We adhere to international security standards and continuously
                work towards achieving industry certifications.
              </p>

              <div className="space-y-4">
                {complianceStandards.map((standard, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-cardBg dark:bg-dark-cardBg rounded-xl border border-border dark:border-dark-border"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          standard.status === "Compliant"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {standard.icon}
                      </div>
                      <span className="font-semibold text-text-primary dark:text-dark-text-primary">
                        {standard.name}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        standard.status === "Compliant"
                          ? "bg-success/10 text-success"
                          : standard.status === "Ready"
                            ? "bg-accent/10 text-accent dark:bg-dark-accent/10 dark:text-dark-accent"
                            : "bg-warning/10 text-warning"
                      }`}
                    >
                      {standard.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-cardBg rounded-2xl p-6 border border-dark-border shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-danger rounded-full"></div>
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                </div>
                <span className="text-xs text-dark-text-secondary font-mono">
                  security-audit.log
                </span>
              </div>

              <div className="space-y-3">
                {auditLog.map((log, index) => (
                  <div
                    key={index}
                    className="p-3 bg-dark-mainBg rounded-lg border border-dark-border font-mono text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-dark-text-secondary text-xs">
                        {log.timestamp}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          log.status === "success"
                            ? "bg-success/20 text-success"
                            : log.status === "warning"
                              ? "bg-warning/20 text-warning"
                              : "bg-accent/20 text-accent"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <div className="text-dark-text-primary">{log.event}</div>
                    <div className="text-dark-text-secondary text-xs mt-1">
                      IP: {log.ip}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold text-sm">
                    All systems operational
                  </span>
                </div>
                <Activity className="w-5 h-5 text-success animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-cardBg dark:bg-dark-cardBg rounded-3xl p-8 sm:p-12 border border-border dark:border-dark-border">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-full mb-6">
                  <Code2 className="w-4 h-4 text-accent dark:text-dark-accent" />
                  <span className="text-sm font-medium text-accent dark:text-dark-accent">
                    Secure by Design
                  </span>
                </div>

                <h2 className="text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
                  Security Isn't an Afterthought
                </h2>
                <p className="text-lg text-text-secondary dark:text-dark-text-secondary mb-6">
                  Every line of code is written with security as the primary
                  concern. From input validation to encrypted storage, security
                  is baked into our architecture.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-secondary dark:text-dark-text-secondary">
                      Security code reviews before deployment
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-secondary dark:text-dark-text-secondary">
                      Automated vulnerability scanning
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-secondary dark:text-dark-text-secondary">
                      Regular penetration testing
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-secondary dark:text-dark-text-secondary">
                      Continuous security monitoring
                    </span>
                  </li>
                </ul>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-soft/20 dark:from-dark-accent/30 dark:to-dark-accent-soft/40 rounded-2xl blur-2xl"></div>
                <div className="relative bg-mainBg dark:bg-dark-mainBg rounded-2xl p-6 border border-border dark:border-dark-border">
                  <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-border dark:border-dark-border">
                    <Terminal className="w-5 h-5 text-accent dark:text-dark-accent" />
                    <span className="font-semibold text-text-primary dark:text-dark-text-primary">
                      Security Scan Results
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-cardBg dark:bg-dark-cardBg rounded-lg">
                      <span className="text-text-secondary dark:text-dark-text-secondary">
                        Vulnerabilities Found
                      </span>
                      <span className="font-bold text-success">0 Critical</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cardBg dark:bg-dark-cardBg rounded-lg">
                      <span className="text-text-secondary dark:text-dark-text-secondary">
                        Security Score
                      </span>
                      <span className="font-bold text-success">A+</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cardBg dark:bg-dark-cardBg rounded-lg">
                      <span className="text-text-secondary dark:text-dark-text-secondary">
                        Last Audit
                      </span>
                      <span className="font-bold text-text-primary dark:text-dark-text-primary">
                        24 hours ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-cardBg dark:bg-dark-cardBg rounded-lg">
                      <span className="text-text-secondary dark:text-dark-text-secondary">
                        Encryption Status
                      </span>
                      <span className="font-bold text-success">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-br from-accent to-accent-hover dark:from-dark-accent dark:to-dark-accent-hover rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Experience Uncompromising Security
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join the platform where security and usability coexist in
                perfect harmony.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-accent hover:bg-gray-50 rounded-xl font-semibold text-lg shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Start Protected Today</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/features"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  View All Features
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

export default Security;
