
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
  Navigation,
  Calendar,
  Gift
} from 'lucide-react';
import { mockCities as initialCities } from '../mockData';
import { UserRoleType, ModuleAction, City } from '../types';

// Lista completa de Estados Brasileiros
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
  const [showCityModal, setShowCityModal] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', uf: 'SP', mfcSince: new Date().toISOString().split('T')[0] });
  
  const modules = [
    { name: 'Dashboard', icon: Globe },
    { name: 'MFCistas', icon: Shield },
    { name: 'Equipes', icon: Filter },
    { name: 'Financeiro', icon: Shield },
    { name: 'Usuários', icon: Lock },
    { name: 'Configurações', icon: SettingsIcon }
  ];
  
  const actions: {id: ModuleAction, label: string}[] = [
    { id: 'view', label: 'Visualizar' },
    { id: 'create', label: 'Criar' },
    { id: 'edit', label: 'Editar' },
    { id: 'delete', label: 'Excluir' },
    { id: 'launch', label: 'Lançar' }
  ];

  const rolesToShow = Object.values(UserRoleType).slice(0, 5);

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(citySearch.toLowerCase()) || 
    c.uf.toLowerCase().includes(citySearch.toLowerCase())
  );

  const suggestedCities = [
    { name: 'TATUÍ', uf: 'SP', mfcSince: '1965-07-01' },
    { name: 'PIRASSUNUNGA', uf: 'SP', mfcSince: '1980-05-15' },
    { name: 'ARARAQUARA', uf: 'SP', mfcSince: '1995-10-20' },
    { name: 'DESCALVADO', uf: 'SP', mfcSince: '2010-03-12' }
  ];

  const handleAddCity = () => {
    if (!newCity.name.trim()) return;
    
    if (cities.some(c => c.name.toLowerCase() === newCity.name.toLowerCase())) {
      alert("Esta unidade já está cadastrada!");
      return;
    }

    const city: City = {
      id: (cities.length + 1).toString(),
      name: newCity.name,
      uf: newCity.uf,
      mfcSince: newCity.mfcSince
    };
    setCities([...cities, city]);
    setShowCityModal(false);
    setNewCity({ name: '', uf: 'SP', mfcSince: new Date().toISOString().split('T')[0] });
  };

  const removeCity = (id: string) => {
    setCities(cities.filter(c => c.id !== id));
  };

  const calculateYearsOfMfc = (dateString?: string) => {
    if (!dateString) return 0;
    const diff = new Date().getTime() - new Date(dateString).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const formatAniversary = (dateString?: string) => {
    if (!dateString) return 'Data não definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 lg:pb-10">
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 lg:px-0">
        <div>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Configurações</h2>
          <p className="text-gray-500 font-medium text-sm lg:text-base">Controle de acessos e unidades do sistema.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100/80 p-1 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('permissoes')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 lg:px-6 py-3 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'permissoes' ? 'bg-white text-blue-600 shadow-lg shadow-gray-200/50 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Shield className="w-3.5 lg:w-4 h-3.5 lg:h-4" /> Permissões
          </button>
          <button 
            onClick={() => setActiveTab('cidades')}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 lg:px-6 py-3 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'cidades' ? 'bg-white text-blue-600 shadow-lg shadow-gray-200/50 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MapPin className="w-3.5 lg:w-4 h-3.5 lg:h-4" /> Unidades
          </button>
        </div>
      </div>

      {activeTab === 'permissoes' && (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500 px-2 lg:px-0">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 lg:px-10 py-6 text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 sticky left-0 bg-gray-50/50 z-20">Módulo</th>
                    {rolesToShow.map(role => (
                      <th key={role} className="px-4 py-6 text-center text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 min-w-[120px]">{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {modules.map(module => (
                    <React.Fragment key={module.name}>
                      <tr className="bg-gray-50/20">
                        <td colSpan={rolesToShow.length + 1} className="px-6 lg:px-10 py-3 sticky left-0 z-10">
                          <div className="flex items-center gap-2">
                             <module.icon className="w-3.5 h-3.5 text-blue-500" />
                             <span className="text-[9px] font-black text-gray-800 uppercase tracking-[0.1em]">{module.name}</span>
                          </div>
                        </td>
                      </tr>
                      {actions.slice(0, 3).map(action => (
                        <tr key={`${module.name}-${action.id}`} className="hover:bg-blue-50/20 transition-all">
                          <td className="px-8 lg:px-14 py-3 text-xs font-bold text-gray-500 capitalize sticky left-0 bg-white group-hover:bg-blue-50/20 z-10">{action.label}</td>
                          {rolesToShow.map(role => (
                            <td key={role} className="px-4 py-3 text-center">
                              <input type="checkbox" defaultChecked={role === UserRoleType.ADMIN || action.id === 'view'} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cidades' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          {/* Busca e Botão Novo */}
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
              onClick={() => setShowCityModal(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 group shrink-0"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Nova Unidade
            </button>
          </div>

          {/* Grid de Unidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6 px-2 lg:px-0">
            {filteredCities.map(city => {
              const years = calculateYearsOfMfc(city.mfcSince);
              return (
                <div 
                  key={city.id} 
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <button 
                      onClick={() => removeCity(city.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{city.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unidade {city.uf}</p>
                  </div>
                  
                  {/* Tempo de MFC e Aniversário */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100/30">
                       <Calendar className="w-3.5 h-3.5 text-blue-600" />
                       <span className="text-[9px] font-black text-blue-700 uppercase">{years} Anos de MFC</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50/50 px-3 py-1.5 rounded-xl border border-emerald-100/30">
                       <Gift className="w-3.5 h-3.5 text-emerald-600" />
                       <span className="text-[9px] font-black text-emerald-700 uppercase">Aniv: {formatAniversary(city.mfcSince)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight">Ativo</span>
                     </div>
                     <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Configurar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR CIDADE - CONFORME DESIGN SOLICITADO */}
      {showCityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-500">
            
            <div className="px-8 py-8 border-b border-gray-50 flex items-center justify-between bg-white relative shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none mb-1">Nova Unidade</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">CADASTRAR NOVA CIDADE NO SISTEMA</p>
                </div>
              </div>
              <button onClick={() => setShowCityModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto no-scrollbar">
              
              {/* CIDADES SUGERIDAS (BOTÕES RÁPIDOS) */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">CIDADES SUGERIDAS</label>
                <div className="grid grid-cols-2 gap-3">
                  {suggestedCities.map(city => (
                    <button 
                      key={city.name}
                      onClick={() => setNewCity({ name: city.name, uf: city.uf, mfcSince: city.mfcSince })}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl text-[10px] font-black uppercase transition-all border group ${newCity.name.toUpperCase() === city.name ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-50' : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:bg-blue-50'}`}
                    >
                      {city.name}
                      <Navigation className={`w-3.5 h-3.5 transition-transform group-hover:rotate-12 ${newCity.name.toUpperCase() === city.name ? 'text-white' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 pt-4">
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
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">MFC DESDE (DATA)</label>
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
            </div>

            <div className="px-10 py-8 bg-white border-t border-gray-50 flex items-center justify-center gap-6 z-20 shrink-0">
              <button 
                onClick={() => setShowCityModal(false)}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                CANCELAR
              </button>
              <button 
                onClick={handleAddCity}
                disabled={!newCity.name}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> ADICIONAR UNIDADE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
