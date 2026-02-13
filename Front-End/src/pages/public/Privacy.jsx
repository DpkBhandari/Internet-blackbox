import {
  Shield,
  Eye,
  Lock,
  Database,
  Globe2,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function Privacy() {
  const privacyPrinciples = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Zero-Knowledge Architecture",
      description:
        "We cannot access, read, or decrypt your data. Only you hold the encryption keys.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description:
        "All data is encrypted on your device before transmission to our servers.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Minimal Data Collection",
      description:
        "We collect only essential information required for account functionality.",
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "No Third-Party Tracking",
      description:
        "Zero analytics, no tracking scripts, and no data sharing with third parties.",
    },
  ];

  return (
    <div className="min-h-screen bg-mainBg dark:bg-dark-mainBg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent dark:from-dark-accent/10 pointer-events-none"></div>

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
          <Link
            to="/"
            className="text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-soft/50 dark:bg-dark-accent-soft/50 rounded-full mb-6">
            <FileText className="w-4 h-4 text-accent dark:text-dark-accent" />
            <span className="text-sm font-medium text-accent dark:text-dark-accent">
              Legal Document
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-text-secondary dark:text-dark-text-secondary">
            Last updated: February 13, 2024
          </p>
        </div>

        <div className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 sm:p-12 border border-border dark:border-dark-border shadow-lg mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-6">
              Our Commitment to Privacy
            </h2>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-6 leading-relaxed">
              At Internet Blackbox, your privacy is our top priority. This
              Privacy Policy explains how we collect, use, protect, and handle
              your information when you use our secure digital information
              management platform. We are committed to transparency and giving
              you control over your personal data.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              {privacyPrinciples.map((principle, index) => (
                <div
                  key={index}
                  className="flex space-x-4 p-4 bg-mainBg dark:bg-dark-mainBg rounded-xl border border-border dark:border-dark-border"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center text-accent dark:text-dark-accent">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary dark:text-dark-text-primary mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  1
                </span>
              </div>
              Information We Collect
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Account Information
                </h3>
                <p className="leading-relaxed mb-2">
                  When you create an account, we collect:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>Full name</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>Email address</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Password (encrypted with bcrypt, never stored in plain
                      text)
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Automatically Collected Information
                </h3>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>IP address (for security purposes only)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>Login timestamps</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Device information (browser type, operating system)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-accent-soft/10 dark:bg-dark-accent-soft/10 border border-accent/20 dark:border-dark-accent/30 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-accent dark:text-dark-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Important:
                    </strong>{" "}
                    We do NOT collect browsing history, use tracking cookies, or
                    employ third-party analytics services.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  2
                </span>
              </div>
              How We Use Your Information
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                We use collected information solely for the following purposes:
              </p>
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Account Management:
                    </strong>{" "}
                    To create, maintain, and secure your account
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Authentication:
                    </strong>{" "}
                    To verify your identity and prevent unauthorized access
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Security:
                    </strong>{" "}
                    To detect, prevent, and respond to security threats and
                    fraudulent activity
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Communication:
                    </strong>{" "}
                    To send essential service-related notifications (password
                    resets, security alerts)
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-success/10 rounded flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Legal Compliance:
                    </strong>{" "}
                    To comply with applicable laws and regulations
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  3
                </span>
              </div>
              Data Security & Encryption
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                We implement industry-leading security measures to protect your
                data:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-mainBg dark:bg-dark-mainBg rounded-lg border border-border dark:border-dark-border">
                  <div className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                    Encryption at Rest
                  </div>
                  <p className="text-sm">
                    256-bit AES encryption for all stored data
                  </p>
                </div>
                <div className="p-4 bg-mainBg dark:bg-dark-mainBg rounded-lg border border-border dark:border-dark-border">
                  <div className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                    Encryption in Transit
                  </div>
                  <p className="text-sm">
                    TLS/SSL encryption for all data transmission
                  </p>
                </div>
                <div className="p-4 bg-mainBg dark:bg-dark-mainBg rounded-lg border border-border dark:border-dark-border">
                  <div className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                    Password Security
                  </div>
                  <p className="text-sm">bcrypt hashing with 12 salt rounds</p>
                </div>
                <div className="p-4 bg-mainBg dark:bg-dark-mainBg rounded-lg border border-border dark:border-dark-border">
                  <div className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                    Access Control
                  </div>
                  <p className="text-sm">Multi-factor authentication ready</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  4
                </span>
              </div>
              Data Sharing & Third Parties
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed font-semibold text-text-primary dark:text-dark-text-primary">
                We do NOT sell, rent, or share your personal information with
                third parties for marketing purposes.
              </p>
              <p className="leading-relaxed">
                Your data may only be shared in the following limited
                circumstances:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Legal Requirements:</strong> When required by law,
                    court order, or government regulation
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Service Providers:</strong> With trusted third-party
                    service providers who assist in operating our platform
                    (e.g., hosting services), under strict confidentiality
                    agreements
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Protection of Rights:</strong> To protect our
                    rights, privacy, safety, or property, and that of our users
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  5
                </span>
              </div>
              Your Rights & Choices
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                You have the following rights regarding your personal data:
              </p>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Access:
                    </strong>{" "}
                    Request a copy of your personal data
                  </div>
                </div>
                <div className="flex items-start p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Correction:
                    </strong>{" "}
                    Update or correct inaccurate information
                  </div>
                </div>
                <div className="flex items-start p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Deletion:
                    </strong>{" "}
                    Request deletion of your account and associated data
                  </div>
                </div>
                <div className="flex items-start p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Portability:
                    </strong>{" "}
                    Export your data in a machine-readable format
                  </div>
                </div>
                <div className="flex items-start p-3 bg-mainBg dark:bg-dark-mainBg rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-text-primary dark:text-dark-text-primary">
                      Objection:
                    </strong>{" "}
                    Object to processing of your personal data
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  6
                </span>
              </div>
              Data Retention
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                We retain your personal information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required by law.
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Active Accounts:</strong> Data retained while your
                    account is active
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Deleted Accounts:</strong> Data permanently deleted
                    within 30 days of account deletion request
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Security Logs:</strong> Retained for 90 days for
                    security and fraud prevention purposes
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  7
                </span>
              </div>
              Cookies & Tracking
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                We use minimal cookies strictly necessary for authentication and
                security:
              </p>
              <div className="bg-mainBg dark:bg-dark-mainBg rounded-lg p-4 border border-border dark:border-dark-border">
                <strong className="text-text-primary dark:text-dark-text-primary">
                  Essential Cookies Only:
                </strong>
                <ul className="list-none space-y-2 mt-3 ml-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>Authentication tokens (HTTP-only, secure)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>Session management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>Security preferences</span>
                  </li>
                </ul>
              </div>
              <p className="leading-relaxed font-semibold text-text-primary dark:text-dark-text-primary">
                We do NOT use advertising cookies, tracking pixels, or
                third-party analytics services.
              </p>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  8
                </span>
              </div>
              Children's Privacy
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                Our service is not directed to individuals under the age of 18.
                We do not knowingly collect personal information from children.
                If we become aware that a child has provided us with personal
                information, we will take steps to delete such information.
              </p>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  9
                </span>
              </div>
              Changes to This Policy
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or for legal, regulatory, or
                operational reasons. We will notify you of any material changes
                by:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    Posting the updated policy on this page with a new "Last
                    Updated" date
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    Sending an email notification to your registered email
                    address
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-2xl p-8 border border-accent/20 dark:border-dark-accent/30">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent dark:bg-dark-accent rounded-lg flex items-center justify-center mr-3 text-white">
                <FileText className="w-5 h-5" />
              </div>
              Contact Us
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-cardBg dark:bg-dark-cardBg rounded-lg p-6 border border-border dark:border-dark-border">
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                      Email:
                    </div>
                    <a
                      href="mailto:privacy@internetblackbox.com"
                      className="text-accent dark:text-dark-accent hover:underline"
                    >
                      privacy@internetblackbox.com
                    </a>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                      Project Team:
                    </div>
                    <p className="text-sm">
                      Deepak Channabasappa Bhandari & Vijay Netaji Waghmode
                    </p>
                    <p className="text-sm">
                      TYBCa Division A, Academic Year 2024-2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-accent dark:bg-dark-accent hover:bg-accent-hover dark:hover:bg-dark-accent-hover text-white rounded-lg font-medium transition-all duration-200"
          >
            <span>Return to Home</span>
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border dark:border-dark-border mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-text-secondary dark:text-dark-text-secondary">
            © 2024 Internet Blackbox. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Privacy;
