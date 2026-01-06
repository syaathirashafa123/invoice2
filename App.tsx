
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  LogOut
} from 'lucide-react';
import { Invoice, Client, CompanySettings, InvoiceStatus } from './types';
import Dashboard from './components/Dashboard';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import ClientList from './components/ClientList';
import SettingsView from './components/SettingsView';
import ReviewInvoiceModal from './components/ReviewInvoiceModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'clients' | 'settings'>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Acme Corp', email: 'billing@acme.com', address: '123 Enterprise Way, NY' },
    { id: '2', name: 'Global Tech', email: 'finance@globaltech.io', address: '500 Innovation Blvd, CA' }
  ]);
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'Nova Solutions Inc.',
    address: '456 Business Park, Austin, TX 78701',
    email: 'hello@novasolutions.com',
    website: 'www.novasolutions.com',
    taxRate: 8.25,
    currency: 'USD'
  });

  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [reviewingInvoice, setReviewingInvoice] = useState<Invoice | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  // Initialize some data if empty
  useEffect(() => {
    const saved = localStorage.getItem('nova_invoices');
    if (saved) {
      setInvoices(JSON.parse(saved));
    } else {
      const mockInvoices: Invoice[] = [
        {
          id: 'inv-1',
          invoiceNumber: 'INV-2024-001',
          clientId: '1',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          items: [{ id: 'item-1', description: 'Website Redesign', quantity: 1, unitPrice: 2500 }],
          status: InvoiceStatus.PAID,
          taxRate: 8.25,
          total: 2706.25
        },
        {
          id: 'inv-2',
          invoiceNumber: 'INV-2024-002',
          clientId: '2',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
          items: [{ id: 'item-2', description: 'Consulting Services', quantity: 10, unitPrice: 150 }],
          status: InvoiceStatus.SENT,
          taxRate: 8.25,
          total: 1623.75
        }
      ];
      setInvoices(mockInvoices);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nova_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleSaveInvoice = (invoice: Invoice) => {
    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? invoice : inv));
    } else {
      setInvoices(prev => [...prev, invoice]);
    }
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    setReviewingInvoice(invoice);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const currentReviewingClient = reviewingInvoice 
    ? clients.find(c => c.id === reviewingInvoice.clientId) 
    : null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col no-print">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FileText size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">NovaInvoice</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors w-full">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center no-print">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {activeTab}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
            <button 
              onClick={() => {
                setEditingInvoice(null);
                setShowInvoiceForm(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm shadow-indigo-200"
            >
              <Plus size={18} />
              New Invoice
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              invoices={invoices} 
              onViewAll={() => setActiveTab('invoices')}
            />
          )}
          {activeTab === 'invoices' && (
            <InvoiceList 
              invoices={invoices} 
              clients={clients}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onSend={handleSendInvoice}
            />
          )}
          {activeTab === 'clients' && (
            <ClientList 
              clients={clients} 
              setClients={setClients}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsView 
              settings={settings} 
              setSettings={setSettings} 
            />
          )}
        </div>
      </main>

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <InvoiceForm 
          onClose={() => setShowInvoiceForm(false)} 
          onSave={handleSaveInvoice}
          clients={clients}
          companySettings={settings}
          initialData={editingInvoice}
        />
      )}

      {/* Review & Send Modal */}
      {reviewingInvoice && currentReviewingClient && (
        <ReviewInvoiceModal 
          invoice={reviewingInvoice}
          client={currentReviewingClient}
          onClose={() => setReviewingInvoice(null)}
        />
      )}
    </div>
  );
};

export default App;
