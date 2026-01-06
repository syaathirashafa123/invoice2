
import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { Invoice, Client } from '../types';
import { generateInvoiceEmailDraft } from '../services/geminiService';

interface ReviewInvoiceModalProps {
  invoice: Invoice;
  client: Client;
  onClose: () => void;
}

const ReviewInvoiceModal: React.FC<ReviewInvoiceModalProps> = ({ invoice, client, onClose }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchDraft = async () => {
      setLoading(true);
      const draft = await generateInvoiceEmailDraft(invoice, client.name, invoice.status);
      setSubject(draft.subject);
      setBody(draft.body);
      setLoading(false);
    };
    fetchDraft();
  }, [invoice, client]);

  const handleSend = async () => {
    setSending(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
    setTimeout(onClose, 2000);
  };

  const handleRegenerate = async () => {
    setLoading(true);
    const draft = await generateInvoiceEmailDraft(invoice, client.name, invoice.status);
    setSubject(draft.subject);
    setBody(draft.body);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-12 text-center space-y-4 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Email Sent!</h2>
          <p className="text-slate-500">The invoice has been successfully delivered to {client.email}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Review & Send Invoice</h2>
              <p className="text-sm text-slate-500">Drafting email for {client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={40} className="text-indigo-600 animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">AI is crafting the perfect message...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recipient</label>
                  <div className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm">
                    {client.name} &lt;{client.email}&gt;
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium"
                    placeholder="Email Subject"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Message Body</label>
                    <button 
                      onClick={handleRegenerate}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <Sparkles size={12} /> Regenerate with AI
                    </button>
                  </div>
                  <textarea 
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none leading-relaxed"
                    placeholder="Write your message here..."
                  />
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs text-amber-800 leading-tight">
                  <strong>Tip:</strong> This email will include a secure PDF link and a "Pay Now" button automatically.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Action Bar */}
        <div className="px-8 py-6 border-t border-slate-100 flex justify-end items-center gap-3 bg-slate-50/50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSend}
            disabled={loading || sending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {sending ? (
              <><Loader2 size={18} className="animate-spin" /> Sending...</>
            ) : (
              <><Send size={18} /> Send Invoice</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewInvoiceModal;
