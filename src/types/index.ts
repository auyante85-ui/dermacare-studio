export type SkinType = 'seca' | 'mixta' | 'grasa' | 'normal' | 'sensible';

export type SkinConcern = 
  | 'acne' 
  | 'manchas_hiperpigmentacion' 
  | 'lineas_envejecimiento' 
  | 'deshidratacion' 
  | 'rojeces_rosacea' 
  | 'poros_textura' 
  | 'falta_luminosidad' 
  | 'ojeras_bolsas';

export type FitzpatrickType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  category: 'tipo_piel' | 'sensibilidad' | 'habitos' | 'preocupaciones' | 'rutina_actual';
  title: string;
  subtitle: string;
  options: {
    id: string;
    label: string;
    description: string;
    iconName?: string;
    scoreWeight?: {
      skinType?: SkinType;
      sensitivityScore?: number;
      hydrationScore?: number;
      oilScore?: number;
    };
  }[];
}

export interface RoutineStep {
  id: string;
  stepNumber: number;
  category: 'Limpieza' | 'Tónico/Esencia' | 'Tratamiento Activo' | 'Hidratación' | 'Fotoprotección' | 'Doble Limpieza' | 'Nutrición';
  name: string;
  activeIngredient: string;
  frequency: string;
  applicationTime: 'AM' | 'PM' | 'AM_PM';
  tips: string;
  productType: string;
  contraindications?: string[];
}

export interface PersonalizedRoutine {
  id: string;
  clientName: string;
  skinType: SkinType;
  primaryConcerns: SkinConcern[];
  sensitivityLevel: 'baja' | 'moderada' | 'alta';
  morningSteps: RoutineStep[];
  nightSteps: RoutineStep[];
  weeklyTreatments: {
    name: string;
    frequency: string;
    description: string;
  }[];
  aiSummary?: {
    summary: string;
    barrierState: string;
    keyActives: string[];
    cautions: string[];
    professionalRecommendation: string;
  };
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: 'Diagnóstico Facial Completo' | 'Asesoría Rutina Online' | 'Seguimiento de Evolución' | 'Limpieza Profunda & Peeling';
  modality: 'Virtual (Videollamada)' | 'Presencial (Gabinete)';
  date: string;
  time: string;
  status: 'confirmada' | 'pendiente' | 'completada' | 'cancelada';
  notes?: string;
}

export interface ClinicalRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  fitzpatrick: FitzpatrickType;
  skinType: SkinType;
  concerns: SkinConcern[];
  allergies: string[];
  medicalConditions: string[]; // ej. Embarazo, Lactancia, Rosácea, Hipotiroidismo
  currentRoutineSummary: string;
  assignedRoutineId?: string;
  sessions: {
    id: string;
    date: string;
    treatmentDone: string;
    skinStateObserved: string;
    cabinProductsUsed: string[];
    homeCareAdjustments: string;
    nextReviewDate: string;
  }[];
  evolutionNotes: string;
  photos: {
    id: string;
    date: string;
    tag: 'Antes' | 'Sesión 2' | 'Sesión 4' | 'Actual';
    imageUrl: string;
    notes: string;
  }[];
  createdAt: string;
}

export interface ActiveIngredient {
  id: string;
  name: string;
  inci: string;
  category: 'Antioxidante' | 'Exfoliante Químico' | 'Retinoide' | 'Hidratante/Humectante' | 'Despigmentante' | 'Calmante/Barrera' | 'Seborregulador';
  bestFor: SkinConcern[];
  suitableForSkin: SkinType[];
  applicationTime: 'AM' | 'PM' | 'AM/PM';
  optimalPh?: string;
  concentrationRange: string;
  benefits: string[];
  incompatibleWith: string[];
  synergies: string[];
  pregnancySafe: boolean;
  sunSensitivityRisk: boolean;
  description: string;
}

export interface CosmeticProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Limpiador' | 'Sérum' | 'Crema Hidratante' | 'Protector Solar' | 'Exfoliante' | 'Aceite Facial' | 'Contorno de Ojos';
  mainActives: string[];
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  texture: 'Gel' | 'Crema' | 'Fluido Ligero' | 'Aceite' | 'Espuma';
  usageTime: 'AM' | 'PM' | 'AM/PM';
  priceEstimated: string;
  description: string;
}
