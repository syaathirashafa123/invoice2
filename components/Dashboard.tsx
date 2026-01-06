
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Clock, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Invoice, InvoiceStatus } from '../types';

interface DashboardProps {
  invoices: Invoice[];
  onViewAll: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, onViewAll }) => {
  const stats = React.useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status === InvoiceStatus.PAID ? inv.total : 0), 0);
    const pendingAmount = invoices.reduce((sum, inv) => sum + (inv.status !== InvoiceStatus.PAID ? inv.total : 0), 0);
    const paidCount = invoices.filter(inv => inv.status === InvoiceStatus.PAID).length;
    const pendingCount = invoices.filter(inv => inv.status !== InvoiceStatus.PAID).length;
    
    return { totalRevenue, pendingAmount, paidCount, pendingCount };
  }, [invoices]);

  const chartData = React.useMemo(() => {
    // Basic mock data for the trend
    return [
      { name: 'Jan', amount: 4000 },
      { name: 'Feb', amount: 3000 },
      { name: 'Mar', amount: 5000 },
      { name: 'Apr', amount: stats.totalRevenue / 4 }, // Just mock context
      { name: 'May', amount: stats.totalRevenue / 2 },
      { name: 'Jun', amount: stats.totalRevenue },
    ];
  }, [stats.totalRevenue]);

  const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444'];

  const pieData = [
    { name: 'Paid', value: stats.paidCount },
    { name: 'Pending', value: stats.pendingCount },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={<TrendingUp className="text-emerald-600" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard 
          title="Pending Amount" 
          value={`$${stats.pendingAmount.toLocaleString()}`} 
          icon={<Clock className="text-amber-600" />}
          trend="-2.4%"
          trendUp={false}
        />
        <StatCard 
          title="Invoices Paid" 
          value={stats.paidCount.toString()} 
          icon={<CheckCircle className="text-indigo-600" />}
          trend="+5"
          trendUp={true}
        />
        <StatCard 
          title="Unpaid Invoices" 
          value={stats.pendingCount.toString()} 
          icon={<AlertCircle className="text-rose-600" />}
          trend="+2"
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Revenue Overview</h3>
            <select className="text-sm border-slate-200 rounded-lg p-1">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Invoice Distribution</h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-xs text-slate-600 font-medium">Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-slate-600 font-medium">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Recent Invoices</h3>
          <button 
            onClick={onViewAll}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice #</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{inv.dueDate}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${inv.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      inv.status === InvoiceStatus.PAID ? 'bg-emerald-50 text-emerald-700' :
                      inv.status === InvoiceStatus.SENT ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <div className={`flex items-center text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
