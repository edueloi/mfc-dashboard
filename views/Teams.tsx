
import React, { useState } from 'react';
import { Layers, Plus, Search, MapPin, Users, ChevronRight, X } from 'lucide-react';
import { mockTeams, mockCities } from '../mockData';

interface TeamsProps {
  onOpenTeam: (id: string) => void;
}

const Teams: React.FC<TeamsProps> = ({ onOpenTeam }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', city: 'Tatuí', state: 'SP', isYouth: false });

  const handleCreate = (saveAndNew: boolean) => {
    // Logic to save team
    console.log('Criando equipe:', newTeam);
    if (!saveAndNew) {
      setShowModal(false);
    }
    setNewTeam({ name: '', city: 'Tatuí', state: 'SP', isYouth: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Equipes Base</h2>
          <p className="text-gray-500">Listagem de núcleos familiares do movimento.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Criar Equipe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeams.map((team) => (
          <div 
            key={team.id} 
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
            onClick={() => onOpenTeam(team.id)}
          >
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${team.isYouth ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  <Layers className="w-6 h-6" />
                </div>
                {team.isYouth && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-purple-50 text-purple-600 px-2 py-1 rounded">
                    MFC Jovem
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{team.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {team.city} - {team.state}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  {team.memberCount} Membros
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-50 rounded-b-xl flex items-center justify-between text-blue-600 text-sm font-medium group-hover:bg-blue-50">
              Ver Detalhes
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar Equipe */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Nova Equipe Base</h3>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Equipe</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex: Sagrada Família"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                    value={newTeam.state}
                    onChange={(e) => setNewTeam({...newTeam, state: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <select 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                    value={newTeam.city}
                    onChange={(e) => setNewTeam({...newTeam, city: e.target.value})}
                  >
                    {mockCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isYouth" 
                  className="w-4 h-4 rounded text-blue-600"
                  checked={newTeam.isYouth}
                  onChange={(e) => setNewTeam({...newTeam, isYouth: e.target.checked})}
                />
                <label htmlFor="isYouth" className="text-sm text-gray-600">Equipe MFC Jovem?</label>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-2">
              <button 
                onClick={() => handleCreate(false)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
              <button 
                onClick={() => handleCreate(true)}
                className="flex-1 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Salvar e Criar Outro
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 text-gray-500 text-sm hover:underline"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
