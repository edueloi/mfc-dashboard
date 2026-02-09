
import React, { useState, useMemo } from 'react';
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
  Trash2
} from 'lucide-react';
import { mockMembers, mockCities } from '../mockData';
import { MemberStatus, UserRoleType, Member } from '../types';

interface MembersProps {
  onOpenMember: (id: string) => void;
}

const Members: React.FC<MembersProps> = ({ onOpenMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [genderFilter, setGenderFilter] = useState<string>('Todos');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('Todos');
  const [mfcTimeFilter, setMfcTimeFilter] = useState<string>('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const initialFormState = {
    name: '', nickname: '', dob: '', rg: '', cpf: '', bloodType: 'O+', gender: 'Feminino',
    maritalStatus: 'Casado(a)', spouseName: '', spouseCpf: '', marriageDate: '',
    mfcDate: new Date().toISOString().split('T')[0], phone: '', emergencyPhone: '',
    street: '', number: '', neighborhood: '', zip: '', complement: '', city: 'Tatuí',
    state: 'SP', condir: 'Sudeste', naturalness: '', father: '', mother: '',
    smoker: false, mobilityIssue: '', healthPlan: '', diet: '', medication: '',
    allergy: '', pcd: false, pcdDescription: '', profession: '', religion: 'Católica',
    education: 'Superior completo', createAccess: false, email: '', username: '',
    password: '', role: UserRoleType.USUARIO
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Helper para cálculos de idade e tempo de MFC
  const calculateYears = (dateString: string) => {
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
    const totals = { total: mockMembers.length, male: 0, female: 0, children: 0, youth: 0, adult: 0, elderly: 0, active: 0 };
    mockMembers.forEach(m => {
      if (m.gender === 'Masculino') totals.male++; else totals.female++;
      if (m.status === MemberStatus.ATIVO) totals.active++;
      const age = calculateYears(m.dob);
      if (age <= 12) totals.children++;
      else if (age <= 18) totals.youth++;
      else if (age <= 59) totals.adult++;
      else totals.elderly++;
    });
    return totals;
  }, []);

  // Lógica de Filtragem Principal
  const filteredMembers = useMemo(() => {
    return mockMembers.filter(m => {
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
  }, [searchTerm, statusFilter, genderFilter, ageGroupFilter, mfcTimeFilter]);

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

  const handleSave = (saveAndNew: boolean) => {
    if (saveAndNew) setFormData(initialFormState);
    else { setShowModal(false); setFormData(initialFormState); }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const InputField = ({ label, field, type = 'text', placeholder = '', className = '' }: any) => (
    <div className={className}>
      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 transition-all outline-none" 
        value={(formData as any)[field]} 
        onChange={e => updateFormData(field, e.target.value)} 
      />
    </div>
  );

  const SelectField = ({ label, field, options, className = '' }: any) => (
    <div className={className}>
      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">{label}</label>
      <div className="relative">
        <select 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 transition-all outline-none appearance-none"
          value={(formData as any)[field]}
          onChange={e => updateFormData(field, e.target.value)}
        >
          {options.map((opt: any) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Comunidade MFC</h2>
          <p className="text-gray-500 font-medium">Gestão demográfica e administrativa de MFCistas.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Novo MFCista
        </button>
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
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500">
        <div className="p-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou telefone..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border ${showFilters ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
            >
              <FilterIcon className="w-4 h-4" />
              Filtros Avançados
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-[9px] animate-in zoom-in">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button 
                onClick={resetFilters}
                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                title="Limpar Filtros"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Gaveta de Filtros */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pb-8 border-t border-gray-50 transition-all duration-500 ${showFilters ? 'max-h-96 opacity-100 py-8' : 'max-h-0 opacity-0 py-0 invisible'}`}>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Shield className="w-3 h-3" /> Status do Membro
            </label>
            <select 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos os Status</option>
              {Object.values(MemberStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <UserRound className="w-3 h-3" /> Gênero
            </label>
            <select 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="Todos">Todos Gêneros</option>
              <option value="Masculino">Homens</option>
              <option value="Feminino">Mulheres</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Baby className="w-3 h-3" /> Faixa Etária
            </label>
            <select 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
            >
              <option value="Todos">Todas as Idades</option>
              <option value="Criança">Crianças (0-12)</option>
              <option value="Jovem">Jovens (13-18)</option>
              <option value="Adulto">Adultos (19-59)</option>
              <option value="Idoso">Idosos (60+)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Tempo de MFC
            </label>
            <select 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-gray-600 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
              value={mfcTimeFilter}
              onChange={(e) => setMfcTimeFilter(e.target.value)}
            >
              <option value="Todos">Qualquer Tempo</option>
              <option value="0-5">Novatos (0-5 anos)</option>
              <option value="5-10">Integrados (5-10 anos)</option>
              <option value="10-25">Experientes (10-25 anos)</option>
              <option value="25+">Veteranos (25+ anos)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Membros */}
      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">MFCista</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Dados MFC</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Idade</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMembers.map((member) => (
                <tr 
                  key={member.id} 
                  className="hover:bg-blue-50/20 transition-all cursor-pointer group"
                  onClick={() => onOpenMember(member.id)}
                >
                  <td className="px-10 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all shadow-inner ${member.gender === 'Masculino' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white'}`}>
                        {member.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{member.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 mb-1">
                       <Clock className="w-3.5 h-3.5 text-blue-500" />
                       <span className="text-sm font-bold text-gray-700">{calculateYears(member.mfcDate)} anos</span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic">Desde {new Date(member.mfcDate).getFullYear()}</p>
                  </td>
                  <td className="px-10 py-5 whitespace-nowrap text-center">
                    <p className="text-sm font-black text-gray-900">{calculateYears(member.dob)} anos</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{member.gender === 'Masculino' ? 'Masculino' : 'Feminino'}</p>
                  </td>
                  <td className="px-10 py-5 whitespace-nowrap text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight shadow-sm ${
                      member.status === MemberStatus.ATIVO ? 'bg-green-100 text-green-700' : 
                      member.status === MemberStatus.AGUARDANDO ? 'bg-amber-100 text-amber-700' : 
                      'bg-gray-100 text-gray-600'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-10 py-5 whitespace-nowrap text-right">
                    <button className="p-2 text-gray-300 hover:text-blue-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                        <Users className="w-8 h-8 text-gray-200" />
                      </div>
                      <p className="text-sm font-black text-gray-300 uppercase tracking-widest">Nenhum MFCista encontrado com estes filtros.</p>
                      <button onClick={resetFilters} className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">Limpar Filtros</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Membro (Existente) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-hidden">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] sm:rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-400 overflow-hidden border border-gray-100">
            <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-white z-20">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-50"><UserPlus className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Novo MFCista</h3>
                  <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-blue-500" /><p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Unidade: <span className="text-blue-600">{formData.city} - {formData.state}</span></p></div>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300 hover:text-gray-500 active:scale-90"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 no-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2"><div className="w-1 h-4 bg-blue-600 rounded-full"></div><h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">1. Identificação Pessoal</h4></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Nome Completo" field="name" className="sm:col-span-2" />
                    <InputField label="Apelido / Crachá" field="nickname" />
                    <InputField label="CPF" field="cpf" />
                    <InputField label="Nascimento" field="dob" type="date" />
                    <SelectField label="Sexo" field="gender" options={['Feminino', 'Masculino', 'Outro']} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2"><div className="w-1 h-4 bg-red-500 rounded-full"></div><h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">2. Vínculo Familiar</h4></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField label="Estado Civil" field="maritalStatus" options={['Casado(a)', 'Solteiro(a)', 'Divorciado(a)', 'Viúvo(a)']} className="sm:col-span-2" />
                    {formData.maritalStatus === 'Casado(a)' && <><InputField label="Cônjuge" field="spouseName" className="sm:col-span-2" /><InputField label="Data Casamento" field="marriageDate" type="date" /></>}
                    <InputField label="MFCista Desde" field="mfcDate" type="date" />
                  </div>
                </div>
               </div>
            </div>
            <div className="px-8 py-5 bg-white border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3 z-20">
              <button onClick={() => setShowModal(false)} className="order-3 sm:order-1 px-5 py-2 text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Cancelar</button>
              <button onClick={() => handleSave(true)} className="order-2 w-full sm:w-auto bg-gray-50 border border-gray-100 text-gray-500 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">Salvar e Criar Outro</button>
              <button onClick={() => handleSave(false)} className="order-1 w-full sm:w-auto bg-blue-600 text-white px-10 py-2.5 rounded-xl font-black text-[10px] shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest"><Save className="w-4 h-4" /> Salvar Cadastro</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
