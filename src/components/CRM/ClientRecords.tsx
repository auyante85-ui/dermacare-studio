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
  Tag,
  Trash2,
  UserPlus
} from 'lucide-react';
import { motion } from 'motion/react';

export const ClientRecords: React.FC = () => {
  const [clients, setClients] = useState<ClinicalRecord[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string>(INITIAL_CLIENTS[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSkinType, setFilterSkinType] = useState<string>('todos');

  // Modal / Session creation state
  const [isAddingSession, setIsAddingSession] = useState<boolean>(false);
  const [sessionTreatment, setSessionTreatment] = useState<string>('Tratamiento Redensificante con Pro-Xylane + Mascarilla de Ácido Hialurónico');
  const [sessionObservations, setSessionObservations] = useState<string>('Excelente absorción y respuesta dérmica. Notable hidratación y disminución de la tirantez.');
  const [sessionCabinProducts, setSessionCabinProducts] = useState<string>('Solución de Péptidos, Emulsión nutritiva con Ceramidas, Protector SPF 50+');
  const [sessionHomeCare, setSessionHomeCare] = useState<string>('Aplicar crema redensificante mañana y noche, más fotoprotección diaria.');
  const [sessionNextDate, setSessionNextDate] = useState<string>('2026-10-15');

  // AI summary state
  const [isGeneratingAISummary, setIsGeneratingAISummary] = useState<boolean>(false);
  const [aiClinicalReport, setAiClinicalReport] = useState<string | null>(null);

  // New Client creation modal
  const [isCreatingClient, setIsCreatingClient] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientEmail, setNewClientEmail] = useState<string>('');
  const [newClientPhone, setNewClientPhone] = useState<string>('');
  const [newClientAge, setNewClientAge] = useState<number>(45);
  const [newClientGender, setNewClientGender] = useState<string>('Femenino');
  const [newClientSkinType, setNewClientSkinType] = useState<SkinType>('madura');
  const [newClientFitzpatrick, setNewClientFitzpatrick] = useState<FitzpatrickType>('III');
  const [newClientConcerns, setNewClientConcerns] = useState<SkinConcern[]>(['piel_madura', 'deshidratacion']);
  const [newClientAllergies, setNewClientAllergies] = useState<string>('Ninguna');
  const [newClientConditions, setNewClientConditions] = useState<string>('Ninguna');
  const [newClientCurrentRoutine, setNewClientCurrentRoutine] = useState<string>('Limpiador suave e hidratante básico.');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterSkinType === 'todos' || c.skinType === filterSkinType;
    return matchesSearch && matchesType;
  });

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

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
      fullName: newClientName || 'Nuevo Paciente',
      email: newClientEmail,
      phone: newClientPhone,
      age: newClientAge,
      gender: newClientGender,
      fitzpatrick: newClientFitzpatrick,
      skinType: newClientSkinType,
      concerns: newClientConcerns,
      allergies: newClientAllergies ? newClientAllergies.split(',').map(s => s.trim()) : [],
      medicalConditions: newClientConditions ? newClientConditions.split(',').map(s => s.trim()) : [],
      currentRoutineSummary: newClientCurrentRoutine || 'Nueva ficha iniciada.',
      sessions: [],
      evolutionNotes: 'Primera valoración clínica abierta. Protocolo personalizado en curso.',
      photos: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setClients([newRecord, ...clients]);
    setSelectedClientId(newRecord.id);
    setIsCreatingClient(false);
    // Reset modal form
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientAge(45);
    setNewClientAllergies('Ninguna');
    setNewClientConditions('Ninguna');
    setNewClientCurrentRoutine('');
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta ficha técnica de paciente?')) {
      const updated = clients.filter(c => c.id !== clientId);
      setClients(updated);
      if (selectedClientId === clientId) {
        setSelectedClientId(updated[0]?.id || '');
      }
    }
  };

  const toggleNewClientConcern = (concern: SkinConcern) => {
    if (newClientConcerns.includes(concern)) {
      if (newClientConcerns.length > 1) {
        setNewClientConcerns(newClientConcerns.filter(c => c !== concern));
      }
    } else {
      setNewClientConcerns([...newClientConcerns, concern]);
    }
  };

  const handleGenerateAISummary = async () => {
    if (!selectedClient) return;
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
          id="btn-create-new-client"
          onClick={() => setIsCreatingClient(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#BAC7BC]" />
          <span>Crear Nueva Ficha de Paciente</span>
        </button>
      </div>

      {clients.length === 0 ? (
        /* EMPTY STATE: When no clients exist */
        <div className="bg-white border border-[#E5E2D9] rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-[#F4F0E8] border border-[#DDD7C9] flex items-center justify-center mx-auto mb-4 text-[#5A6B5D]">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-display font-bold text-[#1A1A1A] mb-2">
            Sin Fichas de Pacientes Registradas
          </h3>
          <p className="text-xs sm:text-sm text-[#78736B] mb-6 max-w-md mx-auto leading-relaxed">
            Comienza a registrar a tus pacientes desde cero para llevar su historial dermocosmético, tipo de piel (incluyendo pieles maduras y menopausia), fototipo, sesiones en cabina y pautas domiciliarias.
          </p>
          <button
            onClick={() => setIsCreatingClient(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#BAC7BC]" />
            <span>Crear Primer Paciente</span>
          </button>
        </div>
      ) : (
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
                {['todos', 'madura', 'menopausica', 'mixta', 'grasa', 'seca', 'sensible', 'normal'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterSkinType(type)}
                    className={`px-3 py-1 rounded-full capitalize whitespace-nowrap font-medium text-[11px] transition-all cursor-pointer ${
                      filterSkinType === type
                        ? 'bg-[#5A6B5D] text-white shadow-xs'
                        : 'bg-[#F9F7F2] border border-[#E5E2D9] text-[#78736B] hover:border-[#BAC7BC]'
                    }`}
                  >
                    {type === 'menopausica' ? 'Menopausia' : type}
                  </button>
                ))}
              </div>

              {/* Patients List */}
              <div className="space-y-2 mt-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredClients.map((client) => {
                  const isSelected = client.id === selectedClient?.id;
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
          {selectedClient && (
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
                      Email: <strong>{selectedClient.email || 'No registrado'}</strong> | Tel: <strong>{selectedClient.phone || 'No registrado'}</strong> | Edad: <strong>{selectedClient.age} años</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddingSession(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A6B5D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#49574B] shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#BAC7BC]" />
                      <span>Añadir Sesión</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClient(selectedClient.id)}
                      className="flex items-center gap-1 p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                      title="Eliminar ficha de paciente"
                    >
                      <Trash2 className="w-4 h-4" />
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
                      Protección solar diaria recomendada.
                    </p>
                  </div>

                  <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E5E2D9]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block">
                      Alergias Conocidas
                    </span>
                    <div className="text-xs font-bold text-[#B91C1C] mt-0.5">
                      {selectedClient.allergies?.join(', ') || 'Ninguna registrada'}
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
                      {selectedClient.medicalConditions?.join(', ') || 'Ninguna'}
                    </div>
                    <p className="text-[11px] text-[#78736B] mt-1">
                      Estado hormonal, medicación o sensibilidades.
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
                          Síntesis Clínica Automatizada
                        </h4>
                      </div>
                      <button
                        onClick={handleGenerateAISummary}
                        disabled={isGeneratingAISummary}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5A6B5D] text-white text-[11px] font-semibold hover:bg-[#49574B] shadow-xs cursor-pointer"
                      >
                        {isGeneratingAISummary ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-[#BAC7BC]" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-[#BAC7BC]" />
                        )}
                        <span>{aiClinicalReport ? 'Actualizar Informe' : 'Generar Informe con IA'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#2B352D] leading-relaxed whitespace-pre-line">
                      {aiClinicalReport || selectedClient.evolutionNotes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sessions Timeline */}
              <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E2D9] mb-6">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-5 h-5 text-[#5A6B5D]" />
                    <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                      Historial de Sesiones en Gabinete ({selectedClient.sessions.length})
                    </h3>
                  </div>

                  <button
                    onClick={() => setIsAddingSession(true)}
                    className="text-xs font-bold text-[#5A6B5D] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Registrar nueva sesión</span>
                  </button>
                </div>

                {selectedClient.sessions.length === 0 ? (
                  <div className="text-center py-8 text-[#78736B] text-xs">
                    No hay sesiones registradas aún para este paciente. Haz clic en "Añadir Sesión" para registrar el primer tratamiento.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedClient.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="bg-[#F9F7F2] border border-[#E5E2D9] rounded-2xl p-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E5E2D9]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#5A6B5D]" />
                            <span className="font-bold text-xs text-[#1A1A1A]">
                              Sesión del {session.date}
                            </span>
                          </div>
                          {session.nextReviewDate && (
                            <span className="text-[11px] text-[#5A6B5D] font-semibold">
                              Próxima revisión: {session.nextReviewDate}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78736B] block mb-0.5">
                              Tratamiento Realizado en Cabina:
                            </span>
                            <p className="font-medium text-[#1A1A1A]">{session.treatmentDone}</p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78736B] block mb-0.5">
                              Estado Cutáneo Observado:
                            </span>
                            <p className="text-[#615C54]">{session.skinStateObserved}</p>
                          </div>
                        </div>

                        {session.cabinProductsUsed && session.cabinProductsUsed.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-[#E5E2D9]/60 flex flex-wrap gap-1.5">
                            {session.cabinProductsUsed.map((p, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 bg-white border border-[#D8D2C4] rounded-md text-[#3C473E] font-medium"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Add New Session */}
      {isAddingSession && selectedClient && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E5E2D9] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2D9]">
              <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                Registrar Sesión en Gabinete para {selectedClient.fullName}
              </h3>
              <button
                onClick={() => setIsAddingSession(false)}
                className="text-[#78736B] hover:text-[#1A1A1A] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">Tratamiento Realizado</label>
                <input
                  type="text"
                  value={sessionTreatment}
                  onChange={(e) => setSessionTreatment(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">Observaciones del Estado Cutáneo</label>
                <textarea
                  rows={3}
                  value={sessionObservations}
                  onChange={(e) => setSessionObservations(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">Productos de Cabina Utilizados (separados por coma)</label>
                <input
                  type="text"
                  value={sessionCabinProducts}
                  onChange={(e) => setSessionCabinProducts(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Ajuste de Pauta Domiciliaria</label>
                  <input
                    type="text"
                    value={sessionHomeCare}
                    onChange={(e) => setSessionHomeCare(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Fecha Próxima Revisión</label>
                  <input
                    type="date"
                    value={sessionNextDate}
                    onChange={(e) => setSessionNextDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E2D9]">
                <button
                  type="button"
                  onClick={() => setIsAddingSession(false)}
                  className="px-4 py-2 border border-[#D8D2C4] text-[#3C473E] rounded-xl font-semibold hover:bg-[#F9F7F2] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5A6B5D] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#49574B] shadow-xs cursor-pointer"
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
            className="bg-white border border-[#E5E2D9] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2D9]">
              <div>
                <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                  Crear Ficha de Nuevo Paciente
                </h3>
                <p className="text-xs text-[#78736B]">Registro inicial para diagnóstico y seguimiento personalizado.</p>
              </div>
              <button
                onClick={() => setIsCreatingClient(false)}
                className="text-[#78736B] hover:text-[#1A1A1A] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  required
                  placeholder="Ej. Carmen Rodríguez"
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
                    placeholder="carmen@ejemplo.com"
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+34 612 345 678"
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
                  <label className="block font-semibold text-[#3C473E] mb-1">Biotipo Cutáneo</label>
                  <select
                    value={newClientSkinType}
                    onChange={(e) => setNewClientSkinType(e.target.value as SkinType)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  >
                    <option value="madura">Piel Madura</option>
                    <option value="menopausica">Menopausia / Hormonal</option>
                    <option value="mixta">Piel Mixta</option>
                    <option value="grasa">Piel Grasa</option>
                    <option value="seca">Piel Seca</option>
                    <option value="sensible">Piel Sensible</option>
                    <option value="normal">Piel Normal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Fototipo</label>
                  <select
                    value={newClientFitzpatrick}
                    onChange={(e) => setNewClientFitzpatrick(e.target.value as FitzpatrickType)}
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  >
                    <option value="I">Fototipo I (Muy claro)</option>
                    <option value="II">Fototipo II (Claro)</option>
                    <option value="III">Fototipo III (Mediterráneo)</option>
                    <option value="IV">Fototipo IV (Moreno)</option>
                    <option value="V">Fototipo V (Oscuro)</option>
                    <option value="VI">Fototipo VI (Muy oscuro)</option>
                  </select>
                </div>
              </div>

              {/* Concerns Multi-selector */}
              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">Preocupaciones Cutáneas Principales</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { id: 'piel_madura', label: 'Piel Madura / Firmeza' },
                    { id: 'menopausia_climaterio', label: 'Menopausia / Sequedad Hormonal' },
                    { id: 'flacidez_densidad', label: 'Flacidez & Óvalo Facial' },
                    { id: 'lineas_envejecimiento', label: 'Arrugas & Líneas de Expresión' },
                    { id: 'deshidratacion', label: 'Deshidratación & Falta de Turgencia' },
                    { id: 'manchas_hiperpigmentacion', label: 'Manchas & Tono Irregular' },
                    { id: 'acne', label: 'Acné & Poros' },
                    { id: 'rojeces_rosacea', label: 'Rojeces & Sensibilidad' },
                  ].map((item) => {
                    const isSelected = newClientConcerns.includes(item.id as SkinConcern);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleNewClientConcern(item.id as SkinConcern)}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between text-[11px] cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white font-bold'
                            : 'border-[#E5E2D9] bg-[#F9F7F2] text-[#3C473E] hover:border-[#BAC7BC]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#BAC7BC]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Alergias o Sensibilidades</label>
                  <input
                    type="text"
                    value={newClientAllergies}
                    onChange={(e) => setNewClientAllergies(e.target.value)}
                    placeholder="Ej. Ácido glicólico, perfumes"
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3C473E] mb-1">Condiciones Médicas / Estado</label>
                  <input
                    type="text"
                    value={newClientConditions}
                    onChange={(e) => setNewClientConditions(e.target.value)}
                    placeholder="Ej. Menopausia, hipotiroidismo, rosácea"
                    className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3C473E] mb-1">Rutina Facial Actual del Paciente</label>
                <textarea
                  rows={2}
                  value={newClientCurrentRoutine}
                  onChange={(e) => setNewClientCurrentRoutine(e.target.value)}
                  placeholder="Ej. Limpiador en espuma y crema hidratante antiedad por la noche..."
                  className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E2D9]">
                <button
                  type="button"
                  onClick={() => setIsCreatingClient(false)}
                  className="px-4 py-2 border border-[#D8D2C4] text-[#3C473E] rounded-xl font-semibold hover:bg-[#F9F7F2] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5A6B5D] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#49574B] shadow-xs cursor-pointer"
                >
                  Crear Ficha Técnica
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
