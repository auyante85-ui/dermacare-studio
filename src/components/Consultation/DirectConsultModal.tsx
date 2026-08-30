import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  X, 
  ShieldCheck, 
  User, 
  Bot, 
  HelpCircle, 
  CheckCircle2, 
  Calendar, 
  PhoneCall,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'expert';
  text: string;
  timestamp: string;
  suggestedProducts?: string[];
}

interface ConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToBooking?: () => void;
  initialQuestion?: string;
}

export const DirectConsultModal: React.FC<ConsultModalProps> = ({
  isOpen,
  onClose,
  onGoToBooking,
  initialQuestion
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'expert',
      text: '¡Hola! Soy Laura, tu especialista en cosmetología y cuidado facial en Dermacare Studio. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre compatibilidad de productos de farmacia en España, dudas sobre embarazo o cómo combinar tus sérums.',
      timestamp: 'Ahora'
    }
  ]);

  const [inputText, setInputText] = useState<string>(initialQuestion || '');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Pre-set frequent questions
  const FAQ_PROMPTS = [
    '¿Puedo usar retinol si estoy buscando embarazo o en lactancia?',
    '¿En qué orden aplico la vitamina C, el ácido hialurónico y la crema?',
    '¿Qué protector solar de farmacia me recomiendas para piel mixta con brillos?',
    '¿Cómo combinar ácido salicílico con niacinamida sin que me salgan rojeces?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call endpoint
      const response = await fetch('/api/cosmetology/ask-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });

      const data = await response.json();
      
      const expertMsg: ChatMessage = {
        id: `exp_${Date.now()}`,
        sender: 'expert',
        text: data.answer || 'Gracias por tu consulta. Para ese caso específico, te sugiero priorizar siempre el respeto a la barrera cutánea con productos calmantes de farmacia española (como La Roche-Posay Toleriane o ISDIN Fusion Water) y realizar un seguimiento personalizado.',
        suggestedProducts: data.suggestedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, expertMsg]);
    } catch (err) {
      // Fallback response for offline / high demand
      const expertMsg: ChatMessage = {
        id: `exp_${Date.now()}`,
        sender: 'expert',
        text: '¡Excelente pregunta! Como norma general en cosmetología clínica: si tienes piel reactiva o estás en etapa de gestación, reemplaza retinoides por Ácido Azelaico o Bakuchiol. Asegúrate de sellar con protector solar FPS 50+ (ej. ISDIN o Heliocare). Si notas tirantez, dale un descanso a los exfoliantes 3 días.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, expertMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-[#E5E2D9] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[700px]"
        >
          {/* Header */}
          <div className="bg-[#2B352D] text-[#F9F7F2] p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-[#5A6B5D] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  <User className="w-6 h-6 text-[#E5ECE6]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#2B352D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-white">
                    Laura Garrido
                  </h3>
                  <span className="bg-[#5A6B5D] text-[10px] px-2 py-0.5 rounded-full text-white font-medium">
                    Cosmetóloga Colegiada
                  </span>
                </div>
                <p className="text-xs text-[#BAC7BC]">
                  Dermacare Studio • Asesoramiento Dermocosmético en España
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#BAC7BC] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy & RGPD Note */}
          <div className="bg-[#F9F7F2] border-b border-[#E5E2D9] px-4 py-2 flex items-center justify-between text-[11px] text-[#78736B]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A6B5D]" />
              <span>Consulta privada y protegida bajo normativa RGPD / UE 2016/679.</span>
            </div>
            <span className="hidden sm:inline text-[#5A6B5D] font-medium">
              Respuesta en tiempo real
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F5]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'expert' && (
                  <div className="w-8 h-8 rounded-xl bg-[#5A6B5D] text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs text-xs font-bold">
                    LG
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#5A6B5D] text-white rounded-br-xs'
                      : 'bg-white text-[#1A1A1A] border border-[#E5E2D9] rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E5E2D9] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block">
                        Recomendaciones habituales en farmacia española:
                      </span>
                      <ul className="text-xs space-y-0.5 text-[#615C54]">
                        {msg.suggestedProducts.map((p, idx) => (
                          <li key={idx}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-[#78736B]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#EAE5D9] text-[#3C473E] flex items-center justify-center shrink-0 mt-1 shadow-2xs text-xs font-bold">
                    Tú
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-[#5A6B5D] text-white flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                  LG
                </div>
                <div className="bg-white border border-[#E5E2D9] rounded-2xl p-4 rounded-bl-xs text-xs text-[#78736B] flex items-center gap-2 shadow-2xs">
                  <Loader2 className="w-4 h-4 animate-spin text-[#5A6B5D]" />
                  <span>Laura está redactando tu recomendación dermocosmética...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Pills */}
          <div className="p-3 bg-white border-t border-[#E5E2D9] overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#78736B] whitespace-nowrap pl-1">
              Preguntas frecuentes:
            </span>
            {FAQ_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="text-[11px] bg-[#F9F7F2] hover:bg-[#EAE5D9] text-[#3C473E] border border-[#E5E2D9] px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar & Actions */}
          <div className="p-4 bg-white border-t border-[#E5E2D9] space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu consulta sobre productos, orden de rutina o ingredientes..."
                className="flex-1 px-4 py-3 bg-[#F9F7F2] border border-[#D8D2C4] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-3 rounded-2xl bg-[#5A6B5D] text-white hover:bg-[#49574B] disabled:opacity-50 transition-all shadow-xs flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#78736B] pt-1">
              <span>¿Necesitas una valoración completa en directo con videollamada?</span>
              {onGoToBooking && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToBooking();
                  }}
                  className="font-bold text-[#5A6B5D] hover:underline flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reservar Cita Personalizada (30-60 min)</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
