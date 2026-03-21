
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Wallet, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Printer,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { MemberStatus, BaseTeam, Member, Payment } from '../types';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Grid from '../components/Grid';

interface FinanceViewProps {
  cityId: string;
}

const FinanceView: React.FC<FinanceViewProps> = ({ cityId }) => {
  const [teams, setTeams] = useState<BaseTeam[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('10/2023');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsData, membersData, paymentsData] = await Promise.all([
          api.getTeams(),
          api.getMembers(),
          api.getPayments()
        ]);
        setTeams(teamsData);
        setMembers(membersData);
        setPayments(paymentsData);
      } catch (err) {
        console.error('Failed to fetch finance data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTeamStats = (teamId: string) => {
    const teamMembers = members.filter(m => m.teamId === teamId);
    const teamPayments = payments.filter(p => p.teamId === teamId && p.referenceMonth === selectedMonth);
    const paidCount = teamPayments.filter(p => p.status === 'Pago').length;
    return {
      total: teamMembers.length,
      paid: paidCount,
      percent: teamMembers.length > 0 ? (paidCount / teamMembers.length) * 100 : 0
    };
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  const renderTeamList = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><Wallet className="w-6 h-6" /></div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-blue-100/50">Ref: {selectedMonth}</span>
          </div>
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Arrecadado</h3>
          <p className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">R$ 4.250,00</p>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shadow-sm"><Clock className="w-6 h-6" /></div>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-amber-100/50">85% da Meta</span>
          </div>
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Pendente Geral</h3>
          <p className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">R$ 750,00</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm"><CheckCircle2 className="w-6 h-6" /></div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100/50">Tatuí</span>
          </div>
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Equipes em Dia</h3>
          <p className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">12 / 15</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Status das Equipes Base</h3>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar equipe..." 
                className="pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-600 transition-all w-full sm:w-72 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {teams.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(team => {
            const stats = getTeamStats(team.id);
            return (
              <div 
                key={team.id} 
                onClick={() => setSelectedTeamId(team.id)}
                className="p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-blue-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${stats.percent === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {team.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 group-hover:text-blue-700 transition-colors tracking-tight">{team.name}</h4>
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5 mt-1">
                      <Users className="w-3.5 h-3.5" /> {team.memberCount} Membros
                    </p>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 md:px-12 flex-1 max-w-sm">
                  <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    <span>Arrecadação</span>
                    <span className="text-gray-600">{stats.paid} / {stats.total}</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-700 rounded-full ${stats.percent === 100 ? 'bg-emerald-500' : stats.percent > 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 md:mt-0 flex items-center gap-8">
                  <div className="text-right">
                    <p className={`text-xs font-black tracking-widest uppercase ${stats.percent === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {stats.percent === 100 ? 'EM DIA' : 'PENDENTE'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">FECHAMENTO: 25/{selectedMonth.split('/')[0]}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTeamDetail = () => {
    const team = teams.find(t => t.id === selectedTeamId);
    const teamMembers = members.filter(m => m.teamId === selectedTeamId);
    
    const gridData = teamMembers.map(member => {
      const payment = payments.find(p => p.memberId === member.id && p.referenceMonth === selectedMonth);
      return {
        ...member,
        paymentStatus: payment?.status || 'Pendente',
        paymentDate: payment?.date || '---',
        paymentAmount: 'R$ 50,00',
        paymentId: payment?.id
      };
    });

    const columns = [
      {
        header: 'MFCista',
        accessor: (row: any) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black uppercase">
              {row.name.substring(0, 1)}
            </div>
            <span className="text-xs font-black text-gray-900 tracking-tight">{row.name}</span>
          </div>
        )
      },
      {
        header: 'Status Pagamento',
        accessor: (row: any) => (
          <div className="flex items-center gap-2">
            {row.paymentStatus === 'Pago' ? (
              <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100/50">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pago
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg border border-amber-100/50">
                <Clock className="w-3.5 h-3.5" /> Pendente
              </span>
            )}
          </div>
        )
      },
      {
        header: 'Data Lançamento',
        accessor: (row: any) => <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{row.paymentDate}</span>
      },
      {
        header: 'Valor',
        accessor: (row: any) => <span className="text-[11px] font-black text-gray-900 tracking-tight">{row.paymentAmount}</span>
      },
      {
        header: 'Ação',
        className: 'text-right',
        accessor: (row: any) => (
          <div className="flex justify-end gap-2">
            {row.paymentStatus === 'Pago' ? (
              <Button variant="ghost" size="sm" className="text-[9px] text-gray-400 hover:text-red-500 font-black tracking-widest">
                ESTORNAR
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 text-[9px] font-black tracking-widest">
                CONFIRMAR PAGO
              </Button>
            )}
          </div>
        )
      }
    ];

    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTeamId(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> VOLTAR PARA LISTA
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Equipe Selecionada:</span>
            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-xl uppercase tracking-widest border border-blue-100/50 shadow-sm">{team?.name}</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{team?.name}</h2>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Lançamentos referentes a {selectedMonth}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
               <Button variant="primary" size="md" onClick={() => {}} className="shadow-xl shadow-blue-100">
                 Lançar Lote Completo
               </Button>
               <Button variant="outline" size="md" onClick={() => {}} className="bg-white border-gray-200 text-gray-600">
                 Exportar PDF
               </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Lista de Membros</h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" /> {teamMembers.length} MFCistas
            </div>
          </div>
          <div className="p-2">
            <Grid<any>
              data={gridData}
              columns={columns}
              onRowClick={() => {}}
            />
          </div>
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
           <Dropdown
             value={selectedMonth}
             onChange={setSelectedMonth}
             options={[
               { value: '10/2023', label: 'Outubro / 2023' },
               { value: '09/2023', label: 'Setembro / 2023' },
               { value: '08/2023', label: 'Agosto / 2023' },
             ]}
             variant="ghost"
             className="border-none shadow-none font-bold text-gray-700"
           />
        </div>
      </div>

      {selectedTeamId ? renderTeamDetail() : renderTeamList()}
    </div>
  );
};

export default FinanceView;
