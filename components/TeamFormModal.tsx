
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { api } from '../services/api';
import { City, BaseTeam } from '../types';
import Modal from './Modal';
import Button from './Button';
import Dropdown from './Dropdown';
import BooleanInput from './BooleanInput';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: City[];
  onTeamCreated: (team: BaseTeam) => void;
  teamToEdit?: BaseTeam | null;
}

const TeamFormModal: React.FC<TeamFormModalProps> = ({ isOpen, onClose, cities, onTeamCreated, teamToEdit }) => {
  const [newTeam, setNewTeam] = useState({ 
    name: '', 
    city: cities[0]?.name || '', 
    state: cities[0]?.uf || '', 
    isYouth: false 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamToEdit) {
      setNewTeam({
        name: teamToEdit.name,
        city: teamToEdit.city,
        state: teamToEdit.state,
        isYouth: teamToEdit.isYouth
      });
    } else {
      setNewTeam({
        name: '',
        city: cities[0]?.name || '',
        state: cities[0]?.uf || '',
        isYouth: false
      });
    }
  }, [teamToEdit, isOpen, cities]);

  useEffect(() => {
    if (!teamToEdit && cities.length > 0 && !newTeam.city) {
      setNewTeam(prev => ({ 
        ...prev, 
        city: cities[0].name, 
        state: cities[0].uf 
      }));
    }
  }, [cities, teamToEdit]);

  const handleCreate = async (saveAndNew: boolean) => {
    if (!newTeam.name) return;
    
    setLoading(true);
    try {
      if (teamToEdit) {
        const updated = await api.updateTeam(teamToEdit.id, newTeam);
        onTeamCreated(updated);
      } else {
        const createdTeam = await api.createTeam(newTeam);
        onTeamCreated(createdTeam);
      }
      
      if (!saveAndNew) {
        onClose();
      }
      if (!teamToEdit || saveAndNew) {
        setNewTeam({ name: '', city: cities[0]?.name || 'Tatuí', state: cities[0]?.uf || 'SP', isYouth: false });
      }
    } catch (err) {
      console.error('Failed to save team', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={teamToEdit ? 'Editar Equipe' : 'Nova Equipe Base'}
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome da Equipe</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
              placeholder="Ex: Equipe Nazaré"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            />
          </div>

          <Dropdown
            label="Cidade Sede"
            options={cities.map(c => ({ label: `${c.name} - ${c.state}`, value: c.name }))}
            value={newTeam.city}
            onChange={(val) => {
              const city = cities.find(c => c.name === val);
              setNewTeam({ ...newTeam, city: val as string, state: city?.uf || 'SP' });
            }}
          />

          <BooleanInput
            label="Equipe do MFC Jovem"
            description="Marque se esta equipe for composta por jovens."
            value={newTeam.isYouth}
            onChange={(val) => setNewTeam({ ...newTeam, isYouth: val })}
            className="bg-purple-50 border-purple-100"
          />
        </div>

        <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleCreate(true)}
            className="w-full sm:w-auto"
            disabled={loading || !newTeam.name}
          >
            Salvar e Criar Outra
          </Button>
          <Button 
            onClick={() => handleCreate(false)}
            className="w-full sm:w-auto"
            disabled={loading || !newTeam.name}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : (teamToEdit ? 'Salvar Alterações' : 'Criar Equipe')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeamFormModal;
