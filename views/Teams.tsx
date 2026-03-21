
import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, MapPin, Users, ChevronRight, X, Save, LayoutGrid, List, Edit3, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { BaseTeam, City } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';
import Grid from '../components/Grid';
import FilterBar from '../components/FilterBar';
import BooleanInput from '../components/BooleanInput';
import TeamFormModal from '../components/TeamFormModal';

interface TeamsProps {
  onOpenTeam: (id: string) => void;
}

const Teams: React.FC<TeamsProps> = ({ onOpenTeam }) => {
  const [teams, setTeams] = useState<BaseTeam[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<BaseTeam | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsData, citiesData] = await Promise.all([
          api.getTeams(),
          api.getCities()
        ]);
        setTeams(teamsData);
        setCities(citiesData);
      } catch (err) {
        console.error('Failed to fetch teams data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTeamCreated = (team: BaseTeam) => {
    if (teamToEdit) {
      setTeams(prev => prev.map(t => t.id === team.id ? team : t));
    } else {
      setTeams(prev => [...prev, team]);
    }
  };

  const handleEditTeam = (e: React.MouseEvent, team: BaseTeam) => {
    e.stopPropagation();
    setTeamToEdit(team);
    setShowModal(true);
  };

  const handleDeleteTeam = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Tem certeza que deseja excluir esta equipe?')) return;
    try {
      await api.deleteTeam(id);
      setTeams(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete team', err);
    }
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Equipes Base</h2>
          <p className="text-gray-500 font-medium">Núcleos familiares que compõem a unidade.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-100 p-1 rounded-xl flex shadow-sm mr-2">
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'table' ? 'primary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('table')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={() => setShowModal(true)}
            size="md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Equipe
          </Button>
        </div>
      </div>

      <FilterBar
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        onClear={() => setSearchTerm('')}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div 
              key={team.id} 
              className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col overflow-hidden"
              onClick={() => onOpenTeam(team.id)}
            >
              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl shadow-lg ${team.isYouth ? 'bg-purple-100 text-purple-600 shadow-purple-100' : 'bg-blue-100 text-blue-600 shadow-blue-100'}`}>
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleEditTeam(e, team)}
                      className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteTeam(e, team.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">{team.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {team.city} - {team.state}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Users className="w-4 h-4 text-blue-500" />
                    {team.memberCount} Membros
                  </div>
                </div>
              </div>
              <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between text-blue-600 text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                Ver Detalhes da Equipe
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Grid<BaseTeam>
          data={filteredTeams}
          onRowClick={(team) => onOpenTeam(team.id)}
          columns={[
            {
              header: 'Equipe',
              accessor: (team) => (
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all shadow-inner ${team.isYouth ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {team.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{team.name}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{team.isYouth ? 'MFC Jovem' : 'Base'}</p>
                  </div>
                </div>
              )
            },
            {
              header: 'Localização',
              accessor: (team) => (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-sm font-bold text-gray-700">{team.city} - {team.state}</span>
                </div>
              )
            },
            {
              header: 'Membros',
              className: 'text-center',
              accessor: (team) => (
                <div className="flex flex-col items-center">
                  <p className="text-sm font-black text-gray-900">{team.memberCount}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Integrantes</p>
                </div>
              )
            },
            {
              header: '',
              className: 'text-right',
              accessor: () => <ChevronRight className="w-5 h-5 text-gray-300" />
            }
          ]}
        />
      )}

      {/* Modal Criar Equipe */}
      <TeamFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setTeamToEdit(null);
        }}
        cities={cities}
        onTeamCreated={handleTeamCreated}
        teamToEdit={teamToEdit}
      />
    </div>
  );
};

export default Teams;
