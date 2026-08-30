import React, { useState } from 'react';
import { 
  PersonalizedRoutine, 
  RoutineStep, 
  SkinType, 
  SkinConcern 
} from '../../types';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Check, 
  Copy, 
  Share2, 
  Printer, 
  Bot, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  Clock,
  Droplets,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

interface RoutineGeneratorProps {
  initialData?: {
    clientName: string;
    skinType: SkinType;
    concerns: SkinConcern[];
    sensitivity: 'baja' | 'moderada' | 'alta';
  };
  onGoToBooking: () => void;
}

export const RoutineGenerator: React.FC<RoutineGeneratorProps> = ({
  initialData,
  onGoToBooking
}) => {
  const [activeTab, setActiveTab] = useState<'AM' | 'PM' | 'WEEKLY'>('AM');
  const [clientName, setClientName] = useState<string>(initialData?.clientName || 'María González');
  const [skinType, setSkinType] = useState<SkinType>(initialData?.skinType || 'mixta');
  const [sensitivity, setSensitivity] = useState<'baja' | 'moderada' | 'alta'>(initialData?.sensitivity || 'moderada');
  const [lifestyle, setLifestyle] = useState<string>('Clima templado, trabajo en oficina con aire acondicionado');
  const [budgetLevel, setBudgetLevel] = useState<string>('Intermedio (Calidad dermofarmacia)');
  const [clientNotes, setClientNotes] = useState<string>('Quiero atenuar manchas de sol y controlar brillo en zona T sin que me reseque.');

  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Default dynamic steps
  const [morningSteps, setMorningSteps] = useState<RoutineStep[]>([
    {
      id: 'am_1',
      stepNumber: 1,
      category: 'Limpieza',
      name: 'Gel Limpiador Suave Syndet pH 5.5',
      activeIngredient: 'Glicerina + Pantenol 2%',
      frequency: 'Diaria (Mañana)',
      applicationTime: 'AM',
      productType: 'Gel limpiador',
      tips: 'Lavar con agua tibia mediante movimientos circulares durante 60 segundos y secar a toques suaves con toalla limpia.'
    },
    {
      id: 'am_2',
      stepNumber: 2,
      category: 'Tratamiento Activo',
      name: 'Sérum Antioxidante Iluminador C-Radiance 15%',
      activeIngredient: 'Ácido L-Ascórbico + Ácido Ferúlico',
      frequency: 'Diaria (Mañana)',
      applicationTime: 'AM',
      productType: 'Sérum antioxidante',
      tips: 'Aplicar 4 gotas sobre piel limpia y completamente seca. Dejar absorber 2 minutos antes de la hidratación.'
    },
    {
      id: 'am_3',
      stepNumber: 3,
      category: 'Hidratación',
      name: 'Fluido Hidratante con Niacinamida 4% & Ácido Hialurónico',
      activeIngredient: 'Niacinamida + Sodium Hyaluronate',
      frequency: 'Diaria (Mañana)',
      applicationTime: 'AM',
      productType: 'Emulsión fluida',
      tips: 'Refuerza la barrera epidérmica y regula la síntesis de sebo a lo largo del día.'
    },
    {
      id: 'am_4',
      stepNumber: 4,
      category: 'Fotoprotección',
      name: 'Protector Solar Facial Invisible FPS 50+ Broad Spectrum',
      activeIngredient: 'Filtros Tinosorb S/M + Antioxidantes',
      frequency: 'Diaria (Cada 3 horas si hay exposición)',
      applicationTime: 'AM',
      productType: 'Protector solar',
      tips: 'Aplicar la cantidad de 2 dedos completos para rostro y cuello. Reaplicar con bruma o stick si estás fuera de casa.'
    }
  ]);

  const [nightSteps, setNightSteps] = useState<RoutineStep[]>([
    {
      id: 'pm_1',
      stepNumber: 1,
      category: 'Doble Limpieza',
      name: '1º Bálsamo Desmaquillante Oleoso + 2º Gel Syndet',
      activeIngredient: 'Escualano vegetal + Pantenol',
      frequency: 'Diaria (Noche)',
      applicationTime: 'PM',
      productType: 'Doble limpieza',
      tips: 'El aceite disuelve filtros solares y sebo; el gel acuoso elimina residuos hidrosolubles y sudor.'
    },
    {
      id: 'pm_2',
      stepNumber: 2,
      category: 'Tratamiento Activo',
      name: 'Retinaldehído 0.05% Emulsión Renovadora Antiedad',
      activeIngredient: 'Retinaldehído 0.05% + Niacinamida 2%',
      frequency: '3 noches por semana (Lunes, Miércoles, Viernes)',
      applicationTime: 'PM',
      productType: 'Sérum nocturno',
      tips: 'Aplicar del tamaño de un guisante sobre rostro seco. Si hay tirantez, usar técnica sándwich (crema -> retinal -> crema).'
    },
    {
      id: 'pm_3',
      stepNumber: 3,
      category: 'Nutrición',
      name: 'Crema Relipidizante con Complejo de 3 Ceramidas & Centella',
      activeIngredient: 'Ceramidas NP/AP/EOP + Madecassoside',
      frequency: 'Diaria (Noche)',
      applicationTime: 'PM',
      productType: 'Crema reparadora',
      tips: 'Sella los activos, repara la barrera cutánea durante las horas de sueño profundo y previene la inflamación.'
    }
  ]);

  const [weeklyTreatments, setWeeklyTreatments] = useState<Array<{ name: string; frequency: string; description: string }>>([
    {
      name: 'Exfoliación Química Suave con Ácido Láctico 5% o Enzimática',
      frequency: '1 noche por semana (Domingos - noche sin retinoides)',
      description: 'Disuelve suavemente las células muertas del estrato córneo sin agredir la barrera lipídica.'
    },
    {
      name: 'Mascarilla Calmante e Hidronutritiva de Avena y Centella',
      frequency: '1-2 veces por semana tras el exfoliante',
      description: 'Restaura la elasticidad, descongestiona y aporta luminosidad profunda.'
    }
  ]);

  const [secretTip, setSecretTip] = useState<string>(
    'Pauta de oro: La constancia vence a la intensidad. Introduce el Retinal 2 veces por semana las primeras 2 semanas antes de subir a días alternos, y jamás omitas el protector solar por la mañana.'
  );

  // Trigger AI generation
  const handleGenerateAIRoutine = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/cosmetology/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skinType,
          concerns: initialData?.concerns || ['manchas_hiperpigmentacion', 'acne'],
          sensitivity,
          lifestyle,
          budgetLevel,
          clientNotes
        })
      });

      const data = await response.json();
      if (data.success && data.routine) {
        const r = data.routine;
        if (r.morningSteps?.length) {
          setMorningSteps(r.morningSteps.map((s: any, idx: number) => ({
            id: `am_${idx}`,
            stepNumber: s.stepNumber || idx + 1,
            category: s.category || 'Tratamiento Activo',
            name: s.name,
            activeIngredient: s.active,
            frequency: s.frequency || 'Diaria',
            applicationTime: 'AM',
            productType: s.category,
            tips: s.tips
          })));
        }

        if (r.nightSteps?.length) {
          setNightSteps(r.nightSteps.map((s: any, idx: number) => ({
            id: `pm_${idx}`,
            stepNumber: s.stepNumber || idx + 1,
            category: s.category || 'Tratamiento Nocturno',
            name: s.name,
            activeIngredient: s.active,
            frequency: s.frequency || 'Diaria',
            applicationTime: 'PM',
            productType: s.category,
            tips: s.tips
          })));
        }

        if (r.weeklyTreatments?.length) {
          setWeeklyTreatments(r.weeklyTreatments);
        }

        if (r.consultantSecretTip) {
          setSecretTip(r.consultantSecretTip);
        }
      }
    } catch (err) {
      console.error('Error generating AI routine:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCopyRoutine = () => {
    const text = `🌸 RUTINA FACIAL PERSONALIZADA - DERMACARE STUDIO 🌸
Cliente: ${clientName} | Biotipo: Piel ${skinType.toUpperCase()} (Sensibilidad ${sensitivity})

☀️ RUTINA DE MAÑANA (AM):
${morningSteps.map(s => `Paso ${s.stepNumber} [${s.category}]: ${s.name} (${s.activeIngredient})\n  • Modo de uso: ${s.tips}`).join('\n\n')}

🌙 RUTINA DE NOCHE (PM):
${nightSteps.map(s => `Paso ${s.stepNumber} [${s.category}]: ${s.name} (${s.activeIngredient})\n  • Frecuencia: ${s.frequency}\n  • Modo de uso: ${s.tips}`).join('\n\n')}

✨ TRATAMIENTOS SEMANALES:
${weeklyTreatments.map(w => `• ${w.name} (${w.frequency}): ${w.description}`).join('\n')}

💡 CONSEJO PROFESIONAL: ${secretTip}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5D9] text-[#3C473E] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5A6B5D]" />
            Formulación & Prescripción Botánica y Clínica
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1A1A1A]">
            Generador de Rutinas Personalizadas
          </h1>
          <p className="text-xs sm:text-sm text-[#78736B] mt-1">
            Diseño cronobiológico de cuidado facial (Mañana, Noche y Tratamientos Especiales) adaptado a biotipo cutáneo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-copy-routine"
            onClick={handleCopyRoutine}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D8D2C4] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#5A6B5D]" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            id="btn-print-routine"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D8D2C4] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#5A6B5D]" />
            <span>Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {/* AI Customization Panel */}
      <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-7 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#E5E2D9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A6B5D] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-[#E5ECE6]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                Adaptación de tu Rutina con la Especialista
              </h3>
              <p className="text-xs text-[#78736B]">
                Ajusta tu presupuesto y estilo de vida para recibir cosméticos disponibles en España y la UE.
              </p>
            </div>
          </div>

          <button
            id="btn-generate-ai-routine"
            onClick={handleGenerateAIRoutine}
            disabled={isGeneratingAI}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] disabled:opacity-50 transition-all shadow-xs"
          >
            {isGeneratingAI ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BAC7BC]" />
                <span>Creando tu pauta personalizada...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#BAC7BC]" />
                <span>Actualizar Rutina</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
              Tipo de Piel & Sensibilidad
            </label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value as SkinType)}
              className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
            >
              <option value="mixta">Piel Mixta</option>
              <option value="grasa">Piel Grasa</option>
              <option value="seca">Piel Seca</option>
              <option value="sensible">Piel Sensible / Reactiva</option>
              <option value="normal">Piel Normal / Equilibrada</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
              Preferencia de Compra y Presupuesto
            </label>
            <select
              value={budgetLevel}
              onChange={(e) => setBudgetLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
            >
              <option value="Económico / Farmacia accesible">Accesible (Mercadona Deliplus, The Ordinary en Primor/Druni)</option>
              <option value="Intermedio (Calidad dermofarmacia)">Dermofarmacia Española (ISDIN, La Roche-Posay, Cerave, Sesderma)</option>
              <option value="Alta gama / Clínica cosmetológica">Alta cosmética (Cantabria Labs, Medik8, Skinceuticals)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
              Notas o Preferencias Particulares
            </label>
            <input
              type="text"
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="Ej. Prefiero texturas ligeras, busco embarazo, no me gustan perfumes..."
              className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
            />
          </div>
        </div>
      </div>

      {/* Routine Tabs (AM vs PM vs Weekly) */}
      <div className="flex items-center justify-between border-b border-[#E5E2D9] mb-6">
        <div className="flex items-center gap-2">
          <button
            id="tab-routine-am"
            onClick={() => setActiveTab('AM')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-sm font-bold transition-all ${
              activeTab === 'AM'
                ? 'border-[#5A6B5D] text-[#1A1A1A]'
                : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Rutina de Mañana (AM)</span>
            <span className="bg-[#EAE5D9] text-[#3C473E] text-xs px-2.5 py-0.5 rounded-full font-bold">
              {morningSteps.length} pasos
            </span>
          </button>

          <button
            id="tab-routine-pm"
            onClick={() => setActiveTab('PM')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-sm font-bold transition-all ${
              activeTab === 'PM'
                ? 'border-[#5A6B5D] text-[#1A1A1A]'
                : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-600" />
            <span>Rutina de Noche (PM)</span>
            <span className="bg-[#EAE5D9] text-[#3C473E] text-xs px-2.5 py-0.5 rounded-full font-bold">
              {nightSteps.length} pasos
            </span>
          </button>

          <button
            id="tab-routine-weekly"
            onClick={() => setActiveTab('WEEKLY')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-sm font-bold transition-all ${
              activeTab === 'WEEKLY'
                ? 'border-[#5A6B5D] text-[#1A1A1A]'
                : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C48B71]" />
            <span>Tratamientos Semanales</span>
            <span className="bg-[#EAE5D9] text-[#3C473E] text-xs px-2.5 py-0.5 rounded-full font-bold">
              {weeklyTreatments.length}
            </span>
          </button>
        </div>
      </div>

      {/* AM STEPS */}
      {activeTab === 'AM' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <Sun className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm">Objetivo Matutino: Protección Antioxidante & Barrera</strong>
              Por la mañana el foco prioritario es blindar la piel contra la radiación ultravioleta, luz azul y polución mediante antioxidantes (Vitamina C) y fotoprotector solar FPS 50+.
            </div>
          </div>

          <div className="space-y-3">
            {morningSteps.map((step) => (
              <div
                key={step.id}
                className="bg-white border border-[#E5E2D9] rounded-2xl p-5 hover:border-[#B8B09F] transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F4F0E8]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#5A6B5D] text-white font-display font-bold text-xs flex items-center justify-center shadow-xs">
                      {step.stepNumber}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D]">
                        {step.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">
                        {step.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#F9F7F2] border border-[#E5E2D9] text-[11px] font-semibold text-[#5A6B5D]">
                      {step.frequency}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#78736B] block mb-0.5">
                      Principio Activo Clave:
                    </span>
                    <p className="text-xs font-semibold text-[#1A1A1A]">
                      {step.activeIngredient}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#78736B] block mb-0.5">
                      Modo de Aplicación Profesional:
                    </span>
                    <p className="text-xs text-[#615C54] leading-relaxed">
                      {step.tips}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* PM STEPS */}
      {activeTab === 'PM' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-indigo-950">
            <Moon className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm">Objetivo Nocturno: Regeneración Celular & Renovación</strong>
              Durante el sueño el flujo sanguíneo cutáneo y la mitosis aumentan. Es el momento idóneo para transformar la piel con retinoides, lípidos reparadores y ceramidas.
            </div>
          </div>

          <div className="space-y-3">
            {nightSteps.map((step) => (
              <div
                key={step.id}
                className="bg-white border border-[#E5E2D9] rounded-2xl p-5 hover:border-[#B8B09F] transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F4F0E8]">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#5A6B5D] text-white font-display font-bold text-xs flex items-center justify-center shadow-xs">
                      {step.stepNumber}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D]">
                        {step.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#1A1A1A]">
                        {step.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#F9F7F2] border border-[#E5E2D9] text-[11px] font-semibold text-[#5A6B5D]">
                      {step.frequency}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#78736B] block mb-0.5">
                      Principio Activo Clave:
                    </span>
                    <p className="text-xs font-semibold text-[#1A1A1A]">
                      {step.activeIngredient}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#78736B] block mb-0.5">
                      Modo de Aplicación Profesional:
                    </span>
                    <p className="text-xs text-[#615C54] leading-relaxed">
                      {step.tips}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* WEEKLY TREATMENTS */}
      {activeTab === 'WEEKLY' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-[#F4EFEA] border border-[#DDD7C9] p-4 rounded-2xl flex items-start gap-3 text-xs text-[#2B352D]">
            <Sparkles className="w-5 h-5 text-[#5A6B5D] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm">Refuerzo Semanal Focalizado</strong>
              Complementos periódicos para afinar el estrato córneo y reponer el agua dérmica sin sobre-estimular la piel.
            </div>
          </div>

          <div className="space-y-3">
            {weeklyTreatments.map((treatment, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E5E2D9] rounded-2xl p-5 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F4F0E8]">
                  <h4 className="font-bold text-sm text-[#1A1A1A]">
                    {treatment.name}
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-[#F9F7F2] border border-[#E5E2D9] text-[11px] font-semibold text-[#5A6B5D]">
                    {treatment.frequency}
                  </span>
                </div>
                <p className="text-xs text-[#615C54] mt-2.5 leading-relaxed">
                  {treatment.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Professional Secret Tip Alert */}
      <div className="mt-8 bg-[#2B352D] text-[#F9F7F2] p-6 rounded-3xl flex items-start gap-3.5 shadow-sm">
        <Info className="w-5 h-5 text-[#BAC7BC] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#BAC7BC] mb-1">
            Regla de Oro de la Consultora Cosmetóloga
          </h4>
          <p className="text-xs sm:text-sm text-[#E5ECE6] leading-relaxed">
            {secretTip}
          </p>
        </div>
      </div>

      {/* Booking CTA Footer */}
      <div className="mt-8 pt-6 border-t border-[#E5E2D9] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-[#1A1A1A]">¿Deseas supervisión profesional de tu rutina?</div>
          <div className="text-xs text-[#78736B]">Agenda una asesoría virtual o presencial para ajustes finos.</div>
        </div>

        <button
          onClick={onGoToBooking}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs"
        >
          <Calendar className="w-4 h-4 text-[#BAC7BC]" />
          <span>Agendar Consulta con la Cosmetóloga</span>
        </button>
      </div>
    </div>
  );
};
