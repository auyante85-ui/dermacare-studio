import React, { useState } from 'react';
import { 
  QUIZ_QUESTIONS, 
  INGREDIENTS_CATALOG 
} from '../../data/mockData';
import { 
  SkinType, 
  SkinConcern, 
  FitzpatrickType, 
  PersonalizedRoutine 
} from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  Bot, 
  ShieldAlert, 
  Droplet, 
  Sun, 
  HeartHandshake, 
  BookOpen, 
  SlidersHorizontal,
  Calendar,
  Printer,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SkinQuizProps {
  onDiagnosticComplete: (result: {
    clientName: string;
    skinType: SkinType;
    concerns: SkinConcern[];
    sensitivity: 'baja' | 'moderada' | 'alta';
    fitzpatrick: FitzpatrickType;
    currentRoutine: string;
    aiAnalysis?: any;
  }) => void;
  onGoToRoutine: () => void;
  onGoToBooking: () => void;
}

export const SkinQuiz: React.FC<SkinQuizProps> = ({
  onDiagnosticComplete,
  onGoToRoutine,
  onGoToBooking,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Form state
  const [clientName, setClientName] = useState<string>('María González');
  const [clientAge, setClientAge] = useState<number>(31);
  const [fitzpatrick, setFitzpatrick] = useState<FitzpatrickType>('III');
  const [answers, setAnswers] = useState<Record<string, string>>({
    sensacion_manana: 'opt_mixta',
    sensibilidad_reaccion: 'sens_media',
    preocupaciones_principales: 'concern_manchas',
    exposicion_solar_habitos: 'sol_ocasional',
    rutina_actual_nivel: 'rutina_basica'
  });
  const [selectedConcerns, setSelectedConcerns] = useState<SkinConcern[]>([
    'manchas_hiperpigmentacion', 
    'lineas_envejecimiento'
  ]);
  const [currentRoutineText, setCurrentRoutineText] = useState<string>(
    'Uso un limpiador en gel por las noches y una crema hidratante básica. A veces aplico protector solar si salgo mucho tiempo.'
  );

  // Result & AI state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [calculatedSkinType, setCalculatedSkinType] = useState<SkinType>('mixta');
  const [calculatedSensitivity, setCalculatedSensitivity] = useState<'baja' | 'moderada' | 'alta'>('moderada');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  const totalSteps = QUIZ_QUESTIONS.length + 1; // +1 for Personal Info step

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const toggleConcern = (concern: SkinConcern) => {
    if (selectedConcerns.includes(concern)) {
      if (selectedConcerns.length > 1) {
        setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
      }
    } else {
      if (selectedConcerns.length < 3) {
        setSelectedConcerns([...selectedConcerns, concern]);
      }
    }
  };

  // Evaluation algorithm
  const computeDiagnosis = () => {
    let skinType: SkinType = 'mixta';
    const ans1 = answers['sensacion_manana'];
    if (ans1 === 'opt_madura') skinType = 'madura';
    else if (ans1 === 'opt_menopausica') skinType = 'menopausica';
    else if (ans1 === 'opt_grasa') skinType = 'grasa';
    else if (ans1 === 'opt_seca') skinType = 'seca';
    else if (ans1 === 'opt_normal') skinType = 'normal';
    else skinType = 'mixta';

    let sens: 'baja' | 'moderada' | 'alta' = 'moderada';
    const ans2 = answers['sensibilidad_reaccion'];
    if (ans2 === 'sens_alta') {
      sens = 'alta';
      if (skinType !== 'madura' && skinType !== 'menopausica') {
        skinType = 'sensible';
      }
    } else if (ans2 === 'sens_baja') {
      sens = 'baja';
    } else {
      sens = 'moderada';
    }

    setCalculatedSkinType(skinType);
    setCalculatedSensitivity(sens);
    setIsCompleted(true);

    // Trigger parent callback
    onDiagnosticComplete({
      clientName: clientName || 'Cliente',
      skinType,
      concerns: selectedConcerns,
      sensitivity: sens,
      fitzpatrick,
      currentRoutine: currentRoutineText,
      aiAnalysis: aiAnalysisResult
    });
  };

  // AI Generation with Gemini server API
  const handleGenerateAIAnalysis = async () => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/cosmetology/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          skinType: calculatedSkinType,
          concerns: selectedConcerns,
          sensitivity: calculatedSensitivity,
          currentRoutine: currentRoutineText,
          answers
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiAnalysisResult(data.analysis);
        onDiagnosticComplete({
          clientName: clientName || 'Cliente',
          skinType: calculatedSkinType,
          concerns: selectedConcerns,
          sensitivity: calculatedSensitivity,
          fitzpatrick,
          currentRoutine: currentRoutineText,
          aiAnalysis: data.analysis
        });
      }
    } catch (err) {
      console.error('Error fetching AI analysis:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const recommendedActives = INGREDIENTS_CATALOG.filter(ing => 
    ing.suitableForSkin.includes(calculatedSkinType) ||
    ing.bestFor.some(b => selectedConcerns.includes(b))
  ).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro Header */}
      {!isCompleted && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5D9] text-[#3C473E] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#5A6B5D]" />
            Evaluación Cutánea Dermocosmética
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1A1A1A] tracking-tight">
            Quiz Diagnóstico Facial Inteligente
          </h1>
          <p className="text-[#78736B] mt-2 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Responde 5 preguntas clave formuladas bajo criterios de cosmetología botánica y clínica para determinar tu biotipo cutáneo, reactividad y activos ideales.
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-xs font-medium text-[#78736B] mb-1.5">
              <span>Paso {currentStep + 1} de {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Completado</span>
            </div>
            <div className="w-full bg-[#E5E2D9] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#5A6B5D] h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      {!isCompleted ? (
        <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* STEP 0: Personal Info & Phototype */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-display font-bold text-[#1A1A1A]">
                  Perfil Clínico Inicial
                </h2>
                <p className="text-xs text-[#78736B] mt-1">
                  Datos indispensables para calibrar la tolerancia y fotoprotección adecuada.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
                    Nombre o Iniciales
                  </label>
                  <input
                    id="input-client-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Sofía Hernández"
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
                    Edad
                  </label>
                  <input
                    id="input-client-age"
                    type="number"
                    value={clientAge}
                    onChange={(e) => setClientAge(Number(e.target.value))}
                    min={12}
                    max={95}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
              </div>

              {/* Visual Phototype Tone Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-2">
                  Tono de Piel y Respuesta al Sol
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { type: 'I', tone: 'Muy Clara / Piel Nórdica', desc: 'Se quema con facilidad, apenas se broncea' },
                    { type: 'II', tone: 'Clara / Sensible', desc: 'Se quema primero, luego ligero bronceado' },
                    { type: 'III', tone: 'Media / Mediterránea', desc: 'Bronceado gradual y uniforme con el sol' },
                    { type: 'IV', tone: 'Morena / Dorada', desc: 'Rara vez se quema, pigmentación fácil' },
                    { type: 'V', tone: 'Oscura / Intensa', desc: 'Muy resistente al sol, alta melanina natural' },
                    { type: 'VI', tone: 'Muy Oscura', desc: 'Máxima protección natural, nunca se quema' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setFitzpatrick(item.type as FitzpatrickType)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        fitzpatrick === item.type
                          ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white shadow-xs'
                          : 'border-[#E5E2D9] bg-[#F9F7F2] hover:border-[#B8B09F] text-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{item.tone}</span>
                        {fitzpatrick === item.type && <CheckCircle2 className="w-4 h-4 text-[#BAC7BC]" />}
                      </div>
                      <p className={`text-[10px] mt-1 leading-tight ${fitzpatrick === item.type ? 'text-[#D8E0D9]' : 'text-[#78736B]'}`}>
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current routine textarea */}
              <div>
                <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
                  ¿Qué productos o rutina usas actualmente?
                </label>
                <textarea
                  id="input-current-routine"
                  rows={2}
                  value={currentRoutineText}
                  onChange={(e) => setCurrentRoutineText(e.target.value)}
                  placeholder="Ej. Jabón neutro, crema hidratante básica, suero de vitamina C a veces..."
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 1 to 5: Questionnaire Questions */}
          {currentStep > 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {(() => {
                const q = QUIZ_QUESTIONS[currentStep - 1];
                const isConcernStep = q.id === 'preocupaciones_principales';

                return (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5A6B5D] block mb-1">
                      {q.category.replace('_', ' ').toUpperCase()}
                    </span>
                    <h2 className="text-lg sm:text-xl font-display font-bold text-[#1A1A1A]">
                      {q.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#78736B] mt-1 mb-5">
                      {q.subtitle}
                    </p>

                    {/* If concerns step, allow multi-select (up to 2-3) */}
                    {isConcernStep ? (
                      <div className="space-y-2.5">
                        <p className="text-xs font-semibold text-[#5A6B5D] mb-2">
                          (Selecciona de 1 a 3 prioridades activas)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { id: 'piel_madura', label: 'Piel Madura & Densidad', desc: 'Arrugas profundas, pérdida de firmeza dérmica y descolgamiento del óvalo facial.' },
                            { id: 'menopausia_climaterio', label: 'Menopausia / Cambios Hormonales', desc: 'Sequedad extrema por caída de estrógenos, afinamiento, fragilidad y sofocos.' },
                            { id: 'lineas_envejecimiento', label: 'Líneas & Pérdida de Firmeza', desc: 'Fotoenvejecimiento, microarrugas y pérdida de elasticidad.' },
                            { id: 'deshidratacion', label: 'Deshidratación & Piel Opaca', desc: 'Pérdida de agua, falta de luminosidad y tirantez.' },
                            { id: 'manchas_hiperpigmentacion', label: 'Manchas & Melasma', desc: 'Tono disparejo, marcas postinflamatorias y léntigos solares.' },
                            { id: 'acne', label: 'Acné & Poros Obstruidos', desc: 'Comedones, exceso de sebo y textura irregular.' },
                            { id: 'rojeces_rosacea', label: 'Rojeces & Sensibilidad Reactiva', desc: 'Cuperosis, ardor recurrente o tendencia a rosácea.' }
                          ].map((item) => {
                            const isSelected = selectedConcerns.includes(item.id as SkinConcern);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleConcern(item.id as SkinConcern)}
                                className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                                  isSelected
                                    ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white shadow-xs'
                                    : 'border-[#E5E2D9] bg-[#F9F7F2] hover:border-[#B8B09F] text-[#1A1A1A]'
                                }`}
                              >
                                <div>
                                  <div className="font-semibold text-sm">{item.label}</div>
                                  <div className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-[#E5ECE6]' : 'text-[#615C54]'}`}>
                                    {item.desc}
                                  </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 ${
                                  isSelected ? 'border-white bg-white text-[#5A6B5D]' : 'border-[#B8B09F]'
                                }`}>
                                  {isSelected && <CheckCircle2 className="w-4 h-4 fill-current" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* Standard single choice questions */
                      <div className="space-y-3">
                        {q.options.map((opt) => {
                          const isSelected = answers[q.id] === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectOption(q.id, opt.id)}
                              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                                isSelected
                                  ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white shadow-xs'
                                  : 'border-[#E5E2D9] bg-[#F9F7F2] hover:border-[#B8B09F] text-[#1A1A1A]'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="font-semibold text-sm">{opt.label}</div>
                                <div className={`text-xs ${isSelected ? 'text-[#E5ECE6]' : 'text-[#615C54]'}`}>
                                  {opt.description}
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                                isSelected ? 'border-white bg-white text-[#5A6B5D]' : 'border-[#B8B09F]'
                              }`}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#5A6B5D]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5E2D9]">
            <button
              id="quiz-btn-prev"
              type="button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                currentStep === 0
                  ? 'opacity-30 cursor-not-allowed text-[#78736B]'
                  : 'text-[#3C473E] hover:bg-[#EAE5D9]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                id="quiz-btn-next"
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5A6B5D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="quiz-btn-finish"
                type="button"
                onClick={computeDiagnosis}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#BAC7BC]" />
                <span>Generar Diagnóstico</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RESULTS SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E2D9]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6B5D] block">
                  Informe de Diagnóstico Cutáneo
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1A1A] mt-1">
                  Perfil de Piel: {calculatedSkinType.toUpperCase()}
                </h2>
                <p className="text-xs sm:text-sm text-[#78736B] mt-1">
                  Cliente: <strong className="text-[#1A1A1A]">{clientName}</strong> ({clientAge} años) | Tono y Fototipo: {fitzpatrick}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D8D2C4] text-xs font-semibold text-[#3C473E] hover:bg-[#F2ECE0] cursor-pointer"
                  title="Imprimir o Guardar como PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Ficha</span>
                </button>

                <button
                  onClick={() => {
                    setIsCompleted(false);
                    setCurrentStep(0);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D8D2C4] text-xs font-semibold text-[#3C473E] hover:bg-[#F2ECE0] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nuevo Quiz</span>
                </button>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6B5D] uppercase">
                  <Droplet className="w-4 h-4 text-[#5A6B5D]" />
                  <span>Biotipo Cutáneo</span>
                </div>
                <div className="text-lg font-display font-bold text-[#1A1A1A] mt-1 capitalize">
                  Piel {calculatedSkinType}
                </div>
                <p className="text-xs text-[#615C54] mt-1">
                  {calculatedSkinType === 'madura' && 'Disminución de colágeno, elastina y lípidos intercelulares con necesidad de redensificación y nutrición.'}
                  {calculatedSkinType === 'menopausica' && 'Descenso estrogénico marcado, pérdida de densidad dérmica, sequedad acusada y propensión a reactividad o sofocos.'}
                  {calculatedSkinType === 'grasa' && 'Hiperfunción sebácea con tendencia a brillo y poro visible.'}
                  {calculatedSkinType === 'mixta' && 'Desbalance entre zona T oleosa y laterales deshidratados o normales.'}
                  {calculatedSkinType === 'seca' && 'Déficit de lípidos intercelulares y alta pérdida de agua transepidérmica.'}
                  {calculatedSkinType === 'sensible' && 'Manto hidrolipídico hiperreactivo con umbral de tolerancia bajo.'}
                  {calculatedSkinType === 'normal' && 'Excelente balance eudérmico entre emulsión epicutánea y agua.'}
                </p>
              </div>

              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#C48B71] uppercase">
                  <ShieldAlert className="w-4 h-4 text-[#C48B71]" />
                  <span>Reactividad & Barrera</span>
                </div>
                <div className="text-lg font-display font-bold text-[#1A1A1A] mt-1 capitalize">
                  Sensibilidad {calculatedSensitivity}
                </div>
                <p className="text-xs text-[#615C54] mt-1">
                  {calculatedSensitivity === 'alta' && 'Requiere activos calmantes (Centella, Ceramidas) y evitar ácidos fuertes.'}
                  {calculatedSensitivity === 'moderada' && 'Tolera activos pautados con introducción gradual nocturna.'}
                  {calculatedSensitivity === 'baja' && 'Buena tolerancia general a concentraciones estándar de retinoides y AHA.'}
                </p>
              </div>

              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#B5795D] uppercase">
                  <Sun className="w-4 h-4 text-[#B5795D]" />
                  <span>Tono & Fototipo Solar</span>
                </div>
                <div className="text-lg font-display font-bold text-[#1A1A1A] mt-1">
                  Fototipo {fitzpatrick}
                </div>
                <p className="text-xs text-[#615C54] mt-1">
                  Protección solar diaria recomendada para preservar el colágeno y prevenir la aparición de manchas.
                </p>
              </div>
            </div>

            {/* Selected Concerns Badges */}
            <div className="mt-6 pt-5 border-t border-[#E5E2D9]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78736B] block mb-2">
                Objetivos Cosméticos Prioritarios:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedConcerns.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5A6B5D] text-white text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#BAC7BC]" />
                    {c.replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Clinical Recommendation Section (Powered by Gemini) */}
          <div className="bg-gradient-to-br from-[#F4F0E8] to-[#EAE5D9] border border-[#DDD7C9] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5A6B5D] flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-5 h-5 text-[#E5ECE6]" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-[#1A1A1A]">
                    Recomendación Personalizada de la Especialista
                  </h3>
                  <p className="text-xs text-[#615C54]">
                    Informe adaptado a tu tipo de piel y cosméticos disponibles en España y Europa.
                  </p>
                </div>
              </div>

              <button
                id="btn-ai-analyze"
                onClick={handleGenerateAIAnalysis}
                disabled={isGeneratingAI}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] disabled:opacity-50 transition-all shadow-xs"
              >
                {isGeneratingAI ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#BAC7BC]" />
                    <span>Preparando tu informe...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#BAC7BC]" />
                    <span>{aiAnalysisResult ? 'Actualizar Informe' : 'Generar Mi Informe Detallado'}</span>
                  </>
                )}
              </button>
            </div>

            {aiAnalysisResult ? (
              <div className="space-y-4 mt-4 pt-4 border-t border-[#D8D2C4]">
                <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-[#E5E2D9]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A6B5D] mb-1">
                    Estado y Cuidado de la Barrera de tu Piel
                  </h4>
                  <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
                    {aiAnalysisResult.barrierState || aiAnalysisResult.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/90 p-4 rounded-2xl border border-[#E5E2D9]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A6B5D] mb-2">
                      Ingredientes Estrella Recomendados
                    </h4>
                    <ul className="space-y-1.5">
                      {(aiAnalysisResult.keyActives || []).map((active: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5A6B5D] mt-1.5 shrink-0" />
                          <span>{active}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/90 p-4 rounded-2xl border border-[#E5E2D9]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C48B71] mb-2">
                      Consejos y Precauciones Útiles
                    </h4>
                    <ul className="space-y-1.5">
                      {(aiAnalysisResult.cautions || []).map((caution: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#A84832]">
                          <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>{caution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {aiAnalysisResult.professionalRecommendation && (
                  <div className="bg-[#2B352D] text-[#F9F7F2] p-4 rounded-2xl">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#BAC7BC] mb-1">
                      Consejo Práctico de la Cosmetóloga (Primeros 30 días)
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#E5ECE6]">
                      {aiAnalysisResult.professionalRecommendation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/70 border border-dashed border-[#D8D2C4] text-center text-xs text-[#615C54]">
                Haz clic en el botón para recibir tus pautas personalizadas, orden de aplicación y recomendaciones de farmacia.
              </div>
            )}
          </div>

          {/* Recommended Actives Preview */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-display font-bold text-[#1A1A1A] mb-1">
              Activos Clave Seleccionados para tu Piel
            </h3>
            <p className="text-xs text-[#78736B] mb-4">
              Moléculas compatibles según tu biotipo y objetivos clínicos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedActives.map((act) => (
                <div key={act.id} className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#E5E2D9] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EAE5D9] flex items-center justify-center text-[#3C473E] font-bold text-xs shrink-0">
                    {act.category[0]}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#1A1A1A]">{act.name}</div>
                    <div className="text-[11px] text-[#5A6B5D] font-medium">{act.category} | {act.applicationTime}</div>
                    <p className="text-[11px] text-[#615C54] mt-1 leading-snug">{act.benefits[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to action bar */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              id="btn-goto-booking"
              onClick={onGoToBooking}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#5A6B5D] text-[#3C473E] text-xs font-bold uppercase tracking-wider hover:bg-[#EAE5D9] transition-all"
            >
              <Calendar className="w-4 h-4 text-[#5A6B5D]" />
              <span>Agendar Asesoría con la Cosmetóloga</span>
            </button>

            <button
              id="btn-goto-routine"
              onClick={onGoToRoutine}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#BAC7BC]" />
              <span>Ver mi Rutina Facial Personalizada</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
