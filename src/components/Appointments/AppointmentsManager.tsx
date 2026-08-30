import React, { useState } from 'react';
import { Appointment } from '../../types';
import { INITIAL_APPOINTMENTS } from '../../data/mockData';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  Check, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

interface AppointmentsManagerProps {
  userRole: 'client' | 'consultant';
  clientNameDefault?: string;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  userRole,
  clientNameDefault
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  
  // Booking Form State
  const [selectedService, setSelectedService] = useState<'Diagnóstico Facial Completo' | 'Asesoría Rutina Online' | 'Seguimiento de Evolución' | 'Limpieza Profunda & Peeling'>('Diagnóstico Facial Completo');
  const [modality, setModality] = useState<'Virtual (Videollamada)' | 'Presencial (Gabinete)'>('Virtual (Videollamada)');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-17');
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  
  const [clientName, setClientName] = useState<string>(clientNameDefault || 'María González');
  const [clientEmail, setClientEmail] = useState<string>('maria.g@gmail.com');
  const [clientPhone, setClientPhone] = useState<string>('+34 611 223 344');
  const [notes, setNotes] = useState<string>('Deseo que revisemos mi diagnóstico cutáneo y resolver dudas sobre la incorporación del retinol.');

  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [newAppointmentId, setNewAppointmentId] = useState<string>('');

  // Consultant filters
  const [statusFilter, setStatusFilter] = useState<'todas' | 'confirmada' | 'pendiente' | 'completada'>('todas');

  const availableHours = [
    '09:30', '10:30', '11:30', '12:30', '16:00', '17:00', '18:00', '19:00'
  ];

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApp: Appointment = {
      id: `app_${Date.now()}`,
      clientName,
      clientEmail,
      clientPhone,
      serviceType: selectedService,
      modality,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmada',
      notes
    };

    setAppointments([newApp, ...appointments]);
    setNewAppointmentId(newApp.id);
    setBookingSuccess(true);
  };

  const handleUpdateStatus = (id: string, newStatus: 'confirmada' | 'pendiente' | 'completada' | 'cancelada') => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const filteredAppointments = appointments.filter(a => {
    if (statusFilter === 'todas') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5D9] text-[#3C473E] text-xs font-semibold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-[#5A6B5D]" />
            Agenda & Asesorías Cosmetológicas
          </div>
          <h1 className="text-3xl font-display font-bold text-[#1A1A1A]">
            {userRole === 'consultant' ? 'Gestión de Citas y Consultas' : 'Agendar Asesoría Personalizada'}
          </h1>
          <p className="text-xs sm:text-sm text-[#78736B] mt-1">
            {userRole === 'consultant'
              ? 'Control de citas confirmadas, enlaces de videollamadas y pacientes en gabinete.'
              : 'Reserva tu espacio para una evaluación profesional en directo o en consultorio.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Booking Form (For Client or New Booking) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-display font-bold text-[#1A1A1A] mb-1">
              Nueva Reserva de Consulta
            </h2>
            <p className="text-xs text-[#78736B] mb-6">
              Selecciona el tipo de servicio, modalidad y el horario que mejor te convenga.
            </p>

            {bookingSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#EFF4F0] border border-[#C5D5C8] rounded-2xl p-6 text-center space-y-4"
              >
                <div className="w-12 h-12 bg-[#5A6B5D] text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2B352D] font-display">
                    ¡Cita Agendada con Éxito!
                  </h3>
                  <p className="text-xs text-[#49574B] mt-1 max-w-md mx-auto">
                    Hemos confirmado tu <strong>{selectedService}</strong> para el <strong>{selectedDate}</strong> a las <strong>{selectedTime}</strong> ({modality}).
                  </p>
                </div>

                <div className="bg-white/90 p-4 rounded-xl text-left border border-[#D5E0D7] text-xs text-[#2B352D] space-y-1.5 max-w-sm mx-auto shadow-xs">
                  <div><strong>Cliente:</strong> {clientName}</div>
                  <div><strong>Email:</strong> {clientEmail}</div>
                  <div><strong>Modalidad:</strong> {modality}</div>
                  {modality.includes('Virtual') ? (
                    <div className="text-[#3C473E] font-semibold pt-1">
                      🔗 Enlace de videollamada enviado por correo electrónico.
                    </div>
                  ) : (
                    <div className="text-amber-800 font-semibold pt-1">
                      📍 Gabinete: Av. de la Belleza 104, Planta 2, Consultorio Dermacare.
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setBookingSuccess(false)}
                  className="px-5 py-2.5 bg-[#5A6B5D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs"
                >
                  Agendar otra cita
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-6">
                {/* 1. Service Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-2">
                    1. Servicio Deseado
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: 'Diagnóstico Facial Completo',
                        duration: '60 min',
                        price: '45,00 €',
                        desc: 'Análisis minucioso de biotipo, barrera cutánea y diseño de rutina desde cero.'
                      },
                      {
                        title: 'Asesoría Rutina Online',
                        duration: '45 min',
                        price: '35,00 €',
                        desc: 'Revisión y optimización de productos actuales y compatibilidad de activos.'
                      },
                      {
                        title: 'Seguimiento de Evolución',
                        duration: '30 min',
                        price: '25,00 €',
                        desc: 'Ajuste de retinoides, control de tolerancia y fotografía comparativa.'
                      },
                      {
                        title: 'Limpieza Profunda & Peeling',
                        duration: '75 min',
                        price: '60,00 €',
                        desc: 'Presencial en cabina: Higiene ultrasónica, peeling químico suave y terapia LED.'
                      }
                    ].map((serv) => (
                      <button
                        key={serv.title}
                        type="button"
                        onClick={() => setSelectedService(serv.title as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          selectedService === serv.title
                            ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white shadow-xs'
                            : 'border-[#E5E2D9] bg-[#F9F7F2] hover:border-[#BAC7BC] text-[#1A1A1A]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{serv.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            selectedService === serv.title ? 'bg-white/20 text-white' : 'bg-[#EAE5D9] text-[#3C473E]'
                          }`}>
                            {serv.price}
                          </span>
                        </div>
                        <div className={`text-[11px] mt-1 ${selectedService === serv.title ? 'text-[#E5ECE6]' : 'text-[#78736B]'}`}>
                          Duración: {serv.duration}
                        </div>
                        <p className={`text-[11px] mt-1 leading-snug ${selectedService === serv.title ? 'text-[#F9F7F2]' : 'text-[#615C54]'}`}>
                          {serv.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Modality Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-2">
                    2. Modalidad de Atención
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setModality('Virtual (Videollamada)')}
                      className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        modality.includes('Virtual')
                          ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white shadow-xs'
                          : 'border-[#E5E2D9] bg-[#F9F7F2] text-[#1A1A1A] hover:bg-[#EAE5D9]'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>💻 Videollamada Online</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModality('Presencial (Gabinete)')}
                      className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        modality.includes('Presencial')
                          ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white shadow-xs'
                          : 'border-[#E5E2D9] bg-[#F9F7F2] text-[#1A1A1A] hover:bg-[#EAE5D9]'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>🏢 Gabinete Presencial</span>
                    </button>
                  </div>
                </div>

                {/* 3. Date & Time Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
                      3. Fecha de Consulta
                    </label>
                    <input
                      id="input-booking-date"
                      type="date"
                      value={selectedDate}
                      min="2026-09-01"
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3C473E] uppercase tracking-wider mb-1.5">
                      Horario Disponible
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {availableHours.map((hr) => (
                        <button
                          key={hr}
                          type="button"
                          onClick={() => setSelectedTime(hr)}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            selectedTime === hr
                              ? 'border-[#5A6B5D] bg-[#5A6B5D] text-white shadow-xs'
                              : 'border-[#E5E2D9] bg-[#F9F7F2] text-[#1A1A1A] hover:border-[#BAC7BC]'
                          }`}
                        >
                          {hr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Client Personal Details */}
                <div className="space-y-3 pt-3 border-t border-[#E5E2D9]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6B5D]">
                    4. Datos de Contacto
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Nombre completo"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Teléfono / WhatsApp"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Motivo principal o dudas previas..."
                      className="w-full px-3.5 py-2.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-booking"
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#5A6B5D] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#49574B] transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4 text-[#BAC7BC]" />
                  <span>Confirmar y Agendar Cita</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Scheduled Appointments List & Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E5E2D9] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E2D9]">
              <div>
                <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                  {userRole === 'consultant' ? 'Citas en Agenda' : 'Próximas Citas Agendadas'}
                </h3>
                <span className="text-xs text-[#78736B]">
                  {filteredAppointments.length} citas registradas
                </span>
              </div>

              {userRole === 'consultant' && (
                <div className="flex items-center gap-1">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-[#F9F7F2] border border-[#D8D2C4] rounded-xl text-[11px] font-medium text-[#3C473E]"
                  >
                    <option value="todas">Todas</option>
                    <option value="confirmada">Confirmadas</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="completada">Completadas</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-3 mt-4">
              {filteredAppointments.map((app) => (
                <div
                  key={app.id}
                  className="bg-[#F9F7F2] border border-[#E5E2D9] rounded-2xl p-4 space-y-2 hover:border-[#BAC7BC] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1A1A1A]">
                      {app.serviceType}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      app.status === 'confirmada' ? 'bg-[#E2EDE5] text-[#2B5A36]' :
                      app.status === 'pendiente' ? 'bg-amber-100 text-amber-900' :
                      app.status === 'completada' ? 'bg-blue-100 text-blue-900' :
                      'bg-rose-100 text-rose-900'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#615C54] flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-[#1A1A1A]">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#5A6B5D]" />
                      {app.date}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#1A1A1A]">
                      <Clock className="w-3.5 h-3.5 text-[#5A6B5D]" />
                      {app.time}
                    </span>
                    <span className="flex items-center gap-1 text-[#78736B]">
                      {app.modality.includes('Virtual') ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                      {app.modality.includes('Virtual') ? 'Online' : 'Gabinete'}
                    </span>
                  </div>

                  <div className="text-xs text-[#3C473E] pt-1.5 border-t border-[#E5E2D9]">
                    <strong>Paciente:</strong> {app.clientName} ({app.clientPhone})
                  </div>

                  {app.notes && (
                    <p className="text-[11px] text-[#78736B] italic">
                      "{app.notes}"
                    </p>
                  )}

                  {/* Actions for Consultant */}
                  {userRole === 'consultant' && (
                    <div className="pt-2 border-t border-[#E5E2D9] flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'completada')}
                        className="px-2.5 py-1 bg-[#E2EDE5] border border-[#C5D5C8] text-[#2B5A36] rounded-lg text-[10px] font-semibold hover:bg-[#D4E4D8]"
                      >
                        Marcar Completada
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'cancelada')}
                        className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[10px] font-semibold hover:bg-rose-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
