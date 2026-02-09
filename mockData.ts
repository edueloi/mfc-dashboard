
import { Member, MemberStatus, BaseTeam, City, User, UserRoleType, Payment } from './types';

export const mockCities: City[] = [
  { id: '1', name: 'Tatuí', uf: 'SP', mfcSince: '1965-07-01', active: true },
  { id: '2', name: 'Pirassununga', uf: 'SP', mfcSince: '1980-05-15', active: true },
  { id: '3', name: 'Araraquara', uf: 'SP', mfcSince: '1995-10-20', active: true },
  { id: '4', name: 'Descalvado', uf: 'SP', mfcSince: '2010-03-12', active: true }
];

export const mockTeams: BaseTeam[] = [
  { id: 't1', name: 'São Paulo Apóstolo', city: 'Tatuí', state: 'SP', isYouth: false, createdAt: '2021-04-07', memberCount: 12 },
  { id: 't2', name: 'Nossa Senhora da Paz', city: 'Tatuí', state: 'SP', isYouth: true, createdAt: '2022-01-15', memberCount: 8 }
];

export const mockMembers: Member[] = [
  {
    id: 'm1',
    name: 'Alzira Camargo Farah Loretti',
    nickname: 'Alzira',
    dob: '1941-03-22',
    rg: '26674889',
    cpf: '039.XXX.XXX-34',
    bloodType: 'A+',
    gender: 'Feminino',
    maritalStatus: 'Casado(a)',
    spouseName: 'Hélio Loretti',
    spouseCpf: '039.XXX.XXX-53',
    marriageDate: '1964-07-11',
    mfcDate: '1965-07-01',
    phone: '(15)99751-6268',
    emergencyPhone: '(15)99719-6620',
    status: MemberStatus.ATIVO,
    teamId: 't1',
    street: 'Rua Cornélio Vieira Camargo',
    number: '104',
    neighborhood: 'Junqueira',
    zip: '18270030',
    city: 'Tatuí',
    state: 'SP',
    condir: 'Sudeste',
    naturalness: 'São Paulo',
    father: 'Nacif Farah',
    mother: 'Francisca Vieira Camargo Farah',
    smoker: false,
    mobilityIssue: 'Auditiva',
    healthPlan: 'Não informado',
    diet: 'Nenhuma',
    medication: 'Nenhuma',
    allergy: 'Nenhuma',
    pcd: true,
    pcdDescription: 'Auditiva',
    profession: 'Aposentado',
    religion: 'Católica',
    education: 'Superior completo',
    movementRoles: ['Tesoureiro'],
    createdAt: '2021-04-07 16:51',
    updatedAt: '2022-09-22 00:28'
  },
  {
    id: 'm2',
    name: 'João Silva',
    nickname: 'João',
    dob: '1995-10-10',
    rg: '12345678',
    cpf: '111.222.333-44',
    bloodType: 'O+',
    gender: 'Masculino',
    maritalStatus: 'Solteiro(a)',
    mfcDate: '2023-01-01',
    phone: '(15)99999-9999',
    emergencyPhone: '(15)88888-8888',
    status: MemberStatus.AGUARDANDO,
    street: 'Av. Brasil',
    number: '500',
    neighborhood: 'Centro',
    zip: '18270000',
    city: 'Tatuí',
    state: 'SP',
    condir: 'Sudeste',
    naturalness: 'Tatuí',
    father: 'Pai Silva',
    mother: 'Mãe Silva',
    smoker: false,
    mobilityIssue: 'Não possui',
    healthPlan: 'Unimed',
    diet: 'Nenhuma',
    medication: 'Nenhuma',
    allergy: 'Nenhuma',
    pcd: false,
    profession: 'Engenheiro',
    religion: 'Católica',
    education: 'Superior completo',
    movementRoles: [],
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00'
  }
];

export const mockPayments: Payment[] = [
  { id: 'p1', memberId: 'm1', teamId: 't1', amount: 50, date: '2023-10-05', referenceMonth: '10/2023', status: 'Pago', launchedBy: 'u1' },
  { id: 'p2', memberId: 'm2', teamId: 't1', amount: 50, date: '2023-10-10', referenceMonth: '10/2023', status: 'Pendente', launchedBy: 'u1' }
];

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'admin',
    email: 'admin@mfc.org',
    name: 'Administrador Geral',
    cityId: '1',
    role: UserRoleType.ADMIN,
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01'
  },
  {
    id: 'u2',
    username: 'alziraloretti',
    email: 'farahalziraloretti@gmail.com',
    name: 'Alzira Loretti',
    cityId: '1',
    role: UserRoleType.TESOUREIRO,
    teamId: 't1',
    createdAt: '2021-04-07',
    updatedAt: '2022-09-22'
  }
];
