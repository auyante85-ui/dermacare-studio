import React, { useState } from 'react';
import { 
  PersonalizedRoutine, 
  RoutineStep, 
  SkinType, 
  SkinConcern,
  CosmeticProduct
} from '../../types';
import { COSMETIC_PRODUCTS } from '../../data/mockData';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Check, 
  Copy, 
  Printer, 
  RefreshCw, 
  Info,
  Droplets,
  Calendar,
  ShoppingBag,
  Tag,
  ShieldCheck,
  PlusCircle,
  Award,
  Layers,
  ExternalLink,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { getProductBuyInfo } from '../../utils/productLinks';

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
  const [activeTab, setActiveTab] = useState<'AM' | 'PM' | 'WEEKLY' | 'PRODUCTS'>('AM');
  const [clientName, setClientName] = useState<string>(initialData?.clientName || 'Cliente');
  const [skinType, setSkinType] = useState<SkinType>(initialData?.skinType || 'madura');
  const [sensitivity, setSensitivity] = useState<'baja' | 'moderada' | 'alta'>(initialData?.sensitivity || 'moderada');
  const [lifestyle, setLifestyle] = useState<string>('Clima mediterráneo, trabajo en interiores con luz artificial');
  const [budgetLevel, setBudgetLevel] = useState<string>('todos');
  const [clientNotes, setClientNotes] = useState<string>('Tratamiento de redensificación, firmeza y nutrición intensa para compensar la pérdida de colágeno y sequedad.');

  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('todos');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Default dynamic steps tailored with high clinical precision
  const [morningSteps, setMorningSteps] = useState<RoutineStep[]>([
    {
      id: 'am_1',
      stepNumber: 1,
      category: 'Limpieza',
      name: 'Emulsión Limpiadora Syndet Hidronutritiva pH 5.5',
      activeIngredient: 'Ceramidas + Pantenol 3% + Glicerina',
      frequency: 'Diaria (Mañana)',
      applicationTime: 'AM',
      productType: 'Emulsión limpiadora',
      tips: 'Lavar con agua templada sin frotar agresivamente para preservar la barrera lipídica y secar a toques suaves.'
    },
    {
      id: 'am_2',
      stepNumber: 2,
      category: 'Tratamiento Activo',
      name: 'Sérum Antioxidante & Péptidos Redensificantes',
      activeIngredient: 'Vitamina C Microencapsulada 10% + Péptidos de Cobre GHK-Cu',
      frequency: 'Diaria (Mañana)',
      applicationTime: 'AM',
      productType: 'Sérum antioxidante',
      tips: 'Aplicar 4-5 gotas sobre rostro, cuello y escote limpios para neutralizar radicales libres y estimular síntesis de colágeno.'
    },
    {
      id: 'am_3',
      stepNumber: 3,
      category: 'Hidratación',
      name: 'Crema Redensificante & Reafirmante con Proxylane & Ácido Hialurónico',
      activeIngredient: 'Pro-Xylane 3% + Fitoestrógenos + Ácido Hialurónico Multimolecular',
      frequency: 'Diaria (Mañana)',
      applicationTime: 'AM',
      productType: 'Crema redensificante',
      tips: 'Extender con masajes ascendentes desde la clavícula hacia el mentón y pómulos para reafirmar el óvalo facial.'
    },
    {
      id: 'am_4',
      stepNumber: 4,
      category: 'Fotoprotección',
      name: 'Fotoprotector Anti-Edad Age Active Fluid FPS 50+',
      activeIngredient: 'Filtros UVA/UVB Amplio Espectro + Fernblock + Ácido Hialurónico',
      frequency: 'Diaria (Reaplicar según exposición solar)',
      applicationTime: 'AM',
      productType: 'Protector solar facial',
      tips: 'Aplicar 2 líneas de producto en los dedos para proteger rostro y cuello contra el fotoenvejecimiento y manchas solares.'
    }
  ]);

  const [nightSteps, setNightSteps] = useState<RoutineStep[]>([
    {
      id: 'pm_1',
      stepNumber: 1,
      category: 'Doble Limpieza',
      name: '1º Aceite Tratante Vegetal + 2º Emulsión Calmante',
      activeIngredient: 'Aceite de Onagra Bio + Almendras Dulces + Centella Asiática',
      frequency: 'Diaria (Noche)',
      applicationTime: 'PM',
      productType: 'Doble limpieza nutritiva',
      tips: 'El aceite botánico disuelve filtros solares y restos de polución sin alterar los lípidos cutáneos.'
    },
    {
      id: 'pm_2',
      stepNumber: 2,
      category: 'Tratamiento Activo',
      name: 'Retinaldehído Encapsulado 0.05% o Complejo Peptídico Tensor',
      activeIngredient: 'Retinaldehído + Matrixyl 3000 + Niacinamida 3%',
      frequency: '3 a 4 noches por semana alternas',
      applicationTime: 'PM',
      productType: 'Sérum renovador nocturno',
      tips: 'Aplicar la cantidad de un guisante sobre piel completamente seca. Estimula la renovación celular profunda sin irritación.'
    },
    {
      id: 'pm_3',
      stepNumber: 3,
      category: 'Nutrición',
      name: 'Bálsamo Relipidizante Intensivo 3 Ceramidas & Ácidos Grasos Omega 6-9',
      activeIngredient: 'Ceramidas 1,3,6 + Colesterol + Aceite de Onagra & Karité',
      frequency: 'Diaria (Noche)',
      applicationTime: 'PM',
      productType: 'Crema reparadora intensiva',
      tips: 'Sella los activos de la noche y repara el manto epicutáneo frente a la sequedad hormonal o estacional.'
    }
  ]);

  const [weeklyTreatments, setWeeklyTreatments] = useState<Array<{ name: string; frequency: string; description: string }>>([
    {
      name: 'Exfoliación Enzimática Suave o con Ácido Láctico al 5%',
      frequency: '1 noche por semana (noche sin retinoides)',
      description: 'Retira células muertas queratinizadas del estrato córneo sin agredir ni deshidratar pieles maduras o reactivas.'
    },
    {
      name: 'Mascarilla Bioreparadora con Factores de Crecimiento & Ácido Hialurónico',
      frequency: '1-2 veces por semana tras la higiene o exfoliación',
      description: 'Aporte de turgencia, volumen hídrico y confort inmediato para recuperar luminosidad y densidad dérmica.'
    }
  ]);

  const [secretTip, setSecretTip] = useState<string>(
    'Pauta clínica fundamental: En pieles maduras y durante la menopausia, la reposición de lípidos (ceramidas, colesterol y ácidos grasos esenciales como el aceite de onagra) junto a activos estimuladores de colágeno (Proxylane, Péptidos y Retinaldehído) es la clave para restaurar el espesor epidérmico y la turgencia.'
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
          concerns: initialData?.concerns || (skinType === 'madura' || skinType === 'menopausica' ? ['piel_madura', 'menopausia_climaterio', 'deshidratacion'] : ['manchas_hiperpigmentacion', 'deshidratacion']),
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
            frequency: s.frequency || 'Diaria (Mañana)',
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
            frequency: s.frequency || 'Diaria (Noche)',
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
Preferencia / Presupuesto: ${budgetLevel}

☀️ RUTINA DE MAÑANA (AM):
${morningSteps.map(s => `Paso ${s.stepNumber} [${s.category}]: ${s.name} (${s.activeIngredient})\n  • Modo de uso: ${s.tips}`).join('\n\n')}

🌙 RUTINA DE NOCHE (PM):
${nightSteps.map(s => `Paso ${s.stepNumber} [${s.category}]: ${s.name} (${s.activeIngredient})\n  • Frecuencia: ${s.frequency}\n  • Modo de uso: ${s.tips}`).join('\n\n')}

✨ TRATAMIENTOS SEMANALES:
${weeklyTreatments.map(w => `• ${w.name} (${w.frequency}): ${w.description}`).join('\n')}

💡 REGLA DE ORO DE LA ESPECIALISTA:
${secretTip}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Filter products from COSMETIC_PRODUCTS based on selected budget & skin type
  const filteredProducts = COSMETIC_PRODUCTS.filter(p => {
    const matchBudget = budgetLevel === 'todos' || p.priceRange === budgetLevel;
    const matchSkin = p.skinTypes.includes(skinType) || p.skinTypes.includes('seca') || p.skinTypes.includes('normal');
    const matchCategory = productCategoryFilter === 'todos' || p.category.toLowerCase().includes(productCategoryFilter.toLowerCase());
    return matchBudget && (budgetLevel !== 'todos' ? true : matchSkin) && matchCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5D9] text-[#3C473E] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5A6B5D]" />
            Formulación & Prescripción Dermocosmética
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1A1A1A]">
            Generador de Rutinas Personalizadas
          </h1>
          <p className="text-xs sm:text-sm text-[#78736B] mt-1">
            Diseño cronobiológico de cuidado facial (Mañana, Noche, Refuerzo Semanal y Catálogo de Productos) adaptado al biotipo cutáneo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-copy-routine"
            onClick={handleCopyRoutine}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D8D2C4] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#5A6B5D]" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Rutina'}</span>
          </button>

          <button
            id="btn-print-routine"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D8D2C4] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#5A6B5D]" />
            <span>Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {/* AI Customization Panel: Adaptación de la Rutina */}
      <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-7 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#E5E2D9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A6B5D] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-[#E5ECE6]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                Adaptación de la Rutina con el Especialista
              </h3>
              <p className="text-xs text-[#78736B]">
                Selecciona tu tipo de piel, preferencias de compra y presupuesto para calibrar los cosméticos disponibles.
              </p>
            </div>
          </div>

          <button
            id="btn-generate-ai-routine"
            onClick={handleGenerateAIRoutine}
            disabled={isGeneratingAI}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] disabled:opacity-50 transition-all shadow-xs cursor-pointer shrink-0"
          >
            {isGeneratingAI ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BAC7BC]" />
                <span>Generando Rutina con IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#BAC7BC]" />
                <span>Actualizar Rutina con IA</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
              Tipo de Piel & Condición
            </label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value as SkinType)}
              className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
            >
              <option value="madura">✨ Pieles Maduras (Líneas profundas, pérdida de firmeza y densidad)</option>
              <option value="menopausica">🌸 Menopausia / Climaterio (Sequedad hormonal, sofocos y afinamiento)</option>
              <option value="mixta">Piel Mixta (Zona T oleosa y laterales normales/secos)</option>
              <option value="grasa">Piel Grasa (Exceso de sebo y poros dilatados)</option>
              <option value="seca">Piel Seca / Alípica (Tirantez y falta de lípidos)</option>
              <option value="sensible">Piel Sensible / Reactiva (Rojeces y fragilidad)</option>
              <option value="normal">Piel Normal / Equilibrada (Eudérmica)</option>
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
              <option value="todos">✨ Todos los Segmentos & Precios</option>
              <option value="farmacia">💊 Dermofarmacia Española & Europea (Vichy, ISDIN, La Roche-Posay, Cerave, Sesderma, Avène, Cantabria Labs)</option>
              <option value="alta_cosmetica">💎 Alta Cosmética & Cosmecéutica (Medik8, SkinCeuticals, Endocare Cellage, Caudalie Premier Cru)</option>
              <option value="natural_eco">🌿 Cosmética Natural & Bio Certificada (Weleda, Caudalie Resveratrol, Apivita Queen Bee, Dr. Hauschka, Nuxe)</option>
              <option value="economico">🏷️ Económico / Accesible / Primor & Druni (The Ordinary, Ziaja, Mercadona Deliplus)</option>
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
              placeholder="Ej. Texturas ricas, sin fragancia, flacidez en cuello..."
              className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
            />
          </div>
        </div>
      </div>

      {/* Routine Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#E5E2D9] mb-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <button
            id="tab-routine-am"
            onClick={() => setActiveTab('AM')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'AM'
                ? 'border-[#5A6B5D] text-[#1A1A1A]'
                : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Rutina de Mañana (AM)</span>
            <span className="bg-[#EAE5D9] text-[#3C473E] text-xs px-2.5 py-0.5 rounded-full font-bold">
              {morningSteps.length}
            </span>
          </button>

          <button
            id="tab-routine-pm"
            onClick={() => setActiveTab('PM')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'PM'
                ? 'border-[#5A6B5D] text-[#1A1A1A]'
                : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-600" />
            <span>Rutina de Noche (PM)</span>
            <span className="bg-[#EAE5D9] text-[#3C473E] text-xs px-2.5 py-0.5 rounded-full font-bold">
              {nightSteps.length}
            </span>
          </button>

          <button
            id="tab-routine-weekly"
            onClick={() => setActiveTab('WEEKLY')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
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

          <button
            id="tab-routine-products"
            onClick={() => setActiveTab('PRODUCTS')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-display text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'PRODUCTS'
                ? 'border-[#5A6B5D] text-[#1A1A1A]'
                : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#5A6B5D]" />
            <span>Vademécum de Productos</span>
            <span className="bg-[#5A6B5D] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filteredProducts.length}
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
              <strong className="font-semibold block text-sm">Objetivo Matutino: Protección Antioxidante & Refuerzo de Barrera</strong>
              Por la mañana el foco prioritario es blindar la piel contra la radiación ultravioleta, luz azul y estrés oxidativo mediante antioxidantes (Vitamina C, Péptidos) y fotoprotector solar FPS 50+.
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

                <div className="mt-3 pt-3 border-t border-[#F4F0E8] flex items-center justify-end">
                  {(() => {
                    const buyInfo = getProductBuyInfo(step.name, undefined, step.purchaseUrl, step.storeName);
                    return (
                      <a
                        id={`buy-am-step-${step.id}`}
                        href={buyInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF4F0] hover:bg-[#2D3B2D] text-[#2D3B2D] hover:text-white text-xs font-semibold rounded-xl border border-[#C5D5C8] hover:border-[#2D3B2D] transition-all group shadow-2xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span>Ver / Comprar ({buyInfo.storeName})</span>
                        <ExternalLink className="w-3 h-3 text-[#78736B] group-hover:text-white" />
                      </a>
                    );
                  })()}
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
              <strong className="font-semibold block text-sm">Objetivo Nocturno: Regeneración Celular & Reposición Lipídica</strong>
              Durante las horas de descanso nocturno el flujo sanguíneo y la mitosis celular se activan. Es el momento idóneo para redensificar con retinoides/retinal, ceramidas y ácidos grasos esenciales.
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

                <div className="mt-3 pt-3 border-t border-[#F4F0E8] flex items-center justify-end">
                  {(() => {
                    const buyInfo = getProductBuyInfo(step.name, undefined, step.purchaseUrl, step.storeName);
                    return (
                      <a
                        id={`buy-pm-step-${step.id}`}
                        href={buyInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF4F0] hover:bg-[#2D3B2D] text-[#2D3B2D] hover:text-white text-xs font-semibold rounded-xl border border-[#C5D5C8] hover:border-[#2D3B2D] transition-all group shadow-2xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span>Ver / Comprar ({buyInfo.storeName})</span>
                        <ExternalLink className="w-3 h-3 text-[#78736B] group-hover:text-white" />
                      </a>
                    );
                  })()}
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
              Complementos periódicos para afinar el estrato córneo, renovar la textura y recargar las reservas dérmicas de agua y lípidos.
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

      {/* VADEMÉCUM DE PRODUCTOS RECOMENDADOS */}
      {activeTab === 'PRODUCTS' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-[#EFF4F0] border border-[#C5D5C8] p-5 rounded-2xl flex items-start gap-3.5 text-xs text-[#2B352D]">
            <ShoppingBag className="w-5 h-5 text-[#5A6B5D] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm">Catálogo Extendido de Cosméticos del Mercado Español y Europeo</strong>
              Selección de productos dermatológicos, cosmecéuticos, de farmacia, naturales y económicos clasificados por tipo de piel (incluyendo piel madura y menopausia), activos y rango de precio.
            </div>
          </div>

          {/* Quick Category filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'todos', label: 'Todos los Productos' },
              { id: 'Crema', label: 'Cremas & Bálsamos' },
              { id: 'Sérum', label: 'Sérums Concentrados' },
              { id: 'Protector', label: 'Fotoprotectores Solares' },
              { id: 'Limpieza', label: 'Limpiadores & Aceites' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setProductCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
                  productCategoryFilter === cat.id
                    ? 'bg-[#5A6B5D] text-white shadow-xs'
                    : 'bg-white border border-[#E5E2D9] text-[#78736B] hover:border-[#BAC7BC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-[#E5E2D9] rounded-2xl p-5 hover:border-[#BAC7BC] transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block">
                        {prod.brand} • {prod.category}
                      </span>
                      <h4 className="font-bold text-sm text-[#1A1A1A] mt-0.5">
                        {prod.name}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#F9F7F2] border border-[#E5E2D9] text-xs font-bold text-[#2B352D] shrink-0">
                      {prod.priceEstimated}
                    </span>
                  </div>

                  <p className="text-xs text-[#615C54] leading-relaxed mb-3">
                    {prod.description}
                  </p>

                  <div className="space-y-1.5 text-[11px] mb-3">
                    <div>
                      <strong className="text-[#3C473E]">Activos Clave: </strong>
                      <span className="text-[#615C54]">{prod.mainActives.join(', ')}</span>
                    </div>
                    {prod.certification && (
                      <div className="text-[10px] text-[#5A6B5D] font-semibold">
                        ✓ {prod.certification}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F4F0E8] space-y-2.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#78736B]">
                      <span className="capitalize">{prod.texture}</span>
                      <span>•</span>
                      <span>Uso: {prod.usageTime}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                      prod.priceRange === 'alta_cosmetica' ? 'bg-amber-100 text-amber-900' :
                      prod.priceRange === 'farmacia' ? 'bg-blue-100 text-blue-900' :
                      prod.priceRange === 'natural_eco' ? 'bg-emerald-100 text-emerald-900' :
                      'bg-zinc-100 text-zinc-900'
                    }`}>
                      {prod.priceRange.replace('_', ' ')}
                    </span>
                  </div>

                  {(() => {
                    const buyInfo = getProductBuyInfo(prod.name, prod.brand, prod.purchaseUrl, prod.storeName);
                    return (
                      <a
                        id={`buy-routine-product-${prod.id}`}
                        href={buyInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#2D3B2D] hover:bg-[#1E281E] text-white text-xs font-semibold rounded-xl transition-all shadow-xs hover:shadow group"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#EAE5D9] group-hover:scale-110 transition-transform" />
                        <span>Ver / Comprar ({buyInfo.storeName})</span>
                        <ExternalLink className="w-3 h-3 text-[#BAC7BC] ml-auto" />
                      </a>
                    );
                  })()}
                </div>
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
          <div className="font-bold text-sm text-[#1A1A1A]">¿Deseas una consulta diagnóstica personalizada?</div>
          <div className="text-xs text-[#78736B]">Agenda una asesoría virtual o en cabina con la especialista.</div>
        </div>

        <button
          onClick={onGoToBooking}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-[#BAC7BC]" />
          <span>Agendar Consulta con la Cosmetóloga</span>
        </button>
      </div>
    </div>
  );
};
