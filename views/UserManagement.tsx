
import React, { useState, useMemo, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Shield, 
  X, 
  Check, 
  Key, 
  Mail, 
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  Save,
  Trash2,
  Edit,
  Users as UsersIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import Grid from '../components/Grid';
import FilterBar from '../components/FilterBar';
import { api } from '../services/api';
import { UserRoleType, User as UserType, Member, City } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'mfcista'>('mfcista');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: UserRoleType.USUARIO,
    cityId: '1'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, membersData, citiesData] = await Promise.all([
          api.getUsers(),
          api.getMembers(),
          api.getCities()
        ]);
        setUsers(usersData);
        setMembers(membersData);
        setCities(citiesData);
      } catch (err) {
        console.error('Failed to fetch user management data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleLinkMember = (member: Member) => {
    setFormData({
      ...formData,
      name: member.name,
      email: '', // Members don't have email in types yet, but we could add it
      username: member.nickname?.toLowerCase().replace(/\s/g, '') || member.name.split(' ')[0].toLowerCase()
    });
    setActiveTab('manual');
  };

  const handleSave = async () => {
    if (!formData.username || !formData.name) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    try {
      const newUser = await api.createUser({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        role: formData.role,
        cityId: formData.cityId
      });

      setUsers([newUser, ...users]);
      setShowModal(false);
      setFormData({ name: '', email: '', username: '', password: '', role: UserRoleType.USUARIO, cityId: '1' });
    } catch (err) {
      console.error('Failed to save user', err);
      alert('Erro ao salvar usuário');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Usuários do Sistema</h2>
          <p className="text-gray-500 font-medium">Gerencie quem pode acessar e administrar a plataforma.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4"
        >
          <UserPlus className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
          Novo Usuário
        </Button>
      </div>

      <FilterBar
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        onClear={() => setSearchTerm('')}
      />

      <Grid<UserType>
        data={filteredUsers}
        isLoading={loading}
        columns={[
          {
            header: 'Identificação',
            accessor: (user) => (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black uppercase shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {user.name.substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold tracking-tight">@{user.username} • {user.email || 'Sem e-mail'}</p>
                </div>
              </div>
            )
          },
          {
            header: 'Nível de Acesso',
            accessor: (user) => (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-lg w-fit">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                {user.role}
              </div>
            )
          },
          {
            header: 'Unidade / Cidade',
            accessor: (user) => (
              <span className="text-sm font-bold text-gray-500">
                {cities.find(c => c.id === user.cityId)?.name || 'Tatuí'} - SP
              </span>
            )
          },
          {
            header: 'Status',
            className: 'text-center',
            accessor: () => (
              <span className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700 rounded-xl shadow-sm">Ativo</span>
            )
          },
          {
            header: '',
            className: 'text-right',
            accessor: () => (
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                <button className="p-2 text-gray-300 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
              </div>
            )
          }
        ]}
      />

      {/* MODAL NOVO USUÁRIO */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Acesso"
        size="md"
      >
        <div className="space-y-8">
          <div className="flex bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setActiveTab('mfcista')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'mfcista' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <UsersIcon className="w-4 h-4" /> Vincular MFCista
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Edit className="w-4 h-4" /> Cadastro Direto
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === 'mfcista' ? (
              <div className="space-y-4 animate-in fade-in duration-400">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-4 mb-6">
                  <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                  <p className="text-[10px] text-blue-700 font-black leading-relaxed uppercase">
                    Selecione um membro da lista para criar seu acesso automaticamente. Isso evita erros de digitação e mantém os dados integrados.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                  {members.map(member => (
                    <button 
                      key={member.id}
                      onClick={() => handleLinkMember(member)}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-50 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xs font-black text-blue-600 uppercase shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {member.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none mb-1">{member.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.phone}</p>
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-transparent group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-400">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Ex: João da Silva"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type="email" 
                        placeholder="exemplo@mfc.org"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Usuário (Username)</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs">@</span>
                      <input 
                        type="text" 
                        placeholder="joao.silva"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Senha de Acesso</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nível de Acesso</label>
                    <Dropdown
                      value={formData.role}
                      onChange={(val) => setFormData({...formData, role: val as UserRoleType})}
                      options={Object.values(UserRoleType).map(role => ({ value: role, label: role }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
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
              disabled={activeTab === 'mfcista'}
              className="w-full sm:w-auto"
            >
              <Save className="w-5 h-5 mr-2" /> Salvar Usuário
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
