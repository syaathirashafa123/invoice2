
import React, { useState } from 'react';
import { Plus, Search, Edit2, Mail, MapPin } from 'lucide-react';
import { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const ClientList: React.FC<ClientListProps> = ({ clients, setClients }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({});

  const handleAdd = () => {
    if (!newClient.name || !newClient.email) return;
    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClient.name,
      email: newClient.email,
      address: newClient.address || '',
      phone: newClient.phone
    };
    setClients([...clients, client]);
    setShowAdd(false);
    setNewClient({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search clients..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 bg-white"
          />
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                {client.name.charAt(0)}
              </div>
              <button className="text-slate-400 hover:text-indigo-600">
                <Edit2 size={16} />
              </button>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{client.name}</h3>
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Mail size={14} /> {client.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> {client.address}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex gap-3">
              <button className="flex-1 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors">
                New Invoice
              </button>
              <button className="flex-1 py-2 rounded-lg bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">
                View History
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold">Add New Client</h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Client Name" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
              <textarea 
                placeholder="Address" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
              <button onClick={handleAdd} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg shadow-indigo-100">Add Client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
