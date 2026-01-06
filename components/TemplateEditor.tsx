
import React from 'react';
import { Palette, Layout, Type, Image as ImageIcon, Check } from 'lucide-react';
import { CompanySettings, Invoice, InvoiceStatus } from '../types';
import PrintPreview from './PrintPreview';

interface TemplateEditorProps {
  settings: CompanySettings;
  setSettings: React.Dispatch<React.SetStateAction<CompanySettings>>;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ settings, setSettings }) => {
  // Mock invoice for preview
  const previewInvoice: Invoice = {
    id: 'preview',
    invoiceNumber: 'INV-2024-PREVIEW',
    clientId: 'sample',
    issueDate: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 1209600000).toLocaleDateString(),
    items: [
      { id: '1', description: 'Brand Identity Design Package', quantity: 1, unitPrice: 1500 },
      { id: '2', description: 'React Development (per hour)', quantity: 12, unitPrice: 85 }
    ],
    status: InvoiceStatus.SENT,
    taxRate: settings.taxRate,
    total: (1500 + (12 * 85)) * (1 + settings.taxRate / 100),
    notes: 'Please include the invoice number in your wire transfer description.'
  };

  const updateTemplate = (updates: Partial<typeof settings.template>) => {
    setSettings(prev => ({
      ...prev,
      template: { ...prev.template, ...updates }
    }));
  };

  const colors = [
    '#4f46e5', // Indigo
    '#0f172a', // Slate
    '#0891b2', // Cyan
    '#16a34a', // Green
    '#db2777', // Pink
    '#ea580c'  // Orange
  ];

  return (
    <div className="flex h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
      {/* Editor Panel */}
      <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Template Designer</h3>
        
        <div className="space-y-8">
          {/* Colors */}
          <section className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} /> Brand Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateTemplate({ primaryColor: color })}
                  className="w-8 h-8 rounded-lg border-2 border-white shadow-sm transition-transform active:scale-90 flex items-center justify-center text-white"
                  style={{ backgroundColor: color }}
                >
                  {settings.template.primaryColor === color && <Check size={14} />}
                </button>
              ))}
              <input 
                type="color" 
                value={settings.template.primaryColor}
                onChange={(e) => updateTemplate({ primaryColor: e.target.value })}
                className="w-8 h-8 rounded-lg border-none cursor-pointer p-0"
              />
            </div>
          </section>

          {/* Layouts */}
          <section className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layout size={14} /> Layout Style
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(['modern', 'classic', 'minimal'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => updateTemplate({ layout: style })}
                  className={`px-4 py-2 rounded-lg text-sm text-left font-medium transition-all ${
                    settings.template.layout === style 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Branding */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <ImageIcon size={14} /> Show Icon Logo
              </label>
              <button 
                onClick={() => updateTemplate({ showLogo: !settings.template.showLogo })}
                className={`w-10 h-5 rounded-full transition-colors relative ${settings.template.showLogo ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.template.showLogo ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </section>

          {/* Typography */}
          <section className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Type size={14} /> Footer Message
            </label>
            <textarea 
              rows={4}
              value={settings.template.footerText}
              onChange={(e) => updateTemplate({ footerText: e.target.value })}
              placeholder="Default terms or thank you note..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </section>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 p-12 overflow-y-auto flex justify-center bg-slate-200/50 scrollbar-hide">
        <div className="scale-[0.7] origin-top">
          <PrintPreview 
            invoice={previewInvoice} 
            settings={settings}
            isDraft
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
