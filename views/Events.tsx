
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
  AlertCircle,
  Receipt,
  ShoppingCart,
  Percent,
  Calculator
} from 'lucide-react';
import { mockEvents, mockTeams, mockEventSales } from '../mockData';
import { Event, EventTeamQuota, EventExpense } from '../types';

const EventsView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    goalValue: 0,
    showOnDashboard: true,
    ticketQuantity: 0,
    ticketValue: 0,
    expenses: [] as EventExpense[],
    teamQuotas: mockTeams.map(t => ({ teamId: t.id, quotaValue: 0 }))
  });

  const [newExpense, setNewExpense] = useState({ description: '', amount: 0 });

  const totalExpenses = useMemo(() => {
    return formData.expenses.reduce((acc, exp) => acc + exp.amount, 0);
  }, [formData.expenses]);

  const potentialRevenue = useMemo(() => {
    return (formData.ticketQuantity || 0) * (formData.ticketValue || 0);
  }, [formData.ticketQuantity, formData.ticketValue]);

  const getEventStats = (event: Event) => {
    const sales = mockEventSales.filter(s => s.eventId === event.id);
    const raised = sales.reduce((acc, s) => acc + s.amount, 0);
    const progress = (raised / event.goalValue) * 100;
    const netProfit = raised - event.costValue;
    const ticketsSold = Math.floor(raised / (event.ticketValue || 1));
    return { raised, progress, netProfit, ticketsSold };
  };

  const handleAddExpense = () => {
    if (!newExpense.description || newExpense.amount <= 0) return;
    setFormData({
      ...formData,
      expenses: [...formData.expenses, { id: Math.random().toString(36).substr(2, 9), ...newExpense }]
    });
    setNewExpense({ description: '', amount: 0 });
  };

  const handleRemoveExpense = (id: string) => {
    setFormData({
      ...formData,
      expenses: formData.expenses.filter(e => e.id !== id)
    });
  };

  const handleSave = () => {
    const costValue = totalExpenses;
    if (editingEventId) {
      setEvents(events.map(e => e.id === editingEventId ? { ...e, ...formData, costValue, id: e.id, cityId: e.cityId, isActive: e.isActive } : e));
    } else {
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        costValue,
        cityId: '1',
        isActive: true
      };
      setEvents([newEvent, ...events]);
    }
    setShowModal(false);
    setEditingEventId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2 lg:px-0">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Gestão de Eventos</h2>
          <p className="text-gray-500 font-medium">Controle de arrecadação, ingressos e despesas detalhadas.</p>
        </div>
        <button 
          onClick={() => {
            setEditingEventId(null);
            setFormData({
                name: '',
                date: new Date().toISOString().split('T')[0],
                goalValue: 0,
                showOnDashboard: true,
                ticketQuantity: 0,
                ticketValue: 0,
                expenses: [],
                teamQuotas: mockTeams.map(t => ({ teamId: t.id, quotaValue: 0 }))
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 group shrink-0"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2 lg:px-0">
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-50">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Gasto Real</p>
                    <p className="text-sm font-black text-red-500">R$ {event.costValue.toFixed(2)}</p>
                  </div>
                  <div className="text-center border-x border-gray-50 px-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Meta Bruta</p>
                    <p className="text-sm font-black text-blue-600">R$ {event.goalValue.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ingressos</p>
                    <p className="text-sm font-black text-gray-700">{stats.ticketsSold} / {event.ticketQuantity}</p>
                  </div>
                   <div className="text-center border-l border-gray-50">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Margem</p>
                    <p className={`text-sm font-black ${stats.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>R$ {stats.netProfit.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">Arrecadado vs Meta</span>
                    <span className="text-blue-600">R$ {stats.raised.toFixed(2)} ({stats.progress.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000 ${stats.progress >= 100 ? 'bg-emerald-500 shadow-emerald-200' : 'bg-blue-600'}`}
                      style={{ width: `${Math.min(stats.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${event.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{event.isActive ? 'Evento Ativo' : 'Finalizado'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-3.5 h-3.5 text-gray-300" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dash: {event.showOnDashboard ? 'Sim' : 'Não'}</span>
                        </div>
                    </div>
                </div>
              </div>
              <button className="w-full py-4 bg-gray-50 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border-t border-gray-50 flex items-center justify-center gap-2">
                 Ver Detalhamento de Equipes <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL NOVO EVENTO / EDIÇÃO */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-500 my-auto">
            
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none mb-1">{editingEventId ? 'Editar Evento' : 'Novo Evento'}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">INGRESSOS, GASTOS E METAS</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300 hover:text-red-500"><X className="w-7 h-7" /></button>
            </div>

            <div className="p-10 space-y-12 overflow-y-auto max-h-[75vh] no-scrollbar">
              
              {/* SEÇÃO 1: DADOS BÁSICOS E INGRESSOS */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                   <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">1. Definição do Evento e Ingressos</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">NOME DO EVENTO</label>
                    <input type="text" placeholder="Ex: Galinhada Beneficente 2024" className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">DATA DO EVENTO</label>
                    <input type="date" className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 space-y-4">
                    <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Calculator className="w-3.5 h-3.5" /> Ingressos Gerados
                    </label>
                    <input 
                      type="number" 
                      placeholder="Qtd." 
                      className="w-full px-5 py-4 bg-white border border-blue-100 rounded-xl text-sm font-black text-blue-700 outline-none"
                      value={formData.ticketQuantity}
                      onChange={e => setFormData({...formData, ticketQuantity: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 space-y-4">
                    <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <DollarSign className="w-3.5 h-3.5" /> Valor Unitário
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 font-black text-xs">R$</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full pl-10 pr-5 py-4 bg-white border border-blue-100 rounded-xl text-sm font-black text-blue-700 outline-none"
                        value={formData.ticketValue}
                        onChange={e => setFormData({...formData, ticketValue: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-blue-600 rounded-3xl shadow-xl shadow-blue-100 flex flex-col justify-center">
                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-1">Potencial Arrecadação</p>
                    <p className="text-2xl font-black text-white">R$ {potentialRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: GASTOS DETALHADOS */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">2. Detalhamento de Gastos (Custos)</h4>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Gasto Total:</span>
                      <span className="text-xs font-black text-red-700">R$ {totalExpenses.toFixed(2)}</span>
                   </div>
                </div>

                <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">DESCRIÇÃO DO GASTO</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Aluguel de Tendas, Compra de Bebidas..." 
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50"
                        value={newExpense.description}
                        onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">VALOR R$</label>
                      <input 
                        type="number" 
                        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-sm font-black text-gray-700 outline-none"
                        value={newExpense.amount}
                        onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <button 
                      onClick={handleAddExpense}
                      className="bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Gasto
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.expenses.map(exp => (
                      <div key={exp.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 group animate-in slide-in-from-left-2 duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
                             <Receipt className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-bold text-gray-700">{exp.description}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm font-black text-red-500">R$ {exp.amount.toFixed(2)}</span>
                          <button onClick={() => handleRemoveExpense(exp.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {formData.expenses.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-3xl">
                        <Receipt className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">Nenhum gasto detalhado ainda.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEÇÃO 3: METAS E EQUIPES */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">3. Meta Geral e Cotas por Equipe</h4>
                   </div>
                   <div className="flex items-center gap-4 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dashboard:</span>
                      <button onClick={() => setFormData({...formData, showOnDashboard: !formData.showOnDashboard})} className="transition-all">
                        {formData.showOnDashboard ? <ToggleRight className="w-8 h-8 text-blue-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-4">
                    <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                       <Target className="w-4 h-4" /> Meta Total de Arrecadação (Bruto)
                    </label>
                    <div className="relative">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300 font-black text-lg">R$</span>
                       <input 
                         type="number" 
                         className="w-full pl-16 pr-8 py-6 bg-white border border-emerald-100 rounded-3xl text-xl font-black text-emerald-700 outline-none focus:ring-8 focus:ring-emerald-100 transition-all"
                         value={formData.goalValue}
                         onChange={e => setFormData({...formData, goalValue: parseFloat(e.target.value) || 0})}
                       />
                    </div>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest px-2 italic">
                       Dica: Sua meta deve ser maior que o gasto real (R$ {totalExpenses.toFixed(2)}).
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Distribuir Meta entre as Equipes Base</p>
                    <div className="max-h-[250px] overflow-y-auto no-scrollbar space-y-3 pr-2">
                      {formData.teamQuotas.map((quota, idx) => {
                        const team = mockTeams.find(t => t.id === quota.teamId);
                        return (
                          <div key={quota.teamId} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all">
                            <span className="text-xs font-bold text-gray-700">{team?.name}</span>
                            <div className="relative w-36">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-black text-[9px]">R$</span>
                              <input 
                                type="number" 
                                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-900 outline-none"
                                value={quota.quotaValue}
                                onChange={(e) => {
                                  const newQuotas = [...formData.teamQuotas];
                                  newQuotas[idx].quotaValue = parseFloat(e.target.value) || 0;
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
              </div>
            </div>

            <div className="px-10 py-8 bg-gray-50 border-t border-gray-50 flex items-center justify-end gap-6 z-20">
              <button onClick={() => setShowModal(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">CANCELAR</button>
              <button 
                onClick={handleSave}
                disabled={!formData.name || formData.goalValue <= 0}
                className="bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> {editingEventId ? 'SALVAR ALTERAÇÕES' : 'LANÇAR EVENTO AGORA'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsView;
