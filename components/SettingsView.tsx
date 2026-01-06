
import React from 'react';
import { Save, Building, Globe, Mail, MapPin, Percent } from 'lucide-react';
import { CompanySettings } from '../types';

interface SettingsViewProps {
  settings: CompanySettings;
  setSettings: React.Dispatch<React.SetStateAction<CompanySettings>>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const handleChange = (field: keyof CompanySettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">Company Settings</h2>
        <p className="text-sm text-slate-500">Update your business profile and default invoice preferences.</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Building size={14} /> Company Name
            </label>
            <input 
              type="text" 
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Globe size={14} /> Website
            </label>
            <input 
              type="text" 
              value={settings.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Mail size={14} /> Contact Email
          </label>
          <input 
            type="email" 
            value={settings.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={14} /> Business Address
          </label>
          <textarea 
            rows={3}
            value={settings.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Percent size={14} /> Default Tax Rate (%)
            </label>
            <input 
              type="number" 
              value={settings.taxRate}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              Currency
            </label>
            <select 
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button 
          onClick={() => alert('Settings Saved!')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95"
        >
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
