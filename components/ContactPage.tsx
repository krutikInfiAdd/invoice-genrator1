
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Since there is no backend to handle emails yet, we simulate a submission.
    console.log({ name, email, message });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for reaching out. We have received your message and will get back to you as soon as possible.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Information */}
        <div className="bg-indigo-700 text-white p-8 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-6">Get in Touch</h1>
            <p className="text-indigo-100 mb-8 leading-relaxed">
              Have questions about our invoice generator? Need help with a feature? 
              Or just want to say hi? We'd love to hear from you.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-indigo-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-indigo-200">support@freeinvoicegenrator.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <svg className="w-6 h-6 text-indigo-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div>
                  <h3 className="font-semibold text-white">Location</h3>
                  <p className="text-indigo-200">Digital Nomad HQ<br/>Internet City, Web 3.0</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
             <p className="text-indigo-300 text-sm">
               © {new Date().getFullYear()} Free Invoice Generator
             </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <Input 
                id="name"
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Input 
                id="email"
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <Textarea 
                id="message"
                required 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                rows={5}
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
