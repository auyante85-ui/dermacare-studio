import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SkinQuiz } from './components/SkinQuiz/SkinQuiz';
import { RoutineGenerator } from './components/RoutineGenerator/RoutineGenerator';
import { AppointmentsManager } from './components/Appointments/AppointmentsManager';
import { ClientRecords } from './components/CRM/ClientRecords';
import { IngredientsCatalog } from './components/Catalog/IngredientsCatalog';
import { DirectConsultModal } from './components/Consultation/DirectConsultModal';
import { SkinType, SkinConcern, FitzpatrickType } from './types';
import { Sparkles, MessageCircle, ShieldCheck, Heart, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'quiz' | 'routine' | 'appointments' | 'crm' | 'catalog' | 'architecture'>('quiz');
  const [userRole, setUserRole] = useState<'client' | 'consultant'>('client');
  const [isConsultModalOpen, setIsConsultModalOpen] = useState<boolean>(false);

  // Shared state from diagnostic
  const [diagnosticResult, setDiagnosticResult] = useState<{
    clientName: string;
    skinType: SkinType;
    concerns: SkinConcern[];
    sensitivity: 'baja' | 'moderada' | 'alta';
    fitzpatrick: FitzpatrickType;
    currentRoutine: string;
    aiAnalysis?: any;
  }>({
    clientName: 'María González',
    skinType: 'mixta',
    concerns: ['manchas_hiperpigmentacion', 'lineas_envejecimiento'],
    sensitivity: 'moderada',
    fitzpatrick: 'III',
    currentRoutine: 'Limpiador suave e hidratante básico.'
  });

  const handleDiagnosticComplete = (result: any) => {
    setDiagnosticResult(result);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] text-[#1A1A1A]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenConsultation={() => setIsConsultModalOpen(true)}
      />

      {/* Main App Content Body */}
      <main className="flex-1">
        {currentTab === 'quiz' && (
          <SkinQuiz
            onDiagnosticComplete={handleDiagnosticComplete}
            onGoToRoutine={() => setCurrentTab('routine')}
            onGoToBooking={() => setCurrentTab('appointments')}
          />
        )}

        {currentTab === 'routine' && (
          <RoutineGenerator
            initialData={{
              clientName: diagnosticResult.clientName,
              skinType: diagnosticResult.skinType,
              concerns: diagnosticResult.concerns,
              sensitivity: diagnosticResult.sensitivity
            }}
            onGoToBooking={() => setCurrentTab('appointments')}
          />
        )}

        {currentTab === 'appointments' && (
          <AppointmentsManager
            userRole={userRole}
            clientNameDefault={diagnosticResult.clientName}
          />
        )}

        {currentTab === 'crm' && (
          <ClientRecords />
        )}

        {currentTab === 'catalog' && (
          <IngredientsCatalog />
        )}
      </main>

      {/* Floating Action Button: Consultar con la Cosmetóloga */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsConsultModalOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-[#2B352D] text-white rounded-full shadow-2xl hover:bg-[#3C473E] border border-white/20 transition-all group"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold leading-tight">Consultar con la Especialista</span>
            <span className="block text-[10px] text-[#BAC7BC]">Respuesta y dudas de cosmética</span>
          </div>
        </motion.button>
      </div>

      {/* Direct Consultation Modal */}
      <DirectConsultModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        onGoToBooking={() => {
          setIsConsultModalOpen(false);
          setCurrentTab('appointments');
        }}
      />

      {/* RGPD & European Compliance Notice Banner */}
      <div className="bg-[#EAE5D9] border-t border-[#DDD7C9] py-2 px-4 text-[11px] text-[#615C54]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5A6B5D]" />
            <span>
              <strong>Garantía de Privacidad RGPD (UE 2016/679):</strong> Tus datos clínicos y respuestas no se comparten con terceros y se utilizan exclusivamente para tu asesoramiento cosmético.
            </span>
          </div>
          <span className="text-[#5A6B5D] font-semibold">Mercado España y Unión Europea</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2B352D] text-[#F9F7F2] border-t border-[#3C473E] py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3C473E] flex items-center justify-center text-[#BAC7BC]">
              <Sparkles className="w-4 h-4 text-[#8FA792]" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-[#F9F7F2]">
                Dermacare Studio
              </span>
              <p className="text-[#A5B4A8] text-[11px]">
                Asesoramiento Dermocosmético Personalizado & Cuidado Facial
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right text-[#A5B4A8] text-[11px] max-w-md">
            <p>
              * Asesoramiento cosmético no médico. Ante patologías dermatológicas severas (dermatitis aguda, acné quístico severo, lesiones pigmentarias sospechosas), consulta siempre a un médico dermatólogo colegiado.
            </p>
            <p className="mt-1 text-[#6D7D6F]">
              © {new Date().getFullYear()} Dermacare Studio • Adaptado a farmacias y cosmética en España.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
