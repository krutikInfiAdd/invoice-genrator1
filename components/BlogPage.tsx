
import React, { useState } from 'react';
import { Button } from './ui/Button';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  date: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'how-to-make-gst-invoice',
    title: 'How to Make a GST Invoice: Step-by-Step Guide',
    date: 'March 15, 2024',
    category: 'Tax & GST',
    excerpt: 'Learn the essential components of a GST invoice, the difference between CGST, SGST, and IGST, and how to ensure your invoices are compliant.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          The Goods and Services Tax (GST) has revolutionized the way taxes are collected in India. For business owners, understanding how to structure a GST-compliant invoice is crucial to avoid penalties and ensure smooth tax filing.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Key Components of a GST Invoice</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Invoice Number & Date:</strong> A unique serial number for identification.</li>
          <li><strong>Customer Name & Address:</strong> Details of the person you are billing.</li>
          <li><strong>GSTIN:</strong> The GST Identification Number of both the supplier and the recipient (if registered).</li>
          <li><strong>HSN/SAC Code:</strong> Harmonized System of Nomenclature code for goods or Services Accounting Code for services.</li>
          <li><strong>Tax Breakup:</strong> Clear separation of CGST, SGST, and IGST based on the location of the supply.</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">CGST vs. SGST vs. IGST</h3>
        <p>
          If you are selling within the same state, you charge <strong>CGST (Central GST)</strong> and <strong>SGST (State GST)</strong>. The rate is split equally. However, if you are selling to a different state, you charge <strong>IGST (Integrated GST)</strong> which is the sum of the Central and State rates.
        </p>
        <p>
          Ensuring these details are correct on every invoice will save you significant time during your monthly GSTR filings.
        </p>
      </div>
    ),
  },
  {
    id: 'invoice-format-freelancers',
    title: 'Invoice Format for Freelancers: Getting Paid Faster',
    date: 'March 12, 2024',
    category: 'Freelancing',
    excerpt: 'Freelancing offers freedom, but getting paid requires discipline. Discover best practices for creating professional invoices that get paid on time.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          As a freelancer, you are not just the talent; you are also the finance department. Sending a professional invoice is the first step to ensuring you get paid for your hard work.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">What to Include?</h3>
        <p>
          Always include your contact info, the client's info, a breakdown of services, the total amount due, and your payment methods (Bank details, UPI, PayPal).
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Set Clear Payment Terms</h3>
        <p>
          Don't leave the due date ambiguous. State "Due on Receipt" or "Net 15" (due in 15 days) clearly. This sets expectations and gives you a timeline to follow up if payment is late.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Follow Up</h3>
        <p>
          It’s not rude to ask for your money. If a payment is late, send a polite reminder. Professional tools like this invoice generator help you create clean, error-free documents that look credible to clients.
        </p>
      </div>
    ),
  },
  {
    id: 'estimate-vs-invoice',
    title: 'Estimate vs. Invoice: What is the Difference?',
    date: 'March 10, 2024',
    category: 'Finance',
    excerpt: 'Confused about when to send an estimate, a quotation, or an invoice? We break down the key differences and when to use each.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Estimate / Quotation</h3>
        <p>
          Sent <em>before</em> work begins. It details the expected cost of goods or services. It is not a demand for payment but a proposal for approval. Use this to negotiate price and scope with your client.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Proforma Invoice</h3>
        <p>
          A preliminary bill of sale sent to buyers in advance of a shipment or delivery of goods. It describes the items and price but is not a demand for payment and cannot be used for tax reclamation.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Tax Invoice</h3>
        <p>
          Sent <em>after</em> work is done or goods are shipped. It is a formal request for payment and is a legal document for tax purposes. This is what you record in your accounting software.
        </p>
      </div>
    ),
  },
  {
    id: 'how-to-calculate-gst',
    title: 'How to Calculate GST on Your Products',
    date: 'March 08, 2024',
    category: 'Tax & GST',
    excerpt: 'Math can be tricky. Learn the simple formulas to add GST to your prices or remove it from inclusive prices.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Calculating GST is straightforward once you know the rate (e.g., 5%, 12%, 18%, 28%).
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Adding GST (Exclusive)</h3>
        <p>
          If your product costs ₹1,000 and GST is 18%:
          <br />
          <code>GST Amount = 1000 * 0.18 = ₹180</code>
          <br />
          <code>Total Invoice Value = 1000 + 180 = ₹1,180</code>
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Removing GST (Inclusive)</h3>
        <p>
          If you sell a product for ₹1,180 which <em>includes</em> 18% GST, and you want to find the base price:
          <br />
          <code>Base Price = 1180 / (1 + 0.18) = 1180 / 1.18 = ₹1,000</code>
        </p>
        <p>
          Using an automated invoice generator handles these calculations for you instantly, preventing manual errors.
        </p>
      </div>
    ),
  },
  {
    id: 'best-invoice-generators',
    title: 'Best Free Invoice Generators for Small Business',
    date: 'March 20, 2024',
    category: 'Tools',
    excerpt: 'Looking for the best tool to create invoices? We compare the top options and explain why a client-side, secure generator is your best bet.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Finding the right invoicing tool can save you hours of administrative work. While there are many paid options like QuickBooks or FreshBooks, freelancers and small businesses often need a simple, free solution.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Top Features to Look For</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No Sign-up Required:</strong> You should be able to start immediately.</li>
          <li><strong>Privacy:</strong> Does the tool store your client data? Client-side tools (like this one) are safer.</li>
          <li><strong>PDF Customization:</strong> Can you add a logo? Change currency?</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Why Our Free Invoice Generator Wins</h3>
        <p>
          Our tool stands out because it is <strong>100% free</strong>, <strong>secure</strong> (data never leaves your browser), and <strong>fast</strong>. Unlike competitors that watermark your PDFs or restrict the number of invoices, we offer unlimited generation for free.
        </p>
      </div>
    ),
  },
  {
    id: 'small-business-billing-guide',
    title: 'The Ultimate Small Business Billing Guide',
    date: 'March 01, 2024',
    category: 'Finance',
    excerpt: 'Navigating business finances can be daunting. Here are some fundamental tips to keep your small business compliant and maximize your deductions.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Disclaimer: Always consult a certified accountant. However, these general tips can help you stay organized.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Separate Personal and Business Finances</h3>
        <p>
          Open a separate bank account for your business. This makes tracking expenses and income infinitely easier when tax season arrives.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Track Deductible Expenses</h3>
        <p>
          Office supplies, software subscriptions, internet bills, and even a portion of your home rent (if working from home) can often be deducted. Keep receipts for everything.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Save for Taxes Year-Round</h3>
        <p>
          Don't spend all your revenue. Set aside a percentage (e.g., 20-30%) of every invoice payment into a savings account specifically for tax payments.
        </p>
      </div>
    ),
  },
  {
    id: 'hsn-code-importance',
    title: 'What is an HSN Code and Why Do You Need It?',
    date: 'February 15, 2024',
    category: 'Tax & GST',
    excerpt: 'HSN codes are mandatory for many GST invoices. Learn what they are and how to find the right code for your products.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          HSN stands for <strong>Harmonized System of Nomenclature</strong>. It is an internationally accepted coding system for classifying goods. In India, GST rates are determined based on these codes.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Who needs to use it?</h3>
        <p>
          If your business turnover is above ₹1.5 Crores, you must mention HSN codes on your invoices. Even for smaller turnovers, it is good practice as it clarifies exactly what is being sold to the tax authorities.
        </p>
        <p>
          <strong>SAC Codes:</strong> For services, the equivalent is the Service Accounting Code (SAC).
        </p>
        <p>
          Using the correct code ensures you are applying the correct GST rate (e.g., 5%, 12%, 18%, or 28%) to your products.
        </p>
      </div>
    ),
  },
  {
    id: 'common-invoicing-mistakes',
    title: '5 Common Invoicing Mistakes to Avoid',
    date: 'March 05, 2024',
    category: 'Tips',
    excerpt: 'Avoid these common pitfalls that delay payments and create accounting headaches. From missing dates to incorrect calculations.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Invoicing seems simple, but small errors can lead to rejected bills and delayed cash flow. Here are five mistakes to watch out for:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Missing Purchase Order (PO) Number:</strong> Large corporate clients often refuse to pay invoices without a PO number.</li>
          <li><strong>Vague Descriptions:</strong> "Consulting Services" is too broad. Use "Website Redesign - Phase 1" instead.</li>
          <li><strong>Incorrect Math:</strong> Double-check your totals, tax calculations, and discounts. An automated generator prevents this.</li>
          <li><strong>Sending to the Wrong Person:</strong> The person who hired you might not be the person paying the bills. Ask for the accounts department contact.</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'digital-vs-paper',
    title: 'Why Digital Invoices are Better than Paper',
    date: 'February 28, 2024',
    category: 'Finance',
    excerpt: 'Switching to digital invoicing is eco-friendly, faster, and more secure. Learn why paper trails are becoming a thing of the past.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          The days of mailing physical invoices are largely over. Digital invoicing (e-invoicing) has taken center stage, and for good reason.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Speed and Efficiency</h3>
        <p>
          A PDF invoice sent via email arrives instantly. There is no "check is in the mail" delay. This accelerates your payment cycle significantly.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Searchability and Storage</h3>
        <p>
          Finding a digital file from three years ago takes seconds. Finding a paper receipt in a filing cabinet can take hours. Digital records are essential for stress-free tax audits.
        </p>
      </div>
    ),
  },
  {
    id: 'managing-overdue-payments',
    title: 'How to Manage Overdue Payments Without Losing Clients',
    date: 'February 25, 2024',
    category: 'Tips',
    excerpt: 'Chasing payments is awkward but necessary. Here is a strategy for following up on late invoices while maintaining good relationships.',
    content: (
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          It happens to everyone. You did the work, sent the invoice, and... silence. Here is how to handle it:
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">The Gentle Nudge</h3>
        <p>
          1-2 days after the due date, send a polite email. "Just checking if this invoice was received." Often, it was simply buried in an inbox.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">The Firm Reminder</h3>
        <p>
          7 days late: Resend the invoice. State clearly that it is now overdue.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">The Phone Call</h3>
        <p>
          Emails are easy to ignore. A phone call is harder. Be friendly but firm. Ask for a specific date when the payment will be released.
        </p>
      </div>
    ),
  },
];

export const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedPost(null);
    window.scrollTo(0, 0);
  };

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md animate-in fade-in duration-300">
        <Button variant="ghost" onClick={handleBack} className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600">
          ← Back to Articles
        </Button>
        
        <article>
          <div className="mb-6">
            <span className="text-indigo-600 font-medium text-sm">{selectedPost.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">{selectedPost.title}</h1>
            <p className="text-gray-500 text-sm">{selectedPost.date}</p>
          </div>
          
          <div className="prose prose-indigo max-w-none">
            {selectedPost.content}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4">Share this article</h4>
            <div className="flex gap-4">
               <Button variant="outline" size="sm" onClick={() => {
                 if (navigator.share) {
                   navigator.share({
                     title: selectedPost.title,
                     text: selectedPost.excerpt,
                     url: window.location.href
                   }).catch(console.error);
                 } else {
                   navigator.clipboard.writeText(window.location.href);
                   alert('Link copied to clipboard!');
                 }
               }}>
                 Share Article
               </Button>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Finance & Billing Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tips, guides, and insights to help you manage your business finances, understand GST, and invoice like a pro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.date}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" className="w-full" onClick={() => handleReadMore(post)}>
                Read Article
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
