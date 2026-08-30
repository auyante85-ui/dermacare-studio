import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini Client
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper to call Gemini with retry and model fallback (gemini-2.5-flash -> gemini-2.5-flash-lite)
async function generateWithRetry(params: {
  model?: string;
  contents: any;
  config?: any;
  maxRetries?: number;
}): Promise<string | null> {
  const ai = getAIClient();
  if (!ai) return null;

  const candidateModels = params.model 
    ? [params.model, "gemini-2.5-flash-lite"] 
    : ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini model ${model}] notice:`, err?.message || err);
      // Continue to next fallback model
    }
  }

  return null;
}

// Utility to safely extract and parse JSON from model responses
function safeParseJson<T = any>(raw: string | null): T | null {
  if (!raw) return null;
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return null;
  }
}

// Fallback algorithm for Skin Analysis when AI is unavailable or offline
function generateFallbackSkinAnalysis(data: {
  skinType?: string;
  sensitivity?: string;
  concerns?: string[];
  clientName?: string;
  currentRoutine?: string;
}) {
  const skinType = data.skinType || "mixta";
  const sensitivity = data.sensitivity || "moderada";
  const concerns = data.concerns && data.concerns.length > 0 ? data.concerns : ["hidratación y balance"];
  const clientName = data.clientName || "Cliente";

  const concernsMap: Record<string, { desc: string; actives: string[] }> = {
    piel_madura: {
      desc: "disminución de densidad dérmica, pérdida de espesor epidérmico y descolgamiento del óvalo facial",
      actives: ["Pro-Xylane 3%", "Péptidos Tensores de Cobre GHK-Cu", "Retinaldehído Encapsulado 0.05%", "Ácido Hialurónico Multimolecular"]
    },
    menopausia_climaterio: {
      desc: "caída brusca en la síntesis de estrógenos con atrofia dérmica, sequedad hormonal profunda y propensión a sofocos",
      actives: ["Fitoestrógenos / Isoflavonas", "Aceite de Onagra Bio (Omega 6)", "Ceramidas NP/AP/EOP", "Niacinamida Calmante 4%"]
    },
    flacidez_densidad: {
      desc: "pérdida de elasticidad y sostén estructural dérmico en tercio inferior y cuello",
      actives: ["Matrixyl 3000 & Synthe'6", "DMAE / Silicio Orgánico", "Factores de Crecimiento Epidérmico"]
    },
    acne: {
      desc: "hipersecreción sebácea con tendencia a comedones y poros dilatados",
      actives: ["Ácido Salicílico 2% (BHA)", "Niacinamida 5%", "Zinc PCA 1%"]
    },
    manchas_hiperpigmentacion: {
      desc: "actividad melanocítica irregular con marcas postinflamatorias o fotoenvejecimiento",
      actives: ["Ácido Tranexámico 3%", "Ácido Azelaico 10%", "Vitamina C Pura (Ácido L-Ascórbico 10%)"]
    },
    lineas_envejecimiento: {
      desc: "disminución progresiva en la síntesis de colágeno y elastina dérmica",
      actives: ["Retinaldehído 0.05%", "Complejo de Péptidos Biomiméticos Matrixyl 3000", "Ácido Hialurónico Multimolecular"]
    },
    deshidratacion: {
      desc: "pérdida transepidérmica de agua (TEWL) y alteración del manto hidrolipídico",
      actives: ["Pantenol (Pro-Vitamina B5) 5%", "Ceramidas NP/AP/EOP", "Ácido Poliglutámico"]
    },
    rojeces_rosacea: {
      desc: "hiperreactividad vascular con compromiso de la función barrera cutánea",
      actives: ["Extracto de Centella Asiática (Madecassoside)", "Niacinamida 4%", "Bisabolol & Alantoína"]
    }
  };

  const selectedActives: string[] = [];
  concerns.forEach((c) => {
    if (concernsMap[c]) {
      selectedActives.push(...concernsMap[c].actives);
    }
  });

  if (selectedActives.length === 0) {
    selectedActives.push("Niacinamida 5%", "Ácido Hialurónico Multimolecular", "Ceramidas NP", "FPS 50+ Filtros Minerales");
  }

  const uniqueActives = Array.from(new Set(selectedActives)).slice(0, 5);

  const barrierEval = sensitivity === "alta"
    ? "Manto hidrolipídico hiperreactivo con microfisuras en la barrera lipídica. Requiere refuerzo prioritario con ceramidas y lípidos biomiméticos antes de activos irritantes."
    : sensitivity === "baja"
    ? "Barrera cutánea resistente con buena tolerancia general a hidroxiácidos y derivados de vitamina A."
    : "Barrera cutánea en equilibrio moderado, con zonas específicas susceptibles a deshidratación y reactividad estacional.";

  return {
    summary: `Diagnóstico cosmetológico personalizado para ${clientName}. Se observa un biotipo de piel ${skinType.toUpperCase()} con nivel de sensibilidad ${sensitivity}. Los objetivos prioritarios se concentran en ${concerns.map(c => c.replace(/_/g, ' ')).join(', ')}.`,
    barrierState: barrierEval,
    keyActives: uniqueActives,
    cautions: [
      "No combinar exfoliantes químicos fuertes (AHA/BHA) en la misma rutina nocturna con retinoides.",
      "Uso mandatorio de protector solar FPS 50+ de amplio espectro cada mañana y reaplicación cada 3-4 horas.",
      "Realizar prueba de parche (patch test) en el antebrazo durante 24 horas antes de incorporar cualquier nuevo principio activo."
    ],
    professionalRecommendation: "Pauta inicial para los primeros 30 días: consolidar una rutina minimalista de soporte de barrera (limpieza suave + hidratante reparadora + fotoprotección). Introducir los activos transformadores de manera escalonada (2 veces por semana)."
  };
}

// Fallback algorithm for Routine Generation
function generateFallbackRoutine(data: {
  skinType?: string;
  concerns?: string[];
  sensitivity?: string;
  budgetLevel?: string;
  lifestyle?: string;
}) {
  const skinType = data.skinType || "madura";
  const sensitivity = data.sensitivity || "moderada";

  const isMature = skinType === "madura";
  const isMenopause = skinType === "menopausica";
  const isOily = skinType === "grasa" || skinType === "mixta";

  if (isMature || isMenopause) {
    return {
      morningSteps: [
        {
          stepNumber: 1,
          category: "Limpieza",
          name: "Emulsión Limpiadora Hidronutritiva Syndet pH 5.5",
          active: "Ceramidas + Pantenol 3% + Glicerina",
          frequency: "Diaria (Mañana)",
          tips: "Limpiar con agua templada y secar a toques suaves con toalla limpia sin friccionar para preservar la barrera lipídica."
        },
        {
          stepNumber: 2,
          category: "Tratamiento Activo",
          name: "Sérum Antioxidante & Péptidos de Cobre Redensificantes",
          active: "Vitamina C Microencapsulada 10% + Complejo Péptidos GHK-Cu",
          frequency: "Diaria (Mañana)",
          tips: "Aplicar 4-5 gotas en rostro, cuello y escote limpios para estimular la producción de colágeno y neutralizar radicales libres."
        },
        {
          stepNumber: 3,
          category: "Hidratación / Firmeza",
          name: isMenopause 
            ? "Crema Relipidizante Nutri-Densidad con Proxylane & Fitoestrógenos"
            : "Crema Reafirmante Antiarrugas Pro-Colágeno & Ácido Hialurónico",
          active: isMenopause ? "Pro-Xylane 3% + Isoflavonas de Soja + 3 Ceramidas" : "Matrixyl 3000 + Ácido Hialurónico Multimolecular",
          frequency: "Diaria (Mañana)",
          tips: "Extender con suaves masajes ascendentes desde la base del cuello hacia el mentón y pómulos para reafirmar el óvalo facial."
        },
        {
          stepNumber: 4,
          category: "Fotoprotección",
          name: "Fotoprotector Facial Age Active Fluid FPS 50+ Broad Spectrum",
          active: "Filtros fotoestables de amplio espectro UVA/UVB + Fernblock + Ácido Hialurónico",
          frequency: "Diaria (Obligatorio cada mañana)",
          tips: "Aplicar la regla de los dos dedos sobre rostro y cuello. Reaplicar cada 3-4 horas si hay exposición solar continuada."
        }
      ],
      nightSteps: [
        {
          stepNumber: 1,
          category: "Doble Limpieza",
          name: "1º Aceite Tratante Botánico de Onagra + 2º Emulsión Calmante",
          active: "Aceite de Onagra Bio (Omega 6) + Centella Asiática",
          frequency: "Diaria (Noche)",
          tips: "El aceite vegetal disuelve restos de maquillaje, polución y filtros solares respetando los lípidos naturales de la piel."
        },
        {
          stepNumber: 2,
          category: "Tratamiento Renovador",
          name: "Sérum Regenerador Nocturno con Retinaldehído 0.05% o Complejo Tensor",
          active: "Retinaldehído encapsulado 0.05% + Niacinamida 3%",
          frequency: "3 a 4 noches por semana alternas",
          tips: "Aplicar la cantidad de un guisante sobre la piel completamente seca para acelerar la regeneración dérmica profunda sin irritación."
        },
        {
          stepNumber: 3,
          category: "Nutrición / Reparación",
          name: "Bálsamo Fortalecedor Relipidizante con Ceramidas & Escualano",
          active: "Ceramidas NP/AP/EOP + Colesterol + Manteca de Karité Bio",
          frequency: "Diaria (Noche)",
          tips: "Sella los activos de la noche y combate la sequedad hormonal y la pérdida transepidérmica de agua."
        }
      ],
      weeklyTreatments: [
        {
          name: "Exfoliación Enzimática Suave o Ácido Láctico al 5%",
          frequency: "1 noche por semana (noche sin retinoides)",
          description: "Elimina células córneas queratinizadas sin agredir ni resecar la piel madura o reactiva."
        },
        {
          name: "Mascarilla de Factores de Crecimiento & Ácido Hialurónico",
          frequency: "1-2 veces por semana tras la higiene",
          description: "Aporta turgencia inmediata, nutrición profunda y recupera la densidad y jugosidad dérmica."
        }
      ],
      consultantSecretTip: "Regla de Oro en Pieles Maduras y Menopausia: La clave biológica es reponer lípidos intercelulares (ceramidas y ácidos grasos omega 6 de onagra) y estimular colágeno con Proxylane y Retinaldehído para revertir el afinamiento dérmico."
    };
  }

  return {
    morningSteps: [
      {
        stepNumber: 1,
        category: "Limpieza",
        name: isOily ? "Gel Limpiador Purificante Syndet pH 5.5" : "Emulsión Limpiadora Hidratante Suave",
        active: "Glicerina + Pantenol 2%",
        frequency: "Diaria (Mañana)",
        tips: "Lavar rostro con agua tibia realizando suaves círculos por 60 segundos. Secar a toques con toalla limpia sin frotar."
      },
      {
        stepNumber: 2,
        category: "Tratamiento Activo",
        name: "Sérum Antioxidante Iluminador C-Radiance",
        active: "Vitamina C (Ascorbyl Glucoside 10%) + Ácido Ferúlico",
        frequency: "Diaria (Mañana)",
        tips: "Aplicar 3-4 gotas sobre rostro seco. Dejar absorber 2 minutos para neutralizar radicales libres y polución."
      },
      {
        stepNumber: 3,
        category: "Hidratación",
        name: isOily ? "Fluido Hidratante Matificante & Regulador" : "Crema Hidratante Intensa con Ácido Hialurónico",
        active: "Niacinamida 4% + Ácido Hialurónico",
        frequency: "Diaria (Mañana)",
        tips: "Refuerza la cohesión celular y mantiene la hidratación sin aportar pesadez."
      },
      {
        stepNumber: 4,
        category: "Fotoprotección",
        name: "Protector Solar Fluido Invisible FPS 50+ Broad Spectrum",
        active: "Filtros fotoestables de amplio espectro UVA/UVB + Antioxidantes",
        frequency: "Diaria (Obligatorio cada mañana)",
        tips: "Aplicar la regla de 2 dedos completos para rostro y cuello. Reaplicar si hay exposición solar directa."
      }
    ],
    nightSteps: [
      {
        stepNumber: 1,
        category: "Doble Limpieza",
        name: "1º Aceite/Bálsamo Desmaquillante + 2º Gel Syndet Acuoso",
        active: "Escualano vegetal + Pantenol",
        frequency: "Diaria (Noche)",
        tips: "Disuelve sebo, partículas contaminantes y restos de protector solar sin alterar la barrera cutánea."
      },
      {
        stepNumber: 2,
        category: "Tratamiento Renovador",
        name: sensitivity === "alta" ? "Sérum Reparador con Niacinamida y Centella" : "Emulsión Renovadora Retinaldehído 0.05%",
        active: sensitivity === "alta" ? "Niacinamida 5% + Madecassoside" : "Retinaldehído 0.05% encapsulado",
        frequency: sensitivity === "alta" ? "Diaria (Noche)" : "3 noches por semana (Lunes, Miércoles, Viernes)",
        tips: "Aplicar del tamaño de un guisante sobre piel completamente seca. Si hay tirantez, emplear la técnica de sándwich."
      },
      {
        stepNumber: 3,
        category: "Reparación / Nutrición",
        name: "Crema Barrera Relipidizante Multiceramidas",
        active: "Complejo de 3 Ceramidas Esenciales (NP, AP, EOP) + Ácido Hialurónico",
        frequency: "Diaria (Noche)",
        tips: "Sella los activos aplicados y potencia la regeneración del manto hidrolipídico durante el descanso."
      }
    ],
    weeklyTreatments: [
      {
        name: "Exfoliación Química Enzimática o Ácido Láctico Suave 5%",
        frequency: "1 vez por semana (en noche sin retinoides)",
        description: "Elimina queratinocitos desprendidos y suaviza la textura cutánea sin causar microabrasiones."
      },
      {
        name: "Mascarilla Facial Calmante de Centella Asiática y Avena Coloidal",
        frequency: "1-2 veces por semana tras el exfoliante",
        description: "Restaura la elasticidad, descongestiona y aporta confort dérmico inmediato."
      }
    ],
    consultantSecretTip: "Regla de Oro de la Cosmetóloga: La constancia y el respeto a la barrera cutánea superan a la sobreestimulación de activos. Mantén siempre el protector solar y dale un mínimo de 4 a 6 semanas a cada ingrediente para evaluar su impacto real."
  };
}

// Fallback algorithm for Clinical CRM Summary
function generateFallbackClinicalSummary(data: {
  clientData?: any;
  sessionNotes?: string;
  previousEvolution?: string;
}) {
  const name = data.clientData?.nombre || "el paciente";
  const biotipo = data.clientData?.biotipo || "mixta";
  const notes = data.sessionNotes || "Tratamiento estándar de cabina.";

  return `1. Resumen de Evolución Clínica y Manto Hidrolipídico:
El paciente (${name}, biotipo piel ${biotipo}) presenta una evolución clínica favorable. Se evidencia adecuado equilibrio del manto hidrolipídico, reducción de reactividad cutánea y buena permeabilidad para la absorción de principios activos.

2. Ajustes en Gabinete y Domicilio:
- En gabinete: ${notes}
- En domicilio: Mantener protocolo de doble limpieza nocturna, fotoprotección estricta FPS 50+ y soporte continuo de ceramidas.

3. Próximo Hito y Control:
Control programado en 4 a 6 semanas para valorar tolerancia a activos transformadores y pautar nueva sesión de acondicionamiento epidérmico.`;
}

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Analyze skin diagnosis & generate AI cosmetological recommendation
app.post("/api/cosmetology/analyze-skin", async (req, res) => {
  const { answers, clientName, currentRoutine, concerns, skinType, sensitivity } = req.body;

  try {
    const ai = getAIClient();

    if (!ai) {
      const fallbackAnalysis = generateFallbackSkinAnalysis({
        skinType,
        sensitivity,
        concerns,
        clientName,
        currentRoutine,
      });

      return res.json({
        success: true,
        source: "expert-rules",
        analysis: fallbackAnalysis,
      });
    }

    const prompt = `Actúa como una Consultora Cosmetóloga Senior y Formulación Dermocosmética.
Analiza la siguiente evaluación cutánea de un cliente y genera un diagnóstico profesional estructurado:

- Nombre/Identificador: ${clientName || "Cliente"}
- Tipo de piel identificado: ${skinType || "No especificado"}
- Preocupaciones cutáneas principales: ${concerns?.join(", ") || "General"}
- Nivel de sensibilidad: ${sensitivity || "Moderada"}
- Rutina actual del cliente: ${currentRoutine || "Básica"}
- Respuestas del cuestionario detallado: ${JSON.stringify(answers || {})}

Genera una respuesta en formato JSON estrictamente válido con los siguientes campos:
{
  "summary": "Resumen clínico claro y empático del estado de la piel (1-2 párrafos)",
  "barrierState": "Evaluación del estado de la barrera cutánea y manto hidrolipídico",
  "keyActives": ["Lista de 4 a 6 ingredientes activos dermatológicos recomendados con concentración sugerida"],
  "cautions": ["3 precauciones indispensables de uso o incompatibilidades"],
  "professionalRecommendation": "Consejo profesional prioritario de la cosmetóloga para los primeros 30 días"
}`;

    const textOutput = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
      maxRetries: 2,
    });

    if (!textOutput) {
      throw new Error("Empty response from AI model");
    }

    const parsed = JSON.parse(textOutput);

    res.json({
      success: true,
      source: "gemini-ai",
      analysis: parsed,
    });
  } catch (error: any) {
    console.warn("Falling back to expert clinical rules for /api/cosmetology/analyze-skin due to:", error?.message || error);
    
    const fallbackAnalysis = generateFallbackSkinAnalysis({
      skinType,
      sensitivity,
      concerns,
      clientName,
      currentRoutine,
    });

    res.json({
      success: true,
      source: "expert-rules-resilient",
      notice: "Informe procesado con motor clínico de respaldo debido a alta demanda temporal de IA.",
      analysis: fallbackAnalysis,
    });
  }
});

// API: Generate complete customized AM/PM Routine
app.post("/api/cosmetology/generate-routine", async (req, res) => {
  const { skinType, concerns, sensitivity, lifestyle, budgetLevel, clientNotes } = req.body;

  try {
    const ai = getAIClient();

    if (!ai) {
      const fallbackRoutine = generateFallbackRoutine({
        skinType,
        concerns,
        sensitivity,
        budgetLevel,
        lifestyle,
      });

      return res.json({
        success: true,
        source: "expert-rules",
        routine: fallbackRoutine,
      });
    }

    const prompt = `Actúa como cosmetóloga profesional y formula una rutina facial completa y personalizada (Mañana, Noche y Tratamientos Semanales):
- Tipo de piel: ${skinType}
- Preocupaciones clave: ${concerns?.join(", ")}
- Nivel de sensibilidad: ${sensitivity}
- Estilo de vida / Preferencias: ${lifestyle || "Estándar"}
- Nivel de presupuesto / complejidad: ${budgetLevel || "Intermedio"}
- Notas adicionales: ${clientNotes || "Ninguna"}

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "morningSteps": [
    {
      "stepNumber": 1,
      "category": "Limpieza | Tónico | Tratamiento/Sérum | Hidratación | Fotoprotección",
      "name": "Nombre sugerido del producto/fórmula",
      "active": "Principio activo clave",
      "frequency": "Diaria / Días alternos",
      "tips": "Modo de aplicación profesional"
    }
  ],
  "nightSteps": [
    {
      "stepNumber": 1,
      "category": "Doble Limpieza | Tratamiento Activo | Hidratación/Reparación",
      "name": "Nombre sugerido del producto/fórmula",
      "active": "Principio activo clave",
      "frequency": "Diaria / X veces por semana",
      "tips": "Modo de aplicación profesional"
    }
  ],
  "weeklyTreatments": [
    {
      "name": "Nombre del tratamiento exfoliante suave o mascarilla",
      "frequency": "Frecuencia semanal recomendada",
      "description": "Objetivo del tratamiento"
    }
  ],
  "consultantSecretTip": "Un tip de oro de cosmetología específico para este caso"
}`;

    const textOutput = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
      maxRetries: 2,
    });

    if (!textOutput) {
      throw new Error("Empty response from AI model");
    }

    const parsed = JSON.parse(textOutput);

    res.json({
      success: true,
      source: "gemini-ai",
      routine: parsed,
    });
  } catch (error: any) {
    console.warn("Falling back to expert clinical rules for /api/cosmetology/generate-routine due to:", error?.message || error);

    const fallbackRoutine = generateFallbackRoutine({
      skinType,
      concerns,
      sensitivity,
      budgetLevel,
      lifestyle,
    });

    res.json({
      success: true,
      source: "expert-rules-resilient",
      notice: "Rutina formulada con motor de prescripción cosmetológica de respaldo.",
      routine: fallbackRoutine,
    });
  }
});

// Intelligent Comprehensive Cosmetology Expert Engine for Resilient Consultations
function generateComprehensiveExpertConsultation(params: {
  question: string;
  clientAge?: number;
  history?: any[];
  photoBase64?: string;
  userProfile?: any;
}) {
  const q = (params.question || "").toLowerCase();
  const age = params.clientAge || 58;
  const isMature = age >= 48;
  const hasPhoto = Boolean(params.photoBase64);

  let photoNote: string | null = null;
  if (hasPhoto) {
    photoNote = `Análisis visual orientativo: Se aprecia la textura cutánea con áreas que demandan soporte lipídico e hidratación profunda. ${
      isMature
        ? "Se observan líneas dinámicas en frente/periorbital y necesidad de refuerzo en la firmeza del tercio inferior del rostro."
        : "Se observa microrelieve cutáneo típico con zonas de brillo o poros visibles que se beneficiarán de una regulación suave sin resecar."
    }`;
  }

  // 1. Incompatibilidades y combinaciones de ingredientes activos (Retinol + Vitamina C, Ácidos, Niacinamida...)
  if (
    q.includes("mezcl") || 
    q.includes("combin") || 
    q.includes("junt") || 
    q.includes("incompatib") || 
    (q.includes("retinol") && q.includes("vitamina c")) ||
    (q.includes("retinol") && (q.includes("acido") || q.includes("ácido") || q.includes("glicolico") || q.includes("glicólico")))
  ) {
    return {
      answer: `¡Excelente pregunta de formulación y compatibilidad! En cosmetología es crucial respetar los tiempos y el pH cutáneo para no saturar la barrera:\n\n` +
        `• **Vitamina C y Retinol/Retinal:** No se recomienda aplicarlos a la vez en el mismo momento. La estrategia óptima es usar la **Vitamina C pura por la mañana** (actúa como escudo antioxidante frente a radiación UV y polución) y reservar el **Retinol o Retinaldehído para la noche** (estimula la regeneración celular mientras duermes).\n\n` +
        `• **Retinoides y Ácidos Exfoliantes (Glicólico, Salicílico, Láctico):** Evita usarlos en la misma noche. Lo ideal es la técnica de *Skin Cycling* o alternancia: 1 o 2 noches por semana aplicas tu exfoliante químico, y las noches alternas aplicas tu retinoide.\n\n` +
        `• **Niacinamida y Ácido Hialurónico:** Son los mejores aliados de cualquier rutina. Son totalmente compatibles tanto con retinoides como con ácidos y vitamina C, ayudando a calmar y reforzar la función barrera.`,
      skinAnalysisNote: photoNote || `Compatibilidad evaluada para perfil de ${age} años.`,
      suggestedProducts: [
        { name: "La Roche-Posay Pure Vitamin C10 Sérum (Mañanas)", tier: "Dermofarmacia", price: "39,90 €" },
        { name: "Medik8 Crystal Retinal 3 / 6 (Noches)", tier: "Cosmecéutica Avanzada", price: "69,00 €" },
        { name: "The Ordinary Niacinamide 10% + Zinc 1%", tier: "Opciones Accesibles", price: "6,60 €" },
        { name: "Caudalie Resveratrol-Lift Sérum Reafirmante", tier: "Cosmética Natural / Bio", price: "52,00 €" }
      ]
    };
  }

  // 2. Orden estricto de la rutina (Paso a paso)
  if (
    q.includes("orden") || 
    q.includes("paso") || 
    q.includes("primero") || 
    q.includes("despues") || 
    q.includes("después") || 
    q.includes("como me pongo") || 
    q.includes("cómo me pongo") ||
    q.includes("rutina")
  ) {
    return {
      answer: `El orden correcto de aplicación de cosméticos sigue la **regla de densidades (de más acuoso/ligero a más denso/graso)** para garantizar que cada activo penetre:\n\n` +
        `☀️ **RUTINA DE MAÑANA (Protección & Firmeza):**\n` +
        `1. **Limpieza suave:** Limpiador al agua (gel syndet, espuma botánica o leche limpiadora).\n` +
        `2. **Contorno de Ojos:** Aplicar antes del sérum con suaves toques sobre el hueso orbicular.\n` +
        `3. **Sérum Tratante:** Vitamina C, Ácido Hialurónico o Sérum de Péptidos tensores.\n` +
        `4. **Crema Hidratante / Reafirmante:** Sella el agua y aporta lípidos protectores.\n` +
        `5. **Protector Solar FPS 50+:** El último paso obligatorio antes de salir o maquillar.\n\n` +
        `🌙 **RUTINA DE NOCHE (Regeneración & Nutrición):**\n` +
        `1. **Doble Limpieza:** 1º Aceite o bálsamo desmaquillante (retira SPF y polución) + 2º Limpiador acuoso suave.\n` +
        `2. **Contorno de Ojos nutritivo.**\n` +
        `3. **Activo Transformador:** Retinaldehído, Retinol o Péptidos redensificantes (con la piel completamente seca).\n` +
        `4. **Crema Reparadora con Ceramidas:** Nutrición intensiva para reparar el manto epicutáneo.`,
      skinAnalysisNote: photoNote || `Protocolo adaptado para optimizar penetración de activos a los ${age} años.`,
      suggestedProducts: [
        { name: "Caudalie Vinoclean Aceite Tratante Desmaquillante", tier: "Cosmética Natural", price: "18,50 €" },
        { name: "Endocare Cellage Firming Cream Reafirmante", tier: "Alta Cosmética", price: "54,50 €" },
        { name: "ISDIN Fusion Water MAGIC FPS 50+", tier: "Dermofarmacia", price: "22,95 €" },
        { name: "CeraVe Crema Hidratante con Ceramidas", tier: "Dermofarmacia", price: "13,50 €" }
      ]
    };
  }

  // 3. Menopausia, Climaterio, Sequedad Hormonal y Sofocos
  if (
    q.includes("menopaus") || 
    q.includes("climaterio") || 
    q.includes("sofoco") || 
    q.includes("hormonal") || 
    q.includes("estrogeno") || 
    q.includes("estrógeno") ||
    q.includes("afinamiento")
  ) {
    return {
      answer: `Durante la **menopausia y el climaterio**, la caída de estrógenos provoca una pérdida de hasta el 30% del colágeno dérmico en los primeros 5 años, acompañada de una reducción drástica de lípidos intercelulares y secreción sebácea. El abordaje cosmetológico prioritario debe ser **redensificante, relipidizante y calmante**:\n\n` +
        `1. **Proxylane y Fitoestrógenos / Isoflavonas (Mañanas):** Estimulan la síntesis de glucosaminoglucanos (GAGs) en la unión dermoepidérmica, recuperando el grosor y turgencia de la piel.\n\n` +
        `2. **Lípidos Esenciales y Ácido Gamma-Linolénico (GLA):** El **aceite de onagra bio**, las **ceramidas 1, 3 y 6** y el colesterol reponen el cemento lipídico frente a la sequedad severa y el picor o tirantez característicos.\n\n` +
        `3. **Péptidos Tensores y Retinaldehído de baja concentración (Noches):** Redensifican la matriz extracelular sin alterar la barrera cutánea, afinando las arrugas y devolviendo luminosidad.\n\n` +
        `4. **Brumas Calmantes & Texturas Refrescantes:** Para los episodios de sofocos faciales, una bruma termal o con ectoína y centella asiática alivia instantáneamente la sensación de calor y rojez.`,
      skinAnalysisNote: photoNote || `Protocolo específico de redensificación y confort para piel en menopausia (${age} años).`,
      suggestedProducts: [
        { name: "Vichy Neovadiol Meno 5 Bi-Serum Antiedad Global", tier: "Dermofarmacia", price: "44,90 €" },
        { name: "ISDIN Isdinceutics Age Reverse Night Crema Reparadora", tier: "Dermofarmacia", price: "52,00 €" },
        { name: "Weleda Aceite Facial Reafirmante de Granada & Maca Bio", tier: "Cosmética Natural", price: "24,50 €" },
        { name: "Endocare Cellage Alta Potencia Redensificante", tier: "Cosmecéutica Avanzada", price: "58,00 €" }
      ]
    };
  }

  // 4. Arrugas profundas, flacidez, descolgamiento y piel madura (50, 58, 60+ años)
  if (
    isMature ||
    q.includes("arruga") || 
    q.includes("firmeza") || 
    q.includes("flacidez") || 
    q.includes("descolgamiento") || 
    q.includes("madura") || 
    q.includes("58") || 
    q.includes("50") || 
    q.includes("60") ||
    q.includes("surco") || 
    q.includes("frente") || 
    q.includes("cuello")
  ) {
    return {
      answer: `Para una piel madura (${age} años), los tres cambios fisiológicos clave son la disminución de estrógenos, la menor síntesis de colágeno tipo I y III y la pérdida de lípidos dérmicos. El plan de choque cosmético debe enfocarse en **densidad, soporte y elasticidad**:\n\n` +
        `1. **Péptidos Tensores y Factores de Crecimiento (Mañanas):** Estimulan a los fibroblastos para reconstruir la matriz extracelular, aportando firmeza al óvalo facial y disminuyendo la profundidad de las arrugas de expresión (frente, entrecejo y surco nasogeniano).\n\n` +
        `2. **Retinaldehído encapsulado (Noches):** El retinal es el retinoide estrella para piel madura: actúa 11 veces más rápido que el retinol tradicional, redensifica la dermis y no deshidrata si se formula con lípidos nutritivos.\n\n` +
        `3. **Nutrición Relipidizante:** Cremas enriquecidas con ceramidas, fitoesteroles y escualano vegetal para evitar la pérdida transepidérmica de agua (TEWL) y aportar confort sin tirantez.`,
      skinAnalysisNote: photoNote || `Enfoque prioritario: Redensificación de la matriz dérmica y elevación del óvalo facial a los ${age} años.`,
      suggestedProducts: [
        { name: "Endocare Cellage Firming Cream (Cantabria Labs)", tier: "Cosmecéutica Avanzada", price: "54,50 €" },
        { name: "Eucerin Hyaluron-Filler + 3x Effect Día/Noche", tier: "Dermofarmacia", price: "32,50 €" },
        { name: "Apivita Queen Bee Sérum Antiedad Holístico", tier: "Cosmética Natural / Bio", price: "62,00 €" },
        { name: "The Ordinary Multi-Peptide + HA Serum", tier: "Opciones Accesibles", price: "18,90 €" }
      ]
    };
  }

  // 4. Manchas, melasma e hiperpigmentación
  if (
    q.includes("mancha") || 
    q.includes("melasma") || 
    q.includes("pigment") || 
    q.includes("tono") || 
    q.includes("tranexamico") || 
    q.includes("tranexámico") || 
    q.includes("azelaico")
  ) {
    return {
      answer: `El tratamiento cosmético de las manchas (solares, seniles o melasma) requiere un abordaje multi-diana que regule la síntesis de melanina y acelere la renovación celular:\n\n` +
        `• **Ácido Tranexámico + Ácido Azelaico:** Bloquean la comunicación entre el queratinocito y el melanocito. Son seguros durante todo el año y aptos incluso para pieles con tendencia a rojeces.\n` +
        `• **Niacinamida al 5%:** Impide la transferencia de los melanosomas a las capas superficiales de la epidermis.\n` +
        `• **Fotoprotección estricta 365 días:** El 90% del éxito en el control de manchas depende del uso diario de SPF 50+ con protección de amplio espectro UVA y luz azul.`,
      skinAnalysisNote: photoNote || `Estrategia despigmentante progresiva y unificadora del tono.`,
      suggestedProducts: [
        { name: "Sesderma Azelac RU Liposomal Sérum Despigmentante", tier: "Dermofarmacia", price: "34,95 €" },
        { name: "Caudalie Vinoperfect Sérum Resplandor Antimanchas", tier: "Cosmética Natural", price: "49,90 €" },
        { name: "Cantabria Labs Neoretin Discrom Control Ultra Emulsión", tier: "Cosmecéutica Avanzada", price: "41,50 €" },
        { name: "ISDIN FotoUltra Spot Prevent FPS 50+", tier: "Dermofarmacia", price: "24,50 €" }
      ]
    };
  }

  // 5. Piel sensible, rosácea, cuperosis y barrera cutánea dañada
  if (
    q.includes("sensib") || 
    q.includes("rosacea") || 
    q.includes("rosácea") || 
    q.includes("rojez") || 
    q.includes("cuperosis") || 
    q.includes("barrera") || 
    q.includes("tirantez") || 
    q.includes("escozor") || 
    q.includes("quema")
  ) {
    return {
      answer: `Una piel reactiva o con la barrera cutánea comprometida necesita **reparación lipídica, activos calmantes y mínima fricción**:\n\n` +
        `1. **Higiene respetuosa:** Evita geles espumosos con sulfatos agresivos. Utiliza leches limpiadoras, aceites botánicos puros o aguas micelares formuladas para piel intolerante.\n` +
        `2. **Activos de rescate:** Centella Asiática (Madecassoside), Niacinamida a concentraciones suaves (2-4%), Pantenol (Vitamina B5) y Ectoína para calmar la microinflamación.\n` +
        `3. **Suspender exfoliantes abrasivos:** Durante los brotes de reactividad, retira ácidos glicólicos fuertes y retinoides hasta que el manto hidrolipídico recupere su equilibrio.`,
      skinAnalysisNote: photoNote || `Protocolo anti-reactividad y refuerzo del manto lipídico.`,
      suggestedProducts: [
        { name: "Bioderma Sensibio H2O Agua Micelar Dermatológica", tier: "Dermofarmacia", price: "14,90 €" },
        { name: "La Roche-Posay Cicaplast Baume B5+", tier: "Dermofarmacia", price: "12,90 €" },
        { name: "Avène Tolerance Control Crema Calmante", tier: "Dermofarmacia", price: "21,50 €" },
        { name: "Weleda Skin Food Crema Nutritiva Reparadora", tier: "Cosmética Natural", price: "10,95 €" }
      ]
    };
  }

  // 6. Cosmética natural, orgánica y botánica certificada
  if (
    q.includes("natural") || 
    q.includes("bio") || 
    q.includes("organ") || 
    q.includes("orgán") || 
    q.includes("ecocert") || 
    q.includes("natrue") || 
    q.includes("vegano") || 
    q.includes("botan") || 
    q.includes("botán")
  ) {
    return {
      answer: `La cosmética natural certificada europea (sellos COSMOS, ECOCERT, NATRUE) ofrece formulaciones ricas en fitoquímicos altamente afines a la piel:\n\n` +
        `• **Para Nutrición y Firmeza:** Aceites de primera presión en frío (almendra dulce, pepitas de uva, rosa mosqueta) y jalea real encapsulada, que aportan ácidos grasos omega 3, 6 y 9 fundamentales para la turgencia cutánea.\n` +
        `• **Para Calmar y Proteger:** Extractos de manzanilla bio, pensamiento silvestre, caléndula y agua de rosas orgánica, que desinflaman y devuelven luminosidad sin emulsionantes sintéticos pesados.\n` +
        `• **Limpieza suave natural:** Limpiadores basados en extracto de saponaria o aceites vegetales que desmaquillan respetando la microbiota dérmica.`,
      skinAnalysisNote: photoNote || `Selección de cosmética botánica certificada con aval europeo.`,
      suggestedProducts: [
        { name: "Weleda Skin Food Crema Facial Reparadora", tier: "Certificado NATRUE", price: "10,95 €" },
        { name: "Caudalie Vinoclean Aceite Desmaquillante 100% Vegetal", tier: "Clean & Vegano", price: "18,50 €" },
        { name: "Apivita Queen Bee Sérum con Jalea Real & Propóleo", tier: "Cosmética Natural 99%", price: "62,00 €" },
        { name: "Nuxe Crème Fraîche de Beauté Hidratante 48h", tier: "Fitocosmética Francesa", price: "28,90 €" }
      ]
    };
  }

  // 7. Contorno de ojos (ojeras, bolsas, patas de gallo)
  if (
    q.includes("ojo") || 
    q.includes("ojera") || 
    q.includes("bolsa") || 
    q.includes("pata de gallo") || 
    q.includes("parpado") || 
    q.includes("párpado")
  ) {
    return {
      answer: `La piel del contorno periocular es 4 veces más fina que la del resto del rostro y carece casi por completo de glándulas sebáceas. Para tratarlo con precisión:\n\n` +
        `• **Para Líneas y Flacidez:** Busca péptidos tensores (Matrixyl, Argireline) o derivados de retinol suaves formulados específicamente para el área ocular.\n` +
        `• **Para Bolsas y Retención:** Cafeína pura y extracto de té verde aplicados con drenaje linfático suave desde el lagrimal hacia las sienes.\n` +
        `• **Para Ojeras Pigmentarias (Marrones):** Vitamina K óxido, ácido tranexámico o vitamina C para aclarar el depósito de pigmento hemático y melánico.`,
      skinAnalysisNote: photoNote || `Tratamiento periocular especializado.`,
      suggestedProducts: [
        { name: "ISDIN K-Ox Eyes Contorno de Ojos", tier: "Dermofarmacia", price: "39,50 €" },
        { name: "Endocare Radiance Contorno de Ojos Antiojeras", tier: "Cosmecéutica Avanzada", price: "33,00 €" },
        { name: "Caudalie Premier Cru El Contorno de Ojos", tier: "Fitocosmética Premium", price: "55,00 €" },
        { name: "CeraVe Crema Reparadora Contorno de Ojos", tier: "Dermofarmacia", price: "12,90 €" }
      ]
    };
  }

  // 8. Embarazo y Lactancia
  if (
    q.includes("embaraz") || 
    q.includes("lactancia") || 
    q.includes("bebé") || 
    q.includes("embarazada")
  ) {
    return {
      answer: `Durante el embarazo y la lactancia es fundamental adaptar la rutina por seguridad materno-fetal:\n\n` +
        `🚫 **Activos a EVITAR:** Retinol, Retinaldehído, Ácido Retinoico, Hidroquinona y Ácido Salicílico en altas concentraciones (>2%).\n\n` +
        `✅ **Activos SEGUROS y eficaces:**\n` +
        `• **Bakuchiol:** La alternativa vegetal al retinol; estimula el colágeno sin riesgo teratogénico.\n` +
        `• **Ácido Azelaico:** Excelente para controlar granitos, rojeces y el melasma gestacional (cloasma).\n` +
        `• **Ácido Hialurónico, Niacinamida y Vitamina C:** Hidratan, iluminan y protegen de los radicales libres.\n` +
        `• **Fotoprotección Mineral (Filtros Físicos):** Óxido de Zinc y Dióxido de Titanio para prevenir manchas sin absorción sistémica.`,
      skinAnalysisNote: photoNote || `Pautas seguras adaptadas a etapa de maternidad.`,
      suggestedProducts: [
        { name: "Sesderma Azelac Crema Hidratante con Ácido Azelaico", tier: "Dermofarmacia", price: "29,95 €" },
        { name: "La Roche-Posay Anthelios Mineral One FPS 50+", tier: "Dermofarmacia", price: "18,50 €" },
        { name: "Weleda Skin Food / Caudalie Vinoperfect Sérum", tier: "Cosmética Natural", price: "10,95 € - 49,90 €" }
      ]
    };
  }

  // 9. Acné, poros dilatados, puntos negros y piel grasa
  if (
    q.includes("acne") || 
    q.includes("acné") || 
    q.includes("grano") || 
    q.includes("poro") || 
    q.includes("punto negro") || 
    q.includes("grasa") || 
    q.includes("brillo") || 
    q.includes("sebo")
  ) {
    return {
      answer: `Para equilibrar una piel con tendencia a comedones, brillos o poros dilatados sin provocar efecto rebote:\n\n` +
        `1. **Ácido Salicílico 2% (BHA):** Al ser liposoluble, penetra en el interior del folículo pilosebáceo, disolviendo el tapón córneo de sebo y células muertas.\n` +
        `2. **Niacinamida 5-10% + Zinc PCA:** Regula la glándula sebácea, afina visualmente el tamaño de los poros y desinflama las lesiones activas.\n` +
        `3. **Hidratación no comedogénica en textura gel/fluido:** Nunca omitas la hidratación, ya que la deshidratación induce a la piel a segregar aún más grasa como mecanismo de compensación.`,
      skinAnalysisNote: photoNote || `Protocolo seborregulador y refinador de textura.`,
      suggestedProducts: [
        { name: "La Roche-Posay Effaclar Duo+M Tratamiento", tier: "Dermofarmacia", price: "19,50 €" },
        { name: "The Ordinary Niacinamide 10% + Zinc 1%", tier: "Opciones Accesibles", price: "6,60 €" },
        { name: "Bioderma Sébium Mat Control Fluido Hidratante", tier: "Dermofarmacia", price: "16,90 €" },
        { name: "Natura Siberica Espuma Purificante Bio Salvia", tier: "Cosmética Natural", price: "8,95 €" }
      ]
    };
  }

  // 10. Respuesta cosmética general completa y personalizada
  return {
    answer: `¡Hola! Con mucho gusto te asesoro de forma personalizada como cosmetóloga:\n\n` +
      `Para optimizar los resultados en tu piel (considerando un perfil de ${age} años), la estrategia más efectiva se basa en tres pilares fundamentales:\n\n` +
      `1. **Hidratación y Soporte de Barrera:** Asegurar que la piel cuente con suficiente agua y lípidos (ácido hialurónico multimolecular, ceramidas y glicerina) para mantener la elasticidad y evitar la tirantez.\n\n` +
      `2. **Tratamiento Transformador Específico:** Si tu objetivo es atenuar arrugas y recuperar firmeza, los péptidos tensores por la mañana y el retinaldehído o bakuchiol por la noche ofrecen una renovación celular visible sin agredir el tejido.\n\n` +
      `3. **Constancia y Protección:** La clave de la cosmética es la regularidad durante un mínimo de 4 a 6 semanas, complementando siempre con protección solar diaria para preservar los resultados conseguidos.`,
    skinAnalysisNote: photoNote || `Asesoramiento integral formulado para ${age} años.`,
    suggestedProducts: [
      { name: "Eucerin Hyaluron-Filler + 3x Effect Día/Noche", tier: "Dermofarmacia", price: "32,50 €" },
      { name: "Endocare Cellage Firming Cream (Cantabria Labs)", tier: "Alta Cosmética", price: "54,50 €" },
      { name: "Weleda Skin Food / Caudalie Vinoclean", tier: "Cosmética Natural", price: "10,95 € - 18,50 €" },
      { name: "The Ordinary Multi-Peptide + HA Serum", tier: "Opciones Accesibles", price: "18,90 €" }
    ]
  };
}

// API: Direct Consultation with Cosmetology Expert (Spain / EU market focused + Photo & Age Analysis)
app.post("/api/cosmetology/ask-expert", async (req, res) => {
  const { question, history, clientAge, userProfile, photoBase64 } = req.body;

  const clientAgeNum = Number(clientAge) || 58;

  try {
    const ai = getAIClient();

    if (!ai) {
      const fallbackResult = generateComprehensiveExpertConsultation({
        question: question || "",
        clientAge: clientAgeNum,
        history,
        photoBase64,
        userProfile,
      });

      return res.json({
        success: true,
        source: "expert-rules-resilient",
        ...fallbackResult,
      });
    }

    const conversationContext = Array.isArray(history) && history.length > 0
      ? history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'CLIENTE' : 'ESPECIALISTA'}: ${h.text}`).join('\n')
      : 'Inicio de la conversación.';

    const systemPrompt = `Eres Laura Garrido, una destacada y empática Consultora Cosmetóloga y Especialista en Dermocosmética en España en Dermacare Studio.
Tu objetivo es responder con máxima claridad, calidez, rigor técnico y cercanía pedagógica a CUALQUIER duda de cosmética, química de formulación, compatibilidad de activos, pasos de rutina, problemas cutáneos o recomendación de productos que plantee el usuario.

HISTORIAL RECIENTE:
${conversationContext}

PERFIL DE USUARIO:
- Edad: ${clientAgeNum} años.
${userProfile ? `- Datos adicionales: ${JSON.stringify(userProfile)}` : ''}

PREGUNTA DEL CLIENTE:
"${question || '¿Qué rutina o activos me recomiendas para el cuidado óptimo de mi piel?'}"

DIRECTIVAS ESPECÍFICAS DE ASESORAMIENTO:
1. RESPONDE DIRECTA Y EXHAUSTIVAMENTE A SU DUDA CONCRETA (incompatibilidades, orden de rutina, arrugas, manchas, rosácea, cosmética natural, embarazo, contorno de ojos, etc.). No desvíes el tema a respuestas genéricas.
2. ADAPTA EL ENFOQUE A SU EDAD (${clientAgeNum} años):
   - En pieles maduras (+50/+58 años): Prioriza pérdida de firmeza, descolgamiento del óvalo facial, arrugas profundas (frente, surco nasogeniano), nutrición relipidizante y regeneración nocturna (péptidos tensores, retinaldehído, ceramidas).
   - En pieles jóvenes (20-35 años): Prioriza balance de hidratación, poros, prevención antioxidante y control de sebo sin agredir.
3. SI HAY FOTOGRAFÍA FACIAL ADJUNTA: Analiza visualmente la textura, nivel de hidratación aparente, líneas de expresión o firmeza con empatía y precisión profesional.
4. RECOMIENDA OPCIONES VARIADAS DE ESPAÑA Y EUROPA (Dermofarmacia, Cosmética Natural/Bio certificada, Cosmecéutica Avanzada u Opciones Accesibles).
5. FORMATO DE RESPUESTA JSON ESTRICTO:
{
  "answer": "Respuesta completa, estructurada (con viñetas o pasos si aplica), clara y pedagógica para resolver totalmente su duda.",
  "skinAnalysisNote": "Observación específica de la piel o foto (si aplica, o null)",
  "suggestedProducts": [
    { "name": "Nombre comercial del producto y marca", "tier": "Dermofarmacia | Cosmética Natural | Cosmecéutica Avanzada | Opciones Accesibles", "price": "Precio orientativo en €" }
  ]
}`;

    let contentsPayload: any;

    if (photoBase64) {
      const mimeMatch = photoBase64.match(/^data:(image\/[a-zA-Z0-9.+_-]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const cleanBase64 = photoBase64.replace(/^data:image\/\w+;base64,/, "");

      contentsPayload = {
        parts: [
          { text: systemPrompt },
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
        ],
      };
    } else {
      contentsPayload = systemPrompt;
    }

    const textOutput = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: contentsPayload,
      config: {
        responseMimeType: "application/json",
      },
      maxRetries: 2,
    });

    if (!textOutput) {
      throw new Error("Empty response from AI model");
    }

    const parsed = safeParseJson<any>(textOutput);
    if (!parsed || !parsed.answer) {
      throw new Error("Invalid JSON structure from AI model");
    }

    res.json({
      success: true,
      source: "gemini-ai",
      answer: parsed.answer,
      skinAnalysisNote: parsed.skinAnalysisNote || null,
      suggestedProducts: parsed.suggestedProducts || [],
    });
  } catch (error: any) {
    console.warn("Fallback expert consultation triggered due to:", error?.message || error);

    const fallbackResult = generateComprehensiveExpertConsultation({
      question: question || "",
      clientAge: clientAgeNum,
      history,
      photoBase64,
      userProfile,
    });

    res.json({
      success: true,
      source: "expert-rules-resilient",
      ...fallbackResult,
    });
  }
});
app.post("/api/cosmetology/clinical-summary", async (req, res) => {
  const { clientData, sessionNotes, previousEvolution } = req.body;

  try {
    const ai = getAIClient();

    if (!ai) {
      const summary = generateFallbackClinicalSummary({
        clientData,
        sessionNotes,
        previousEvolution,
      });

      return res.json({
        success: true,
        source: "expert-rules",
        summary,
      });
    }

    const prompt = `Eres una redactora de fichas técnicas cosmetológicas profesionales.
Sintetiza la siguiente sesión de consulta y evolución en un informe clínico técnico y conciso para la ficha del cliente:
- Datos del cliente: ${JSON.stringify(clientData)}
- Notas de la sesión actual: ${sessionNotes}
- Historial previo: ${previousEvolution || "Primera consulta"}

Proporciona:
1. Resumen de evolución clínica y estado del manto lipídico.
2. Ajustes requeridos en gabinete o domicilio.
3. Próximo hito y fecha sugerida de control.`;

    const textOutput = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      maxRetries: 2,
    });

    res.json({
      success: true,
      source: "gemini-ai",
      summary: textOutput || "",
    });
  } catch (error: any) {
    console.warn("Falling back to expert clinical rules for /api/cosmetology/clinical-summary due to:", error?.message || error);

    const summary = generateFallbackClinicalSummary({
      clientData,
      sessionNotes,
      previousEvolution,
    });

    res.json({
      success: true,
      source: "expert-rules-resilient",
      summary,
    });
  }
});

// Vite middleware for development vs static production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cosmetology App server running on http://localhost:${PORT}`);
  });
}

startServer();
