
import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Heart,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  History,
  ArrowLeft,
  Mail
} from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';
import Button from '../components/Button';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

type AuthView = 'login' | 'recover' | 'success';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login(username.toLowerCase());
      onLogin(user);
    } catch (err) {
      setError('Credenciais inválidas. Verifique seu usuário e senha.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 font-sans p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-xl shadow-blue-900/5 border border-slate-100 p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/20 mb-6 rotate-3">
            M
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">MFC Gestão</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Movimento Familiar Cristão</p>
        </div>

        {view === 'login' && (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-semibold text-sm shadow-sm"
                    placeholder="Identificador"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha</label>
                  <button 
                    type="button" 
                    onClick={() => setView('recover')}
                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Recuperar
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="block w-full pl-11 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-semibold text-sm shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-blue-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-3 text-red-600 text-[11px] font-bold animate-in fade-in zoom-in-95 duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-2"
              >
                Entrar no Sistema
                <ChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Acessos de Teste</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-bold">ADMIN:</span>
                    <span className="text-blue-600 font-black">admin</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-bold">TESOUREIRO:</span>
                    <span className="text-indigo-600 font-black">alziraloretti</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'recover' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <header className="mb-8">
              <button 
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-black uppercase tracking-widest mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar ao login
              </button>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Recuperar Acesso</h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Informe o e-mail cadastrado para enviarmos as instruções.
              </p>
            </header>

            <form onSubmit={handleRecover} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail de Cadastro</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 focus:bg-white transition-all font-semibold text-sm shadow-sm"
                    placeholder="exemplo@mfc.org"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                isLoading={loading}
                className="w-full"
              >
                Enviar Link
                <ChevronRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>
        )}

        {view === 'success' && (
          <div className="text-center animate-in zoom-in-95 duration-500 py-6">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3">E-mail Enviado</h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
              Verifique sua caixa de entrada para continuar a recuperação.
            </p>
            <Button 
              onClick={() => setView('login')}
              variant="secondary"
              className="w-full"
            >
              Voltar ao Login
            </Button>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            MFC Unidade Tatuí
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
