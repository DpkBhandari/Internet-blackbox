import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

function Terms() {
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
            <Scale className="w-4 h-4 text-accent dark:text-dark-accent" />
            <span className="text-sm font-medium text-accent dark:text-dark-accent">
              Legal Agreement
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary dark:text-dark-text-primary mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-text-secondary dark:text-dark-text-secondary">
            Last updated: February 13, 2024
          </p>
        </div>

        <div className="bg-warning/10 border border-warning/30 rounded-2xl p-6 mb-12">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-text-primary dark:text-dark-text-primary mb-2">
                Important Notice
              </h3>
              <p className="text-text-secondary dark:text-dark-text-secondary leading-relaxed">
                Please read these Terms of Service carefully before using
                Internet Blackbox. By accessing or using our service, you agree
                to be bound by these terms. If you disagree with any part of
                these terms, you may not access the service.
              </p>
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
              Acceptance of Terms
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding
                agreement between you ("User," "you," or "your") and Internet
                Blackbox ("we," "us," or "our") regarding your use of the
                Internet Blackbox platform, including all features, content, and
                services offered.
              </p>
              <p className="leading-relaxed">
                By creating an account, accessing, or using our service, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms and our Privacy Policy. If you are using
                the service on behalf of an organization, you represent that you
                have the authority to bind that organization to these Terms.
              </p>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  2
                </span>
              </div>
              Eligibility & Account Registration
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Eligibility
                </h3>
                <p className="leading-relaxed mb-3">
                  You must meet the following requirements to use our service:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Be at least 18 years of age or the age of majority in your
                      jurisdiction
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Have the legal capacity to enter into a binding contract
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Not be prohibited from using the service under applicable
                      laws
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Account Responsibilities
                </h3>
                <p className="leading-relaxed mb-3">
                  When you create an account, you agree to:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>
                      Provide accurate, current, and complete information
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>
                      Maintain and promptly update your account information
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>
                      Maintain the security and confidentiality of your password
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>
                      Immediately notify us of any unauthorized use of your
                      account
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>
                      Be responsible for all activities that occur under your
                      account
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  3
                </span>
              </div>
              Acceptable Use Policy
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                You agree not to engage in any of the following prohibited
                activities:
              </p>

              <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                <h4 className="font-semibold text-danger mb-3">
                  Prohibited Activities:
                </h4>
                <ul className="list-none space-y-2 ml-2">
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-danger mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Violating any applicable laws, regulations, or third-party
                      rights
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-danger mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Accessing or attempting to access accounts or data not
                      intended for you
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-danger mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Using the service to transmit malware, viruses, or harmful
                      code
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-danger mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Attempting to bypass security measures or authentication
                      mechanisms
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-danger mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Engaging in data mining, scraping, or automated data
                      collection
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-danger mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Reverse engineering, decompiling, or disassembling the
                      service
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-danger mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Using the service to harass, abuse, or harm others
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-danger mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Impersonating any person or entity or misrepresenting your
                      affiliation
                    </span>
                  </li>
                </ul>
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
              Intellectual Property Rights
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Our Intellectual Property
                </h3>
                <p className="leading-relaxed">
                  The service, including all content, features, functionality,
                  source code, design elements, trademarks, and logos, is owned
                  by Internet Blackbox and is protected by international
                  copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Your Content
                </h3>
                <p className="leading-relaxed mb-2">
                  You retain all rights to the content and data you upload,
                  store, or transmit through the service. By using our service,
                  you grant us a limited license to:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>
                      Store and process your content to provide the service
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>Create backups for data protection and recovery</span>
                  </li>
                </ul>
                <p className="leading-relaxed mt-3 font-semibold text-text-primary dark:text-dark-text-primary">
                  Note: Due to our zero-knowledge architecture, we cannot
                  access, read, or modify your encrypted content.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  5
                </span>
              </div>
              Service Availability & Modifications
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Service Availability
                </h3>
                <p className="leading-relaxed">
                  We strive to provide reliable and continuous service, but we
                  do not guarantee that the service will be uninterrupted,
                  timely, secure, or error-free. Scheduled maintenance and
                  updates may temporarily affect service availability.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Modifications to Service
                </h3>
                <p className="leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any
                  part of the service at any time, with or without notice. We
                  will not be liable to you or any third party for any
                  modification, suspension, or discontinuance of the service.
                </p>
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
              Privacy & Data Protection
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                Your privacy is critically important to us. Our collection, use,
                and protection of your personal information is governed by our
                Privacy Policy, which is incorporated into these Terms by
                reference.
              </p>
              <div className="bg-mainBg dark:bg-dark-mainBg rounded-lg p-4 border border-border dark:border-dark-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-accent dark:text-dark-accent" />
                  <h4 className="font-semibold text-text-primary dark:text-dark-text-primary">
                    Key Privacy Commitments:
                  </h4>
                </div>
                <ul className="list-none space-y-2 ml-7">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>256-bit AES encryption for all stored data</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Zero-knowledge architecture - we cannot access your data
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>No third-party tracking or analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                    <span>GDPR and data protection compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  7
                </span>
              </div>
              Disclaimer of Warranties
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed uppercase font-semibold text-text-primary dark:text-dark-text-primary">
                The service is provided "as is" and "as available" without
                warranties of any kind, either express or implied.
              </p>
              <p className="leading-relaxed">
                We disclaim all warranties, including but not limited to implied
                warranties of merchantability, fitness for a particular purpose,
                and non-infringement. We do not warrant that:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>The service will meet your specific requirements</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    The service will be uninterrupted, timely, secure, or
                    error-free
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    Results obtained from the service will be accurate or
                    reliable
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>All errors or defects will be corrected</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  8
                </span>
              </div>
              Limitation of Liability
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed uppercase font-semibold text-text-primary dark:text-dark-text-primary">
                To the maximum extent permitted by applicable law, Internet
                Blackbox shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages.
              </p>
              <p className="leading-relaxed">
                This includes, but is not limited to, damages for:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Loss of profits, data, use, or goodwill</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Service interruption or system failure</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>Cost of substitute services</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-accent dark:bg-dark-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span>
                    Unauthorized access to or alteration of your transmissions
                    or data
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  9
                </span>
              </div>
              Termination
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Your Right to Terminate
                </h3>
                <p className="leading-relaxed">
                  You may terminate your account at any time by contacting us or
                  using the account deletion feature in your settings. Upon
                  termination, your data will be permanently deleted within 30
                  days.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                  Our Right to Terminate
                </h3>
                <p className="leading-relaxed mb-2">
                  We may suspend or terminate your account and access to the
                  service immediately, without prior notice, if you:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-warning mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Violate these Terms or our Acceptable Use Policy
                    </span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-warning mr-2 mt-1 flex-shrink-0" />
                    <span>Engage in fraudulent or illegal activities</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-warning mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Pose a security risk to the service or other users
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  10
                </span>
              </div>
              Governing Law & Dispute Resolution
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with applicable laws, without regard to conflict of law
                principles. Any disputes arising from these Terms or your use of
                the service shall be resolved through binding arbitration or in
                the courts of competent jurisdiction.
              </p>
            </div>
          </section>

          <section className="bg-cardBg dark:bg-dark-cardBg rounded-2xl p-8 border border-border dark:border-dark-border">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent-soft/30 dark:bg-dark-accent-soft/30 rounded-lg flex items-center justify-center mr-3">
                <span className="text-accent dark:text-dark-accent font-bold">
                  11
                </span>
              </div>
              Changes to Terms
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                We reserve the right to modify these Terms at any time. We will
                notify you of material changes by:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>
                    Posting the updated Terms with a new "Last Updated" date
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>
                    Sending an email notification to your registered address
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Displaying a prominent notice on the service</span>
                </li>
              </ul>
              <p className="leading-relaxed mt-3">
                Your continued use of the service after changes become effective
                constitutes acceptance of the modified Terms.
              </p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-accent/10 to-accent-soft/20 dark:from-dark-accent/20 dark:to-dark-accent-soft/30 rounded-2xl p-8 border border-accent/20 dark:border-dark-accent/30">
            <h2 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
              <div className="w-8 h-8 bg-accent dark:bg-dark-accent rounded-lg flex items-center justify-center mr-3 text-white">
                <FileText className="w-5 h-5" />
              </div>
              Contact Information
            </h2>
            <div className="ml-11 space-y-4 text-text-secondary dark:text-dark-text-secondary">
              <p className="leading-relaxed">
                If you have questions, concerns, or requests regarding these
                Terms of Service, please contact us:
              </p>
              <div className="bg-cardBg dark:bg-dark-cardBg rounded-lg p-6 border border-border dark:border-dark-border">
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-text-primary dark:text-dark-text-primary mb-1">
                      Email:
                    </div>
                    <a
                      href="mailto:legal@internetblackbox.com"
                      className="text-accent dark:text-dark-accent hover:underline"
                    >
                      legal@internetblackbox.com
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

        <div className="mt-12 bg-mainBg dark:bg-dark-mainBg rounded-xl p-6 border border-border dark:border-dark-border text-center">
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            By using Internet Blackbox, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service.
          </p>
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

export default Terms;
