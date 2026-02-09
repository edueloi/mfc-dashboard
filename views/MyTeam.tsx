
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  History, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  X, 
  ChevronRight, 
  Calendar,
  Save,
  CheckCircle2,
  CalendarDays,
  Settings2,
  ArrowUpRight,
  TrendingUp,
  Ban,
  AlertTriangle,
  MapPin,
  Ticket,
  Target,
  UserPlus
} from 'lucide-react';
import { mockTeams, mockMembers, mockPayments, mockEvents, mockEventSales } from '../mockData';
import { Payment, Member, Event, EventSale } from '../types';

interface MyTeamViewProps {
  teamId: string;
  userId: string;
  onOpenMember: (id: string) => void;
}

const MyTeamView: React.FC<MyTeamViewProps> = ({ teamId, userId, onOpenMember }) => {
  const [activeTab, setActiveTab] = useState<'membros' | 'mensalidades' | 'eventos' | 'historico'>('membros');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  
  const [selectedForPayment, setSelectedForPayment] = useState<{memberIds: string[], name: string} | null>(null);
  const [paymentMonth, setPaymentMonth] = useState(`${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
  
  const [membersState, setMembersState] = useState<Member[]>(mockMembers.filter(m => m.teamId === teamId));
  const team = mockTeams.find(t => t.id === teamId);
  const [localPayments, setLocalPayments] = useState<Payment[]>(mockPayments.filter(p => p.teamId === teamId));
  const [localSales, setLocalSales] = useState<EventSale[]>(mockEventSales.filter(s => s.teamId === teamId));

  // Estado para nova venda
  const [newSale, setNewSale] = useState({
    eventId: '',
    memberId: membersState[0]?.id || '',
    buyerName: '',
    amount: 0,
    status: 'Pago' as 'Pago' | 'Pendente'
  });

  const activeEvents = mockEvents.filter(e => e.isActive);

  const teamEventStats = useMemo(() => {
    return activeEvents.map(event => {
        const teamQuota = event.teamQuotas.find(q => q.teamId === teamId)?.quotaValue || 0;
        const sales = localSales.filter(s => s.eventId === event.id);
        const raised = sales.reduce((acc, s) => acc + s.amount, 0);
        const progress = teamQuota > 0 ? (raised / teamQuota) * 100 : 0;
        return { event, teamQuota, raised, progress, sales };
    });
  }, [localSales, activeEvents, teamId]);

  const months = useMemo(() => {
    const year = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => `${i + 1}/${year}`);
  }, []);

  const currentMonth = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

  const groupedMembers = useMemo(() => {
    const processed = new Set<string>();
    const groups: { 
      type: 'couple' | 'single', 
      members: Member[], 
      displayName: string,
      isInactive: boolean 
    }[] = [];

    membersState.forEach(member => {
      if (processed.has(member.id)) return;
      const spouse = membersState.find(m => m.id !== member.id && (m.name === member.spouseName || m.nickname === member.spouseName || (m.spouseName === member.name)));
      if (spouse) {
        const firstName1 = member.nickname || member.name.split(' ')[0];
        const firstName2 = spouse.nickname || spouse.name.split(' ')[0];
        groups.push({ type: 'couple', members: [member, spouse], displayName: `${firstName1} & ${firstName2}`, isInactive: !!(member.isPaymentInactive || spouse.isPaymentInactive) });
        processed.add(member.id); processed.add(spouse.id);
      } else {
        groups.push({ type: 'single', members: [member], displayName: member.name, isInactive: !!member.isPaymentInactive });
        processed.add(member.id);
      }
    });
    return groups;
  }, [membersState]);

  const handleLaunchSale = () => {
    if (!newSale.eventId || !newSale.buyerName || newSale.amount <= 0) return;
    const sale: EventSale = {
        id: Math.random().toString(36).substr(2, 9),
        ...newSale,
        teamId: teamId,
        date: new Date().toISOString()
    };
    setLocalSales([...localSales, sale]);
    setShowSaleModal(false);
    setNewSale({ eventId: '', memberId: membersState[0]?.id || '', buyerName: '', amount: 0, status: 'Pago' });
  };

  if (!team) return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">Equipe não encontrada.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header da Equipe */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-3">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{team.name}</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> {team.city} • Unidade Administrativa
              </p>
            </div>
          </div>
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 flex-wrap">
            {[
              { id: 'membros', label: 'Membros', icon: Users },
              { id: 'mensalidades', label: 'Mensalidades', icon: DollarSign },
              { id: 'eventos', label: 'Eventos/Metas', icon: Ticket },
              { id: 'historico', label: 'Histórico', icon: History }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white shadow-xl text-blue-600 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'membros' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membersState.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group" onClick={() => onOpenMember(member.id)}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {member.name.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">{member.name}</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.nickname || 'Sem Apelido'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">{member.movementRoles[0] || 'Membro Comum'}</span>
                  <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{member.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'eventos' && (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Metas de Arrecadação</h3>
                    <p className="text-xs text-gray-400 font-medium">Eventos ativos com cotas para nossa equipe.</p>
                </div>
                <button 
                  onClick={() => {
                    setNewSale({...newSale, eventId: activeEvents[0]?.id || ''});
                    setShowSaleModal(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Lançar Venda
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teamEventStats.map(stat => (
                    <div key={stat.event.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-8 space-y-6 flex-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                        <Ticket className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-gray-900">{stat.event.name}</h4>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meta Equipe: R$ {stat.teamQuota.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-blue-600 tracking-tighter">R$ {stat.raised.toFixed(2)}</p>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Já Arrecadado</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Objetivo da Equipe</span>
                                    <span className="text-blue-600">{stat.progress.toFixed(1)}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                    <div className="h-full bg-blue-600 shadow-lg transition-all duration-1000" style={{ width: `${Math.min(stat.progress, 100)}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Últimas Vendas da Equipe</p>
                                {stat.sales.slice(0, 3).map(sale => {
                                    const seller = membersState.find(m => m.id === sale.memberId);
                                    return (
                                        <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase">{seller?.name.substring(0, 1)}</div>
                                                <div>
                                                    <p className="text-[11px] font-black text-gray-900 leading-none">{sale.buyerName}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Por: {seller?.nickname || seller?.name.split(' ')[0]}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-gray-700">R$ {sale.amount.toFixed(2)}</p>
                                                <span className={`text-[8px] font-black uppercase tracking-widest ${sale.status === 'Pago' ? 'text-emerald-500' : 'text-amber-500'}`}>{sale.status}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {stat.sales.length === 0 && <p className="text-[10px] text-gray-300 font-black italic uppercase text-center py-4">Nenhuma venda lançada ainda.</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* MODAL LANÇAR VENDA EVENTO */}
      {showSaleModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-500">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                            <Ticket className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-none mb-1">Registrar Venda</h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ARRECADAÇÃO DE EVENTO</p>
                        </div>
                    </div>
                    <button onClick={() => setShowSaleModal(false)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-300 transition-all"><X className="w-7 h-7" /></button>
                </div>

                <div className="p-8 space-y-6 flex-1 overflow-y-auto no-scrollbar">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">EVENTO ATIVO</label>
                            <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 outline-none" value={newSale.eventId} onChange={e => setNewSale({...newSale, eventId: e.target.value})}>
                                {activeEvents.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">QUEM VENDEU? (MEMBRO DA EQUIPE)</label>
                            <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 outline-none" value={newSale.memberId} onChange={e => setNewSale({...newSale, memberId: e.target.value})}>
                                {membersState.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">NOME DO COMPRADOR EXTERNO</label>
                            <input type="text" placeholder="Ex: Sr. Benedito (Vizinho)" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" value={newSale.buyerName} onChange={e => setNewSale({...newSale, buyerName: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">VALOR TOTAL</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs">R$</span>
                                    <input type="number" className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-gray-900 outline-none" value={newSale.amount} onChange={e => setNewSale({...newSale, amount: parseFloat(e.target.value)})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">SITUAÇÃO</label>
                                <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 outline-none" value={newSale.status} onChange={e => setNewSale({...newSale, status: e.target.value as 'Pago' | 'Pendente'})}>
                                    <option value="Pago">Já Pagou</option>
                                    <option value="Pendente">A Receber</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-50 flex items-center justify-end gap-4">
                    <button onClick={() => setShowSaleModal(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500">CANCELAR</button>
                    <button onClick={handleLaunchSale} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3">
                        <Save className="w-5 h-5" /> LANÇAR VENDA
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MyTeamView;
