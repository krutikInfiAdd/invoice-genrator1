
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';
import type { InvoiceDetails } from '../types';

interface DashboardProps {
  onLoad: (type: 'invoice' | 'quotation', details: InvoiceDetails) => void;
}

interface SavedDocument {
  id: string;
  type: 'invoice' | 'quotation';
  details: InvoiceDetails;
  updatedAt: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLoad }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fixLink, setFixLink] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;
      setError(null);
      setFixLink(null);

      try {
        // NOTE: We use client-side sorting to avoid requiring a Firestore Composite Index
        // which causes "failed-precondition" errors for new users.
        const q = query(
          collection(db, 'invoices'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const docs: SavedDocument[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() } as SavedDocument);
        });

        // Sort in memory (descending by updatedAt)
        docs.sort((a, b) => {
          const timeA = a.updatedAt?.seconds || 0;
          const timeB = b.updatedAt?.seconds || 0;
          return timeB - timeA;
        });

        setDocuments(docs);
      } catch (err: any) {
        console.error("Error fetching documents:", err);
        
        const isPermissionError = err.code === 'permission-denied' || err.message?.includes('Missing or insufficient permissions');
        const isIndexError = err.code === 'failed-precondition' || err.message?.includes('requires an index');

        if (isPermissionError) {
          setError('Access Denied: Please check your Firestore Security Rules in the Firebase Console.');
        } else if (isIndexError) {
          const match = err.message?.match(/https:\/\/console\.firebase\.google\.com[^\s]*/);
          const url = match ? match[0] : null;
          
          setError('Missing Index: Firestore requires a specific index to sort these documents.');
          if (url) {
            setFixLink(url);
          }
        } else {
          setError('Failed to load documents. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    setDeleteId(id);
    try {
      await deleteDoc(doc(db, 'invoices', id));
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document.");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          {fixLink && (
            <div className="mt-4 p-4 bg-white rounded border border-red-100 shadow-sm">
               <h4 className="font-bold text-red-800 mb-2">Action Required</h4>
               <p className="text-sm text-gray-600 mb-3">
                 Firebase requires a composite index to perform this query (sorting by date for a specific user).
               </p>
               <a 
                 href={fixLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
               >
                 Create Missing Index &rarr;
               </a>
               <p className="mt-2 text-xs text-gray-500">
                 Clicking this button will open the Firebase Console. Simply click "Create Index" in the dialog that appears and wait a few minutes.
               </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">My Documents</h1>
      <p className="text-gray-500 mb-8">Manage your saved invoices and quotations.</p>

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500">Create an invoice or quotation and save it to see it here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => {
                  // Calculate total safely
                  const subtotal = doc.details.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
                  const discountAmount = (subtotal * (doc.details.discount || 0)) / 100;
                  
                  let taxAmount = 0;
                  if (doc.details.taxType !== 'none') {
                    taxAmount = ((subtotal - discountAmount) * doc.details.taxRate) / 100;
                  }
                  
                  const total = subtotal - discountAmount + taxAmount;

                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.type === 'invoice' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {doc.details.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.details.billTo.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.details.issueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {total.toLocaleString('en-US', { style: 'currency', currency: doc.details.currency })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                          onClick={() => onLoad(doc.type, doc.details)}
                        >
                          Load
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleteId === doc.id}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
