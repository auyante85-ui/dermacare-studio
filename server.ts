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

// Helper to call Gemini with retry for transient 503/429 spikes
async function generateWithRetry(params: {
  model?: string;
  contents: string;
  config?: any;
  maxRetries?: number;
}): Promise<string | null> {
  const ai = getAIClient();
  if (!ai) return null;

  const model = params.model || "gemini-3.7-flash";
  const maxRetries = params.maxRetries ?? 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return response.text || null;
    } catch (err: any) {
      const isTransient = 
        err?.status === "UNAVAILABLE" || 
        err?.code === 503 || 
        err?.message?.includes("503") ||
        err?.message?.includes("high demand") ||
        err?.code === 429 ||
        err?.status === "RESOURCE_EXHAUSTED";

      console.warn(`[Gemini Attempt ${attempt + 1}/${maxRetries + 1}] failed:`, err?.message || err);

      if (isTransient && attempt < maxRetries) {
        // Exponential backoff with jitter: 800ms, 1600ms
        const delay = 800 * Math.pow(2, attempt) + Math.random() * 300;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // If retries exhausted or non-transient, rethrow to be caught by fallback handler
      throw err;
    }
  }

  return null;
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
  const skinType = data.skinType || "mixta";
  const sensitivity = data.sensitivity || "moderada";

  const isOily = skinType === "grasa" || skinType === "mixta";
  const isDry = skinType === "seca";

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
      model: "gemini-3.7-flash",
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
      model: "gemini-3.7-flash",
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

// API: Direct Consultation with Cosmetology Expert (Spain / EU market focused)
app.post("/api/cosmetology/ask-expert", async (req, res) => {
  const { question } = req.body;

  try {
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "expert-rules",
        answer: "¡Hola! Como cosmetóloga especialista en dermocosmética para el mercado español y europeo, te aconsejo siempre introducir activos transformadores de manera paulatina. Para combinar sérums, aplica primero la textura más fluida (como ácido hialurónico sobre piel húmeda) y sella con crema hidratante y fotoprotector FPS 50+.",
        suggestedProducts: [
          "ISDIN Fotoprotector Fusion Water MAGIC SPF 50",
          "La Roche-Posay Hyalu B5 Sérum",
          "Cerave Crema Hidratante con 3 Ceramidas Esenciales"
        ]
      });
    }

    const prompt = `Actúa como una prestigiosa y cálida Consultora Cosmetóloga Española colegiada llamada Laura Garrido en Dermacare Studio.
Responde a la siguiente duda de un cliente sobre cuidado de la piel, compatibilidad de productos, embarazo/lactancia o rutinas.

Pregunta del cliente: "${question}"

Reglas estrictas de respuesta:
1. Lenguaje 100% en español de España, cercano, empático, profesional y muy fácil de entender sin tecnicismos informáticos.
2. Haz referencias naturales a marcas y productos de dermofarmacia, parafarmacia o cosmética populares y de fácil adquisición en España y la Unión Europea (ejemplos: ISDIN, La Roche-Posay, Cantabria Labs / Heliocare / Endocare, Cerave, Avène, Sesderma, Bella Aurora, Bioderma, The Ordinary en Primor/Druni/Sephora España, Mercadona Deliplus en opciones low-cost, GH Gema Herrerías).
3. Si la duda involucra embarazo o lactancia, recuerda la contraindicación del retinol/ácido retinoico y altas dosis de ácido salicílico, recomendando alternativas seguras como Ácido Azelaico, Niacinamida o Bakuchiol.
4. Responde en formato JSON con la estructura:
{
  "answer": "Texto de la respuesta claro, cálido y pedagógico (máx 3 párrafos)",
  "suggestedProducts": ["Producto 1 recomendado en farmacias de España", "Producto 2", "Producto 3"]
}`;

    const textOutput = await generateWithRetry({
      model: "gemini-3.7-flash",
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
      answer: parsed.answer,
      suggestedProducts: parsed.suggestedProducts || [],
    });
  } catch (error: any) {
    console.warn("Fallback expert response for /api/cosmetology/ask-expert:", error?.message || error);
    res.json({
      success: true,
      source: "expert-rules-resilient",
      answer: "¡Hola! Como norma general en cosmetología clínica para el mercado español: si tienes la piel reactiva o dudas sobre cómo mezclar productos, mantén la regla de 'menos es más'. Aplica siempre primero las fórmulas acuosas/ligeras, después las emulsiones o cremas relipidizantes (con ceramidas o centella asiática) y culmina cada mañana con protector solar FPS 50+ de amplio espectro (como ISDIN o Heliocare). Si estás embarazada, sustituye retinoides por ácido azelaico.",
      suggestedProducts: [
        "ISDIN Fusion Water MAGIC SPF 50+",
        "La Roche-Posay Cicaplast Baume B5+",
        "Sesderma Azelac RU Sérum Liposomado"
      ]
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
      model: "gemini-3.7-flash",
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
