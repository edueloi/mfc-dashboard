
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  X, 
  UserCheck, 
  MapPin, 
  Shield, 
  Lock, 
  Save, 
  Heart, 
  Activity,
  ChevronDown,
  User as UserIcon,
  UserPlus,
  Stethoscope,
  Info,
  CalendarDays,
  Users,
  Baby,
  PersonStanding,
  UserRound,
  VenetianMask,
  PieChart as PieIcon,
  TrendingUp
} from 'lucide-react';
import { mockMembers, mockCities } from '../mockData';
import { MemberStatus, UserRoleType } from '../types';

interface MembersProps {
  onOpenMember: (id: string) => void;
}

const Members: React.FC<MembersProps> = ({ onOpenMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [showModal, setShowModal] = useState(false);
  
  const initialFormState = {
    // Dados Pessoais
    name: '',
    nickname: '',
    dob: '',
    rg: '',
    cpf: '',
    bloodType: 'O+',
    gender: 'Feminino',
    maritalStatus: 'Casado(a)',
    spouseName: '',
    spouseCpf: '',
    marriageDate: '',
    mfcDate: new Date().toISOString().split('T')[0],
    phone: '',
    emergencyPhone: '',
    // Endereço
    street: '',
    number: '',
    neighborhood: '',
    zip: '',
    complement: '',
    city: 'Tatuí',
    state: 'SP',
    condir: 'Sudeste',
    naturalness: '',
    // Saúde / Outros
    father: '',
    mother: '',
    smoker: false,
    mobilityIssue: '',
    healthPlan: '',
    diet: '',
    medication: '',
    allergy: '',
    pcd: false,
    pcdDescription: '',
    profession: '',
    religion: 'Católica',
    education: 'Superior completo',
    // Acesso
    createAccess: false,
    email: '',
    username: '',
    password: '',
    role: UserRoleType.USUARIO
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Cálculos Estatísticos
  const stats = useMemo(() => {
    const now = new Date();
    const totals = {
      total: mockMembers.length,
      male: 0,
      female: 0,
      children: 0, // 0-12
      youth: 0,    // 13-18
      adult: 0,    // 19-59
      elderly: 0,  // 60+
      active: 0
    };

    mockMembers.forEach(m => {
      if (m.gender === 'Masculino') totals.male++;
      else totals.female++;

      if (m.status === MemberStatus.ATIVO) totals.active++;

      const birthDate = new Date(m.dob);
      let age = now.getFullYear() - birthDate.getFullYear();
      const mDiff = now.getMonth() - birthDate.getMonth();
      if (mDiff < 0 || (mDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age <= 12) totals.children++;
      else if (age <= 18) totals.youth++;
      else if (age <= 59) totals.adult++;
      else totals.elderly++;
    });

    return totals;
  }, []);

  const filteredMembers = mockMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'Todos' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (saveAndNew: boolean) => {
    console.log('Salvando novo membro e usuário:', formData);
    if (saveAndNew) {
      setFormData(initialFormState);
    } else {
      setShowModal(false);
      setFormData(initialFormState);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'email' && (!prev.username || prev.username === prev.email.split('@')[0])) {
        newState.username = value.split('@')[0];
      }
      return newState;
    });
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
      {/* Page Header */}
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

      {/* DASHBOARD DE ESTATÍSTICAS - DESIGN SOFISTICADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card: Visão Geral Gênero */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
             <Users className="w-32 h-32 text-blue-900" />
          </div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Perfil por Gênero</h4>
          <div className="flex items-end gap-6">
             <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                   <span className="flex items-center gap-2 text-xs font-black text-pink-500"><VenetianMask className="w-3.5 h-3.5" /> Mulheres</span>
                   <span className="text-sm font-black text-gray-900">{stats.female}</span>
                </div>
                <div className="h-1.5 w-full bg-pink-50 rounded-full overflow-hidden">
                   <div className="h-full bg-pink-500 rounded-full" style={{width: `${(stats.female/stats.total)*100}%`}}></div>
                </div>
                <div className="flex items-center justify-between">
                   <span className="flex items-center gap-2 text-xs font-black text-blue-500"><UserRound className="w-3.5 h-3.5" /> Homens</span>
                   <span className="text-sm font-black text-gray-900">{stats.male}</span>
                </div>
                <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full" style={{width: `${(stats.male/stats.total)*100}%`}}></div>
                </div>
             </div>
          </div>
        </div>

        {/* Card: Faixas Etárias - Jovens/Crianças */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
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

        {/* Card: Faixas Etárias - Adultos/Idosos */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Experiência e Maturidade</h4>
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

        {/* Card: Saúde da Unidade */}
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
                   <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Membros Ativos</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center text-[10px] font-black text-white">
                   {Math.round((stats.active/stats.total)*100)}%
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..."
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <select 
            className="w-full bg-gray-50 border border-gray-50 rounded-2xl px-6 py-4 font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos Status</option>
            {Object.values(MemberStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Tabela de Membros */}
      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">MFCista</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contato</th>
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
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {member.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{member.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.city} - {member.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-5 whitespace-nowrap text-sm font-bold text-gray-600">{member.phone}</td>
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
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO MEMBRO */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-hidden">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] sm:rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-400 overflow-hidden border border-gray-100">
            
            <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-white z-20">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-50">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Novo MFCista</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Unidade: <span className="text-blue-600">{formData.city} - {formData.state}</span></p>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300 hover:text-gray-500 active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">1. Identificação Pessoal</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Nome Completo" field="name" className="sm:col-span-2" />
                    <InputField label="Apelido / Crachá" field="nickname" />
                    <InputField label="CPF" field="cpf" placeholder="000.000.000-00" />
                    <InputField label="Nascimento" field="dob" type="date" />
                    <SelectField label="Sexo" field="gender" options={['Feminino', 'Masculino', 'Outro']} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">2. Vínculo Familiar</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField label="Estado Civil" field="maritalStatus" options={['Casado(a)', 'Solteiro(a)', 'Divorciado(a)', 'Viúvo(a)']} className="sm:col-span-2" />
                    {formData.maritalStatus === 'Casado(a)' && (
                      <>
                        <InputField label="Cônjuge" field="spouseName" className="sm:col-span-2" />
                        <InputField label="Data Casamento" field="marriageDate" type="date" />
                      </>
                    )}
                    <InputField label="MFCista Desde" field="mfcDate" type="date" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">3. Localização & Contato</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputField label="Logradouro" field="street" className="sm:col-span-2" />
                    <InputField label="Nº" field="number" />
                    <InputField label="Bairro" field="neighborhood" />
                    <InputField label="CEP" field="zip" />
                    <SelectField label="Cidade" field="city" options={mockCities.map(c => c.name)} />
                    <InputField label="Contato" field="phone" className="sm:col-span-1" />
                    <InputField label="Emergência" field="emergencyPhone" className="sm:col-span-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">4. Saúde & Outros</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Profissão" field="profession" />
                    <SelectField label="Escolaridade" field="education" options={['Fundamental', 'Médio', 'Superior incompleto', 'Superior completo', 'Pós-graduação']} />
                    <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <input type="checkbox" id="pcd_modal_2" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-50" checked={formData.pcd} onChange={e => updateFormData('pcd', e.target.checked)} />
                      <label htmlFor="pcd_modal_2" className="text-[9px] font-black text-gray-400 uppercase tracking-widest cursor-pointer">Possui alguma deficiência (PCD)?</label>
                    </div>
                    {formData.pcd && <InputField label="Descrição PCD" field="pcdDescription" className="sm:col-span-2" />}
                  </div>
                </div>
              </div>

              <div className="bg-blue-600/5 border border-blue-600/10 rounded-2xl p-6 sm:p-7">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <h4 className="font-black text-blue-900 uppercase tracking-widest text-[10px]">Acesso ao Sistema</h4>
                    </div>
                    <p className="text-[10px] text-blue-700/70 font-medium leading-relaxed max-w-sm">
                      Deseja que este membro tenha acesso administrativo para gerenciar dados da unidade?
                    </p>
                    <label className="relative inline-flex items-center cursor-pointer mt-1 group">
                      <input type="checkbox" className="sr-only peer" checked={formData.createAccess} onChange={e => updateFormData('createAccess', e.target.checked)} />
                      <div className="w-9 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                      <span className="ml-3 text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Habilitar Login</span>
                    </label>
                  </div>

                  <div className="flex-[1.5] w-full">
                    {formData.createAccess ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <InputField label="E-mail Administrativo" field="email" type="email" />
                        <InputField label="Usuário de Login" field="username" />
                        <div className="sm:col-span-2">
                           <InputField label="Senha Temporária" field="password" type="text" placeholder="Senha sugerida..." />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-6 px-4 border border-dashed border-blue-200 rounded-2xl text-center bg-white/50">
                        <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest italic">Acesso administrativo desativado para este membro.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="px-8 py-5 bg-white border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3 z-20">
              <button onClick={() => setShowModal(false)} className="order-3 sm:order-1 px-5 py-2 text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors">Cancelar</button>
              <button 
                onClick={() => handleSave(true)}
                className="order-2 w-full sm:w-auto bg-gray-50 border border-gray-100 text-gray-500 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                Salvar e Criar Outro
              </button>
              <button 
                onClick={() => handleSave(false)}
                className="order-1 w-full sm:w-auto bg-blue-600 text-white px-10 py-2.5 rounded-xl font-black text-[10px] shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest"
              >
                <Save className="w-4 h-4" /> Salvar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
