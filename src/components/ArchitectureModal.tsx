import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  GitFork, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Code2, 
  ArrowRight,
  Server,
  Smartphone,
  Workflow
} from 'lucide-react';
import { motion } from 'motion/react';

export const ArchitectureModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fase1' | 'fase2' | 'ai_arch'>('fase1');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5D9] text-[#3C473E] text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5 text-[#5A6B5D]" />
          Arquitectura & Documentación de Sistema
        </div>
        <h1 className="text-3xl font-display font-bold text-[#1A1A1A]">
          Propuesta Técnica: Fases 1, 2 e Integración IA
        </h1>
        <p className="text-xs sm:text-sm text-[#78736B] mt-1">
          Especificación de Software Senior para la plataforma de Consultoría Cosmetológica y Diagnóstico Facial.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E2D9] mb-6">
        <button
          onClick={() => setActiveTab('fase1')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-display text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'fase1'
              ? 'border-[#5A6B5D] text-[#5A6B5D]'
              : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
          }`}
        >
          <Workflow className="w-4 h-4 text-[#5A6B5D]" />
          <span>Fase 1: Arquitectura & User Journeys</span>
        </button>

        <button
          onClick={() => setActiveTab('fase2')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-display text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'fase2'
              ? 'border-[#5A6B5D] text-[#5A6B5D]'
              : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
          }`}
        >
          <Database className="w-4 h-4 text-[#5A6B5D]" />
          <span>Fase 2: Estructura de Base de Datos</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_arch')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-display text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'ai_arch'
              ? 'border-[#5A6B5D] text-[#5A6B5D]'
              : 'border-transparent text-[#78736B] hover:text-[#1A1A1A]'
          }`}
        >
          <Cpu className="w-4 h-4 text-[#5A6B5D]" />
          <span>Integración de IA (Gemini 3.7 Flash)</span>
        </button>
      </div>

      {/* FASE 1 CONTENT */}
      {activeTab === 'fase1' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tech Stack */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-1">
              1. Pila Tecnológica Recomendada (Stack Escalable)
            </h3>
            <p className="text-xs text-[#78736B] mb-4">
              Arquitectura desacoplada, moderna y optimizada para rápida velocidad de carga y cumplimiento estricto de privacidad de datos de salud estética.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9]">
                <strong className="text-[#1A1A1A] block font-bold text-sm mb-1">
                  Frontend (Client SPA)
                </strong>
                <ul className="space-y-1 text-[#615C54]">
                  <li>• <strong>React 19 + TypeScript:</strong> Control tipado de parámetros cosmetológicos.</li>
                  <li>• <strong>Tailwind CSS v4:</strong> Diseño responsive con paleta neutra y lujo clínico.</li>
                  <li>• <strong>Motion (Framer):</strong> Transiciones fluidas en el quiz y rutinas.</li>
                  <li>• <strong>Lucide Icons:</strong> Simbología dermatológica clara.</li>
                </ul>
              </div>

              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9]">
                <strong className="text-[#1A1A1A] block font-bold text-sm mb-1">
                  Backend & API Layer
                </strong>
                <ul className="space-y-1 text-[#615C54]">
                  <li>• <strong>Node.js + Express / Next.js API Routes:</strong> Endpoints seguros que resguardan credenciales.</li>
                  <li>• <strong>@google/genai SDK:</strong> Conexión con <em>gemini-3.7-flash</em> para análisis clínico.</li>
                  <li>• <strong>CORS & Rate Limiting:</strong> Protección contra abusos en endpoints de IA.</li>
                </ul>
              </div>

              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9]">
                <strong className="text-[#1A1A1A] block font-bold text-sm mb-1">
                  Persistencia & Base de Datos
                </strong>
                <ul className="space-y-1 text-[#615C54]">
                  <li>• <strong>PostgreSQL (Cloud SQL / Supabase) o Firestore:</strong> Schemas relacionales para historial clínico y citas.</li>
                  <li>• <strong>Storage Cloud Bucket:</strong> Para fotografías de seguimiento clínico (con encriptación en reposo).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Journeys */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-1">
              2. Flujos de Usuario (User Journeys)
            </h3>
            <p className="text-xs text-[#78736B] mb-4">
              Doble recorrido diferenciado para clientes y la profesional cosmetóloga.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9] space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E5E2D9]">
                  <span className="w-6 h-6 rounded-full bg-[#5A6B5D] text-white font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-sm text-[#1A1A1A]">
                    Recorrido del Cliente Final (B2C)
                  </h4>
                </div>
                <div className="space-y-2 text-[#615C54]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                    <span><strong>1. Diagnóstico:</strong> Completa el Quiz de 5 pasos evaluando biotipo, reactividad y hábitos.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                    <span><strong>2. Resultados & IA:</strong> Visualiza su biotipo y solicita el informe inteligente asistido por Gemini.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                    <span><strong>3. Rutina Cronobiológica:</strong> Consulta su prescripción AM/PM con modo de aplicación y advertencias.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                    <span><strong>4. Agendamiento:</strong> Reserva cita online o presencial para seguimiento profesional.</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9] space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E5E2D9]">
                  <span className="w-6 h-6 rounded-full bg-[#5A6B5D] text-white font-bold flex items-center justify-center text-xs">
                    2
                  </span>
                  <h4 className="font-bold text-sm text-[#1A1A1A]">
                    Recorrido de la Consultora Cosmetóloga (B2B / CRM)
                  </h4>
                </div>
                <div className="space-y-2 text-[#615C54]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                    <span><strong>1. Gestión de Agenda:</strong> Revisa el calendario de asesorías virtuales y pacientes en cabina.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                    <span><strong>2. Ficha Clínica:</strong> Abre el expediente del paciente, fototipo Fitzpatrick y alergias.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                    <span><strong>3. Registro de Sesión & Fotos:</strong> Anota tratamientos en cabina y compara fotos evolutivas.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                    <span><strong>4. Síntesis Clínica con IA:</strong> Genera resúmenes médicos-estéticos automatizados en 1 clic.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* FASE 2 CONTENT */}
      {activeTab === 'fase2' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-1">
              Diseño de Modelo Entidad-Relación (Base de Datos)
            </h3>
            <p className="text-xs text-[#78736B] mb-4">
              Tablas / Colecciones normalizadas preparadas para PostgreSQL (SQL) o Firestore/MongoDB (NoSQL).
            </p>

            <div className="space-y-4 text-xs font-mono">
              {/* Table 1: users / clients */}
              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D9] font-sans">
                  <span className="font-bold text-sm text-[#1A1A1A]">1. Tabla: `clients` (Pacientes / Clientes)</span>
                  <span className="text-[10px] bg-[#EAE5D9] text-[#3C473E] px-2.5 py-0.5 rounded-full font-bold">SQL / NoSQL</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[#3C473E]">
                  <div>• `id`: UUID (Primary Key)</div>
                  <div>• `full_name`: VARCHAR(150)</div>
                  <div>• `email`: VARCHAR(150) UNIQUE</div>
                  <div>• `phone`: VARCHAR(30)</div>
                  <div>• `birth_date` / `age`: INT</div>
                  <div>• `fitzpatrick_type`: ENUM('I'..'VI')</div>
                  <div>• `skin_type`: ENUM('seca','grasa','mixta','sensible','normal')</div>
                  <div>• `allergies`: TEXT[] / JSON</div>
                  <div>• `medical_conditions`: TEXT[] (ej. Embarazo)</div>
                  <div>• `created_at`: TIMESTAMP DEFAULT NOW()</div>
                </div>
              </div>

              {/* Table 2: skin_diagnostics */}
              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D9] font-sans">
                  <span className="font-bold text-sm text-[#1A1A1A]">2. Tabla: `skin_diagnostics` (Evaluaciones Cutáneas)</span>
                  <span className="text-[10px] bg-[#EAE5D9] text-[#3C473E] px-2.5 py-0.5 rounded-full font-bold">Foreign Key: `client_id`</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[#3C473E]">
                  <div>• `id`: UUID (Primary Key)</div>
                  <div>• `client_id`: UUID (FK references clients.id)</div>
                  <div>• `raw_answers`: JSONB (Respuestas del quiz)</div>
                  <div>• `calculated_skin_type`: VARCHAR(50)</div>
                  <div>• `sensitivity_score`: INT (0..10)</div>
                  <div>• `primary_concerns`: TEXT[]</div>
                  <div>• `ai_barrier_analysis`: TEXT</div>
                  <div>• `ai_recommended_actives`: TEXT[]</div>
                  <div>• `ai_cautions`: TEXT[]</div>
                  <div>• `created_at`: TIMESTAMP</div>
                </div>
              </div>

              {/* Table 3: routines & routine_steps */}
              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D9] font-sans">
                  <span className="font-bold text-sm text-[#1A1A1A]">3. Tablas: `routines` y `routine_steps`</span>
                  <span className="text-[10px] bg-[#EAE5D9] text-[#3C473E] px-2.5 py-0.5 rounded-full font-bold">Relación 1 a N</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[#3C473E]">
                  <div>• `routine_id`: UUID (PK)</div>
                  <div>• `diagnostic_id`: UUID (FK)</div>
                  <div>• `routine_step_id`: UUID (PK)</div>
                  <div>• `time_of_day`: ENUM('AM','PM','WEEKLY')</div>
                  <div>• `step_order`: INT (1, 2, 3...)</div>
                  <div>• `category`: VARCHAR (Limpieza, Sérum, FPS)</div>
                  <div>• `active_ingredient`: VARCHAR</div>
                  <div>• `application_tips`: TEXT</div>
                  <div>• `frequency`: VARCHAR</div>
                </div>
              </div>

              {/* Table 4: appointments & clinical_sessions */}
              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9]">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D9] font-sans">
                  <span className="font-bold text-sm text-[#1A1A1A]">4. Tablas: `appointments` & `clinical_sessions`</span>
                  <span className="text-[10px] bg-[#EAE5D9] text-[#3C473E] px-2.5 py-0.5 rounded-full font-bold">Historial Clínico</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[#3C473E]">
                  <div>• `session_id`: UUID (PK)</div>
                  <div>• `treatment_done`: TEXT</div>
                  <div>• `skin_state_observed`: TEXT</div>
                  <div>• `cabin_products`: TEXT[]</div>
                  <div>• `home_care_adjustments`: TEXT</div>
                  <div>• `before_after_photo_urls`: TEXT[]</div>
                  <div>• `next_review_date`: DATE</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI ARCHITECTURE CONTENT */}
      {activeTab === 'ai_arch' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
              3. Estrategia de Integración de IA con Gemini 3.7 Flash
            </h3>
            <p className="text-xs text-[#78736B] leading-relaxed">
              La integración de IA se ejecuta en el servidor mediante el SDK <code>@google/genai</code> para garantizar la máxima seguridad y latencia reducida.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9] space-y-2">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-bold">
                  <Sparkles className="w-4 h-4 text-[#5A6B5D]" />
                  <span>1. Diagnóstico Cutáneo</span>
                </div>
                <p className="text-[#615C54] leading-relaxed">
                  Endpoint <code>/api/cosmetology/analyze-skin</code>. Recibe el cuestionario estructurado y responde con JSON estricto analizando barrera cutánea, activos tolerados y contraindicaciones.
                </p>
              </div>

              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9] space-y-2">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-bold">
                  <Cpu className="w-4 h-4 text-[#5A6B5D]" />
                  <span>2. Generador de Rutinas</span>
                </div>
                <p className="text-[#615C54] leading-relaxed">
                  Endpoint <code>/api/cosmetology/generate-routine</code>. Genera la cronobiología de pasos AM/PM según el estilo de vida, presupuesto y notas específicas del paciente.
                </p>
              </div>

              <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#E5E2D9] space-y-2">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#5A6B5D]" />
                  <span>3. Síntesis Clínica CRM</span>
                </div>
                <p className="text-[#615C54] leading-relaxed">
                  Endpoint <code>/api/cosmetology/clinical-summary</code>. Redacta evoluciones clínicas formales sintetizando sesiones pasadas, tratamientos y pautas domiciliarias.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
