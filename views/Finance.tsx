import React, { useMemo, useState } from 'react';
import {
  Users,
  Wallet,
  Search,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Printer,
  AlertCircle,
} from 'lucide-react';
import { mockCities, mockMembers, mockPayments, mockTeams } from '../mockData';
import { MemberStatus, Payment } from '../types';

interface FinanceViewProps {
  cityId: string;
}

const DEFAULT_PAYMENT_VALUE = 50;
const CURRENT_USER_ID = 'u1';

const FinanceView: React.FC<FinanceViewProps> = ({ cityId }) => {
  const [selectedMonth, setSelectedMonth] = useState('10/2023');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const cityName = useMemo(() => {
    const city = mockCities.find((item) => item.id === cityId);
    return city?.name ?? mockCities[0]?.name ?? '';
  }, [cityId]);

  const cityTeams = useMemo(
    () => mockTeams.filter((team) => team.city === cityName),
    [cityName],
  );

  const filteredTeams = useMemo(() => {
    if (!searchTerm.trim()) return cityTeams;
    return cityTeams.filter((team) => team.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [cityTeams, searchTerm]);

  const selectedTeamMembers = useMemo(() => {
    if (!selectedTeamId) return [];
    return mockMembers.filter((member) => member.teamId === selectedTeamId);
  }, [selectedTeamId]);

  const activeSelectedTeamMembers = useMemo(
    () => selectedTeamMembers.filter((member) => member.status !== MemberStatus.INATIVO),
    [selectedTeamMembers],
  );

  const monthlyPayments = useMemo(
    () => payments.filter((payment) => payment.referenceMonth === selectedMonth),
    [payments, selectedMonth],
  );

  const getPaymentForMember = (memberId: string) =>
    payments.find((payment) => payment.memberId === memberId && payment.referenceMonth === selectedMonth);

  const getTeamStats = (teamId: string) => {
    const teamMembers = mockMembers.filter(
      (member) => member.teamId === teamId && member.status !== MemberStatus.INATIVO,
    );
    const teamPayments = monthlyPayments.filter((payment) => payment.teamId === teamId);
    const paidCount = teamPayments.filter((payment) => payment.status === 'Pago').length;

    return {
      total: teamMembers.length,
      paid: paidCount,
      percent: teamMembers.length > 0 ? (paidCount / teamMembers.length) * 100 : 0,
    };
  };

  const financialSummary = useMemo(() => {
    const paidTotal = monthlyPayments
      .filter((payment) => payment.status === 'Pago')
      .reduce((total, payment) => total + payment.amount, 0);

    const pendingTotal = monthlyPayments
      .filter((payment) => payment.status === 'Pendente')
      .reduce((total, payment) => total + payment.amount, 0);

    const teamsInDay = cityTeams.filter((team) => {
      const stats = getTeamStats(team.id);
      return stats.total > 0 && stats.total === stats.paid;
    }).length;

    const totalActiveMembers = mockMembers.filter(
      (member) => member.city === cityName && member.status !== MemberStatus.INATIVO,
    ).length;

    const paidMembers = monthlyPayments.filter((payment) => payment.status === 'Pago').length;

    return {
      paidTotal,
      pendingTotal,
      teamsInDay,
      totalTeams: cityTeams.length,
      paidMembers,
      totalActiveMembers,
    };
  }, [monthlyPayments, cityTeams, cityName]);

  const createOrUpdatePayment = (memberId: string, teamId: string, status: Payment['status']) => {
    const currentDate = new Date().toISOString().split('T')[0];

    setPayments((previous) => {
      const existingPayment = previous.find(
        (payment) => payment.memberId === memberId && payment.referenceMonth === selectedMonth,
      );

      if (!existingPayment) {
        return [
          ...previous,
          {
            id: `p-${memberId}-${selectedMonth.replace('/', '-')}`,
            memberId,
            teamId,
            amount: DEFAULT_PAYMENT_VALUE,
            date: status === 'Pago' ? currentDate : '',
            referenceMonth: selectedMonth,
            status,
            launchedBy: CURRENT_USER_ID,
          },
        ];
      }

      return previous.map((payment) => {
        if (payment.id !== existingPayment.id) return payment;
        return {
          ...payment,
          status,
          date: status === 'Pago' ? currentDate : '',
        };
      });
    });
  };

  const handleConfirmPayment = (memberId: string, teamId: string) => {
    createOrUpdatePayment(memberId, teamId, 'Pago');
    setFeedbackMessage('Pagamento confirmado com sucesso.');
  };

  const handleReversePayment = (memberId: string, teamId: string) => {
    createOrUpdatePayment(memberId, teamId, 'Pendente');
    setFeedbackMessage('Pagamento estornado e marcado como pendente.');
  };

  const handleLaunchBatch = () => {
    if (!selectedTeamId) return;

    let changesCount = 0;

    activeSelectedTeamMembers.forEach((member) => {
      const existingPayment = getPaymentForMember(member.id);
      if (!existingPayment || existingPayment.status !== 'Pago') {
        createOrUpdatePayment(member.id, selectedTeamId, 'Pago');
        changesCount += 1;
      }
    });

    if (changesCount === 0) {
      setFeedbackMessage('Nenhuma alteração: todos os membros ativos já estavam pagos neste mês.');
      return;
    }

    setFeedbackMessage(`Lançamento em lote concluído: ${changesCount} pagamento(s) atualizado(s).`);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  const renderTeamList = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider">
              Ref: {selectedMonth}
            </span>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Arrecadado</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(financialSummary.paidTotal)}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-wider">
              {financialSummary.totalActiveMembers > 0
                ? `${Math.round((financialSummary.paidMembers / financialSummary.totalActiveMembers) * 100)}% da Meta`
                : 'Sem Meta'}
            </span>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Pendente Geral</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(financialSummary.pendingTotal)}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase tracking-wider">
              {cityName}
            </span>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Equipes em Dia</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {financialSummary.teamsInDay} / {financialSummary.totalTeams}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-800">Status das Equipes Base</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar equipe..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredTeams.map((team) => {
            const stats = getTeamStats(team.id);
            return (
              <div
                key={team.id}
                onClick={() => {
                  setSelectedTeamId(team.id);
                  setFeedbackMessage(null);
                }}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-blue-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                      stats.percent === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {team.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{team.name}</h4>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" /> {stats.total} Membros ativos
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:px-12 flex-1 max-w-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1.5">
                    <span>Arrecadação</span>
                    <span>
                      {stats.paid} / {stats.total}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stats.percent === 100
                          ? 'bg-green-500'
                          : stats.percent > 50
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                      }`}
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center gap-6">
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        stats.percent === 100 ? 'text-green-600' : 'text-amber-600'
                      }`}
                    >
                      {stats.percent === 100 ? 'EM DIA' : 'PENDENTE'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      FECHAMENTO: 25/{selectedMonth.split('/')[0]}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-all" />
                </div>
              </div>
            );
          })}

          {filteredTeams.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500 font-medium">
              Nenhuma equipe encontrada para o filtro informado.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTeamDetail = () => {
    const team = mockTeams.find((item) => item.id === selectedTeamId);

    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <button
          onClick={() => {
            setSelectedTeamId(null);
            setFeedbackMessage(null);
          }}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para lista de equipes
        </button>

        {feedbackMessage && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 flex items-center gap-3 text-blue-700 text-sm font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{team?.name}</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg uppercase">
                Equipe Base
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              Lançamentos referentes ao mês de <strong>{selectedMonth}</strong>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLaunchBatch}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Lançar Lote Completo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">MFCista</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Status Pagamento
                </th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Data Lançamento</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Valor</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {selectedTeamMembers.map((member) => {
                const payment = getPaymentForMember(member.id);
                const memberInactive = member.status === MemberStatus.INATIVO;

                return (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                          {member.name.substring(0, 1)}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-800 block">{member.name}</span>
                          {memberInactive && (
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">
                              Inativo (fora do lote)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {payment?.status === 'Pago' ? (
                          <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase tracking-tight">
                            <CheckCircle2 className="w-4 h-4" /> Pago
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-tight">
                            <Clock className="w-4 h-4" /> Pendente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">{payment?.date || '---'}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-900">
                      {formatCurrency(payment?.amount ?? DEFAULT_PAYMENT_VALUE)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {payment?.status === 'Pago' ? (
                        <button
                          disabled={memberInactive}
                          onClick={() => handleReversePayment(member.id, member.teamId || selectedTeamId || '')}
                          className="text-[10px] font-bold text-gray-400 uppercase hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Estornar
                        </button>
                      ) : (
                        <button
                          disabled={memberInactive}
                          onClick={() => handleConfirmPayment(member.id, member.teamId || selectedTeamId || '')}
                          className="bg-green-50 text-green-700 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-green-100 transition-all border border-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirmar Pago
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Tesouraria Geral</h2>
          <p className="text-gray-500 font-medium">Gestão financeira de todas as Equipes Bases.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <Calendar className="w-5 h-5 text-gray-400 ml-2" />
          <select
            className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer"
            value={selectedMonth}
            onChange={(event) => {
              setSelectedMonth(event.target.value);
              setFeedbackMessage(null);
            }}
          >
            <option value="10/2023">Outubro / 2023</option>
            <option value="09/2023">Setembro / 2023</option>
            <option value="08/2023">Agosto / 2023</option>
          </select>
        </div>
      </div>

      {selectedTeamId ? renderTeamDetail() : renderTeamList()}
    </div>
  );
};

export default FinanceView;
