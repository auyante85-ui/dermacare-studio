import React, { useState } from 'react';
import { ActiveIngredient, CosmeticProduct, SkinConcern, SkinType } from '../../types';
import { INGREDIENTS_CATALOG, COSMETIC_PRODUCTS } from '../../data/mockData';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Droplet, 
  Sun, 
  Moon, 
  Scale, 
  Baby, 
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { motion } from 'motion/react';

export const IngredientsCatalog: React.FC = () => {
  const [viewMode, setViewMode] = useState<'actives' | 'products' | 'matrix'>('actives');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedConcern, setSelectedConcern] = useState<string>('todos');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('todos');
  const [onlyPregnancySafe, setOnlyPregnancySafe] = useState<boolean>(false);

  // Active Compatibility Matrix state
  const [activeA, setActiveA] = useState<string>('retinol');
  const [activeB, setActiveB] = useState<string>('niacinamida');

  // Filter Actives
  const filteredActives = INGREDIENTS_CATALOG.filter((act) => {
    const matchesSearch = act.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          act.inci.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          act.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConcern = selectedConcern === 'todos' || act.bestFor.includes(selectedConcern as SkinConcern);
    const matchesSkin = selectedSkinType === 'todos' || act.suitableForSkin.includes(selectedSkinType as SkinType);
    const matchesPregnancy = !onlyPregnancySafe || act.pregnancySafe;
    return matchesSearch && matchesConcern && matchesSkin && matchesPregnancy;
  });

  // Filter Products
  const filteredProducts = COSMETIC_PRODUCTS.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prod.mainActives.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesConcern = selectedConcern === 'todos' || prod.concerns.includes(selectedConcern as SkinConcern);
    const matchesSkin = selectedSkinType === 'todos' || prod.skinTypes.includes(selectedSkinType as SkinType);
    return matchesSearch && matchesConcern && matchesSkin;
  });

  // Matrix analysis logic
  const getMatrixEvaluation = (idA: string, idB: string) => {
    if (idA === idB) {
      return {
        status: 'neutral',
        title: 'Mismo Activo',
        badge: 'NEUTRO',
        description: 'Estás evaluando la misma molécula cosmética.'
      };
    }

    if (
      (idA === 'retinol' && idB === 'niacinamida') ||
      (idA === 'niacinamida' && idB === 'retinol')
    ) {
      return {
        status: 'synergy',
        title: 'Sinergia de Oro (Potenciación + Tolerancia)',
        badge: 'SINERGIA EXCELENTE',
        description: 'La Niacinamida refuerza la síntesis de ceramidas e incrementa la tolerancia biológica al Retinoide, mitigando la irritación y potenciando el antienvejecimiento.'
      };
    }

    if (
      (idA === 'vitamina_c' && idB === 'retinol') ||
      (idA === 'retinol' && idB === 'vitamina_c')
    ) {
      return {
        status: 'schedule',
        title: 'Separar por Horario (AM vs PM)',
        badge: 'SEPARAR DÍA / NOCHE',
        description: 'La Vitamina C pura requiere pH ácido (<3.5) y protege contra radicales libres por la Mañana. El Retinol es fotosensible y actúa óptimamente a pH 5.5-6.5 por la Noche. No mezclar en el mismo paso inmediato.'
      };
    }

    if (
      (idA === 'retinol' && idB === 'acido_salicilico') ||
      (idA === 'acido_salicilico' && idB === 'retinol')
    ) {
      return {
        status: 'caution',
        title: 'Incompatibilidad en el Mismo Paso (Riesgo de Sobreexfoliación)',
        badge: 'PRECAUCIÓN / ALTERNAR NOCHES',
        description: 'Ambos activos aceleran la descamación del estrato córneo. Usarlos en la misma noche puede romper la barrera lipídica y causar dermatitis de contacto. Utilizar en noches alternas (ej. Salicílico los Martes, Retinal los Jueves).'
      };
    }

    if (
      (idA === 'acido_hialuronico') || (idB === 'acido_hialuronico') ||
      (idA === 'ceramidas') || (idB === 'ceramidas')
    ) {
      return {
        status: 'synergy',
        title: 'Compatibilidad Universal & Refuerzo de Barrera',
        badge: '100% COMPATIBLE',
        description: 'Activos humectantes y lípidos biomiméticos que pueden combinarse libremente con cualquier otro principio activo en la misma rutina para mantener la hidratación.'
      };
    }

    if (
      (idA === 'acido_azelaico' && idB === 'niacinamida') ||
      (idA === 'niacinamida' && idB === 'acido_azelaico')
    ) {
      return {
        status: 'synergy',
        title: 'Dúo Despigmentante y Anti-Rojeces',
        badge: 'SINERGIA CALMANTE',
        description: 'Combinación magistral para pieles con rosácea o manchas post-acné. Calman el eritema y bloquean la sobreproducción de melanina.'
      };
    }

    return {
      status: 'compatible',
      title: 'Compatibles en Rutina',
      badge: 'COMPATIBLE',
      description: 'Pueden convivir en una misma rutina siempre respetando el orden correcto de textura (de más ligera a más densa).'
    };
  };

  const currentMatrixEval = getMatrixEvaluation(activeA, activeB);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5D9] text-[#3C473E] text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#5A6B5D]" />
            Dermo-Vademécum & Formulación
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1A1A1A]">
            Catálogo de Principios Activos & Productos
          </h1>
          <p className="text-xs sm:text-sm text-[#78736B] mt-1">
            Base de conocimiento cosmetológico con matrices de compatibilidad, pH óptimo y filtros por biotipo.
          </p>
        </div>
      </div>

      {/* Main View Mode Selector */}
      <div className="flex items-center gap-2 border-b border-[#E5E2D9] mb-6">
        <button
          onClick={() => setViewMode('actives')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-display text-xs sm:text-sm font-bold transition-all ${
            viewMode === 'actives'
              ? 'border-[#5A6B5D] text-[#5A6B5D]'
              : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#5A6B5D]" />
          <span>Principios Activos ({filteredActives.length})</span>
        </button>

        <button
          onClick={() => setViewMode('products')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-display text-xs sm:text-sm font-bold transition-all ${
            viewMode === 'products'
              ? 'border-[#5A6B5D] text-[#5A6B5D]'
              : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#5A6B5D]" />
          <span>Fórmulas y Productos ({filteredProducts.length})</span>
        </button>

        <button
          onClick={() => setViewMode('matrix')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-display text-xs sm:text-sm font-bold transition-all ${
            viewMode === 'matrix'
              ? 'border-[#5A6B5D] text-[#5A6B5D]'
              : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-[#5A6B5D]" />
          <span>Matriz de Compatibilidad</span>
          <span className="bg-[#5A6B5D] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            PRO
          </span>
        </button>
      </div>

      {/* FILTERS BAR (For Actives & Products) */}
      {viewMode !== 'matrix' && (
        <div className="bg-white border border-[#E5E2D9] rounded-3xl p-5 sm:p-6 mb-8 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#78736B] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar activo, INCI o beneficio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
              />
            </div>

            {/* Concern Filter */}
            <div>
              <select
                value={selectedConcern}
                onChange={(e) => setSelectedConcern(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
              >
                <option value="todos">Todas las Preocupaciones</option>
                <option value="acne">Acné & Poros</option>
                <option value="manchas_hiperpigmentacion">Manchas & Melasma</option>
                <option value="lineas_envejecimiento">Líneas & Antiedad</option>
                <option value="deshidratacion">Deshidratación & Barrera</option>
                <option value="rojeces_rosacea">Rojeces & Rosácea</option>
              </select>
            </div>

            {/* Skin Type Filter */}
            <div>
              <select
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
              >
                <option value="todos">Todos los Biotipos</option>
                <option value="mixta">Piel Mixta</option>
                <option value="grasa">Piel Grasa</option>
                <option value="seca">Piel Seca</option>
                <option value="sensible">Piel Sensible</option>
                <option value="normal">Piel Normal</option>
              </select>
            </div>
          </div>

          {/* Additional Checkbox Toggles */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#E5E2D9] text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#3C473E] font-medium">
              <input
                type="checkbox"
                checked={onlyPregnancySafe}
                onChange={(e) => setOnlyPregnancySafe(e.target.checked)}
                className="rounded border-[#D8D2C4] text-[#5A6B5D] focus:ring-[#5A6B5D]"
              />
              <span className="flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5 text-[#5A6B5D]" />
                Solo seguros durante Embarazo / Lactancia
              </span>
            </label>
          </div>
        </div>
      )}

      {/* VIEW 1: ACTIVES DIRECTORY */}
      {viewMode === 'actives' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredActives.map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-7 hover:border-[#BAC7BC] transition-all shadow-xs space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E2D9]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block">
                    {act.category} | Concentración: {act.concentrationRange}
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#1A1A1A] mt-0.5">
                    {act.name}
                  </h3>
                  <span className="text-xs text-[#78736B] italic font-mono">
                    INCI: {act.inci}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    act.applicationTime === 'AM' ? 'bg-[#F2ECE1] text-[#7A5B2F]' :
                    act.applicationTime === 'PM' ? 'bg-[#E5ECE6] text-[#365A41]' :
                    'bg-[#EAE5D9] text-[#3C473E]'
                  }`}>
                    {act.applicationTime}
                  </span>
                  {act.optimalPh && (
                    <span className="text-[10px] font-semibold text-[#78736B]">
                      pH {act.optimalPh}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#615C54] leading-relaxed">
                {act.description}
              </p>

              {/* Benefits */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6B5D] block mb-1.5">
                  Beneficios Clínicos:
                </span>
                <ul className="space-y-1">
                  {act.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Incompatibilities & Synergies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E5E2D9] text-[11px]">
                <div className="bg-[#EFF4F0] p-3 rounded-2xl border border-[#C5D5C8] text-[#2B352D]">
                  <strong className="font-bold block text-[10px] uppercase tracking-wider text-[#3D5240]">
                    Sinergias Top:
                  </strong>
                  <span className="mt-0.5 block leading-snug">
                    {act.synergies.join(', ')}
                  </span>
                </div>

                <div className="bg-[#FDF2F0] p-3 rounded-2xl border border-[#F0CECA] text-[#7A3631]">
                  <strong className="font-bold block text-[10px] uppercase tracking-wider text-[#8A3B35]">
                    Incompatible con:
                  </strong>
                  <span className="mt-0.5 block leading-snug">
                    {act.incompatibleWith.join(', ') || 'Ninguna contraindicación directa.'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* VIEW 2: PRODUCTS CATALOG */}
      {viewMode === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E5E2D9] rounded-3xl p-6 hover:border-[#BAC7BC] transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D]">
                    {prod.category}
                  </span>
                  <span className="text-xs font-bold text-[#1A1A1A] bg-[#EAE5D9] px-2.5 py-0.5 rounded-full">
                    {prod.priceEstimated}
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-base text-[#1A1A1A]">
                    {prod.name}
                  </h4>
                  <span className="text-xs text-[#78736B] font-medium">
                    {prod.brand} | Textura {prod.texture}
                  </span>
                </div>

                <p className="text-xs text-[#615C54] leading-relaxed">
                  {prod.description}
                </p>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block mb-1">
                    Activos Destacados:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prod.mainActives.map((act, i) => (
                      <span key={i} className="text-[10px] bg-[#F9F7F2] border border-[#E5E2D9] text-[#1A1A1A] px-2.5 py-0.5 rounded-md font-medium">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E5E2D9] flex items-center justify-between text-xs text-[#78736B]">
                <span>Uso: <strong className="text-[#1A1A1A]">{prod.usageTime}</strong></span>
                <span className="capitalize">Biotipo: {prod.skinTypes.join(', ')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* VIEW 3: ACTIVE COMPATIBILITY MATRIX */}
      {viewMode === 'matrix' && (
        <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A6B5D] block mb-1">
              Herramienta de Compatibilidad Cosmetológica
            </span>
            <h3 className="text-2xl font-display font-bold text-[#1A1A1A]">
              Verificador de Interacción y Sinergia de Activos
            </h3>
            <p className="text-xs sm:text-sm text-[#78736B] mt-1 max-w-2xl">
              Selecciona dos principios activos para evaluar instantáneamente su compatibilidad fisicoquímica, pH, recomendaciones de absorción y posibles riesgos de irritación.
            </p>
          </div>

          {/* Active Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F9F7F2] p-6 rounded-2xl border border-[#E5E2D9]">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3C473E] mb-2">
                Activo A:
              </label>
              <select
                value={activeA}
                onChange={(e) => setActiveA(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border border-[#D8D2C4] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
              >
                {INGREDIENTS_CATALOG.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3C473E] mb-2">
                Activo B:
              </label>
              <select
                value={activeB}
                onChange={(e) => setActiveB(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border border-[#D8D2C4] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
              >
                {INGREDIENTS_CATALOG.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Result Output Card */}
          <motion.div
            key={`${activeA}-${activeB}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 sm:p-8 rounded-2xl border ${
              currentMatrixEval.status === 'synergy'
                ? 'bg-[#EFF4F0] border-[#C5D5C8] text-[#2B352D]'
                : currentMatrixEval.status === 'caution'
                ? 'bg-[#FDF2F0] border-[#F0CECA] text-[#7A3631]'
                : currentMatrixEval.status === 'schedule'
                ? 'bg-[#FDF9EE] border-[#ECDDB9] text-[#7A5B2F]'
                : 'bg-[#F9F7F2] border-[#E5E2D9] text-[#1A1A1A]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-current/20">
              <span className="font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/70 border border-current/20 w-fit">
                {currentMatrixEval.badge}
              </span>
              <span className="text-xs font-medium opacity-80">
                Interacción Dermocosmética
              </span>
            </div>

            <h4 className="font-display font-bold text-xl sm:text-2xl mt-4">
              {currentMatrixEval.title}
            </h4>

            <p className="text-xs sm:text-sm mt-2 leading-relaxed opacity-90 max-w-3xl">
              {currentMatrixEval.description}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};
