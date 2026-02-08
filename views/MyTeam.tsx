
import React, { useState } from 'react';
import { Users, DollarSign, History, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { mockTeams, mockMembers, mockPayments } from '../mockData';

interface MyTeamViewProps {
  teamId: string;
  userId: string;
  onOpenMember: (id: string) => void;
}

const MyTeamView: React.FC<MyTeamViewProps> = ({ teamId, userId, onOpenMember }) => {
  const [activeTab, setActiveTab] = useState<'membros' | 'mensalidades' | 'historico'>('membros');
  const team = mockTeams.find(t => t.id === teamId);
  const teamMembers = mockMembers.filter(m => m.teamId === teamId);
  const payments = mockPayments.filter(p => p.teamId === teamId);

  if (!team) return <div>Equipe não encontrada.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{team.name}</h2>
            <p className="text-gray-500">Minha Equipe Base em {team.city}</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('membros')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'membros' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Membros
            </button>
            <button 
              onClick={() => setActiveTab('mensalidades')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'mensalidades' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Mensalidades
            </button>
            <button 
              onClick={() => setActiveTab('historico')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'historico' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Histórico
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'membros' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onOpenMember(member.id)}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {member.name.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{member.name}</h4>
                  <p className="text-xs text-gray-500">{member.nickname}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Status: <span className="text-green-600 font-medium">{member.status}</span></p>
                <p>Aniversário: {member.dob}</p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {member.movementRoles.map(role => (
                    <span key={role} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] uppercase font-bold">{role}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mensalidades' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Referência: Outubro / 2023</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" /> Novo Lançamento
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Membro</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamMembers.map(member => {
                  const payment = payments.find(p => p.memberId === member.id && p.referenceMonth === '10/2023');
                  return (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-4">
                        {payment?.status === 'Pago' ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase"><CheckCircle className="w-3 h-3" /> Pago</span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold uppercase"><Clock className="w-3 h-3" /> Pendente</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">R$ 50,00</td>
                      <td className="px-6 py-4">
                        <button className={`px-3 py-1 rounded text-xs font-bold transition-colors ${payment?.status === 'Pago' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                          {payment?.status === 'Pago' ? 'Lançado' : 'Lançar Pago'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
             <h3 className="font-bold text-gray-800">Últimos Lançamentos</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {payments.map(p => {
              const member = teamMembers.find(m => m.id === p.memberId);
              return (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{member?.name}</p>
                      <p className="text-xs text-gray-500">Mês ref: {p.referenceMonth} | Lançado em {p.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">+ R$ {p.amount.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">ID: {p.id}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeamView;
