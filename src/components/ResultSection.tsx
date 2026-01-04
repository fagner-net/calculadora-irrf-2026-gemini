import React from 'react';
import type { CalculationDetail } from '../services/irrf-calculator';
import { formatCurrency } from '../utils/format';

interface ResultSectionProps {
  title: string;
  detail: CalculationDetail;
  isBest: boolean;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ title, detail, isBest }) => {
  return (
    <div className={`h-full bg-white shadow-md rounded px-8 pt-6 pb-8 flex flex-col ${isBest ? 'border-2 border-green-500 ring-2 ring-green-100' : 'border border-gray-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {isBest && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Melhor Opção</span>}
      </div>
      
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="flex justify-between items-end">
            <div>
                <p className="text-sm text-gray-600">Base de Cálculo</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(detail.baseCalculation)}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-500">Deduções Totais</p>
                <p className="text-sm font-medium text-gray-700">{formatCurrency(detail.deductions)}</p>
            </div>
        </div>
        
        {/* Highlight 65+ Exemption if active */}
        {detail.exemption65Value > 0 && (
           <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center text-xs text-blue-600">
              <span>Isenção 65 anos aplicada:</span>
              <span className="font-medium">{formatCurrency(detail.exemption65Value)}</span>
           </div>
        )}
      </div>

      <div className="overflow-x-auto mb-4 flex-grow">
        <table className="min-w-full text-xs text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th className="px-2 py-2">Faixa</th>
                    <th className="px-2 py-2">Alíquota</th>
                    <th className="px-2 py-2 text-right">Imposto</th>
                </tr>
            </thead>
            <tbody>
                {detail.brackets.map((b, idx) => (
                    <tr key={idx} className="bg-white border-b">
                        <td className="px-2 py-1">{b.range}</td>
                        <td className="px-2 py-1">{(b.rate * 100).toFixed(1).replace('.', ',')}%</td>
                        <td className="px-2 py-1 text-right">{formatCurrency(b.taxAmount)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 pt-2 space-y-2 mt-auto">
        <div className="flex justify-between text-sm">
            <span className="text-gray-600">Imposto Bruto:</span>
            <span className="font-medium">{formatCurrency(detail.grossTax)}</span>
        </div>
        
        {/* Detalhamento do Redutor */}
        <div className="bg-green-50 p-2 rounded border border-green-100">
            <div className="flex justify-between text-sm text-green-700 font-medium">
                <span>Redutor:</span>
                <span>- {formatCurrency(detail.reductionValue)}</span>
            </div>
            <p className="text-[10px] text-green-600 mt-1 italic">
                {detail.reductionExplanation}
            </p>
        </div>

        <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 border-t border-gray-300 pt-4">
            <span>IRRF a Reter:</span>
            <span>{formatCurrency(detail.netTax)}</span>
        </div>
        <div className="text-right text-xs text-gray-400 mt-1">
            Alíquota Efetiva: {(detail.effectiveRate * 100).toFixed(2).replace('.', ',')}%
        </div>
      </div>
    </div>
  );
};