
import React from 'react';
import { Edit2, Trash2, Printer, FileText, Send } from 'lucide-react';
import { Invoice, Client, InvoiceStatus } from '../types';

interface InvoiceListProps {
  invoices: Invoice[];
  clients: Client[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onSend: (invoice: Invoice) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, clients, onEdit, onDelete, onSend }) => {
  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Invoice #</th>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Due Date</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-indigo-600">{inv.invoiceNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{getClientName(inv.clientId)}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{inv.issueDate}</td>
                <td className="px-6 py-4 text-slate-600">{inv.dueDate}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">${inv.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    inv.status === InvoiceStatus.PAID ? 'bg-emerald-50 text-emerald-700' :
                    inv.status === InvoiceStatus.SENT ? 'bg-amber-50 text-amber-700' :
                    inv.status === InvoiceStatus.OVERDUE ? 'bg-rose-50 text-rose-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onSend(inv)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Send / Review"
                    >
                      <Send size={16} />
                    </button>
                    <button 
                      onClick={() => onEdit(inv)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(inv.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Print"
                      onClick={() => window.print()}
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={48} className="text-slate-200" />
                    <p>No invoices created yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
