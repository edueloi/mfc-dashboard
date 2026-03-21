
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter as FilterIcon, 
  Plus, 
  MoreVertical, 
  X, 
  MapPin, 
  Shield, 
  Save, 
  Heart, 
  ChevronDown,
  UserPlus,
  Users,
  Baby,
  PersonStanding,
  UserRound,
  VenetianMask,
  PieChart as PieIcon,
  TrendingUp,
  Clock,
  Trash2,
  Edit3,
  ChevronRight
} from 'lucide-react';
import Grid from '../components/Grid';
import FilterBar from '../components/FilterBar';
import DateInput from '../components/DateInput';
import BooleanInput from '../components/BooleanInput';
import { api } from '../services/api';
import { MemberStatus, UserRoleType, Member } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';
import MemberFormModal from '../components/MemberFormModal';

interface MembersProps {
  onOpenMember: (id: string) => void;
}

const Members: React.FC<MembersProps> = ({ onOpenMember }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [genderFilter, setGenderFilter] = useState<string>('Todos');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('Todos');
  const [mfcTimeFilter, setMfcTimeFilter] = useState<string>('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await api.getMembers();
        setMembers(data);
      } catch (err) {
        console.error('Failed to fetch members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);
  
  // Helper para cálculos de idade e tempo de MFC
  const calculateYears = (dateString: string) => {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    return years;
  };

  // Cálculos Estatísticos (Baseados no total da unidade)
  const stats = useMemo(() => {
    const totals = { total: members.length, male: 0, female: 0, children: 0, youth: 0, adult: 0, elderly: 0, active: 0 };
    members.forEach(m => {
      if (m.gender === 'Masculino') totals.male++; else totals.female++;
      if (m.status === MemberStatus.ATIVO) totals.active++;
      const age = calculateYears(m.dob);
      if (age <= 12) totals.children++;
      else if (age <= 18) totals.youth++;
      else if (age <= 59) totals.adult++;
      else totals.elderly++;
    });
    return totals;
  }, [members]);

  // Lógica de Filtragem Principal
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Busca por texto
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm);
      
      // Filtro de Status
      const matchesStatus = statusFilter === 'Todos' || m.status === statusFilter;
      
      // Filtro de Gênero
      const matchesGender = genderFilter === 'Todos' || m.gender === genderFilter;
      
      // Filtro de Faixa Etária
      const age = calculateYears(m.dob);
      let group = 'Adulto';
      if (age <= 12) group = 'Criança';
      else if (age <= 18) group = 'Jovem';
      else if (age >= 60) group = 'Idoso';
      const matchesAgeGroup = ageGroupFilter === 'Todos' || group === ageGroupFilter;
      
      // Filtro de Tempo de MFC
      const yearsMfc = calculateYears(m.mfcDate);
      let timeRange = '0-5';
      if (yearsMfc > 25) timeRange = '25+';
      else if (yearsMfc > 10) timeRange = '10-25';
      else if (yearsMfc > 5) timeRange = '5-10';
      const matchesMfcTime = mfcTimeFilter === 'Todos' || timeRange === mfcTimeFilter;

      return matchesSearch && matchesStatus && matchesGender && matchesAgeGroup && matchesMfcTime;
    });
  }, [members, searchTerm, statusFilter, genderFilter, ageGroupFilter, mfcTimeFilter]);

  const activeFiltersCount = [
    statusFilter !== 'Todos',
    genderFilter !== 'Todos',
    ageGroupFilter !== 'Todos',
    mfcTimeFilter !== 'Todos'
  ].filter(Boolean).length;

  const resetFilters = () => {
    setStatusFilter('Todos');
    setGenderFilter('Todos');
    setAgeGroupFilter('Todos');
    setMfcTimeFilter('Todos');
    setSearchTerm('');
  };

  const handleMemberCreated = (member: Member) => {
    if (memberToEdit) {
      setMembers(prev => prev.map(m => m.id === member.id ? member : m));
    } else {
      setMembers(prev => [...prev, member]);
    }
  };

  const handleEditMember = (member: Member) => {
    setMemberToEdit(member);
    setShowModal(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este membro?')) return;
    try {
      await api.deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete member', err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Comunidade MFC</h2>
          <p className="text-gray-500 font-medium">Gestão demográfica e administrativa de MFCistas.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          size="lg"
          className="shadow-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo MFCista
        </Button>
      </div>

      {/* Estatísticas (Fixo para a Unidade) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Perfil por Gênero</h4>
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black text-pink-500"><VenetianMask className="w-3.5 h-3.5" /> Mulheres</span>
                <span className="text-sm font-black text-gray-900">{stats.female}</span>
             </div>
             <div className="h-1.5 w-full bg-pink-50 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500" style={{width: `${(stats.female/stats.total)*100}%`}}></div>
             </div>
             <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black text-blue-500"><UserRound className="w-3.5 h-3.5" /> Homens</span>
                <span className="text-sm font-black text-gray-900">{stats.male}</span>
             </div>
             <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{width: `${(stats.male/stats.total)*100}%`}}></div>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Base da Pirâmide</h4>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-amber-50 rounded-3xl border border-amber-100/50">
                <Baby className="w-5 h-5 text-amber-600 mb-2" />
                <p className="text-2xl font-black text-amber-700">{stats.children}</p>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Crianças</p>
             </div>
             <div className="p-4 bg-indigo-50 rounded-3xl border border-indigo-100/50">
                <TrendingUp className="w-5 h-5 text-indigo-600 mb-2" />
                <p className="text-2xl font-black text-indigo-700">{stats.youth}</p>
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Jovens</p>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Experiência</h4>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-100/50">
                <UserRound className="w-5 h-5 text-emerald-600 mb-2" />
                <p className="text-2xl font-black text-emerald-700">{stats.adult}</p>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Adultos</p>
             </div>
             <div className="p-4 bg-rose-50 rounded-3xl border border-rose-100/50">
                <PersonStanding className="w-5 h-5 text-rose-600 mb-2" />
                <p className="text-2xl font-black text-rose-700">{stats.elderly}</p>
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Idosos</p>
             </div>
          </div>
        </div>

        <div className="bg-blue-600 p-6 rounded-[2.5rem] shadow-2xl shadow-blue-100 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
             <PieIcon className="w-32 h-32 text-white" />
          </div>
          <h4 className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-6">Status da Unidade</h4>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-white">{stats.total}</span>
                <span className="text-xs font-bold text-blue-100 bg-white/10 px-3 py-1 rounded-full">Total Membros</span>
             </div>
             <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                   <p className="text-xl font-black text-white">{stats.active}</p>
                   <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Ativos</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center text-[10px] font-black text-white">
                   {Math.round((stats.active/stats.total)*100)}%
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Painel de Filtros Avançados */}
      <FilterBar
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        onClear={() => setSearchTerm('')}
      >
        <Dropdown
          options={[
            { label: 'Todos os Status', value: 'Todos' },
            ...Object.values(MemberStatus).map(s => ({ label: s, value: s }))
          ]}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as string)}
          className="w-44"
        />
        <Dropdown
          options={[
            { label: 'Todos Gêneros', value: 'Todos' },
            { label: 'Homens', value: 'Masculino' },
            { label: 'Mulheres', value: 'Feminino' }
          ]}
          value={genderFilter}
          onChange={(val) => setGenderFilter(val as string)}
          className="w-40"
        />
        <Dropdown
          options={[
            { label: 'Todas as Idades', value: 'Todos' },
            { label: 'Crianças (0-12)', value: 'Criança' },
            { label: 'Jovens (13-18)', value: 'Jovem' },
            { label: 'Adultos (19-59)', value: 'Adulto' },
            { label: 'Idosos (60+)', value: 'Idoso' }
          ]}
          value={ageGroupFilter}
          onChange={(val) => setAgeGroupFilter(val as string)}
          className="w-44"
        />
      </FilterBar>

      {/* Tabela de Membros */}
      <Grid<Member>
        data={filteredMembers}
        isLoading={loading}
        onRowClick={(member) => onOpenMember(member.id)}
        columns={[
          {
            header: 'MFCista',
            accessor: (member) => (
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all shadow-inner ${member.gender === 'Masculino' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                  {member.name.substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{member.name}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.phone}</p>
                </div>
              </div>
            )
          },
          {
            header: 'Dados MFC',
            accessor: (member) => (
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <Clock className="w-3.5 h-3.5 text-blue-500" />
                   <span className="text-sm font-bold text-gray-700">{calculateYears(member.mfcDate)} anos</span>
                </div>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic">Desde {new Date(member.mfcDate).getFullYear()}</p>
              </div>
            )
          },
          {
            header: 'Idade',
            className: 'text-center',
            accessor: (member) => (
              <div>
                <p className="text-sm font-black text-gray-900">{calculateYears(member.dob)} anos</p>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{member.gender === 'Masculino' ? 'Masculino' : 'Feminino'}</p>
              </div>
            )
          },
          {
            header: 'Status',
            className: 'text-center',
            accessor: (member) => (
              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight shadow-sm ${
                member.status === MemberStatus.ATIVO ? 'bg-green-100 text-green-700' : 
                member.status === MemberStatus.AGUARDANDO ? 'bg-amber-100 text-amber-700' : 
                'bg-gray-100 text-gray-600'}`}>
                {member.status}
              </span>
            )
          },
          {
            header: '',
            className: 'text-right',
            accessor: (member) => (
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleEditMember(member); }}
                  className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteMember(member.id); }}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            )
          }
        ]}
      />

      {/* Modal Novo Membro */}
      <MemberFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setMemberToEdit(null);
        }}
        onMemberCreated={handleMemberCreated}
        memberToEdit={memberToEdit}
      />
    </div>
  );
};

export default Members;
