import React from 'react';
import { 
  Sparkles, 
  Stethoscope, 
  Calendar, 
  Users, 
  BookOpen, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'quiz' | 'routine' | 'appointments' | 'crm' | 'catalog' | 'architecture';
  setCurrentTab: (tab: 'quiz' | 'routine' | 'appointments' | 'crm' | 'catalog' | 'architecture') => void;
  userRole: 'client' | 'consultant';
  setUserRole: (role: 'client' | 'consultant') => void;
  onOpenConsultation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  onOpenConsultation
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#E5E2D9]">
      {/* Top Banner with Role Switcher & Direct Advice Contact */}
      <div className="bg-[#2B352D] text-[#F9F7F2] px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium tracking-wide">Dermacare Studio</span>
            <span className="text-[#6D7D6F]">|</span>
            <span className="text-[#D8E0D9]">Consultoría Dermocosmética & Cuidado de la Piel en España</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#BAC7BC]">Perfil activo:</span>
            <div className="inline-flex bg-[#1E2520] p-0.5 rounded-full border border-[#3C473E]">
              <button
                id="role-btn-client"
                onClick={() => {
                  setUserRole('client');
                  if (currentTab === 'crm') setCurrentTab('quiz');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  userRole === 'client'
                    ? 'bg-[#5A6B5D] text-white shadow-xs'
                    : 'text-[#BAC7BC] hover:text-white'
                }`}
              >
                👤 Vista Cliente
              </button>
              <button
                id="role-btn-consultant"
                onClick={() => {
                  setUserRole('consultant');
                  if (currentTab === 'quiz') setCurrentTab('crm');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  userRole === 'consultant'
                    ? 'bg-[#5A6B5D] text-white shadow-xs'
                    : 'text-[#BAC7BC] hover:text-white'
                }`}
              >
                🩺 Panel Especialista
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentTab(userRole === 'client' ? 'quiz' : 'crm')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3C473E] to-[#5A6B5D] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#E5ECE6]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-[#1A1A1A] tracking-tight block">
                Dermacare Studio
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#78736B] font-semibold block -mt-0.5">
                Cosmetología Facial & Dermocosmética
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-tab-quiz"
              onClick={() => setCurrentTab('quiz')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'quiz'
                  ? 'bg-[#EAE5D9] text-[#242A25] shadow-2xs font-semibold'
                  : 'text-[#615C54] hover:text-[#1A1A1A] hover:bg-[#F2ECE0]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${currentTab === 'quiz' ? 'text-[#5A6B5D]' : 'text-[#78736B]'}`} />
              <span>Test de Piel</span>
            </button>

            <button
              id="nav-tab-routine"
              onClick={() => setCurrentTab('routine')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'routine'
                  ? 'bg-[#EAE5D9] text-[#242A25] shadow-2xs font-semibold'
                  : 'text-[#615C54] hover:text-[#1A1A1A] hover:bg-[#F2ECE0]'
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 ${currentTab === 'routine' ? 'text-[#5A6B5D]' : 'text-[#78736B]'}`} />
              <span>Mi Rutina Facial</span>
            </button>

            <button
              id="nav-tab-appointments"
              onClick={() => setCurrentTab('appointments')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'appointments'
                  ? 'bg-[#EAE5D9] text-[#242A25] shadow-2xs font-semibold'
                  : 'text-[#615C54] hover:text-[#1A1A1A] hover:bg-[#F2ECE0]'
              }`}
            >
              <Calendar className={`w-4 h-4 ${currentTab === 'appointments' ? 'text-[#5A6B5D]' : 'text-[#78736B]'}`} />
              <span>Reservar Cita</span>
            </button>

            <button
              id="nav-tab-crm"
              onClick={() => setCurrentTab('crm')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'crm'
                  ? 'bg-[#EAE5D9] text-[#242A25] shadow-2xs font-semibold'
                  : 'text-[#615C54] hover:text-[#1A1A1A] hover:bg-[#F2ECE0]'
              }`}
            >
              <Users className={`w-4 h-4 ${currentTab === 'crm' ? 'text-[#5A6B5D]' : 'text-[#78736B]'}`} />
              <span>Fichas de Clientes</span>
              {userRole === 'consultant' && (
                <span className="bg-[#5A6B5D] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">PRO</span>
              )}
            </button>

            <button
              id="nav-tab-catalog"
              onClick={() => setCurrentTab('catalog')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'catalog'
                  ? 'bg-[#EAE5D9] text-[#242A25] shadow-2xs font-semibold'
                  : 'text-[#615C54] hover:text-[#1A1A1A] hover:bg-[#F2ECE0]'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${currentTab === 'catalog' ? 'text-[#5A6B5D]' : 'text-[#78736B]'}`} />
              <span>Guía de Ingredientes</span>
            </button>

            {/* Direct Consult Button */}
            {onOpenConsultation && (
              <button
                id="btn-open-direct-consult"
                onClick={onOpenConsultation}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5A6B5D] text-white hover:bg-[#49574B] text-xs font-bold transition-all shadow-xs ml-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#BAC7BC]" />
                <span>Consultar Especialista</span>
              </button>
            )}
          </nav>

          {/* Quick Action Button for Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            {onOpenConsultation && (
              <button
                onClick={onOpenConsultation}
                className="px-3 py-1.5 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consultar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Menu */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-[#E5E2D9] no-scrollbar">
          <button
            onClick={() => setCurrentTab('quiz')}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium ${
              currentTab === 'quiz' ? 'bg-[#5A6B5D] text-white' : 'bg-[#EAE5D9] text-[#4A463F]'
            }`}
          >
            Test de Piel
          </button>
          <button
            onClick={() => setCurrentTab('routine')}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium ${
              currentTab === 'routine' ? 'bg-[#5A6B5D] text-white' : 'bg-[#EAE5D9] text-[#4A463F]'
            }`}
          >
            Mi Rutina
          </button>
          <button
            onClick={() => setCurrentTab('appointments')}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium ${
              currentTab === 'appointments' ? 'bg-[#5A6B5D] text-white' : 'bg-[#EAE5D9] text-[#4A463F]'
            }`}
          >
            Citas
          </button>
          <button
            onClick={() => setCurrentTab('crm')}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium ${
              currentTab === 'crm' ? 'bg-[#5A6B5D] text-white' : 'bg-[#EAE5D9] text-[#4A463F]'
            }`}
          >
            Fichas
          </button>
          <button
            onClick={() => setCurrentTab('catalog')}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium ${
              currentTab === 'catalog' ? 'bg-[#5A6B5D] text-white' : 'bg-[#EAE5D9] text-[#4A463F]'
            }`}
          >
            Ingredientes
          </button>
        </div>
      </div>
    </header>
  );
};
