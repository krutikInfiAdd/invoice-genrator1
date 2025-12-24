import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { PlusIcon } from './icons/PlusIcon';
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
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const q = query(collection(db, 'invoices'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const docsList: SavedDocument[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.details && !data.details.items) data.details.items = [];
        docsList.push({ id: doc.id, ...data } as SavedDocument);
      });
      docsList.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setDocuments(docsList);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load your documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, [user]);

  const handleLoad = (type: 'invoice' | 'quotation', details: InvoiceDetails) => {
    onLoad(type, details);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Don't trigger the row click (load)
    if (!confirm('Are you sure you want to delete this permanently?')) return;
    setDeleteId(id);
    try {
      await deleteDoc(doc(db, 'invoices', id));
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (e) { console.error(e); } finally { setDeleteId(null); }
  };

  if (loading && documents.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 font-black tracking-tight uppercase text-xs">Accessing Cloud History...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your History</h1>
          <p className="text-gray-500 mt-1">Manage and edit your saved invoices and quotations.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={fetchDocuments} disabled={loading} size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-700 text-sm font-bold">{error}</p>
        </div>
      )}

      {documents.length === 0 && !loading ? (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mb-6">
            <DownloadIcon className="w-12 h-12 rotate-180" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Cloud is Empty</h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-8">Create your first professional invoice to save it here for future use.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Document</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Name</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {documents.map((doc) => {
                   const total = (doc.details.items?.reduce((acc, item) => acc + (item.quantity * item.price), 0) || 0);
                   return (
                    <tr 
                      key={doc.id} 
                      className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                      onClick={() => handleLoad(doc.type, doc.details)}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                            doc.type === 'invoice' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'
                          }`}>
                            {doc.type}
                          </span>
                          <span className="font-black text-gray-900 text-sm">#{doc.details.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-700">{doc.details.billTo.name || 'Untitled Client'}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{doc.details.billTo.phone}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">
                        {doc.details.issueDate}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-black text-indigo-700">
                          {doc.details.currency} {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); handleLoad(doc.type, doc.details); }}
                          >
                            Open
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-300 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => handleDelete(e, doc.id)} 
                            disabled={deleteId === doc.id}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
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