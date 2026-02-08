
import React, { useState } from 'react';
import { Shield, MapPin, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { mockCities } from '../mockData';
import { UserRoleType, ModuleAction } from '../types';

interface SettingsViewProps {
  initialTab: 'permissoes' | 'cidades';
}

const SettingsView: React.FC<SettingsViewProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const modules = ['Dashboard', 'MFCistas', 'Equipes', 'Financeiro', 'Usuários', 'Configurações'];
  const actions: ModuleAction[] = ['view', 'create', 'edit', 'delete', 'launch'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('permissoes')}
          className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'permissoes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Matriz de Permissões</div>
        </button>
        <button 
          onClick={() => setActiveTab('cidades')}
          className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'cidades' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Gestão de Cidades</div>
        </button>
      </div>

      {activeTab === 'permissoes' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Controle de Acesso Granular</h3>
              <p className="text-gray-500 text-sm">Configure o que cada cargo pode realizar no sistema.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Módulo / Permissão</th>
                  {Object.values(UserRoleType).slice(0, 5).map(role => (
                    <th key={role} className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {modules.map(module => (
                  <React.Fragment key={module}>
                    <tr className="bg-blue-50/50">
                      <td colSpan={6} className="px-6 py-2 text-xs font-bold text-blue-700 uppercase">{module}</td>
                    </tr>
                    {actions.map(action => (
                      <tr key={`${module}-${action}`} className="hover:bg-gray-50 group">
                        <td className="px-10 py-3 text-sm text-gray-600 font-medium capitalize">{action}</td>
                        {Object.values(UserRoleType).slice(0, 5).map(role => (
                          <td key={role} className="px-6 py-3 text-center">
                            <input 
                              type="checkbox" 
                              defaultChecked={role === UserRoleType.ADMIN || (action === 'view')} 
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
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
      )}

      {activeTab === 'cidades' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Unidades Federativas</h3>
              <p className="text-sm text-gray-500">Cidades ativas no movimento.</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Adicionar Cidade
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCities.map(city => (
              <div key={city.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-colors">
                <div>
                  <p className="text-lg font-bold text-gray-900">{city.name}</p>
                  <p className="text-sm text-gray-500">{city.uf}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
