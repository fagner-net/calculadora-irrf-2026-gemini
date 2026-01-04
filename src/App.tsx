import { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { InputGroup } from './components/InputGroup';
import { ResultSection } from './components/ResultSection';
import { calculateIRRF, type CalculationInput } from './services/irrf-calculator';
import { formatCurrency } from './utils/format';

function App() {
  const [values, setValues] = useState<CalculationInput>({
    grossSalary: 0,
    dependents: 0,
    alimony: 0,
    socialSecurity: 0,
    otherDeductions: 0,
    isRetiree65Plus: false,
  });

  const handleChange = (field: keyof CalculationInput, value: number | boolean) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    return calculateIRRF(values);
  }, [values]);

  const orderedResults = results.bestMethod === 'full' 
    ? [ { type: 'full', title: 'Cálculo Completo', data: results.full }, { type: 'simplified', title: 'Cálculo Simplificado', data: results.simplified } ]
    : [ { type: 'simplified', title: 'Cálculo Simplificado', data: results.simplified }, { type: 'full', title: 'Cálculo Completo', data: results.full } ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-700 sm:text-4xl">
            Simulador IRRF 2026
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Lei nº 15.270/2025 e IN RFB nº 2.299/2025
          </p>
        </div>

        {/* Financial Inputs Section (Top) */}
        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
           <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
             Dados Financeiros
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <InputGroup 
                  label="Remuneração Bruta Mensal" 
                  value={values.grossSalary} 
                  onChange={(v) => handleChange('grossSalary', v)} 
                  prefix="R$"
               />
               
               <InputGroup 
                  label="Previdência Oficial (INSS)" 
                  value={values.socialSecurity} 
                  onChange={(v) => handleChange('socialSecurity', v)} 
                  prefix="R$"
               />

               <InputGroup 
                  label="Número de Dependentes" 
                  value={values.dependents} 
                  onChange={(v) => handleChange('dependents', v)} 
                  step="1"
               />

               <InputGroup 
                  label="Pensão Alimentícia" 
                  value={values.alimony} 
                  onChange={(v) => handleChange('alimony', v)} 
                  prefix="R$"
               />

               <InputGroup 
                  label="Outras Deduções" 
                  value={values.otherDeductions} 
                  onChange={(v) => handleChange('otherDeductions', v)} 
                  prefix="R$"
               />

               <div className="flex items-end pb-3">
                 <div className="flex items-center h-10">
                    <input 
                        id="retiree" 
                        type="checkbox" 
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={values.isRetiree65Plus}
                        onChange={(e) => handleChange('isRetiree65Plus', e.target.checked)}
                    />
                    <label htmlFor="retiree" className="ml-3 text-sm font-medium text-gray-900 cursor-pointer select-none">
                        Aposentado/Pensionista (65+)
                    </label>
                 </div>
               </div>
           </div>
        </div>

        {/* Savings Alert */}
        <AnimatePresence>
            {results.savings > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm"
                >
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <span className="font-bold">Economia Mensal:</span> Ao optar pelo modelo <span className="font-bold uppercase">{results.bestMethod === 'full' ? 'Completo' : 'Simplificado'}</span>, 
                                você economiza <span className="font-bold text-lg">{formatCurrency(results.savings)}</span>.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Results Section (Bottom - Animated Swap) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LayoutGroup>
                {orderedResults.map((item) => (
                    <motion.div 
                        layout 
                        key={item.type}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="h-full"
                    >
                        <ResultSection 
                            title={item.title} 
                            detail={item.data} 
                            isBest={results.bestMethod === item.type}
                        />
                    </motion.div>
                ))}
            </LayoutGroup>
        </div>

      </div>
    </div>
  );
}

export default App;
