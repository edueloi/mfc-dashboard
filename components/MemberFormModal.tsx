
import React, { useState, useEffect } from 'react';
import { Save, X, UserPlus, Heart, Shield, Activity } from 'lucide-react';
import { api } from '../services/api';
import { MemberStatus, UserRoleType, Member } from '../types';
import Modal from './Modal';
import Button from './Button';
import Dropdown from './Dropdown';
import DateInput from './DateInput';
import BooleanInput from './BooleanInput';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberCreated: (member: Member) => void;
  memberToEdit?: Member | null;
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({ isOpen, onClose, onMemberCreated, memberToEdit }) => {
  const initialFormState = {
    name: '', nickname: '', dob: '', rg: '', cpf: '', bloodType: 'O+', gender: 'Feminino',
    maritalStatus: 'Casado(a)', spouseName: '', spouseCpf: '', marriageDate: '',
    mfcDate: new Date().toISOString().split('T')[0], phone: '', emergencyPhone: '',
    street: '', number: '', neighborhood: '', zip: '', complement: '', city: 'Tatuí',
    state: 'SP', condir: 'Sudeste', naturalness: '', father: '', mother: '',
    smoker: false, mobilityIssue: '', healthPlan: '', diet: '', medication: '',
    allergy: '', pcd: false, pcdDescription: '', profession: '', religion: 'Católica',
    education: 'Superior completo', createAccess: false, email: '', username: '',
    password: '', role: UserRoleType.USUARIO, status: MemberStatus.ATIVO
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        ...initialFormState,
        ...memberToEdit,
        smoker: !!memberToEdit.smoker,
        pcd: !!memberToEdit.pcd,
        createAccess: !!memberToEdit.createAccess
      });
    } else {
      setFormData(initialFormState);
    }
  }, [memberToEdit, isOpen]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (saveAndNew: boolean) => {
    if (!formData.name) return;
    
    setLoading(true);
    try {
      if (memberToEdit) {
        const updated = await api.updateMember(memberToEdit.id, formData);
        onMemberCreated(updated);
      } else {
        const newMember = await api.createMember(formData);
        onMemberCreated(newMember);
      }
      
      if (saveAndNew) {
        setFormData(initialFormState);
      } else {
        onClose();
        setFormData(initialFormState);
      }
    } catch (err) {
      console.error('Failed to save member', err);
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, colorClass }: any) => (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClass} shadow-sm`}>
        <Icon className="w-4 h-4" />
      </div>
      <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">{title}</h4>
    </div>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
      {children}
    </label>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={memberToEdit ? 'Editar MFCista' : 'Novo MFCista'}
      size="lg"
    >
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {/* Section 1: Identificação */}
          <div className="space-y-6">
            <SectionHeader icon={UserPlus} title="1. Identificação Pessoal" colorClass="bg-blue-50 text-blue-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Label>Nome Completo</Label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                  value={formData.name}
                  onChange={e => updateFormData('name', e.target.value)}
                />
              </div>
              <div>
                <Label>Apelido / Crachá</Label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                  value={formData.nickname}
                  onChange={e => updateFormData('nickname', e.target.value)}
                />
              </div>
              <div>
                <Label>CPF</Label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                  value={formData.cpf}
                  onChange={e => updateFormData('cpf', e.target.value)}
                />
              </div>
              <DateInput 
                label="Nascimento" 
                value={formData.dob} 
                onChange={(val) => updateFormData('dob', val)} 
              />
              <Dropdown
                label="Sexo"
                options={[{ label: 'Feminino', value: 'Feminino' }, { label: 'Masculino', value: 'Masculino' }, { label: 'Outro', value: 'Outro' }]}
                value={formData.gender}
                onChange={(val) => updateFormData('gender', val as string)}
              />
            </div>
          </div>

          {/* Section 2: Vínculo Familiar */}
          <div className="space-y-6">
            <SectionHeader icon={Heart} title="2. Vínculo Familiar" colorClass="bg-red-50 text-red-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Dropdown
                label="Estado Civil"
                options={[{ label: 'Casado(a)', value: 'Casado(a)' }, { label: 'Solteiro(a)', value: 'Solteiro(a)' }, { label: 'Divorciado(a)', value: 'Divorciado(a)' }, { label: 'Viúvo(a)', value: 'Viúvo(a)' }]}
                value={formData.maritalStatus}
                onChange={(val) => updateFormData('maritalStatus', val as string)}
                className="sm:col-span-2"
              />
              {formData.maritalStatus === 'Casado(a)' && (
                <>
                  <div className="sm:col-span-2">
                    <Label>Cônjuge</Label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                      value={formData.spouseName}
                      onChange={e => updateFormData('spouseName', e.target.value)}
                    />
                  </div>
                  <DateInput 
                    label="Data Casamento" 
                    value={formData.marriageDate} 
                    onChange={(val) => updateFormData('marriageDate', val)} 
                  />
                </>
              )}
              <DateInput 
                label="MFCista Desde" 
                value={formData.mfcDate} 
                onChange={(val) => updateFormData('mfcDate', val)} 
              />
            </div>
          </div>

          {/* Section 3: Saúde */}
          <div className="space-y-6">
            <SectionHeader icon={Activity} title="3. Saúde e Preferências" colorClass="bg-emerald-50 text-emerald-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <BooleanInput
                label="Fumante"
                value={formData.smoker}
                onChange={(val) => updateFormData('smoker', val)}
              />
              <BooleanInput
                label="PCD"
                value={formData.pcd}
                onChange={(val) => updateFormData('pcd', val)}
              />
              {formData.pcd && (
                <div className="sm:col-span-2">
                  <Label>Descrição PCD</Label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                    value={formData.pcdDescription}
                    onChange={e => updateFormData('pcdDescription', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Acesso */}
          <div className="space-y-6">
            <SectionHeader icon={Shield} title="4. Acesso ao Sistema" colorClass="bg-indigo-50 text-indigo-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <BooleanInput
                label="Liberar Acesso"
                value={formData.createAccess}
                onChange={(val) => updateFormData('createAccess', val)}
              />
              {formData.createAccess && (
                <>
                  <div className="sm:col-span-2">
                    <Label>E-mail</Label>
                    <input 
                      type="email" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                      value={formData.email}
                      onChange={e => updateFormData('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Usuário</Label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                      value={formData.username}
                      onChange={e => updateFormData('username', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Senha</Label>
                    <input 
                      type="password" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-400 transition-all outline-none shadow-sm"
                      value={formData.password}
                      onChange={e => updateFormData('password', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
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
            onClick={() => handleSave(true)}
            className="w-full sm:w-auto"
            disabled={loading || !formData.name}
          >
            Salvar e Criar Outro
          </Button>
          <Button 
            onClick={() => handleSave(false)}
            className="w-full sm:w-auto"
            disabled={loading || !formData.name}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : (memberToEdit ? 'Salvar Alterações' : 'Salvar Cadastro')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MemberFormModal;
