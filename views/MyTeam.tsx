
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
  // Fix: Added missing MapPin import
  MapPin
} from 'lucide-react';
import { mockTeams, mockMembers, mockPayments } from '../mockData';
import { Payment, Member } from '../types';

interface MyTeamViewProps {
  teamId: string;
  userId: string;
  onOpenMember: (id: string) => void;
}

const MyTeamView: React.FC<MyTeamViewProps> = ({ teamId, userId, onOpenMember }) => {
  const [activeTab, setActiveTab] = useState<'membros' | 'mensalidades' | 'historico'>('membros');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedForPayment, setSelectedForPayment] = useState<{memberIds: string[], name: string} | null>(null);
  const [paymentMonth, setPaymentMonth] = useState(`${new Date().getMonth() + 1}/${new Date().getFullYear()}`);
  
  // Estado local para simular inativação de pagamentos
  const [membersState, setMembersState] = useState<Member[]>(mockMembers.filter(m => m.teamId === teamId));
  const team = mockTeams.find(t => t.id === teamId);
  const [localPayments, setLocalPayments] = useState<Payment[]>(mockPayments.filter(p => p.teamId === teamId));

  const months = useMemo(() => {
    const year = new Date().getFullYear();
    // Gerar meses do ano atual para o sistema de mensalidades
    return Array.from({ length: 12 }, (_, i) => `${i + 1}/${year}`);
  }, []);

  const currentMonth = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

  // Agrupamento de casais e membros simplificados
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

      const spouse = membersState.find(m => 
        m.id !== member.id && 
        (m.name === member.spouseName || m.nickname === member.spouseName || (m.spouseName === member.name))
      );

      if (spouse) {
        const firstName1 = member.nickname || member.name.split(' ')[0];
        const firstName2 = spouse.nickname || spouse.name.split(' ')[0];
        groups.push({
          type: 'couple',
          members: [member, spouse],
          displayName: `${firstName1} & ${firstName2}`,
          isInactive: !!(member.isPaymentInactive || spouse.isPaymentInactive)
        });
        processed.add(member.id);
        processed.add(spouse.id);
      } else {
        groups.push({
          type: 'single',
          members: [member],
          displayName: member.name,
          isInactive: !!member.isPaymentInactive
        });
        processed.add(member.id);
      }
    });

    return groups;
  }, [membersState]);

  // Função para contar meses em atraso para um grupo
  const getPendingMonths = (memberIds: string[]) => {
    const year = new Date().getFullYear();
    const currentMonthIdx = new Date().getMonth();
    const pending: string[] = [];

    // Verifica até o mês atual
    for (let i = 0; i <= currentMonthIdx; i++) {
      const m = `${i + 1}/${year}`;
      const isPaid = memberIds.every(id => 
        localPayments.some(p => p.memberId === id && p.referenceMonth === m && p.status === 'Pago')
      );
      if (!isPaid) pending.push(m);
    }
    return pending;
  };

  // Cálculos estatísticos da mensalidade
  const monthlyStats = useMemo(() => {
    const activeGroups = groupedMembers.filter(g => !g.isInactive);
    const totalExpected = activeGroups.reduce((acc, g) => acc + (g.members.length * 15), 0);
    
    let totalCollected = 0;
    activeGroups.forEach(g => {
      if (memberIdsPaidInMonth(g.members.map(m => m.id), currentMonth)) {
        totalCollected += (g.members.length * 15);
      }
    });

    const pendingCount = activeGroups.filter(g => !memberIdsPaidInMonth(g.members.map(m => m.id), currentMonth)).length;

    return {
      totalExpected,
      totalCollected,
      pendingCount,
      inactiveCount: groupedMembers.filter(g => g.isInactive).length
    };
  }, [groupedMembers, localPayments, currentMonth]);

  function memberIdsPaidInMonth(memberIds: string[], month: string) {
    return memberIds.every(id => 
      localPayments.some(p => p.memberId === id && p.referenceMonth === month && p.status === 'Pago')
    );
  }

  const handleLaunchPayment = () => {
    if (!selectedForPayment) return;

    const newPayments: Payment[] = selectedForPayment.memberIds.map(id => ({
      id: Math.random().toString(36).substr(2, 9),
      memberId: id,
      teamId: teamId,
      amount: 15.00,
      date: new Date().toISOString().split('T')[0],
      referenceMonth: paymentMonth,
      status: 'Pago',
      launchedBy: userId
    }));

    setLocalPayments([...localPayments, ...newPayments]);
    setShowPayModal(false);
    setSelectedForPayment(null);
  };

  const togglePaymentStatus = (groupIdx: number) => {
    const group = groupedMembers[groupIdx];
    const newStatus = !group.isInactive;
    
    setMembersState(prev => prev.map(m => {
      if (group.members.some(gm => gm.id === m.id)) {
        return { ...m, isPaymentInactive: newStatus };
      }
      return m;
    }));
  };

  if (!team) return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">Equipe não encontrada.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header da Equipe */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-100 rotate-3 transform hover:rotate-0 transition-transform duration-500">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{team.name}</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> {team.city} • Unidade Administrativa
              </p>
            </div>
          </div>
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 backdrop-blur-sm">
            {[
              { id: 'membros', label: 'Membros', icon: Users },
              { id: 'mensalidades', label: 'Mensalidades', icon: DollarSign },
              { id: 'historico', label: 'Histórico', icon: History }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white shadow-xl shadow-gray-200/50 text-blue-600 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
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
            <div key={member.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden" onClick={() => onOpenMember(member.id)}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  {member.name.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">{member.name}</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.nickname || 'Sem Apelido'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Situação</span>
                  <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{member.status}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                  {member.movementRoles.map(role => (
                    <span key={role} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-xl text-[8px] uppercase font-black tracking-widest border border-slate-100">{role}</span>
                  ))}
                  {member.movementRoles.length === 0 && <span className="text-[8px] font-black text-gray-300 uppercase italic">Apenas Membro</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mensalidades' && (
        <div className="space-y-6">
          {/* CARDS DE MONITORAMENTO FINANCEIRO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp className="w-24 h-24" /></div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Arrecadado {currentMonth.split('/')[0]}</p>
                <div className="flex items-end justify-between">
                   <h5 className="text-3xl font-black text-blue-600 tracking-tighter">R$ {monthlyStats.totalCollected.toFixed(2)}</h5>
                   <div className="text-[10px] font-black text-gray-300 bg-gray-50 px-2.5 py-1 rounded-lg">Meta: R$ {monthlyStats.totalExpected}</div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Pendentes no Mês</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><AlertTriangle className="w-6 h-6" /></div>
                   <div>
                      <h5 className="text-2xl font-black text-gray-900">{monthlyStats.pendingCount}</h5>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Lançamentos em aberto</p>
                   </div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Contribuintes Inativos</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600"><Ban className="w-6 h-6" /></div>
                   <div>
                      <h5 className="text-2xl font-black text-gray-900">{monthlyStats.inactiveCount}</h5>
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Pagamentos Pausados</p>
                   </div>
                </div>
             </div>
             <div className="bg-blue-600 p-6 rounded-[2.5rem] shadow-2xl shadow-blue-100 flex flex-col justify-between group">
                <p className="text-[9px] font-black text-blue-200 uppercase tracking-[0.2em]">Saúde Financeira</p>
                <div className="flex items-center justify-between mt-4">
                   <div className="text-4xl font-black text-white">{Math.round((monthlyStats.totalCollected / (monthlyStats.totalExpected || 1)) * 100)}%</div>
                   <button onClick={() => setShowConfigModal(true)} className="p-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all"><Settings2 className="w-5 h-5" /></button>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Painel de Lançamentos</h3>
                <p className="text-xs text-gray-400 font-medium tracking-tight">Gerencie os pagantes e visualize meses em atraso.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowConfigModal(true)}
                  className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-all"
                >
                  <Settings2 className="w-4 h-4 text-blue-500" /> Configurar Pagantes
                </button>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 sticky left-0 bg-gray-50/50 z-10">Contribuinte (Casal/Membro)</th>
                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Referência Mês</th>
                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Valor Total</th>
                    <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {groupedMembers.map((group, idx) => {
                    const mIds = group.members.map(m => m.id);
                    const paidInCurrentMonth = memberIdsPaidInMonth(mIds, currentMonth);
                    const pendingMonths = getPendingMonths(mIds);
                    
                    return (
                      <tr key={idx} className={`transition-all ${group.isInactive ? 'opacity-40 grayscale pointer-events-none bg-gray-50/50' : 'hover:bg-blue-50/20'}`}>
                        <td className="px-10 py-6 sticky left-0 bg-white/80 backdrop-blur-sm z-10 border-r border-gray-50">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-sm shadow-inner ${group.type === 'couple' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                              {group.type === 'couple' ? 'C' : 'M'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-black text-gray-900 leading-none">{group.displayName}</p>
                                {pendingMonths.length > 0 && !group.isInactive && (
                                  <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded-lg text-[9px] font-black animate-pulse border border-red-100 cursor-help group/tip relative">
                                    <AlertCircle className="w-3 h-3" /> 
                                    {pendingMonths.length} {pendingMonths.length === 1 ? 'ATRASO' : 'ATRASOS'}
                                    {/* Tooltip com os meses */}
                                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tip:block bg-slate-900 text-white p-3 rounded-xl min-w-[150px] shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                      <p className="text-[8px] uppercase tracking-widest mb-2 font-black border-b border-white/10 pb-1">Meses em aberto:</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {pendingMonths.map(pm => <span key={pm} className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold">{pm}</span>)}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Contribuição Mensal</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          {paidInCurrentMonth ? (
                            <span className="inline-flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-4 py-1.5 rounded-xl border border-green-100/50">
                              <CheckCircle2 className="w-4 h-4" /> Pago
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-4 py-1.5 rounded-xl border border-amber-100/50">
                              <Clock className="w-4 h-4" /> Pendente
                            </span>
                          )}
                        </td>
                        <td className="px-10 py-6 text-center font-black text-base text-gray-700 tabular-nums">
                          R$ {(group.members.length * 15).toFixed(2)}
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button 
                            onClick={() => {
                              setSelectedForPayment({ memberIds: mIds, name: group.displayName });
                              setShowPayModal(true);
                            }}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 ml-auto"
                          >
                            <Plus className="w-4 h-4" /> Lançar Pagamento
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-gray-50 flex items-center justify-between">
             <div>
               <h3 className="text-xl font-black text-gray-900 tracking-tight">Extrato de Entradas</h3>
               <p className="text-xs text-gray-400 font-medium">Histórico consolidado da equipe.</p>
             </div>
             <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-blue-600 transition-all"><History className="w-6 h-6" /></button>
          </div>
          <div className="divide-y divide-gray-50">
            {[...localPayments].reverse().map(p => {
              const member = membersState.find(m => m.id === p.memberId);
              return (
                <div key={p.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all shadow-inner">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 leading-none mb-2">{member?.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-2 py-0.5 rounded">Mês Ref: {p.referenceMonth}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lançado em {new Date(p.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-green-600 tabular-nums">+ R$ {p.amount.toFixed(2)}</p>
                    <p className="text-[9px] text-gray-300 font-black tracking-widest uppercase">ID: {p.id.toUpperCase()}</p>
                  </div>
                </div>
              );
            })}
            {localPayments.length === 0 && (
              <div className="p-32 text-center space-y-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <AlertCircle className="w-12 h-12 text-gray-100" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-gray-300 uppercase tracking-widest">Nenhum lançamento registrado</p>
                  <p className="text-xs text-gray-400">Comece a lançar as mensalidades na aba dedicada.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAR PAGANTES (INATIVAR) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500 border border-gray-100">
              <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-blue-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-xl">
                      <Settings2 className="w-7 h-7" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">Configurar Pagantes</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Gestão de Atividade Financeira</p>
                   </div>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-300"><X className="w-7 h-7" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-4 no-scrollbar">
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4 mb-6">
                   <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                   <p className="text-[11px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                     Ao inativar um pagante, ele não aparecerá como pendente nos relatórios mensais e o valor não será contabilizado na meta de arrecadação da equipe.
                   </p>
                </div>

                <div className="space-y-3">
                   {groupedMembers.map((group, idx) => (
                     <div key={idx} className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${group.isInactive ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:border-blue-200'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${group.isInactive ? 'bg-gray-200 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                             {group.type === 'couple' ? 'C' : 'M'}
                           </div>
                           <div>
                              <p className={`text-sm font-black ${group.isInactive ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{group.displayName}</p>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">R$ {(group.members.length * 15).toFixed(2)} / mês</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => togglePaymentStatus(idx)}
                          className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${group.isInactive ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                        >
                          {group.isInactive ? 'Ativar Pagamento' : 'Inativar Pagante'}
                        </button>
                     </div>
                   ))}
                </div>
              </div>
              <div className="p-10 border-t border-gray-50 bg-gray-50/50">
                 <button onClick={() => setShowConfigModal(false)} className="w-full py-4 bg-white border border-gray-100 text-gray-600 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:bg-gray-100 transition-all">Fechar Configurações</button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL LANÇAR PAGAMENTO */}
      {showPayModal && selectedForPayment && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none mb-1">Recebimento</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedForPayment.name}</p>
                </div>
              </div>
              <button onClick={() => setShowPayModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400"><X className="w-7 h-7" /></button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="bg-blue-600 p-8 rounded-[2rem] shadow-2xl shadow-blue-100 flex items-center justify-between group overflow-hidden relative">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Total a Registrar</p>
                   <p className="text-4xl font-black text-white tracking-tighter">R$ {(selectedForPayment.memberIds.length * 15).toFixed(2)}</p>
                </div>
                <div className="relative z-10 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-sm font-black text-xs border border-white/20">
                  {selectedForPayment.memberIds.length}p
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em] ml-1">Mês de Referência</label>
                <div className="grid grid-cols-3 gap-3">
                  {months.map(m => {
                    const isPaid = memberIdsPaidInMonth(selectedForPayment.memberIds, m);
                    return (
                      <button
                        key={m}
                        disabled={isPaid}
                        onClick={() => setPaymentMonth(m)}
                        className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                          isPaid 
                            ? 'bg-gray-50 border-gray-50 text-gray-300 cursor-not-allowed line-through' 
                            : paymentMonth === m 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-105' 
                              : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:bg-blue-50/30'
                        }`}
                      >
                        {m.split('/')[0].padStart(2, '0')}/{m.split('/')[1].substring(2)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handleLaunchPayment}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <Save className="w-5 h-5" /> Confirmar Pagamento
                </button>
                <button 
                  onClick={() => setShowPayModal(false)}
                  className="w-full py-4 text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] hover:text-gray-500 transition-colors"
                >
                  Desistir do Lançamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeamView;
