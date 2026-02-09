
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('1');

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
    { name: 'Tesouraria Equipes', icon: DollarSign, view: 'financeiro' as View, roles: [UserRoleType.ADMIN, UserRoleType.TESOUREIRO, UserRoleType.COORD_CIDADE] },
    { name: 'Livro Caixa', icon: BookOpen, view: 'livro-caixa' as View, roles: [UserRoleType.ADMIN, UserRoleType.TESOUREIRO, UserRoleType.COORD_CIDADE] },
    { name: 'Usuários Sistema', icon: UserCog, view: 'usuarios' as View, roles: [UserRoleType.ADMIN] },
    { name: 'Configurações', icon: Settings, view: 'permissoes' as View, roles: [UserRoleType.ADMIN] },
  ];

  const filteredNav = navigation.filter(item => !item.roles || item.roles.includes(currentUser.role));

  const handleNavigate = (view: View, id?: string) => {
    if (id) {
      if (view === 'perfil-membro') setSelectedMemberId(id);
      if (view === 'detalhe-equipe') setSelectedTeamId(id);
    }
    setCurrentView(view);
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
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <h1 className="text-xl font-bold text-gray-800">MFC Gestão</h1>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {filteredNav.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${currentView === item.view ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon className={`w-5 h-5 ${currentView === item.view ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {currentUser.name.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider truncate">{currentUser.role}</p>
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-4">
            {currentUser.role === UserRoleType.ADMIN ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100">
                  <MapPin className="w-4 h-4" />
                  {currentCity.name} - {currentCity.uf}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl hidden group-hover:block z-50">
                  {mockCities.map(city => (
                    <button 
                      key={city.id} 
                      onClick={() => setSelectedCityId(city.id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {city.name} - {city.uf}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{currentCity.name} - {currentCity.uf}</span>
              </div>
            )}
          </div>

          <div className="hidden sm:block text-right px-4">
            <p className="text-xs text-gray-400 font-medium">Data de hoje</p>
            <p className="text-sm font-bold text-gray-700">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
