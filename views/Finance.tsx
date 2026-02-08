
import React from 'react';
import { TrendingUp, TrendingDown, Users, Wallet, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinanceView: React.FC<{ cityId: string }> = ({ cityId }) => {
  const data = [
    { name: 'Jul', total: 4000 },
    { name: 'Ago', total: 4500 },
    { name: 'Set', total: 4200 },
    { name: 'Out', total: 5100 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Financeiro - Tatuí</h2>
        <p className="text-gray-500">Gestão de arrecadações e fundos da unidade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Wallet className="w-6 h-6" /></div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+ R$ 500,00 este mês</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Saldo em Caixa</h3>
          <p className="text-3xl font-bold text-gray-900">R$ 12.450,00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">88% de adesão</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">MFCistas Adimplentes</h3>
          <p className="text-3xl font-bold text-gray-900">382 / 432</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><TrendingDown className="w-6 h-6" /></div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">-5% vs mês anterior</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pendências Totais</h3>
          <p className="text-3xl font-bold text-gray-900">R$ 2.150,00</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Histórico de Arrecadação</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
