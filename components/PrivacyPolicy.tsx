
import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introduction</h2>
          <p>
            Welcome to Free Invoice Generator. We respect your privacy and are committed to protecting the personal information you share with us. 
            This Privacy Policy explains how we handle your data when you use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Data Collection and Storage</h2>
          <p className="mb-2">
            <strong>We do not store your invoice data on our servers.</strong>
          </p>
          <p>
            Our service operates as a client-side application. This means that all the information you enter (names, addresses, prices, items) 
            is processed entirely within your web browser. When you generate a PDF, it is created locally on your device. 
            No invoice data is transmitted to our backend database.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Local Storage</h2>
          <p>
            We use your browser's "Local Storage" to improve your experience. For example, if you upload a company logo, 
            it may be saved in your browser so it appears the next time you visit. You can clear this data at any time by clearing your browser cache.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Third-Party Services</h2>
          <p>
            We may use third-party analytics tools (like Google Analytics) to understand how visitors use our site. 
            These tools collect anonymous usage data, such as page views and browser types, but do not access the content of your invoices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We encourage you to review this page periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@freeinvoicegenrator.com.
          </p>
        </section>
      </div>
    </div>
  );
};
