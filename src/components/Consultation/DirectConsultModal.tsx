import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
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
  ChevronDown,
  Camera,
  Image as ImageIcon,
  Trash2,
  Sparkle,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductBuyInfo } from '../../utils/productLinks';

interface ProductSuggestion {
  name: string;
  tier?: string;
  price?: string;
  purchaseUrl?: string;
  storeName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'expert';
  text: string;
  timestamp: string;
  photoUrl?: string;
  skinAnalysisNote?: string;
  suggestedProducts?: ProductSuggestion[] | string[];
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
      text: '¡Hola! Soy Laura Garrido, cosmetóloga especialista de Dermacare Studio. Cuéntame sobre tu piel, tus inquietudes y tu edad (o adjunta una fotografía de tu rostro) para formular un asesoramiento a tu medida con cosméticos y activos disponibles en España y Europa.',
      timestamp: 'Ahora'
    }
  ]);

  const [inputText, setInputText] = useState<string>(initialQuestion || '');
  const [clientAge, setClientAge] = useState<number | string>(58);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedPhotoBase64, setSelectedPhotoBase64] = useState<string | null>(null);
  const [photoPreviewName, setPhotoPreviewName] = useState<string>('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior
      });
    }
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'nearest' });
  };

  useEffect(() => {
    if (isOpen) {
      // Immediate scroll followed by animation frame to prevent freeze
      scrollToBottom('auto');
      const timer = setTimeout(() => scrollToBottom('smooth'), 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isTyping, isOpen]);

  // Frequently asked questions tailored to real skin needs and ages
  const FAQ_PROMPTS = [
    'Tengo 58 años: ¿Qué rutina me recomiendas para arrugas profundas y pérdida de firmeza?',
    '¿Puedo combinar retinol por la noche y vitamina C por la mañana?',
    '¿En qué orden aplico mi limpiador, sérum de péptidos y crema reafirmante?',
    '¿Qué cosmética natural certificada me aconsejas para piel madura o sensible?',
    '¿Cómo trato las manchas y el tono irregular sin agredir la piel?',
    '¿Qué activos cosméticos son seguros durante el embarazo?'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreviewName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedPhoto = () => {
    setSelectedPhotoBase64(null);
    setPhotoPreviewName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query && !selectedPhotoBase64) return;

    const currentPhoto = selectedPhotoBase64;
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query || 'He adjuntado una fotografía de mi piel para tu valoración cosmetológica.',
      photoUrl: currentPhoto || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setSelectedPhotoBase64(null);
    setPhotoPreviewName('');
    setIsTyping(true);

    try {
      // Call endpoint with conversation context history, age and photo
      const response = await fetch('/api/cosmetology/ask-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: query || 'Por favor analiza la fotografía de piel adjunta y sugiere el tratamiento ideal según mi edad y necesidades.',
          history: newHistory,
          clientAge: Number(clientAge) || undefined,
          photoBase64: currentPhoto || undefined
        })
      });

      const data = await response.json();
      
      const expertMsg: ChatMessage = {
        id: `exp_${Date.now()}`,
        sender: 'expert',
        text: data.answer || 'Gracias por tu consulta. Analizando tu perfil, priorizaremos activos tensores, péptidos estimuladores de colágeno y una correcta hidratación barrera.',
        skinAnalysisNote: data.skinAnalysisNote,
        suggestedProducts: data.suggestedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, expertMsg]);
    } catch (err) {
      // Fallback response for offline
      const expertMsg: ChatMessage = {
        id: `exp_${Date.now()}`,
        sender: 'expert',
        text: `Para el cuidado a los ${clientAge || 58} años, el pilar fundamental consiste en recuperar la densidad cutánea y suavizar arrugas mediante péptidos tensores en la mañana y retinaldehído o ácido hialurónico biomimético por la noche. Recuerda que no es necesario sobrecargar la piel: 3 pasos bien formulados son la clave del éxito.`,
        suggestedProducts: [
          { name: "Endocare Cellage Firming Cream (Cantabria Labs)", tier: "Alta Cosmética", price: "54,50 €" },
          { name: "La Roche-Posay Hyalu B5 Sérum", tier: "Farmacia", price: "38,50 €" },
          { name: "Weleda Skin Food / Caudalie Vinoclean", tier: "Natural Certificado", price: "10,95 € - 18,50 €" }
        ],
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white border border-[#E5E2D9] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh] max-h-[740px]"
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
                    Cosmetóloga Especialista
                  </span>
                </div>
                <p className="text-xs text-[#BAC7BC]">
                  Dermacare Studio • Asesoramiento Facial Personalizado
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#BAC7BC] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Age Bar & Context Indicator */}
          <div className="bg-[#F9F7F2] border-b border-[#E5E2D9] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#615C54] font-medium">Edad para el diagnóstico:</span>
              <div className="inline-flex items-center gap-1 bg-white border border-[#D8D2C4] px-2.5 py-1 rounded-xl">
                <input
                  type="number"
                  min={14}
                  max={99}
                  value={clientAge}
                  onChange={(e) => setClientAge(e.target.value)}
                  className="w-10 text-center font-bold text-[#2B352D] focus:outline-none"
                />
                <span className="text-[11px] text-[#78736B]">años</span>
              </div>
              <span className="text-[10px] text-[#78736B] hidden sm:inline">(Adapta activos a tu edad)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#5A6B5D]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Memoria de consulta activa</span>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div 
            ref={chatContainerRef} 
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F5] scroll-smooth"
          >
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
                  className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#5A6B5D] text-white rounded-br-xs'
                      : 'bg-white text-[#1A1A1A] border border-[#E5E2D9] rounded-bl-xs'
                  }`}
                >
                  {/* Attached photo in message */}
                  {msg.photoUrl && (
                    <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20">
                      <img 
                        src={msg.photoUrl} 
                        alt="Foto de piel adjunta" 
                        className="max-h-48 w-full object-cover" 
                      />
                    </div>
                  )}

                  {msg.skinAnalysisNote && (
                    <div className="mb-2.5 bg-[#EFF4F0] p-2.5 rounded-xl border border-[#C5D5C8] text-[11px] text-[#2B352D]">
                      <strong className="block text-[#3D5240] font-bold uppercase tracking-wider mb-0.5">
                        🔍 Observación de Piel & Fotografía:
                      </strong>
                      <span>{msg.skinAnalysisNote}</span>
                    </div>
                  )}

                  {msg.sender === 'expert' ? (
                    <div className="space-y-2 leading-relaxed text-xs sm:text-sm text-[#1A1A1A]">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</p>
                  )}
                  
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-[#E5E2D9] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B5D] block">
                          Opciones Recomendadas en España & Europa:
                        </span>
                        <span className="text-[10px] text-[#78736B]">Enlaces directos de compra</span>
                      </div>
                      <div className="space-y-2">
                        {msg.suggestedProducts.map((item, idx) => {
                          const isObj = typeof item === 'object' && item !== null;
                          const name = isObj ? (item as ProductSuggestion).name : (item as string);
                          const tier = isObj ? (item as ProductSuggestion).tier : null;
                          const price = isObj ? (item as ProductSuggestion).price : null;
                          const customUrl = isObj ? (item as ProductSuggestion).purchaseUrl : undefined;
                          const customStore = isObj ? (item as ProductSuggestion).storeName : undefined;

                          const buyInfo = getProductBuyInfo(name, undefined, customUrl, customStore);

                          return (
                            <div 
                              key={idx} 
                              className="p-2.5 bg-[#F9F7F2] rounded-xl border border-[#E5E2D9] text-xs text-[#2B352D] space-y-2 hover:border-[#BAC7BC] transition-all"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6B5D] mt-0.5 shrink-0" />
                                  <div>
                                    <span className="font-semibold text-[#1A1A1A] block">{name}</span>
                                    {tier && (
                                      <span className="text-[10px] text-[#5A6B5D] font-medium">Gama: {tier}</span>
                                    )}
                                  </div>
                                </div>
                                {price && (
                                  <span className="font-bold text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#D8D2C4] shrink-0 text-[#1A1A1A]">
                                    {price}
                                  </span>
                                )}
                              </div>

                              <div className="pt-1.5 border-t border-[#EAE5D9]/80 flex items-center justify-end">
                                <a
                                  id={`buy-chat-product-${idx}`}
                                  href={buyInfo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2D3B2D] hover:bg-[#1E281E] text-white text-[11px] font-medium rounded-lg transition-all shadow-2xs hover:shadow-xs group"
                                >
                                  <ShoppingBag className="w-3 h-3 text-[#EAE5D9] group-hover:scale-110 transition-transform" />
                                  <span>Ver / Comprar ({buyInfo.storeName})</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-[#BAC7BC]" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
                  <span>Laura está analizando tus necesidades y seleccionando los activos...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Pills */}
          <div className="p-2.5 bg-white border-t border-[#E5E2D9] overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#78736B] whitespace-nowrap pl-1">
              Temas rápidos:
            </span>
            {FAQ_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="text-[11px] bg-[#F9F7F2] hover:bg-[#EAE5D9] text-[#3C473E] border border-[#E5E2D9] px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Photo Preview if attached */}
          {selectedPhotoBase64 && (
            <div className="px-4 py-2 bg-[#F3EFE6] border-t border-[#E5E2D9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={selectedPhotoBase64} 
                  alt="Vista previa" 
                  className="w-10 h-10 object-cover rounded-lg border border-[#D8D2C4]" 
                />
                <div>
                  <span className="text-xs font-semibold text-[#2B352D] block">Foto de piel lista para enviar</span>
                  <span className="text-[10px] text-[#78736B] truncate max-w-[200px] block">{photoPreviewName || 'fotografia_rostro.jpg'}</span>
                </div>
              </div>
              <button
                onClick={removeSelectedPhoto}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Quitar foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Bar & Actions */}
          <div className="p-4 bg-white border-t border-[#E5E2D9] space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {/* Photo Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isTyping}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  selectedPhotoBase64 
                    ? 'bg-[#5A6B5D] text-white border-[#5A6B5D]' 
                    : 'bg-[#F9F7F2] text-[#5A6B5D] border-[#D8D2C4] hover:bg-[#EAE5D9]'
                }`}
                title="Adjuntar Foto de Piel para análisis"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pregunta sobre arrugas, orden de cremas, productos de farmacia..."
                className="flex-1 px-4 py-3 bg-[#F9F7F2] border border-[#D8D2C4] rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6B5D]"
                disabled={isTyping}
              />

              <button
                type="submit"
                disabled={(!inputText.trim() && !selectedPhotoBase64) || isTyping}
                className="p-3 rounded-2xl bg-[#5A6B5D] text-white hover:bg-[#49574B] disabled:opacity-50 transition-all shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#78736B] pt-1">
              <span>¿Prefieres una valoración en directo por videollamada?</span>
              {onGoToBooking && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToBooking();
                  }}
                  className="font-bold text-[#5A6B5D] hover:underline flex items-center gap-1 cursor-pointer"
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
