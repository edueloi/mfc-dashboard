
export enum MemberStatus {
  ATIVO = 'Ativo',
  INATIVO = 'Inativo',
  PENDENTE = 'Pendente',
  CONVIDADO = 'Convidado',
  AGUARDANDO = 'Aguardando'
}

export enum UserRoleType {
  ADMIN = 'Administrador',
  COORD_CIDADE = 'Coordenador Cidade',
  COORD_ESTADO = 'Coordenador Estado',
  SEC_COM_CIDADE = 'Secretário Comunicação Cidade',
  SEC_COM_ESTADO = 'Secretário Comunicação Estado',
  COORD_CONDIR = 'Coordenador Condir',
  COORD_EQUIPE_BASE = 'Coordenador Equipe Base',
  VICE_COORD = 'Vice Coordenador',
  TESOUREIRO = 'Tesoureiro',
  USUARIO = 'Usuário'
}

export type ModuleAction = 'view' | 'create' | 'edit' | 'delete' | 'launch';

export interface PermissionMatrix {
  role: UserRoleType;
  modules: {
    [module: string]: {
      [action in ModuleAction]: boolean;
    };
  };
}

export interface City {
  id: string;
  name: string;
  uf: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  cityId: string;
  role: UserRoleType;
  teamId?: string; // Equipe que o usuário pertence
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  memberId: string;
  teamId: string;
  amount: number;
  date: string;
  referenceMonth: string; // MM/YYYY
  status: 'Pago' | 'Pendente' | 'Isento';
  launchedBy: string; // userId
}

export interface Member {
  id: string;
  name: string;
  nickname: string;
  dob: string;
  rg: string;
  cpf: string;
  bloodType: string;
  gender: string;
  maritalStatus: string;
  spouseName?: string;
  spouseCpf?: string;
  marriageDate?: string;
  mfcDate: string;
  phone: string;
  emergencyPhone: string;
  status: MemberStatus;
  teamId?: string;
  // Address
  street: string;
  number: string;
  neighborhood: string;
  zip: string;
  complement?: string;
  city: string;
  state: string;
  condir: string;
  naturalness: string;
  // Others
  father: string;
  mother: string;
  smoker: boolean;
  mobilityIssue: string;
  healthPlan: string;
  diet: string;
  medication: string;
  allergy: string;
  pcd: boolean;
  pcdDescription?: string;
  profession: string;
  religion: string;
  education: string;
  // Roles inside movement
  movementRoles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseTeam {
  id: string;
  name: string;
  city: string;
  state: string;
  isYouth: boolean;
  createdAt: string;
  memberCount: number;
}
