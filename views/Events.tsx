
import React, { useState, useMemo, useEffect } from 'react';
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
  PieChart,
  DollarSign,
  AlertCircle,
  Receipt,
  ShoppingCart,
  Percent,
  Calculator
} from 'lucide-react';
import { api } from '../services/api';
import { Event, EventTeamQuota, EventExpense, BaseTeam } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';
import DateInput from '../components/DateInput';
import BooleanInput from '../components/BooleanInput';
import Grid from '../components/Grid';

const EventsView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<BaseTeam[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    goalValue: 0,
    showOnDashboard: true,
    ticketQuantity: 0,
    ticketValue: 0,
    expenses: [] as EventExpense[],
    teamQuotas: [] as EventTeamQuota[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, teamsData] = await Promise.all([
          api.getEvents(),
          api.getTeams()
        ]);
        setEvents(eventsData);
        setTeams(teamsData);
        setFormData(prev => ({
          ...prev,
          teamQuotas: teamsData.map(t => ({ teamId: t.id, quotaValue: 0 }))
        }));
      } catch (err) {
        console.error('Failed to fetch events data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [newExpense, setNewExpense] = useState({ description: '', amount: 0 });

  const totalExpenses = useMemo(() => {
    return formData.expenses.reduce((acc, exp) => acc + exp.amount, 0);
  }, [formData.expenses]);

  const potentialRevenue = useMemo(() => {
    return (formData.ticketQuantity || 0) * (formData.ticketValue || 0);
  }, [formData.ticketQuantity, formData.ticketValue]);

  const getEventStats = (event: Event) => {
    // In a real app, we would fetch sales for this event
    // For now, we'll use a placeholder or mock logic if needed
    const raised = 0; // Placeholder
    const progress = event.goalValue > 0 ? (raised / event.goalValue) * 100 : 0;
    const netProfit = raised - event.costValue;
    const ticketsSold = event.ticketValue > 0 ? Math.floor(raised / event.ticketValue) : 0;
    return { raised, progress, netProfit, ticketsSold };
  };

  const handleAddExpense = () => {
    if (!newExpense.description || newExpense.amount <= 0) return;
    setFormData({
      ...formData,
      expenses: [...formData.expenses, { id: Math.random().toString(36).substr(2, 9), eventId: '', ...newExpense }]
    });
    setNewExpense({ description: '', amount: 0 });
  };

  const handleRemoveExpense = (id: string) => {
    setFormData({
      ...formData,
      expenses: formData.expenses.filter(e => e.id !== id)
    });
  };

  const handleSave = async () => {
    const costValue = totalExpenses;
    setLoading(true);
    try {
      if (editingEventId) {
        const updated = await api.updateEvent(editingEventId, {
          ...formData,
          costValue,
          cityId: '1', // Default city for now
          isActive: true
        });
        setEvents(events.map(e => e.id === editingEventId ? updated : e));
      } else {
        const newEvent = await api.createEvent({
          ...formData,
          costValue,
          cityId: '1', // Default city for now
          isActive: true
        });
        setEvents([newEvent, ...events]);
      }
      setShowModal(false);
      setEditingEventId(null);
    } catch (err) {
      console.error('Failed to save event', err);
      alert('Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;
    try {
      await api.deleteEvent(id);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setFormData({
      name: event.name,
      date: event.date,
      goalValue: event.goalValue,
      showOnDashboard: event.showOnDashboard,
      ticketQuantity: event.ticketQuantity,
      ticketValue: event.ticketValue,
      expenses: event.expenses || [],
      teamQuotas: event.teamQuotas || teams.map(t => ({ teamId: t.id, quotaValue: 0 }))
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2 lg:px-0">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Gestão de Eventos</h2>
          <p className="text-gray-500 font-medium">Controle de arrecadação, ingressos e despesas detalhadas.</p>
        </div>
        <Button 
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
              teamQuotas: teams.map(t => ({ teamId: t.id, quotaValue: 0 }))
            });
            setShowModal(true);
          }}
          size="lg"
          className="shadow-blue-100 shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
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
                    <button 
                      onClick={() => handleEditEvent(event)}
                      className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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

      {/* Modal Novo Evento */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEventId ? 'Editar Evento' : 'Lançar Novo Evento'}
        size="lg"
      >
        <div className="space-y-12">
          {/* SEÇÃO 1: DADOS BÁSICOS */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">1. Dados Básicos do Evento</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome do Evento</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                  placeholder="Ex: Almoço de Confraternização"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <DateInput
                label="Data do Evento"
                value={formData.date}
                onChange={val => setFormData({...formData, date: val})}
              />
            </div>
          </div>

          {/* SEÇÃO 2: GASTOS E INVESTIMENTOS */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">2. Gastos e Investimentos</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="p-6 bg-red-50 rounded-[2.5rem] border border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Total de Gastos:</span>
                    <span className="text-xl font-black text-red-600">R$ {totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-red-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${Math.min((totalExpenses / (formData.goalValue || 1)) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Qtd Ingressos</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 outline-none"
                      value={formData.ticketQuantity}
                      onChange={e => setFormData({...formData, ticketQuantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valor Unitário</label>
                    <input 
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 outline-none"
                      value={formData.ticketValue}
                      onChange={e => setFormData({...formData, ticketValue: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Potencial Bruto:</span>
                  <span className="text-sm font-black text-blue-600">R$ {potentialRevenue.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    placeholder="Descrição do Gasto"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 outline-none"
                    value={newExpense.description}
                    onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Valor R$"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 outline-none"
                      value={newExpense.amount || ''}
                      onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <Button 
                    onClick={handleAddExpense}
                    variant="outline"
                    className="sm:col-span-2"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Gasto
                  </Button>
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
          </div>

          {/* SEÇÃO 3: METAS E EQUIPES */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">3. Meta Geral e Cotas por Equipe</h4>
               </div>
               <BooleanInput
                 label="Exibir no Dashboard"
                 value={formData.showOnDashboard}
                 onChange={val => setFormData({...formData, showOnDashboard: val})}
               />
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
                    const team = teams.find(t => t.id === quota.teamId);
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

          <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowModal(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name || formData.goalValue <= 0}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingEventId ? 'Salvar Alterações' : 'Lançar Evento Agora'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventsView;
