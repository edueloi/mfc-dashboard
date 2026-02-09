
import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Search,
  Lock,
  Globe,
  Settings as SettingsIcon,
  ChevronRight,
  Filter,
  Check,
  X,
  Info,
  Building2,
  Save,
  Navigation
} from 'lucide-react';
import { mockCities as initialCities } from '../mockData';
import { UserRoleType, ModuleAction, City } from '../types';

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
    const city: City = {
      id: (cities.length + 1).toString(),
      name: newCity.name,
      uf: newCity.uf
    };
    setCities([...cities, city]);
    setShowCityModal(false);
    setNewCity({ name: '', uf: 'SP' });
  };

  const suggestedCities = ['Tatuí', 'Pirassununga', 'Araraquara', 'Descalvado'];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Configurações</h2>
          <p className="text-gray-500 font-medium">Controle de acessos, unidades e parâmetros globais.</p>
        </div>

        {/* Tab Switcher Moderno */}
        <div className="flex bg-gray-100/80 p-1.5 rounded-[1.8rem] border border-gray-200/50 backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('permissoes')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'permissoes' ? 'bg-white text-blue-600 shadow-xl shadow-gray-200/50 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Shield className="w-4 h-4" /> Matriz de Permissões
          </button>
          <button 
            onClick={() => setActiveTab('cidades')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'cidades' ? 'bg-white text-blue-600 shadow-xl shadow-gray-200/50 border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MapPin className="w-4 h-4" /> Unidades Federativas
          </button>
        </div>
      </div>

      {activeTab === 'permissoes' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
          <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Shield className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">Controle de Acesso Granular</h3>
              <p className="text-blue-100 text-sm font-medium leading-relaxed">
                Defina o que cada cargo pode realizar em cada módulo do sistema. As alterações aqui refletem instantaneamente em toda a plataforma.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 sticky left-0 bg-gray-50/50 z-20">Módulo / Permissão</th>
                    {rolesToShow.map(role => (
                      <th key={role} className="px-6 py-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 min-w-[150px]">{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {modules.map(module => (
                    <React.Fragment key={module.name}>
                      <tr className="bg-gray-50/30">
                        <td colSpan={rolesToShow.length + 1} className="px-10 py-4 sticky left-0 z-10">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
                                <module.icon className="w-4 h-4" />
                             </div>
                             <span className="text-xs font-black text-gray-800 uppercase tracking-[0.2em]">{module.name}</span>
                          </div>
                        </td>
                      </tr>
                      {actions.map(action => (
                        <tr key={`${module.name}-${action.id}`} className="hover:bg-blue-50/20 transition-all group">
                          <td className="px-14 py-4 text-sm font-bold text-gray-500 capitalize border-r border-gray-50 sticky left-0 bg-white group-hover:bg-blue-50/20 z-10">
                            {action.label}
                          </td>
                          {rolesToShow.map(role => (
                            <td key={role} className="px-6 py-4 text-center">
                              <label className="inline-flex items-center cursor-pointer group/toggle">
                                <input 
                                  type="checkbox" 
                                  defaultChecked={role === UserRoleType.ADMIN || (action.id === 'view')} 
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 relative"></div>
                              </label>
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
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar cidade ou estado..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-medium"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowCityModal(true)}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95 group shrink-0"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Adicionar Cidade
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCities.map(city => (
              <div 
                key={city.id} 
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <span className="px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-black rounded-xl uppercase tracking-widest border border-gray-100">
                    ID: {city.id}
                  </span>
                </div>

                <div className="space-y-1 mb-10">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{city.name}</h3>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Estado de {city.uf === 'SP' ? 'São Paulo' : city.uf}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400">
                        U
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[8px] font-black text-blue-600">
                      +12
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit className="w-5 h-5" /></button>
                    <button className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCities.length === 0 && (
              <div className="col-span-full py-32 text-center">
                 <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-gray-100">
                    <MapPin className="w-10 h-10 text-gray-200" />
                 </div>
                 <h4 className="text-xl font-black text-gray-900 tracking-tight">Nenhuma cidade encontrada</h4>
                 <p className="text-gray-400 font-medium">Tente ajustar seus termos de pesquisa.</p>
                 <button onClick={() => setCitySearch('')} className="mt-6 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Limpar Busca</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR CIDADE (RESPONSIVO - BOTTOM SHEET NO MOBILE) */}
      {showCityModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-500 overflow-hidden border border-gray-100">
            
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white relative">
              {/* Handle para mobile */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-100 rounded-full sm:hidden"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">Nova Unidade</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Adicionar nova cidade ao sistema</p>
                </div>
              </div>
              <button onClick={() => setShowCityModal(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-300 hover:text-gray-500 active:scale-90">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-1">
              {/* Sugestões Rápidas */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sugestões Rápidas</label>
                <div className="flex flex-wrap gap-2">
                  {suggestedCities.map(city => (
                    <button 
                      key={city}
                      onClick={() => setNewCity({ ...newCity, name: city })}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${newCity.name === city ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-50' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome da Cidade</label>
                  <div className="relative group">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Ex: Pirassununga"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none"
                      value={newCity.name}
                      onChange={(e) => setNewCity({...newCity, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Estado (UF)</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <select 
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none appearance-none"
                      value={newCity.uf}
                      onChange={(e) => setNewCity({...newCity, uf: e.target.value})}
                    >
                      <option value="SP">São Paulo (SP)</option>
                      <option value="MG">Minas Gerais (MG)</option>
                      <option value="RJ">Rio de Janeiro (RJ)</option>
                      <option value="PR">Paraná (PR)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-8 bg-white border-t border-gray-50 flex items-center justify-end gap-4 z-20">
              <button 
                onClick={() => setShowCityModal(false)}
                className="flex-1 sm:flex-none text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddCity}
                disabled={!newCity.name}
                className="flex-1 sm:flex-none bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> Adicionar Unidade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
