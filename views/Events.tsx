
import React, { useState, useMemo } from 'react';
import { 
  Ticket, 
  Plus, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  X, 
  Save, 
  Search, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  PieChart,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { mockEvents, mockTeams, mockEventSales } from '../mockData';
import { Event, EventTeamQuota } from '../types';

const EventsView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    costValue: 0,
    goalValue: 0,
    showOnDashboard: true,
    teamQuotas: mockTeams.map(t => ({ teamId: t.id, quotaValue: 0 }))
  });

  const getEventStats = (event: Event) => {
    const sales = mockEventSales.filter(s => s.eventId === event.id);
    const raised = sales.reduce((acc, s) => acc + s.amount, 0);
    const paidRaised = sales.filter(s => s.status === 'Pago').reduce((acc, s) => acc + s.amount, 0);
    const progress = (raised / event.goalValue) * 100;
    const netProfit = raised - event.costValue;
    return { raised, paidRaised, progress, netProfit };
  };

  const handleSave = () => {
    if (editingEventId) {
      setEvents(events.map(e => e.id === editingEventId ? { ...e, ...formData, id: e.id, cityId: e.cityId, isActive: e.isActive } : e));
    } else {
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        cityId: '1',
        isActive: true
      };
      setEvents([newEvent, ...events]);
    }
    setShowModal(false);
    setEditingEventId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Gestão de Eventos</h2>
          <p className="text-gray-500 font-medium">Controle de arrecadação, metas e distribuição por equipes.</p>
        </div>
        <button 
          onClick={() => {
            setEditingEventId(null);
            setFormData({
                name: '',
                date: new Date().toISOString().split('T')[0],
                costValue: 0,
                goalValue: 0,
                showOnDashboard: true,
                teamQuotas: mockTeams.map(t => ({ teamId: t.id, quotaValue: 0 }))
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.map(event => {
          const stats = getEventStats(event);
          return (
            <div key={event.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all border-l-8 border-l-blue-600">
              <div className="p-8 space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <Ticket className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight">{event.name}</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(event.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-300 hover:text-blue-600 transition-colors"><Edit3 className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-50">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Custo Evento</p>
                    <p className="text-sm font-black text-gray-700">R$ {event.costValue.toFixed(2)}</p>
                  </div>
                  <div className="text-center border-x border-gray-50 px-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Meta Bruta</p>
                    <p className="text-sm font-black text-blue-600">R$ {event.goalValue.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Margem Real</p>
                    <p className={`text-sm font-black ${stats.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>R$ {stats.netProfit.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">Progresso da Meta</span>
                    <span className="text-blue-600">R$ {stats.raised.toFixed(2)} ({stats.progress.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000"
                      style={{ width: `${Math.min(stats.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${event.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{event.isActive ? 'Evento Aberto' : 'Evento Encerrado'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dashboard:</span>
                        {event.showOnDashboard ? <ToggleRight className="text-blue-600" /> : <ToggleLeft className="text-gray-300" />}
                    </div>
                </div>
              </div>
              <button className="w-full py-4 bg-gray-50 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border-t border-gray-50 flex items-center justify-center gap-2">
                 Ver Detalhes por Equipe <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL NOVO EVENTO */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-500">
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none mb-1">Novo Evento</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">DEFINA METAS E CUSTOS</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300"><X className="w-7 h-7" /></button>
            </div>

            <div className="p-10 overflow-y-auto max-h-[70vh] no-scrollbar space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">NOME DO EVENTO</label>
                  <input type="text" placeholder="Ex: Quermesse da Unidade 2024" className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">DATA EVENTO</label>
                  <input type="date" className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-2xl px-6">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exibir no Dashboard</span>
                   <button onClick={() => setFormData({...formData, showOnDashboard: !formData.showOnDashboard})} className="transition-all">
                     {formData.showOnDashboard ? <ToggleRight className="w-10 h-10 text-blue-600" /> : <ToggleLeft className="w-10 h-10 text-gray-300" />}
                   </button>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">INVESTIMENTO (CUSTO)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs">R$</span>
                    <input type="number" className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-gray-700 outline-none" value={formData.costValue} onChange={e => setFormData({...formData, costValue: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">META DE ARRECADAÇÃO</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 font-black text-xs">R$</span>
                    <input type="number" className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-blue-600 outline-none" value={formData.goalValue} onChange={e => setFormData({...formData, goalValue: parseFloat(e.target.value)})} />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" /> Distribuição de Metas por Equipe
                </h4>
                <div className="space-y-3">
                  {formData.teamQuotas.map((quota, idx) => {
                    const team = mockTeams.find(t => t.id === quota.teamId);
                    return (
                      <div key={quota.teamId} className="flex items-center justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                        <span className="text-xs font-bold text-gray-700">{team?.name}</span>
                        <div className="relative w-40">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-[9px]">R$</span>
                          <input 
                            type="number" 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-900 outline-none"
                            value={quota.quotaValue}
                            onChange={(e) => {
                              const newQuotas = [...formData.teamQuotas];
                              newQuotas[idx].quotaValue = parseFloat(e.target.value);
                              setFormData({...formData, teamQuotas: newQuotas});
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-gray-50 border-t border-gray-50 flex items-center justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500">CANCELAR</button>
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" /> CRIAR EVENTO AGORA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsView;
