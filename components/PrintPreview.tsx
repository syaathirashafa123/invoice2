
import React from 'react';
import { Invoice, Client, CompanySettings } from '../types';

interface PrintPreviewProps {
  invoice: Invoice;
  client?: Client;
  settings: CompanySettings;
  isDraft?: boolean;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ invoice, client, settings, isDraft = false }) => {
  const { template } = settings;
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * (invoice.taxRate / 100);

  const containerStyle = {
    '--primary-color': template.primaryColor,
    fontFamily: template.headerFont || 'Inter, sans-serif'
  } as React.CSSProperties;

  return (
    <div 
      className={`bg-white shadow-xl mx-auto overflow-hidden print:shadow-none print:m-0 print:w-full`}
      style={{ ...containerStyle, width: '210mm', minHeight: '297mm', padding: '20mm' }}
    >
      {/* Draft Watermark */}
      {isDraft && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 text-slate-100 text-[120px] font-black opacity-20 pointer-events-none uppercase">
          Sample
        </div>
      )}

      {/* Header Layouts */}
      <div className={`flex justify-between items-start mb-12 ${template.layout === 'classic' ? 'flex-col items-center text-center' : ''}`}>
        <div className={template.layout === 'classic' ? 'mb-6' : ''}>
          {template.showLogo && (
            <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-2xl`} style={{ backgroundColor: template.primaryColor }}>
              {settings.name.charAt(0)}
            </div>
          )}
          <h1 className="text-3xl font-bold text-slate-900">{settings.name}</h1>
          <p className="text-slate-500 text-sm whitespace-pre-line">{settings.address}</p>
          <p className="text-slate-500 text-sm">{settings.email} • {settings.website}</p>
        </div>
        <div className={template.layout === 'classic' ? 'w-full border-t pt-6' : 'text-right'}>
          <h2 className="text-4xl font-light uppercase tracking-tighter mb-2" style={{ color: template.primaryColor }}>Invoice</h2>
          <div className="space-y-1 text-sm">
            <p><span className="text-slate-400">Number:</span> <span className="font-bold">{invoice.invoiceNumber}</span></p>
            <p><span className="text-slate-400">Date:</span> {invoice.issueDate}</p>
            <p><span className="text-slate-400">Due:</span> {invoice.dueDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12 border-t border-b py-8 border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To</h3>
          <p className="text-lg font-bold text-slate-900">{client?.name || 'Customer Name'}</p>
          <p className="text-slate-500 text-sm whitespace-pre-line">{client?.address || 'Customer Address'}</p>
          <p className="text-slate-500 text-sm">{client?.email || 'customer@email.com'}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Total Amount</h3>
          <p className="text-4xl font-bold" style={{ color: template.primaryColor }}>
            {settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : '£'}{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className={`mt-2 inline-block px-3 py-1 rounded text-xs font-bold uppercase ${
            invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {invoice.status}
          </p>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-slate-900">
            <th className="text-left py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Description</th>
            <th className="text-center py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-24">Qty</th>
            <th className="text-right py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-32">Unit Price</th>
            <th className="text-right py-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-32">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td className="py-5 font-medium text-slate-800">{item.description}</td>
              <td className="py-5 text-center text-slate-600">{item.quantity}</td>
              <td className="py-5 text-right text-slate-600">
                ${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="py-5 text-right font-bold text-slate-900">
                ${(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Calculations */}
      <div className="flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Tax ({invoice.taxRate}%)</span>
            <span>${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center">
            <span className="text-sm font-bold uppercase">Grand Total</span>
            <span className="text-xl font-black text-slate-900">
              ${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-slate-100 text-center">
        {invoice.notes && (
          <div className="mb-8 text-left">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Notes</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{invoice.notes}</p>
          </div>
        )}
        <p className="text-sm font-medium text-slate-800 mb-1">Thank you for your business!</p>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          {template.footerText || `Please make checks payable to ${settings.name}. Total amount is due within 14 days of invoice date.`}
        </p>
      </div>
    </div>
  );
};

export default PrintPreview;
