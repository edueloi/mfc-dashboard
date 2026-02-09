
import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Plus, 
  Trash2, 
  Search, 
  Lock, 
  Globe, 
  Settings as SettingsIcon, 
  Filter, 
  X, 
  Building2, 
  Save, 
  ChevronDown,
  Calendar,
  Gift,
  AlertTriangle,
  Users,
  Layers,
  Power,
  Edit3,
  Clock,
  History
} from 'lucide-react';
import { mockCities as initialCities, mockMembers, mockTeams } from '../mockData';
import { UserRoleType, ModuleAction, City } from '../types';

const BRAZILIAN_STATES = [
  { uf: 'AC', name: 'Acre' }, { uf: 'AL', name: 'Alagoas' }, { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' }, { uf: 'ES', name: 'Espírito Santo' }, { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' }, { uf: 'MT', name: 'Mato Grosso' }, { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' }, { uf: 'PA', name: 'Pará' }, { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' }, { uf: 'PE', name: 'Pernambuco' }, { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' }, { uf: 'RN', name: 'Rio Grande do Norte' }, { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' }, { uf: 'RR', name: 'Roraima' }, { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' }, { uf: 'SE', name: 'Sergipe' }, { uf: 'TO', name: 'Tocantins' }
];

interface SettingsViewProps {
  initialTab: 'permissoes' | 'cidades';
}

const SettingsView: React.FC<SettingsViewProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState<City[]>(initialCities);
  
  // Modais
  const [showCityModal, setShowCityModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados de formulário
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [newCity, setNewCity] = useState({ name: '', uf: 'SP', mfcSince: new Date().toISOString().split('T')[0] });
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(citySearch.toLowerCase()) || 
    c.uf.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingCityId(null);
    setNewCity({ name: '', uf: 'SP', mfcSince: new Date().toISOString().split('T')[0] });
    setShowCityModal(true);
  };

  const handleOpenEditModal = (city: City) => {
    setEditingCityId(city.id);
    setNewCity({ name: city.name, uf: city.uf, mfcSince: city.mfcSince || '' });
    setShowCityModal(true);
  };

  const handleSaveCity = () => {
    const cityNameTrimmed = newCity.name.trim();
    if (!cityNameTrimmed) return;
    
    // Validação de duplicidade
    const isDuplicate = cities.some(c => 
      c.name.toLowerCase() === cityNameTrimmed.toLowerCase() && 
      c.id !== editingCityId
    );

    if (isDuplicate) {
      alert("Erro: Já existe uma unidade cadastrada com este nome!");
      return;
    }

    if (editingCityId) {
      setCities(cities.map(c => c.id === editingCityId ? { ...c, name: cityNameTrimmed, uf: newCity.uf, mfcSince: newCity.mfcSince } : c));
    } else {
      const city: City = {
        id: (cities.length + 1).toString(),
        name: cityNameTrimmed,
        uf: newCity.uf,
        mfcSince: newCity.mfcSince,
        active: true
      };
      setCities([...cities, city]);
    }
    
    setShowCityModal(false);
  };

  const handleOpenDeleteModal = (city: City) => {
    setCityToDelete(city);
    setDeleteConfirmationText('');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (cityToDelete && deleteConfirmationText === cityToDelete.name.toUpperCase()) {
      setCities(cities.filter(c => c.id !== cityToDelete.id));
      setShowDeleteModal(false);
      setCityToDelete(null);
    }
  };

  const toggleCityStatus = (id: string) => {
    setCities(cities.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const getCityImpact = (cityName: string) => {
    const memberCount = mockMembers.filter(m => m.city === cityName).length;
    const teamCount = mockTeams.filter(t => t.city === cityName).length;
    return { memberCount, teamCount };
  };

  const calculateYearsOfMfc = (dateString?: string) => {
    if (!dateString) return 0;
    const diff = new Date().getTime() - new Date(dateString).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const formatMfcDate = (dateString?: string) => {
    if (!dateString) return '---';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatAnniversary = (dateString?: string) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    // Ajuste de fuso horário local para não retroceder um dia
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 lg:pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 lg:px-0">
        <div>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Configurações</h2>
          <p className="text-gray-500 font-medium text-sm lg:text-base">Gestão de acessos e unidades administrativas.</p>
        </div>

        <div className="flex bg-gray-100/80 p-1 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
          <button onClick={() => setActiveTab('permissoes')} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'permissoes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
            <Shield className="w-4 h-4" /> Permissões
          </button>
          <button onClick={() => setActiveTab('cidades')} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cidades' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>
            <MapPin className="w-4 h-4" /> Unidades
          </button>
        </div>
      </div>

      {activeTab === 'cidades' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col lg:flex-row gap-4 px-2 lg:px-0">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar unidade..."
                className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm shadow-sm"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
            </div>
            <button 
              onClick={handleOpenAddModal}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 group shrink-0"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Nova Unidade
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6 px-2 lg:px-0">
            {filteredCities.map(city => {
              const years = calculateYearsOfMfc(city.mfcSince);
              return (
                <div 
                  key={city.id} 
                  className={`bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all relative overflow-hidden ${!city.active ? 'bg-gray-50/50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner ${city.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => toggleCityStatus(city.id)}
                        className={`p-2.5 rounded-xl transition-colors ${city.active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-gray-300 hover:bg-gray-100'}`}
                        title={city.active ? "Inativar Cidade" : "Ativar Cidade"}
                      >
                        <Power className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(city)}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className={`text-2xl font-black tracking-tight leading-tight ${!city.active ? 'text-gray-400' : 'text-gray-900'}`}>{city.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unidade {city.uf}</p>
                  </div>
                  
                  {/* INFORMAÇÕES MFC E ANIVERSÁRIO - NOVO DESIGN */}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                        <History className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">MFC desde</span>
                        <span className="text-xs font-bold text-gray-700">{formatMfcDate(city.mfcSince)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 bg-blue-600/5 px-3 py-1.5 rounded-xl border border-blue-600/10">
                         <Calendar className="w-3.5 h-3.5 text-blue-600" />
                         <span className="text-[9px] font-black text-blue-700 uppercase">{years} Anos</span>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-600/5 px-3 py-1.5 rounded-xl border border-emerald-600/10">
                         <Gift className="w-3.5 h-3.5 text-emerald-600" />
                         <span className="text-[9px] font-black text-emerald-700 uppercase">Aniv: {formatAnniversary(city.mfcSince)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${city.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${city.active ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {city.active ? 'Ativo' : 'Inativo'}
                        </span>
                     </div>
                     <button 
                      onClick={() => handleOpenEditModal(city)}
                      className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all group/edit border border-transparent hover:border-blue-100"
                    >
                      <Edit3 className="w-3.5 h-3.5 group-hover/edit:rotate-12 transition-transform" /> Editar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL CADASTRO / EDIÇÃO */}
      {showCityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-500">
            <div className="px-8 py-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none mb-1">{editingCityId ? 'Editar Unidade' : 'Nova Unidade'}</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">DADOS DA CIDADE NO SISTEMA</p>
                </div>
              </div>
              <button onClick={() => setShowCityModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300 hover:text-red-500"><X className="w-7 h-7" /></button>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">NOME DA UNIDADE</label>
                <input 
                  type="text" 
                  placeholder="Ex: Tatuí"
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none"
                  value={newCity.name}
                  onChange={(e) => setNewCity({...newCity, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">ESTADO (UF)</label>
                  <div className="relative">
                    <select 
                      className="w-full pl-6 pr-12 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none appearance-none"
                      value={newCity.uf}
                      onChange={(e) => setNewCity({...newCity, uf: e.target.value})}
                    >
                      {BRAZILIAN_STATES.map(state => (
                        <option key={state.uf} value={state.uf}>{state.name} ({state.uf})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">MFC DESDE</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    <input 
                      type="date"
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none"
                      value={newCity.mfcSince}
                      onChange={(e) => setNewCity({...newCity, mfcSince: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-white border-t border-gray-50 flex items-center justify-center gap-6">
              <button onClick={() => setShowCityModal(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">CANCELAR</button>
              <button 
                onClick={handleSaveCity}
                disabled={!newCity.name}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> {editingCityId ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR UNIDADE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXCLUSÃO BLINDADO */}
      {showDeleteModal && cityToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-red-100 animate-in zoom-in-95 duration-500">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">Atenção Crítica!</h3>
                <p className="text-sm text-gray-500 font-medium">Você está prestes a excluir a unidade <span className="text-red-600 font-black">{cityToDelete.name}</span>.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xl font-black text-gray-900">{getCityImpact(cityToDelete.name).memberCount}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">MFCistas Afetados</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Layers className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <p className="text-xl font-black text-gray-900">{getCityImpact(cityToDelete.name).teamCount}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Equipes Base</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                  Para confirmar, digite o nome da cidade abaixo em <span className="text-red-500">CAIXA ALTA</span>:
                </p>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-red-50/30 border border-red-100 rounded-2xl text-center font-black text-red-600 placeholder:text-red-200 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all"
                  placeholder={cityToDelete.name.toUpperCase()}
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={handleConfirmDelete}
                  disabled={deleteConfirmationText !== cityToDelete.name.toUpperCase()}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                >
                  Confirmar Exclusão Permanente
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                  DESISTIR E VOLTAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
