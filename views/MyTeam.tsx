
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
  CalendarDays
} from 'lucide-react';
import { mockTeams, mockMembers, mockPayments } from '../mockData';
import { Payment } from '../types';

interface MyTeamViewProps {
  teamId: string;
  userId: string;
  onOpenMember: (id: string) => void;
}

const MyTeamView: React.FC<MyTeamViewProps> = ({ teamId, userId, onOpenMember }) => {
  const [activeTab, setActiveTab] = useState<'membros' | 'mensalidades' | 'historico'>('membros');
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedForPayment, setSelectedForPayment] = useState<{memberIds: string[], name: string} | null>(null);
  const [paymentMonth, setPaymentMonth] = useState(`${new Date().getMonth() + 1}/${new Date().getFullYear()}`);

  const team = mockTeams.find(t => t.id === teamId);
  const teamMembers = mockMembers.filter(m => m.teamId === teamId);
  const [localPayments, setLocalPayments] = useState<Payment[]>(mockPayments.filter(p => p.teamId === teamId));

  // Agrupamento de casais
  const groupedMembers = useMemo(() => {
    const processed = new Set<string>();
    const groups: { type: 'couple' | 'single', members: any[], displayName: string }[] = [];

    teamMembers.forEach(member => {
      if (processed.has(member.id)) return;

      const spouse = teamMembers.find(m => 
        m.id !== member.id && 
        (m.name === member.spouseName || m.nickname === member.spouseName)
      );

      if (spouse) {
        groups.push({
          type: 'couple',
          members: [member, spouse],
          displayName: `${member.nickname || member.name.split(' ')[0]} & ${spouse.nickname || spouse.name.split(' ')[0]}`
        });
        processed.add(member.id);
        processed.add(spouse.id);
      } else {
        groups.push({
          type: 'single',
          members: [member],
          displayName: member.name
        });
        processed.add(member.id);
      }
    });

    return groups;
  }, [teamMembers]);

  const months = useMemo(() => {
    const year = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => `${i + 1}/${year}`);
  }, []);

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

  const isMonthPaid = (memberIds: string[], month: string) => {
    return memberIds.every(id => 
      localPayments.some(p => p.memberId === id && p.referenceMonth === month && p.status === 'Pago')
    );
  };

  if (!team) return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">Equipe não encontrada.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 rotate-3">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{team.name}</h2>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Minha Equipe Base • {team.city}</p>
            </div>
          </div>
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {[
              { id: 'membros', label: 'Membros', icon: Users },
              { id: 'mensalidades', label: 'Mensalidades', icon: DollarSign },
              { id: 'historico', label: 'Histórico', icon: History }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white shadow-lg shadow-gray-200/50 text-blue-600 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
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
          {teamMembers.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group" onClick={() => onOpenMember(member.id)}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {member.name.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">{member.name}</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.nickname}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Status</span>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{member.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Aniversário</span>
                  <span className="text-xs font-bold text-gray-600">{new Date(member.dob).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                  {member.movementRoles.map(role => (
                    <span key={role} className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-lg text-[8px] uppercase font-black tracking-widest border border-slate-100">{role}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mensalidades' && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Fluxo de Contribuições</h3>
              <p className="text-xs text-gray-400 font-medium">Acompanhamento mensal e lançamentos por casal/membro.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                REF: {months[new Date().getMonth()]}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 sticky left-0 bg-gray-50/50 z-10">Casal / Membro</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Status Atual</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Valor Base</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {groupedMembers.map((group, idx) => {
                  const mIds = group.members.map(m => m.id);
                  const paidInCurrentMonth = isMonthPaid(mIds, months[new Date().getMonth()]);
                  
                  return (
                    <tr key={idx} className="hover:bg-blue-50/20 transition-all">
                      <td className="px-8 py-5 sticky left-0 bg-white/80 backdrop-blur-sm z-10 border-r border-gray-50">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${group.type === 'couple' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {group.type === 'couple' ? 'C' : 'M'}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-none mb-1">{group.displayName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{group.type === 'couple' ? 'Agrupado por Casal' : 'Individual'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {paidInCurrentMonth ? (
                          <span className="inline-flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-3 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5" /> Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center font-black text-sm text-gray-700 tabular-nums">
                        R$ {(group.members.length * 15).toFixed(2)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => {
                            setSelectedForPayment({ memberIds: mIds, name: group.displayName });
                            setShowPayModal(true);
                          }}
                          className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 ml-auto"
                        >
                          <Plus className="w-3.5 h-3.5" /> Lançar Pagamento
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50">
             <h3 className="text-xl font-black text-gray-900 tracking-tight">Extrato de Entradas</h3>
             <p className="text-xs text-gray-400 font-medium">Histórico completo de lançamentos financeiros da equipe.</p>
          </div>
          <div className="divide-y divide-gray-50">
            {[...localPayments].reverse().map(p => {
              const member = teamMembers.find(m => m.id === p.memberId);
              return (
                <div key={p.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-green-50 rounded-xl text-green-600 flex items-center justify-center shadow-inner">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 leading-none mb-1">{member?.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Mês Ref: {p.referenceMonth}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-[10px] text-gray-400 font-medium">Lançado em {new Date(p.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-green-600 tabular-nums">+ R$ {p.amount.toFixed(2)}</p>
                    <p className="text-[9px] text-gray-300 font-black tracking-widest uppercase">ID Transação: {p.id}</p>
                  </div>
                </div>
              );
            })}
            {localPayments.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10 text-gray-200" />
                </div>
                <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Nenhum lançamento registrado.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL LANÇAR PAGAMENTO - REFINADO */}
      {showPayModal && selectedForPayment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-none mb-1">Confirmar Recebimento</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedForPayment.name}</p>
                </div>
              </div>
              <button onClick={() => setShowPayModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100/50 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total a Lançar</p>
                   <p className="text-3xl font-black text-blue-700 tracking-tighter">R$ {(selectedForPayment.memberIds.length * 15).toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm font-black text-xs">
                  {selectedForPayment.memberIds.length}p
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-300 uppercase mb-3 tracking-widest ml-1">Mês de Referência</label>
                <div className="grid grid-cols-3 gap-2">
                  {months.map(m => {
                    const isPaid = isMonthPaid(selectedForPayment.memberIds, m);
                    return (
                      <button
                        key={m}
                        disabled={isPaid}
                        onClick={() => setPaymentMonth(m)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border ${
                          isPaid 
                            ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed line-through' 
                            : paymentMonth === m 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                              : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/30'
                        }`}
                      >
                        {m.split('/')[0].padStart(2, '0')}/{m.split('/')[1].substring(2)}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-[10px] text-gray-400 font-bold italic text-center">
                  * Meses cinzas já possuem lançamentos efetuados.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleLaunchPayment}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Save className="w-5 h-5" /> Registrar Pagamento
                </button>
                <button 
                  onClick={() => setShowPayModal(false)}
                  className="w-full py-4 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-gray-600 transition-colors"
                >
                  Cancelar Lançamento
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
