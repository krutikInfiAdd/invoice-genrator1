
import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">About Us</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Our Mission</h2>
          <p>
            At Free Invoice Generator, our mission is simple: to empower freelancers, small business owners, and contractors 
            with professional billing tools at absolutely no cost. We believe that administrative tasks shouldn't eat into your profits or your time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>100% Free:</strong> No subscriptions, no "pro" plans, and no watermarks.</li>
            <li><strong>Privacy First:</strong> Unlike other platforms, we don't store your client data. Everything happens in your browser.</li>
            <li><strong>Instant PDF:</strong> Generate high-quality invoices in seconds.</li>
            <li><strong>No Account Needed:</strong> Start creating immediately without a signup process.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Our Story</h2>
          <p>
            We started this project because we were tired of complex accounting software that required monthly fees just to send a simple bill. 
            We wanted to build a tool that was lightweight, fast, and secure. Today, thousands of invoices are generated using our platform every month.
          </p>
        </section>
      </div>
    </div>
  );
};
