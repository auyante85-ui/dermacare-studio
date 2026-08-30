import React, { useState } from 'react';
import { ClinicalRecord, SkinType, SkinConcern, FitzpatrickType } from '../../types';
import { INITIAL_CLIENTS } from '../../data/mockData';
import { 
  Users, 
  Search, 
  Plus, 
  Calendar, 
  FileText, 
  Camera, 
  Sparkles, 
  Bot, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Activity,
  HeartPulse,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';

export const ClientRecords: React.FC = () => {
  const [clients, setClients] = useState<ClinicalRecord[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string>(INITIAL_CLIENTS[0].id);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSkinType, setFilterSkinType] = useState<string>('todos');

  // Modal / Session creation state
  const [isAddingSession, setIsAddingSession] = useState<boolean>(false);
  const [sessionTreatment, setSessionTreatment] = useState<string>('Peeling suave con Ácido Mandélico 10% + Mascarilla de Ácido Hialurónico');
  const [sessionObservations, setSessionObservations] = useState<string>('Excelente recuperación de la barrera cutánea. Descongestión evidente y pH equilibrado.');
  const [sessionCabinProducts, setSessionCabinProducts] = useState<string>('Solución Mandélica 10%, Emulsión descongestiva, Crema de Ceramidas');
  const [sessionHomeCare, setSessionHomeCare] = useState<string>('Mantener protector solar diario y añadir Retinal 2 noches por semana.');
  const [sessionNextDate, setSessionNextDate] = useState<string>('2026-10-15');

  // AI summary state
  const [isGeneratingAISummary, setIsGeneratingAISummary] = useState<boolean>(false);
  const [aiClinicalReport, setAiClinicalReport] = useState<string | null>(null);

  // New Client creation modal
  const [isCreatingClient, setIsCreatingClient] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientEmail, setNewClientEmail] = useState<string>('');
  const [newClientPhone, setNewClientPhone] = useState<string>('');
  const [newClientAge, setNewClientAge] = useState<number>(30);
  const [newClientSkinType, setNewClientSkinType] = useState<SkinType>('mixta');
  const [newClientFitzpatrick, setNewClientFitzpatrick] = useState<FitzpatrickType>('III');
  const [newClientAllergies, setNewClientAllergies] = useState<string>('Ninguna');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterSkinType === 'todos' || c.skinType === filterSkinType;
    return matchesSearch && matchesType;
  });

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession = {
      id: `sess_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      treatmentDone: sessionTreatment,
      skinStateObserved: sessionObservations,
      cabinProductsUsed: sessionCabinProducts.split(',').map(s => s.trim()),
      homeCareAdjustments: sessionHomeCare,
      nextReviewDate: sessionNextDate
    };

    setClients(clients.map(c => {
      if (c.id === selectedClient.id) {
        return {
          ...c,
          sessions: [newSession, ...c.sessions]
        };
      }
      return c;
    }));

    setIsAddingSession(false);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ClinicalRecord = {
      id: `cli_${Date.now()}`,
      fullName: newClientName,
      email: newClientEmail,
      phone: newClientPhone,
      age: newClientAge,
      gender: 'Femenino',
      fitzpatrick: newClientFitzpatrick,
      skinType: newClientSkinType,
      concerns: ['acne', 'deshidratacion'],
      allergies: newClientAllergies.split(',').map(s => s.trim()),
      medicalConditions: [],
      currentRoutineSummary: 'Nueva ficha iniciada.',
      sessions: [],
      evolutionNotes: 'Primera valoración clínica abierta.',
      photos: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setClients([newRecord, ...clients]);
    setSelectedClientId(newRecord.id);
    setIsCreatingClient(false);
  };

  const handleGenerateAISummary = async () => {
    setIsGeneratingAISummary(true);
    try {
      const response = await fetch('/api/cosmetology/clinical-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientData: {
            nombre: selectedClient.fullName,
            edad: selectedClient.age,
            biotipo: selectedClient.skinType,
            fototipo: selectedClient.fitzpatrick,
            alergias: selectedClient.allergies,
            condiciones: selectedClient.medicalConditions
          },
          sessionNotes: selectedClient.sessions.map(s => `${s.date}: ${s.treatmentDone} - ${s.skinStateObserved}`).join(' | '),
          previousEvolution: selectedClient.evolutionNotes
        })
      });

      const data = await response.json();
      if (data.success && data.summary) {
        setAiClinicalReport(data.summary);
      }
    } catch (err) {
      console.error('Error generating AI clinical summary:', err);
    } finally {
      setIsGeneratingAISummary(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5D9] text-[#3C473E] text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-[#5A6B5D]" />
            Expediente Clínico Cosmetológico (CRM)
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1A1A1A]">
            Fichas Técnicas & Evolución de Pacientes
          </h1>
          <p className="text-xs sm:text-sm text-[#78736B] mt-1">
            Gestión integral de biotipos, registros fotográficos, sesiones de gabinete y síntesis con IA.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingClient(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#BAC7BC]" />
          <span>Nueva Ficha de Paciente</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Patient Directory & Search */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-5 shadow-xs">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-[#78736B] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar text-xs">
              {['todos', 'mixta', 'grasa', 'seca', 'sensible'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterSkinType(type)}
                  className={`px-3 py-1 rounded-full capitalize whitespace-nowrap font-medium text-[11px] transition-all ${
                    filterSkinType === type
                      ? 'bg-[#5A6B5D] text-white shadow-xs'
                      : 'bg-[#F9F7F2] border border-[#E5E2D9] text-[#78736B] hover:border-[#BAC7BC]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Patients List */}
            <div className="space-y-2 mt-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredClients.map((client) => {
                const isSelected = client.id === selectedClient.id;
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white shadow-xs'
                        : 'border-[#E5E2D9] bg-[#F9F7F2] hover:border-[#BAC7BC] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{client.fullName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#EAE5D9] text-[#3C473E]'
                      }`}>
                        Piel {client.skinType}
                      </span>
                    </div>

                    <div className={`text-[11px] mt-1 ${isSelected ? 'text-[#E5ECE6]' : 'text-[#78736B]'}`}>
                      {client.age} años | Fitzpatrick {client.fitzpatrick} | {client.sessions.length} sesiones
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
                      {client.concerns.slice(0, 2).map((c, i) => (
                        <span
                          key={i}
                          className={`text-[9px] px-2 py-0.5 rounded-md font-semibold truncate ${
                            isSelected ? 'bg-white/10 text-[#BAC7BC]' : 'bg-[#EAE5D9] text-[#615C54]'
                          }`}
                        >
                          {c.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Patient Clinical File Detail */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E5E2D9]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-display font-bold text-[#1A1A1A]">
                    {selectedClient.fullName}
                  </h2>
                  <span className="bg-[#EAE5D9] text-[#3C473E] text-xs px-3 py-1 rounded-full font-bold capitalize">
                    Piel {selectedClient.skinType}
                  </span>
                </div>
                <p className="text-xs text-[#78736B] mt-1">
                  Email: <strong>{selectedClient.email}</strong> | Tel: <strong>{selectedClient.phone}</strong> | Edad: <strong>{selectedClient.age} años</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingSession(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#BAC7BC]" />
                  <span>Añadir Sesión</span>
                </button>
              </div>
            </div>

            {/* Clinical Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block">
                  Fototipo Fitzpatrick
                </span>
                <div className="text-base font-bold text-[#1A1A1A] mt-0.5">
                  Escala {selectedClient.fitzpatrick}
                </div>
                <p className="text-[11px] text-[#78736B] mt-1">
                  Protección solar diaria no negociable.
                </p>
              </div>

              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block">
                  Alergias Conocidas
                </span>
                <div className="text-xs font-bold text-[#B91C1C] mt-0.5">
                  {selectedClient.allergies.join(', ') || 'Ninguna registrada'}
                </div>
                <p className="text-[11px] text-[#78736B] mt-1">
                  Revisar INCI antes de aplicar en cabina.
                </p>
              </div>

              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block">
                  Condiciones / Fármacos
                </span>
                <div className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                  {selectedClient.medicalConditions.join(', ') || 'Ninguna'}
                </div>
                <p className="text-[11px] text-[#78736B] mt-1">
                  Precaución con retinoides en embarazo.
                </p>
              </div>
            </div>

            {/* Current Routine & Evolution Overview */}
            <div className="mt-6 space-y-4">
              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A6B5D] mb-1">
                  Resumen de Rutina Domiciliaria Actual
                </h4>
                <p className="text-xs text-[#1A1A1A] leading-relaxed">
                  {selectedClient.currentRoutineSummary}
                </p>
              </div>

              {/* AI Clinical Summary Assistant */}
              <div className="bg-[#EFF4F0] p-5 rounded-2xl border border-[#C5D5C8]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#5A6B5D]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B352D]">
                      Síntesis Clínica Automatizada (Gemini 3.7 Flash)
                    </h4>
                  </div>
                  <button
                    onClick={handleGenerateAISummary}
                    disabled={isGeneratingAISummary}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5A6B5D] text-white text-[11px] font-semibold hover:bg-[#49574B] shadow-xs"
                  >
                    {isGeneratingAISummary ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-[#BAC7BC]" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-[#BAC7BC]" />
                    )}
                    <span>{aiClinicalReport ? 'Actualizar Informe' : 'Generar Informe IA'}</span>
                  </button>
                </div>

                <p className="text-xs text-[#2B352D] leading-relaxed whitespace-pre-line">
                  {aiClinicalReport || selectedClient.evolutionNotes}
                </p>
              </div>
            </div>
          </div>

          {/* Photo Gallery / Evolution Before-After */}
          {selectedClient.photos.length > 0 && (
            <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-4 h-4 text-[#5A6B5D]" />
                <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                  Registro Fotográfico de Evolución Cutánea
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedClient.photos.map((photo) => (
                  <div key={photo.id} className="bg-[#F9F7F2] p-3.5 rounded-2xl border border-[#E5E2D9]">
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-2 bg-[#EAE5D9]">
                      <img
                        src={photo.imageUrl}
                        alt={photo.tag}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 bg-[#2B352D]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                        {photo.tag} ({photo.date})
                      </span>
                    </div>
                    <p className="text-[11px] text-[#615C54] leading-snug">
                      {photo.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Sessions Timeline */}
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5A6B5D]" />
                <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                  Historial de Sesiones en Gabinete ({selectedClient.sessions.length})
                </h3>
              </div>
            </div>

            {selectedClient.sessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#78736B] bg-[#F9F7F2] rounded-2xl border border-[#E5E2D9]">
                No hay sesiones registradas aún para este paciente. Haz clic en "Añadir Sesión".
              </div>
            ) : (
              <div className="space-y-4">
                {selectedClient.sessions.map((sess, idx) => (
                  <div
                    key={sess.id}
                    className="bg-[#F9F7F2] border border-[#E5E2D9] rounded-2xl p-4 space-y-2 hover:border-[#BAC7BC] transition-all"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5E2D9]">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5A6B5D] text-white text-[11px] font-bold flex items-center justify-center">
                          {selectedClient.sessions.length - idx}
                        </span>
                        <h4 className="font-bold text-xs text-[#1A1A1A]">
                          {sess.treatmentDone}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-[#5A6B5D] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {sess.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <strong className="text-[#3C473E] block text-[11px] uppercase">Estado Cutáneo Observado:</strong>
                        <p className="text-[#615C54] mt-0.5">{sess.skinStateObserved}</p>
                      </div>
                      <div>
                        <strong className="text-[#3C473E] block text-[11px] uppercase">Ajuste de Cuidados en Casa:</strong>
                        <p className="text-[#615C54] mt-0.5">{sess.homeCareAdjustments}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E5E2D9] flex items-center justify-between text-[11px] text-[#78736B]">
                      <span><strong>Activos en cabina:</strong> {sess.cabinProductsUsed.join(', ')}</span>
                      <span><strong>Próxima revisión:</strong> {sess.nextReviewDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Add New Session */}
      {isAddingSession && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E5E2D9] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2D9]">
              <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                Registrar Nueva Sesión Clínica
              </h3>
              <button
                onClick={() => setIsAddingSession(false)}
                className="text-[#78736B] hover:text-[#1A1A1A] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">
                  Tratamiento Realizado en Cabina
                </label>
                <input
                  type="text"
                  value={sessionTreatment}
                  onChange={(e) => setSessionTreatment(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">
                  Diagnóstico / Estado de Piel Observado
                </label>
                <textarea
                  rows={2}
                  value={sessionObservations}
                  onChange={(e) => setSessionObservations(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">
                  Productos / Activos Utilizados en Cabina (separados por coma)
                </label>
                <input
                  type="text"
                  value={sessionCabinProducts}
                  onChange={(e) => setSessionCabinProducts(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">
                  Pauta / Ajuste Domiciliario para el Paciente
                </label>
                <textarea
                  rows={2}
                  value={sessionHomeCare}
                  onChange={(e) => setSessionHomeCare(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">
                  Fecha Recomendada para Próxima Sesión
                </label>
                <input
                  type="date"
                  value={sessionNextDate}
                  onChange={(e) => setSessionNextDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E2D9]">
                <button
                  type="button"
                  onClick={() => setIsAddingSession(false)}
                  className="px-4 py-2 border border-[#D8D2C4] text-[#3C473E] rounded-xl font-semibold hover:bg-[#F9F7F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5A6B5D] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#49574B] shadow-xs"
                >
                  Guardar Sesión
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: Create New Patient Record */}
      {isCreatingClient && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E5E2D9] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2D9]">
              <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                Crear Ficha de Nuevo Paciente
              </h3>
              <button
                onClick={() => setIsCreatingClient(false)}
                className="text-[#78736B] hover:text-[#1A1A1A] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  required
                  placeholder="Ej. Laura Martínez"
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    required
                    placeholder="laura@ejemplo.com"
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    required
                    placeholder="+34 600 000 000"
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Edad</label>
                  <input
                    type="number"
                    value={newClientAge}
                    onChange={(e) => setNewClientAge(Number(e.target.value))}
                    min={14}
                    max={99}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Biotipo</label>
                  <select
                    value={newClientSkinType}
                    onChange={(e) => setNewClientSkinType(e.target.value as SkinType)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  >
                    <option value="mixta">Mixta</option>
                    <option value="grasa">Grasa</option>
                    <option value="seca">Seca</option>
                    <option value="sensible">Sensible</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Fitzpatrick</label>
                  <select
                    value={newClientFitzpatrick}
                    onChange={(e) => setNewClientFitzpatrick(e.target.value as FitzpatrickType)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  >
                    <option value="I">Fototipo I</option>
                    <option value="II">Fototipo II</option>
                    <option value="III">Fototipo III</option>
                    <option value="IV">Fototipo IV</option>
                    <option value="V">Fototipo V</option>
                    <option value="VI">Fototipo VI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">Alergias o Sensibilidades</label>
                <input
                  type="text"
                  value={newClientAllergies}
                  onChange={(e) => setNewClientAllergies(e.target.value)}
                  placeholder="Ej. Ácido glicólico, fragancias"
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E2D9]">
                <button
                  type="button"
                  onClick={() => setIsCreatingClient(false)}
                  className="px-4 py-2 border border-[#D8D2C4] text-[#3C473E] rounded-xl font-semibold hover:bg-[#F9F7F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5A6B5D] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#49574B] shadow-xs"
                >
                  Crear Ficha
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
