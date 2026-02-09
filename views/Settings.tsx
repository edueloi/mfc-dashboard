
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
  Navigation
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
  const [newCity, setNewCity] = useState({ name: '', uf: 'SP' });
  
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

  const handleAddCity = () => {
    if (!newCity.name.trim()) return;
    
    if (cities.some(c => c.name.toLowerCase() === newCity.name.toLowerCase())) {
      alert("Esta unidade já está cadastrada!");
      return;
    }

    const city: City = {
      id: (cities.length + 1).toString(),
      name: newCity.name,
      uf: newCity.uf
    };
    setCities([...cities, city]);
    setShowCityModal(false);
    setNewCity({ name: '', uf: 'SP' });
  };

  const removeCity = (id: string) => {
    setCities(cities.filter(c => c.id !== id));
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 px-2 lg:px-0">
            {filteredCities.map(city => (
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
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight">Ativo</span>
                   </div>
                   <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Configurar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR CIDADE - MOBILE BOTTOM SHEET */}
      {showCityModal && (
        <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] lg:rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-20 duration-500 overflow-hidden border border-gray-100 max-h-[90vh]">
            
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white relative shrink-0">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-100 rounded-full lg:hidden"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-none mb-1">Nova Unidade</h3>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Preencha os dados da nova cidade</p>
                </div>
              </div>
              <button onClick={() => setShowCityModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1 overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome da Cidade</label>
                  <div className="relative group">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Digite o nome..."
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none"
                      value={newCity.name}
                      onChange={(e) => setNewCity({...newCity, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Estado (UF)</label>
                  <div className="relative">
                    <select 
                      className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none appearance-none"
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
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4 z-20 shrink-0">
              <button 
                onClick={() => setShowCityModal(false)}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddCity}
                disabled={!newCity.name}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> Criar Unidade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
