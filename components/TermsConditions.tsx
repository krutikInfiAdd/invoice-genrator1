
import React from 'react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms and Conditions</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Agreement to Terms</h2>
          <p>
            By accessing and using the Free Invoice Generator website ("Service"), you agree to be bound by these Terms and Conditions. 
            If you do not agree with any part of these terms, you are prohibited from using this Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Use License</h2>
          <p>
            Permission is granted to temporarily download copies of the materials (information or software) on Free Invoice Generator's website for personal, 
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
          <p className="mt-2">
            Under this license, you may not:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Modify or copy the materials for commercial redistribution (generating your own invoices for business use is permitted).</li>
            <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
            <li>Remove any copyright or other proprietary notations from the materials.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Disclaimer</h2>
          <p>
            The materials on Free Invoice Generator's website are provided on an 'as is' basis. We make no warranties, expressed or implied, 
            and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, 
            fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="mt-2">
            Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the 
            materials on our website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Limitations</h2>
          <p>
            In no event shall Free Invoice Generator or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
            or due to business interruption) arising out of the use or inability to use the materials on the website, even if we have been notified orally 
            or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Data & Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding 
            the collection and use of your personal information. We prioritize client-side processing to ensure your data remains secure on your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Modifications</h2>
          <p>
            Free Invoice Generator may revise these terms of service for its website at any time without notice. By using this website you are agreeing 
            to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive 
            jurisdiction of the courts in that State or location.
          </p>
        </section>
      </div>
    </div>
  );
};
