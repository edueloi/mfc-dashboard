
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Layers, 
  UserCog, 
  Settings, 
  MapPin, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  UserPlus,
  DollarSign,
  UserCheck,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import Dashboard from './views/Dashboard';
import Members from './views/Members';
import Teams from './views/Teams';
import TeamDetail from './views/TeamDetail';
import MemberProfile from './views/MemberProfile';
import SettingsView from './views/Settings';
import UserManagement from './views/UserManagement';
import MyTeamView from './views/MyTeam';
import FinanceView from './views/Finance';
import GeneralLedger from './views/GeneralLedger';
import Login from './views/Login';
import { UserRoleType, User as UserType } from './types';
import { mockCities } from './mockData';

type View = 'dashboard' | 'mfcistas' | 'equipes' | 'usuarios' | 'permissoes' | 'cidades' | 'perfil-membro' | 'detalhe-equipe' | 'minha-equipe' | 'financeiro' | 'livro-caixa';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('1');

  // Ajusta o menu automaticamente ao redimensionar a tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setSelectedCityId(currentUser.cityId);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Login onLogin={(user) => setCurrentUser(user)} />;
  }

  const currentCity = mockCities.find(c => c.id === selectedCityId) || mockCities[0];

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' as View },
    { name: 'MFCistas', icon: Users, view: 'mfcistas' as View, roles: [UserRoleType.ADMIN, UserRoleType.COORD_CIDADE, UserRoleType.TESOUREIRO, UserRoleType.COORD_ESTADO] },
    { name: 'Equipes Base', icon: Layers, view: 'equipes' as View, roles: [UserRoleType.ADMIN, UserRoleType.COORD_CIDADE] },
    { name: 'Minha Equipe', icon: UserCheck, view: 'minha-equipe' as View, roles: [UserRoleType.TESOUREIRO, UserRoleType.COORD_EQUIPE_BASE, UserRoleType.USUARIO] },
    { 
      name: 'Tesouraria Equipes', 
      icon: DollarSign, 
      view: 'financeiro' as View, 
      roles: [
        UserRoleType.ADMIN, 
        UserRoleType.COORD_CIDADE, 
        UserRoleType.COORD_ESTADO, 
        UserRoleType.COORD_CONDIR, 
        UserRoleType.VICE_COORD,
        UserRoleType.TESOUREIRO
      ],
      // Regra especial: Tesoureiro de equipe (com teamId) não vê o financeiro geral
      checkSpecial: (user: UserType) => user.role !== UserRoleType.TESOUREIRO || !user.teamId
    },
    { 
      name: 'Livro Caixa', 
      icon: BookOpen, 
      view: 'livro-caixa' as View, 
      roles: [
        UserRoleType.ADMIN, 
        UserRoleType.COORD_CIDADE, 
        UserRoleType.COORD_ESTADO, 
        UserRoleType.COORD_CONDIR, 
        UserRoleType.VICE_COORD,
        UserRoleType.TESOUREIRO
      ],
      checkSpecial: (user: UserType) => user.role !== UserRoleType.TESOUREIRO || !user.teamId
    },
    { name: 'Usuários Sistema', icon: UserCog, view: 'usuarios' as View, roles: [UserRoleType.ADMIN] },
    { name: 'Configurações', icon: Settings, view: 'permissoes' as View, roles: [UserRoleType.ADMIN] },
  ];

  const filteredNav = navigation.filter(item => {
    const hasRole = !item.roles || item.roles.includes(currentUser.role);
    const passesSpecial = !item.checkSpecial || item.checkSpecial(currentUser);
    return hasRole && passesSpecial;
  });

  const handleNavigate = (view: View, id?: string) => {
    if (id) {
      if (view === 'perfil-membro') setSelectedMemberId(id);
      if (view === 'detalhe-equipe') setSelectedTeamId(id);
    }
    setCurrentView(view);
    // No mobile/tablet, fecha o menu após selecionar uma opção
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'mfcistas':
        return <Members onOpenMember={(id) => handleNavigate('perfil-membro', id)} />;
      case 'equipes':
        return <Teams onOpenTeam={(id) => handleNavigate('detalhe-equipe', id)} />;
      case 'perfil-membro':
        return <MemberProfile memberId={selectedMemberId!} onBack={() => setCurrentView('mfcistas')} />;
      case 'detalhe-equipe':
        return <TeamDetail teamId={selectedTeamId!} onBack={() => setCurrentView('equipes')} onOpenMember={(id) => handleNavigate('perfil-membro', id)} />;
      case 'minha-equipe':
        return <MyTeamView teamId={currentUser.teamId || 't1'} userId={currentUser.id} onOpenMember={(id) => handleNavigate('perfil-membro', id)} />;
      case 'financeiro':
        return <FinanceView cityId={selectedCityId} />;
      case 'livro-caixa':
        return <GeneralLedger />;
      case 'permissoes':
      case 'cidades':
        return <SettingsView initialTab={currentView === 'cidades' ? 'cidades' : 'permissoes'} />;
      case 'usuarios':
        return <UserManagement />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      {/* Overlay para mobile quando o menu está aberto */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Menu Lateral Fixo */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-2xl lg:shadow-none
        transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:h-full flex-shrink-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-[1.2rem] flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 rotate-3">M</div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter">MFC Gestão</h1>
            </div>
            <button className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar py-2">
            {filteredNav.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.view)}
                className={`
                  w-full flex items-center gap-3.5 px-5 py-3.5 rounded-[1.5rem] text-sm font-bold transition-all duration-200 group
                  ${currentView === item.view 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon className={`
                  w-5 h-5 transition-transform duration-200
                  ${currentView === item.view ? 'text-white' : 'text-slate-400 group-hover:scale-110 group-hover:text-blue-500'}
                `} />
                <span className="flex-1 text-left tracking-tight">{item.name}</span>
                {currentView === item.view && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </button>
            ))}
          </nav>

          {/* User Profile Footer Section */}
          <div className="p-6 mt-auto flex-shrink-0">
            <div className="bg-slate-50 rounded-[2rem] p-4 border border-slate-100/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 font-black">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate leading-none mb-1">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest truncate">{currentUser.role}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                  title="Sair do Sistema"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Fixo */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-30">
          <div className="flex items-center gap-6">
            <button 
              className="lg:hidden p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all shadow-sm active:scale-95" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            
            <div className="flex items-center gap-4">
              {currentUser.role === UserRoleType.ADMIN ? (
                <div className="relative group">
                  <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-black border border-slate-200 shadow-sm transition-all active:scale-95">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="uppercase tracking-widest">{currentCity.name} - {currentCity.uf}</span>
                    <ChevronDown className="w-4 h-4 text-slate-300" />
                  </button>
                  <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-slate-100 rounded-[1.8rem] shadow-2xl py-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Alterar Unidade</p>
                    </div>
                    {mockCities.map(city => (
                      <button 
                        key={city.id} 
                        onClick={() => setSelectedCityId(city.id)}
                        className={`
                          w-full text-left px-5 py-3 text-xs font-bold transition-colors flex items-center justify-between
                          ${selectedCityId === city.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                      >
                        {city.name} - {city.uf}
                        {selectedCityId === city.id && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{currentCity.name} - {currentCity.uf}</span>
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 px-4 border-l border-slate-100 h-10 ml-auto">
            <div className="text-right">
              <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Acesso do Dia</p>
              <p className="text-sm font-black text-slate-700">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </header>

        {/* Content Section Rolável */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto pb-20">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
