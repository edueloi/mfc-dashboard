
import React from 'react';
import { 
  Users, 
  Layers, 
  UserCheck, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  History,
  Baby,
  PersonStanding
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Total MFCistas', value: '432', icon: Users, color: 'bg-blue-600', trend: 'Membros totais', view: 'mfcistas' },
    { label: 'Jovens e Crianças', value: '86', icon: Baby, color: 'bg-indigo-600', trend: 'Base do Movimento' },
    { label: '3ª Idade (Experiência)', value: '142', icon: PersonStanding, color: 'bg-rose-600', trend: 'Nossa Fortaleza' },
    { label: 'Equipes Base', value: '28', icon: Layers, color: 'bg-emerald-600', trend: 'Ativas na Unidade', view: 'equipes' },
  ];

  const pieData = [
    { name: 'Em Dia (Mensalidade)', value: 385, color: '#059669' },
    { name: 'Pendentes', value: 25, color: '#D97706' },
    { name: 'Inativos', value: 22, color: '#DC2626' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Visão Geral da Unidade</h2>
          <p className="text-gray-500 font-medium">Informações consolidadas para apoio à gestão.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
             Última atualização: Hoje
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group" onClick={() => stat.view && onNavigate(stat.view)}>
            <div className="flex items-center justify-between mb-6">
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-100 rotate-2 group-hover:rotate-0 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                MFC Tatuí
              </span>
            </div>
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</h3>
            <p className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-wide">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-black text-gray-800 tracking-tight">Saúde das Equipes Base</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Comparativo de Arrecadação Mensal</p>
            </div>
            <button className="bg-slate-50 text-slate-500 p-3 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100">
              <History className="w-5 h-5" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'S.P Apóstolo', value: 100 },
                { name: 'N.S Paz', value: 85 },
                { name: 'S. Família', value: 92 },
                { name: 'N.S Graças', value: 78 },
                { name: 'S. Expedito', value: 100 },
                { name: 'Jovens MFC', value: 65 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-black text-gray-800 tracking-tight mb-2 text-center">Frequência Financeira</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-10">Consolidado das Equipes</p>
          <div className="h-64 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-8 w-full">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
