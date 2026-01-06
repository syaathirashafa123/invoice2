
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles, Loader2, Save, Printer } from 'lucide-react';
import { Invoice, Client, CompanySettings, LineItem, InvoiceStatus } from '../types';
import { generateSmartDescription } from '../services/geminiService';

interface InvoiceFormProps {
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  clients: Client[];
  companySettings: CompanySettings;
  initialData: Invoice | null;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onClose, onSave, clients, companySettings, initialData }) => {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: initialData?.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientId: initialData?.clientId || '',
    issueDate: initialData?.issueDate || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    items: initialData?.items || [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
    status: initialData?.status || InvoiceStatus.DRAFT,
    taxRate: companySettings.taxRate,
    notes: initialData?.notes || ''
  });

  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const calculateSubtotal = () => {
    return (formData.items || []).reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * ((formData.taxRate || 0) / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), { id: Math.random().toString(), description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const handleRemoveItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== id)
    }));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleAISuggest = async (id: string, currentDesc: string) => {
    if (!currentDesc.trim()) return;
    setIsGenerating(id);
    const suggestion = await generateSmartDescription(currentDesc);
    handleItemChange(id, 'description', suggestion);
    setIsGenerating(null);
  };

  const handleSave = () => {
    if (!formData.clientId || !formData.items?.length) {
      alert('Please select a client and add at least one item.');
      return;
    }

    const finalInvoice: Invoice = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      invoiceNumber: formData.invoiceNumber!,
      clientId: formData.clientId!,
      issueDate: formData.issueDate!,
      dueDate: formData.dueDate!,
      items: formData.items!,
      status: formData.status!,
      taxRate: formData.taxRate!,
      notes: formData.notes,
      total: calculateTotal()
    };

    onSave(finalInvoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 rounded-t-2xl z-10 no-print">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Invoice' : 'Create New Invoice'}</h2>
            <p className="text-sm text-slate-500">Configure your invoice details and line items.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Client</label>
                <select 
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Invoice #</label>
                  <input 
                    type="text" 
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as InvoiceStatus })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  >
                    {Object.values(InvoiceStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Date</label>
                <input 
                  type="date" 
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Line Items</h3>
              <button 
                onClick={handleAddItem}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {(formData.items || []).map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-start group">
                  <div className="col-span-6 relative">
                    <input 
                      type="text" 
                      placeholder="Item name/description..."
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm pr-10"
                    />
                    <button 
                      onClick={() => handleAISuggest(item.id, item.description)}
                      disabled={isGenerating === item.id}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors disabled:opacity-50"
                      title="AI Optimize Description"
                    >
                      {isGenerating === item.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </button>
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number" 
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center pt-2 font-semibold text-slate-700">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Calcs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Notes</label>
              <textarea 
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none"
                placeholder="Private notes for team members..."
              />
            </div>
            <div className="bg-slate-50 p-6 rounded-xl space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax ({formData.taxRate}%)</span>
                <span>${calculateTax().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between text-lg font-bold text-slate-900">
                <span>Total Due</span>
                <span className="text-indigo-600">${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-8 py-6 border-t border-slate-100 flex justify-between items-center bg-white sticky bottom-0 rounded-b-2xl no-print">
          <div className="flex gap-4">
            <button 
              className="text-slate-600 hover:text-slate-800 text-sm font-medium px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              onClick={() => window.print()}
            >
              <Printer size={18} className="inline mr-2" /> Print Preview
            </button>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save size={18} /> Save Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
