
import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Layers, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { mockUsers } from '../mockData';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username.toLowerCase());
      if (user) {
        onLogin(user);
      } else {
        setError('Credenciais inválidas. Verifique seu usuário e senha.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      
      {/* LADO ESQUERDO: FORMULÁRIO (40% no Desktop) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center p-8 sm:p-12 xl:p-20 relative bg-white z-10">
        
        {/* Logo Mobile Only */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-blue-100 rotate-3">M</div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">MFC Gestão</h1>
        </div>

        <div className="max-w-md w-full mx-auto">
          <header className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Bem-vindo.</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Acesse o painel administrativo para gerenciar sua unidade e equipes base do movimento.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Usuário de Acesso</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-14 pr-5 py-4.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 transition-all font-semibold"
                  placeholder="Ex: admin_tatui"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Senha Segura</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-14 pr-14 py-4.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 transition-all font-semibold"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-blue-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-100" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Lembrar acesso</span>
              </label>
              <button type="button" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Esqueci a senha</button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 text-red-600 text-xs font-bold animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black rounded-[1.8rem] shadow-2xl shadow-blue-100 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar no Sistema
                  <LogIn className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-slate-50 text-center">
             <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] mb-4">Dica para Testes</p>
             <div className="flex justify-center gap-2">
                <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg text-[9px] font-black border border-slate-100">USUÁRIO: admin</span>
                <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg text-[9px] font-black border border-slate-100">OU: alziraloretti</span>
             </div>
          </footer>
        </div>
      </div>

      {/* LADO DIREITO: INFO & IMAGEM (60% no Desktop) */}
      <div className="hidden lg:flex w-[60%] bg-blue-600 relative overflow-hidden items-center justify-center p-20">
        
        {/* Background Decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full -mr-96 -mt-96 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full -ml-48 -mb-48 blur-2xl"></div>
        
        <div className="relative z-10 max-w-2xl w-full text-white">
          <div className="flex items-center gap-4 mb-16 animate-in fade-in slide-in-from-left duration-700">
            <div className="w-16 h-16 bg-white rounded-[1.8rem] flex items-center justify-center text-blue-600 font-black text-3xl shadow-2xl rotate-6">M</div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter leading-none mb-1">MFC Gestão</h1>
              <p className="text-blue-100 font-bold uppercase tracking-[0.3em] text-[10px]">Movimento Familiar Cristão</p>
            </div>
          </div>

          <h3 className="text-5xl font-black tracking-tight leading-[1.1] mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            A tecnologia a serviço da <span className="text-blue-300">comunidade e da fé.</span>
          </h3>

          <div className="grid grid-cols-2 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-blue-300" />
                </div>
                <h4 className="font-black text-sm uppercase tracking-widest">Gestão Total</h4>
              </div>
              <p className="text-blue-100/70 text-sm leading-relaxed font-medium">Controle demográfico, cargos e financeiro de forma centralizada por cidade.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <Heart className="w-5 h-5 text-blue-300" />
                </div>
                <h4 className="font-black text-sm uppercase tracking-widest">Núcleos de Base</h4>
              </div>
              <p className="text-blue-100/70 text-sm leading-relaxed font-medium">Acompanhe o crescimento das Equipes Base e o engajamento dos MFCistas.</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-14 h-14 rounded-2xl bg-white/20 border-4 border-blue-700 flex items-center justify-center font-black text-xs">U{i}</div>
               ))}
               <div className="w-14 h-14 rounded-2xl bg-blue-400 border-4 border-blue-700 flex items-center justify-center font-black text-xs">+</div>
             </div>
             <div className="text-right">
                <p className="text-3xl font-black">+430</p>
                <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">MFCistas Cadastrados</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
