
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, 
  Layers, 
  History, 
  Baby, 
  PersonStanding,
  ChevronDown,
  Calendar,
  BarChart3,
  TrendingUp,
  Filter,
  Search,
  Check,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie,
  AreaChart,
  Area
} from 'recharts';
import { mockTeams } from '../mockData';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [selectedMonth, setSelectedMonth] = useState('06');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [chartType, setChartType] = useState<'bar' | 'trend'>('bar');
  
  // Estados para o novo filtro de equipes
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [teamSearch, setTeamSearch] = useState('');
  const [isTeamFilterOpen, setIsTeamFilterOpen] = useState(false);
  const teamFilterRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teamFilterRef.current && !teamFilterRef.current.contains(event.target as Node)) {
        setIsTeamFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const stats = [
    { label: 'Total MFCistas', value: '432', icon: Users, color: 'bg-blue-600', trend: 'Membros totais', view: 'mfcistas' },
    { label: 'Jovens e Crianças', value: '86', icon: Baby, color: 'bg-indigo-600', trend: 'Base do Movimento' },
    { label: '3ª Idade (Experiência)', value: '142', icon: PersonStanding, color: 'bg-rose-600', trend: 'Nossa Fortaleza' },
    { label: 'Equipes Base', value: '28', icon: Layers, color: 'bg-emerald-600', trend: 'Ativas na Unidade', view: 'equipes' },
  ];

  // Filtra a lista de equipes para o dropdown baseado na busca
  const filteredTeamsForSelect = useMemo(() => {
    return mockTeams.filter(team => 
      team.name.toLowerCase().includes(teamSearch.toLowerCase())
    );
  }, [teamSearch]);

  // Dados do gráfico de barras filtrados pelas equipes selecionadas
  const barData = useMemo(() => {
    const allData = [
      { id: 't1', name: 'S.P Apóstolo', value: 100 },
      { id: 't2', name: 'N.S Paz', value: 85 },
      { id: 't3', name: 'S. Família', value: 92 },
      { id: 't4', name: 'N.S Graças', value: 78 },
      { id: 't5', name: 'S. Expedito', value: 100 },
      { id: 't6', name: 'Jovens MFC', value: 65 },
    ];

    if (selectedTeamIds.length === 0) return allData;
    return allData.filter(d => selectedTeamIds.includes(d.id));
  }, [selectedTeamIds]);

  const trendData = useMemo(() => [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3800 },
    { name: 'Mar', value: 4200 },
    { name: 'Abr', value: 4500 },
    { name: 'Mai', value: 4300 },
    { name: 'Jun', value: 4800 },
  ], [selectedYear]);

  const pieData = [
    { name: 'Em Dia (Mensalidade)', value: 385, color: '#059669' },
    { name: 'Pendentes', value: 25, color: '#D97706' },
    { name: 'Inativos', value: 22, color: '#DC2626' },
  ];

  const months = [
    { v: '01', l: 'Janeiro' }, { v: '02', l: 'Fevereiro' }, { v: '03', l: 'Março' },
    { v: '04', l: 'Abril' }, { v: '05', l: 'Maio' }, { v: '06', l: 'Junho' },
    { v: '07', l: 'Julho' }, { v: '08', l: 'Agosto' }, { v: '09', l: 'Setembro' },
    { v: '10', l: 'Outubro' }, { v: '11', l: 'Novembro' }, { v: '12', l: 'Dezembro' }
  ];

  const toggleTeamSelection = (id: string) => {
    setSelectedTeamIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const removeTeamTag = (id: string) => {
    setSelectedTeamIds(prev => prev.filter(item => item !== id));
  };

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
        {/* GRÁFICO PRINCIPAL COM FILTROS AVANÇADOS */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col min-h-[550px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-800 tracking-tight">Saúde das Equipes Base</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                Análise Financeira Filtrada
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 mr-2">
                <button 
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                  title="Ver Barras"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setChartType('trend')}
                  className={`p-2 rounded-lg transition-all ${chartType === 'trend' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                  title="Ver Tendência"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-gray-400 ml-2" />
                <select 
                  className="bg-transparent text-[10px] font-black text-gray-600 uppercase border-none focus:ring-0 cursor-pointer"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                </select>
                <div className="w-px h-3 bg-gray-200 mx-1"></div>
                <select 
                  className="bg-transparent text-[10px] font-black text-gray-600 uppercase border-none focus:ring-0 cursor-pointer"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            </div>
          </div>

          {/* NOVO: FILTRO DE EQUIPES MULTISSELEÇÃO */}
          <div className="mb-10 space-y-4">
            <div className="relative" ref={teamFilterRef}>
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-2xl min-h-[56px] focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-white focus-within:border-blue-400 transition-all cursor-text" onClick={() => setIsTeamFilterOpen(true)}>
                <Filter className="w-4 h-4 text-gray-400 ml-2" />
                
                {selectedTeamIds.length === 0 ? (
                  <span className="text-sm font-semibold text-gray-400 ml-2">Filtrar por Equipes específicas...</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedTeamIds.map(id => {
                      const team = mockTeams.find(t => t.id === id);
                      return (
                        <span key={id} className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest animate-in zoom-in-95">
                          {team?.name}
                          <button onClick={(e) => { e.stopPropagation(); removeTeamTag(id); }} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="ml-auto pr-2">
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isTeamFilterOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* DROPDOWN DO FILTRO */}
              {isTeamFilterOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[1.8rem] shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar equipe..."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto no-scrollbar space-y-1">
                    <button 
                      onClick={() => setSelectedTeamIds([])}
                      className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-colors border border-transparent flex items-center justify-between"
                    >
                      Mostrar Todas as Equipes
                      {selectedTeamIds.length === 0 && <Check className="w-4 h-4" />}
                    </button>
                    
                    <div className="w-full h-px bg-gray-50 my-2"></div>

                    {filteredTeamsForSelect.map(team => (
                      <button 
                        key={team.id}
                        onClick={() => toggleTeamSelection(team.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${selectedTeamIds.includes(team.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {team.name}
                        {selectedTeamIds.includes(team.id) && <Check className="w-4 h-4" />}
                      </button>
                    ))}

                    {filteredTeamsForSelect.length === 0 && (
                      <div className="py-8 text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">Nenhuma equipe encontrada.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-72 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                    formatter={(value: number) => [`${value}%`, 'Arrecadação']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value === 100 ? '#059669' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Batida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Em Aberto</span>
            </div>
          </div>
        </div>

        {/* PIE CHART LATERAL */}
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
