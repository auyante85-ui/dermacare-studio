import { 
  QuizQuestion, 
  ActiveIngredient, 
  CosmeticProduct, 
  ClinicalRecord, 
  Appointment,
  PersonalizedRoutine 
} from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'sensacion_manana',
    category: 'tipo_piel',
    title: '1. ¿Cómo sientes tu rostro 2 horas después de lavarte la cara (sin aplicar cremas)?',
    subtitle: 'Nos permite identificar la tasa de secreción sebácea basal y el nivel de pérdida transepidérmica de agua.',
    options: [
      {
        id: 'opt_grasa',
        label: 'Brillante y oleosa en todo el rostro',
        description: 'Sensación de pesadez o poros visibles en frente, nariz y mejillas.',
        scoreWeight: { skinType: 'grasa', oilScore: 3 }
      },
      {
        id: 'opt_mixta',
        label: 'Zona T brillante (frente, nariz, mentón) y mejillas normales o secas',
        description: 'La zona central produce sebo mientras los laterales se sienten cómodos o tirantes.',
        scoreWeight: { skinType: 'mixta', oilScore: 2 }
      },
      {
        id: 'opt_seca',
        label: 'Tirante, áspera o con sensación de falta de flexibilidad',
        description: 'La piel pide crema de inmediato y luce mate o desvitalizada.',
        scoreWeight: { skinType: 'seca', hydrationScore: -2 }
      },
      {
        id: 'opt_normal',
        label: 'Equilibrada, suave y confortable',
        description: 'Sin exceso de grasa ni sensación de sequedad.',
        scoreWeight: { skinType: 'normal', hydrationScore: 2 }
      }
    ]
  },
  {
    id: 'sensibilidad_reaccion',
    category: 'sensibilidad',
    title: '2. ¿Cómo reacciona tu piel ante cambios climáticos, fragancias o productos nuevos?',
    subtitle: 'Determinamos el umbral de reactividad y la integridad de la barrera cutánea.',
    options: [
      {
        id: 'sens_alta',
        label: 'Fácilmente se enrojece, arde, pica o reacciona con brotes',
        description: 'Piel reactiva que no tolera perfumes, alcohol o cambios bruscos de temperatura.',
        scoreWeight: { skinType: 'sensible', sensitivityScore: 3 }
      },
      {
        id: 'sens_media',
        label: 'A veces presenta rojez o ligera irritación con exfoliantes o sol',
        description: 'Sensibilidad reactiva ocasional.',
        scoreWeight: { sensitivityScore: 2 }
      },
      {
        id: 'sens_baja',
        label: 'Muy resistente, rara vez experimenta molestias o ardor',
        description: 'Tolera la mayoría de productos y principios activos sin problema.',
        scoreWeight: { sensitivityScore: 0 }
      }
    ]
  },
  {
    id: 'preocupaciones_principales',
    category: 'preocupaciones',
    title: '3. ¿Cuáles son tus 2 principales objetivos o preocupaciones cutáneas hoy?',
    subtitle: 'Enfocaremos los activos biológicos específicos para tus metas.',
    options: [
      {
        id: 'concern_acne',
        label: 'Acné, puntos negros, comedones o poros dilatados',
        description: 'Control de sebo, textura irregular y brotes inflamatorios.'
      },
      {
        id: 'concern_manchas',
        label: 'Manchas solares, melasma o marcas post-acné',
        description: 'Tono irregular e hiperpigmentación.'
      },
      {
        id: 'concern_edad',
        label: 'Líneas de expresión, arrugas o pérdida de firmeza',
        description: 'Estimulación de colágeno y renovación celular.'
      },
      {
        id: 'concern_deshidratacion',
        label: 'Deshidratación profunda, falta de brillo y aspecto opaco',
        description: 'Recuperar la jugosidad, agua cutánea y luminosidad natural.'
      },
      {
        id: 'concern_rojeces',
        label: 'Rojeces persistentes, cuperosis o tendencia a rosácea',
        description: 'Calmar la inflamación y fortalecer capilares.'
      }
    ]
  },
  {
    id: 'exposicion_solar_habitos',
    category: 'habitos',
    title: '4. ¿Cuál es tu nivel de exposición solar y uso de protector solar?',
    subtitle: 'La radiación UV es el factor #1 del fotoenvejecimiento y daño celular.',
    options: [
      {
        id: 'sol_diario_spf',
        label: 'Uso protector solar a diario y reaplico cada pocas horas',
        description: 'Excelente hábito de fotoprotección preventiva.'
      },
      {
        id: 'sol_ocasional',
        label: 'Solo uso protector solar cuando voy a la playa o hay mucho sol',
        description: 'Fotoprotección intermitente que requiere regularizarse.'
      },
      {
        id: 'sol_pantallas',
        label: 'Paso muchas horas frente a pantallas / interiores y no suelo usar SPF',
        description: 'Exposición a luz azul e interiores sin protección.'
      }
    ]
  },
  {
    id: 'rutina_actual_nivel',
    category: 'rutina_actual',
    title: '5. ¿Cómo describirías tu rutina actual de cuidado facial?',
    subtitle: 'Nos ayuda a dosificar la complejidad para que sea 100% sostenible para ti.',
    options: [
      {
        id: 'rutina_cero',
        label: 'Mínima o nula (solo agua o jabón de ducha)',
        description: 'Empezaremos con los pilares básicos fundamentales.'
      },
      {
        id: 'rutina_basica',
        label: 'Básica (limpiador + crema hidratante + a veces protector)',
        description: 'Lista para incorporar sérums de tratamiento focalizados.'
      },
      {
        id: 'rutina_avanzada',
        label: 'Avanzada (uso varios sérums, ácidos, tónicos o retinol)',
        description: 'Podemos optimizar compatibilidades, orden y concentraciones.'
      }
    ]
  }
];

export const INGREDIENTS_CATALOG: ActiveIngredient[] = [
  {
    id: 'niacinamida',
    name: 'Niacinamida (Vitamina B3)',
    inci: 'Niacinamide',
    category: 'Seborregulador',
    bestFor: ['acne', 'poros_textura', 'manchas_hiperpigmentacion', 'deshidratacion', 'rojeces_rosacea'],
    suitableForSkin: ['grasa', 'mixta', 'seca', 'normal', 'sensible'],
    applicationTime: 'AM/PM',
    optimalPh: '5.0 - 7.0',
    concentrationRange: '2% - 10% (5% ideal)',
    benefits: [
      'Regula la síntesis sebácea sin resecar',
      'Refuerza la síntesis de ceramidas y barrera lipídica',
      'Reduce la transferencia de melanosomas (despigmentante)',
      'Antiinflamatorio y calmante en rojeces'
    ],
    incompatibleWith: ['Ácido L-Ascórbico puro a pH muy ácido (si se mezclan en el mismo paso inmediato pueden causar flushing temporal)'],
    synergies: ['Ácido Hialurónico', 'Zinc PCA', 'Retinol', 'Ceramidas', 'Centella Asiática'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'El activo todoterreno de la cosmetología moderna. Mejora la función barrera, homogeniza el tono y balancea la producción sebácea con alta tolerancia.'
  },
  {
    id: 'vitamina_c',
    name: 'Vitamina C Pura (Ácido L-Ascórbico)',
    inci: 'Ascorbic Acid / Sodium Ascorbyl Phosphate',
    category: 'Antioxidante',
    bestFor: ['manchas_hiperpigmentacion', 'falta_luminosidad', 'lineas_envejecimiento'],
    suitableForSkin: ['normal', 'mixta', 'seca', 'grasa'],
    applicationTime: 'AM',
    optimalPh: '2.8 - 3.5 (Pura) o 6.0 (Derivados)',
    concentrationRange: '8% - 15%',
    benefits: [
      'Potente neutralizador de radicales libres inducidos por UV y polución',
      'Cofactor indispensable en la síntesis de colágeno',
      'Inhibe la tirosinasa disminuyendo manchas y aportando luminosidad'
    ],
    incompatibleWith: ['Retinol en el mismo momento (separar AM/PM)', 'Exfoliantes fuertes AHA/BHA simultáneos si la piel es reactiva'],
    synergies: ['Ácido Ferúlico', 'Vitamina E (Tocoferol)', 'Fotoprotector Solar FPS 50+ (potencia la defensa UV)'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'El estándar de oro en antioxidantes faciales. Aplicada por la mañana bajo el protector solar, multiplica la fotoprotección contra el daño celular.'
  },
  {
    id: 'retinol',
    name: 'Retinol / Retinaldehído',
    inci: 'Retinol / Retinal',
    category: 'Retinoide',
    bestFor: ['lineas_envejecimiento', 'acne', 'poros_textura', 'manchas_hiperpigmentacion'],
    suitableForSkin: ['grasa', 'mixta', 'normal', 'seca'],
    applicationTime: 'PM',
    optimalPh: '5.5 - 6.5',
    concentrationRange: '0.1% - 1% (Retinol) / 0.05% - 0.1% (Retinal)',
    benefits: [
      'Acelera el recambio celular del estrato córneo',
      'Estimula la síntesis dérmica de colágeno y elastina',
      'Desobstruye el folículo pilosebáceo y afina la textura cutánea'
    ],
    incompatibleWith: ['Ácidos AHA/BHA de alta potencia en la misma rutina nocturna', 'Peróxido de Benzoilo simultáneo', 'Vitamina C pura'],
    synergies: ['Ceramidas', 'Ácido Hialurónico', 'Niacinamida (prepara la piel para tolerar mejor el retinoide)', 'Pantenol'],
    pregnancySafe: false,
    sunSensitivityRisk: true,
    description: 'El activo antiedad y regenerador con mayor evidencia científica en cosmetología. Requiere pauta de retinización progresiva nocturna y SPF diario.'
  },
  {
    id: 'acido_salicilico',
    name: 'Ácido Salicílico (BHA)',
    inci: 'Salicylic Acid',
    category: 'Exfoliante Químico',
    bestFor: ['acne', 'poros_textura', 'manchas_hiperpigmentacion'],
    suitableForSkin: ['grasa', 'mixta'],
    applicationTime: 'PM',
    optimalPh: '3.0 - 4.0',
    concentrationRange: '0.5% - 2%',
    benefits: [
      'Lipófilo: penetra dentro del poro disolviendo el tapón de sebo y queratina',
      'Propiedades antibacterianas y antiinflamatorias directas',
      'Alisa la textura y previene la formación de nuevos comedones'
    ],
    incompatibleWith: ['Retinol en la misma sesión', 'Exfoliantes físicos agresivos'],
    synergies: ['Niacinamida', 'Ácido Hialurónico', 'Centella Asiática'],
    pregnancySafe: false, // en altas concentraciones evitar
    sunSensitivityRisk: true,
    description: 'Beta-hidroxiácido soluble en grasa por excelencia. Penetra los poros taponados para limpiar en profundidad y erradicar puntos negros y filamentos sebáceos.'
  },
  {
    id: 'acido_hialuronico',
    name: 'Ácido Hialurónico Multimolecular',
    inci: 'Sodium Hyaluronate / Hydrolyzed Hyaluronic Acid',
    category: 'Hidratante/Humectante',
    bestFor: ['deshidratacion', 'lineas_envejecimiento', 'rojeces_rosacea'],
    suitableForSkin: ['seca', 'sensible', 'mixta', 'grasa', 'normal'],
    applicationTime: 'AM/PM',
    optimalPh: '5.0 - 7.0',
    concentrationRange: '1% - 2%',
    benefits: [
      'Retiene hasta 1000 veces su peso molecular en agua',
      'El alto peso hidrata y protege la superficie; el bajo peso molecular penetra a capas más profundas',
      'Efecto turgencia y relleno temporal de microarrugas de deshidratación'
    ],
    incompatibleWith: [],
    synergies: ['Todos los principios activos (Gliserina, Ceramidas, Vitamina C, Retinol)'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'Molécula humectante estrella. Debe aplicarse sobre la piel ligeramente húmeda y sellarse con crema para evitar la evaporación transepidérmica.'
  },
  {
    id: 'ceramidas',
    name: 'Complejo de Ceramidas (NP, AP, EOP) + Colesterol',
    inci: 'Ceramide NP, Ceramide AP, Phytosphingosine',
    category: 'Calmante/Barrera',
    bestFor: ['deshidratacion', 'rojeces_rosacea', 'lineas_envejecimiento'],
    suitableForSkin: ['seca', 'sensible', 'normal', 'mixta', 'grasa'],
    applicationTime: 'AM/PM',
    optimalPh: '5.5',
    concentrationRange: '1% - 5%',
    benefits: [
      'Restaura el cemento intercelular del estrato córneo',
      'Previene la pérdida transepidérmica de agua (TEWL)',
      'Protege contra agresiones externas, contaminantes y alérgenos'
    ],
    incompatibleWith: [],
    synergies: ['Ácido Hialurónico', 'Pantenol', 'Retinol (mitiga irritación)', 'Ácidos exfoliantes'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'Lípidos bio-idénticos que componen el 50% de la barrera cutánea. Esenciales para reparar pieles irritadas o dañadas por sobreexfoliación.'
  },
  {
    id: 'acido_azelaico',
    name: 'Ácido Azelaico',
    inci: 'Azelaic Acid',
    category: 'Despigmentante',
    bestFor: ['rojeces_rosacea', 'acne', 'manchas_hiperpigmentacion'],
    suitableForSkin: ['sensible', 'mixta', 'grasa', 'normal'],
    applicationTime: 'AM/PM',
    optimalPh: '4.0 - 5.5',
    concentrationRange: '10% - 15% (Cosmético) / 20% (Farmacéutico)',
    benefits: [
      'Inhibe selectivamente los melanocitos hiperactivos',
      'Acción antiinflamatoria superior en rosácea y eritema',
      'Comedolítico y antimicrobiano frente a Cutibacterium acnes'
    ],
    incompatibleWith: [],
    synergies: ['Niacinamida', 'Ácido Hialurónico', 'Protector Solar FPS 50+'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'Uno de los activos más seguros y versátiles. Trata rojeces, marcas oscuras y acné simultáneamente, siendo seguro incluso durante el embarazo.'
  }
];

export const COSMETIC_PRODUCTS: CosmeticProduct[] = [
  {
    id: 'prod_1',
    name: 'Fotoprotector Fusion Water MAGIC SPF 50',
    brand: 'ISDIN (España)',
    category: 'Protector Solar',
    mainActives: ['Filtros Solares UVA/UVB de Amplio Espectro', 'Ácido Hialurónico', 'Extracto de Alga Mediterránea'],
    skinTypes: ['grasa', 'mixta', 'normal', 'sensible'],
    concerns: ['manchas_hiperpigmentacion', 'lineas_envejecimiento', 'deshidratacion'],
    texture: 'Fluido Ligero',
    usageTime: 'AM',
    priceEstimated: '22,95 €',
    description: 'El protector solar líder de farmacia en España. Absorción ultrarrápida, acabado sedoso no graso y no pica en los ojos. Apto para uso diario urbano.'
  },
  {
    id: 'prod_2',
    name: 'Hyalu B5 Sérum Anti-Arrugas Reparador',
    brand: 'La Roche-Posay (Dermofarmacia)',
    category: 'Sérum',
    mainActives: ['Ácido Hialurónico Puro Doble Peso', 'Vitamina B5 (Pantenol 5%)', 'Madecassoside'],
    skinTypes: ['seca', 'sensible', 'normal', 'mixta'],
    concerns: ['deshidratacion', 'lineas_envejecimiento', 'rojeces_rosacea'],
    texture: 'Gel',
    usageTime: 'AM/PM',
    priceEstimated: '38,50 €',
    description: 'Sérum de referencia dermatológica que rellena arrugas por deshidratación y repara la barrera cutánea desde la primera hora.'
  },
  {
    id: 'prod_3',
    name: 'Endocare Renewal Retinol Intensive Serum (0.5% o 0.2%)',
    brand: 'Cantabria Labs (España)',
    category: 'Sérum',
    mainActives: ['Retinol Puro Microencapsulado', 'Ácido Hialurónico', 'Niacinamida'],
    skinTypes: ['mixta', 'grasa', 'normal'],
    concerns: ['lineas_envejecimiento', 'manchas_hiperpigmentacion', 'poros_textura', 'acne'],
    texture: 'Fluido Ligero',
    usageTime: 'PM',
    priceEstimated: '44,90 €',
    description: 'Fórmula de alta tolerancia fabricada en España con sistema RetinSphere Technology para retexturizar y rejuvenecer intensamente.'
  },
  {
    id: 'prod_4',
    name: 'Azelac RU Sérum Liposomado Despigmentante',
    brand: 'Sesderma (Valencia, España)',
    category: 'Sérum',
    mainActives: ['Ácido Azelaico Liposomado', '4-Butilresorcinol', 'Ácido Tranexámico'],
    skinTypes: ['sensible', 'mixta', 'grasa', 'normal', 'seca'],
    concerns: ['manchas_hiperpigmentacion', 'rojeces_rosacea', 'falta_luminosidad'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '34,95 €',
    description: 'Tratamiento despigmentante universal seguro durante todo el año, apto para embarazadas y pieles con manchas solares o melasma.'
  },
  {
    id: 'prod_5',
    name: 'Crema Hidratante con 3 Ceramidas Esenciales',
    brand: 'CeraVe (Parafarmacia)',
    category: 'Crema Hidratante',
    mainActives: ['Ceramidas 1, 3, 6-II', 'Ácido Hialurónico', 'Tecnología MVE de liberación continua'],
    skinTypes: ['seca', 'sensible', 'normal', 'mixta'],
    concerns: ['deshidratacion', 'rojeces_rosacea'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '13,50 €',
    description: 'Básico indispensable de farmacia para restaurar la barrera protectora de la piel durante 24 horas sin obstruir los poros.'
  },
  {
    id: 'prod_6',
    name: 'Cicaplast Baume B5+ Bálsamo Ultra-Reparador',
    brand: 'La Roche-Posay',
    category: 'Crema Hidratante',
    mainActives: ['Tribioma (Prebiótico)', 'Pantenol 5%', 'Madecassoside', 'Zinc + Manganeso'],
    skinTypes: ['sensible', 'seca', 'mixta', 'normal', 'grasa'],
    concerns: ['rojeces_rosacea', 'deshidratacion'],
    texture: 'Bálsamo',
    usageTime: 'AM/PM',
    priceEstimated: '11,20 €',
    description: 'El comodín de rescate imprescindible para calmar rojeces, irritaciones tras peelings o rozaduras y fortalecer la microbiota cutánea.'
  },
  {
    id: 'prod_7',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary (Primor / Druni / Sephora España)',
    category: 'Sérum',
    mainActives: ['Niacinamida 10%', 'Zinc PCA 1%'],
    skinTypes: ['grasa', 'mixta'],
    concerns: ['acne', 'poros_textura', 'manchas_hiperpigmentacion'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '6,60 €',
    description: 'Fórmula de alta concentración para regular la producción de grasa, reducir rojeces post-acné y minimizar la apariencia de poros.'
  },
  {
    id: 'prod_8',
    name: 'Splendor 10 Tratamiento Total Antiedad SPF 20',
    brand: 'Bella Aurora (Especialistas en Manchas, España)',
    category: 'Crema Hidratante',
    mainActives: ['Péptidos Anti-Manchas', 'Ácido Hialurónico', 'Extracto de Flor de Loto'],
    skinTypes: ['normal', 'seca', 'mixta'],
    concerns: ['manchas_hiperpigmentacion', 'lineas_envejecimiento', 'falta_luminosidad'],
    texture: 'Crema',
    usageTime: 'AM',
    priceEstimated: '24,90 €',
    description: 'Marca histórica española con más de 130 años de experiencia despigmentante. Aporta luminosidad, redensifica y unifica el tono.'
  },
  {
    id: 'prod_9',
    name: 'Regenerist Sérum Noche Retinol 24',
    brand: 'Olay (Disponible en Supermercados & Perfumerías)',
    category: 'Sérum',
    mainActives: ['Complejo Retinoide', 'Vitamina B3 (Niacinamida)'],
    skinTypes: ['mixta', 'normal', 'seca'],
    concerns: ['lineas_envejecimiento', 'poros_textura', 'falta_luminosidad'],
    texture: 'Fluido Ligero',
    usageTime: 'PM',
    priceEstimated: '26,50 €',
    description: 'Fórmula accesible de perfumería sin perfume para iniciarse en el mundo de los retinoides de forma suave y sin descamaciones.'
  }
];

export const INITIAL_CLIENTS: ClinicalRecord[] = [
  {
    id: 'cli_1',
    fullName: 'Valentina Restrepo',
    email: 'valentina.r@gmail.com',
    phone: '+34 612 345 678',
    age: 29,
    gender: 'Femenino',
    fitzpatrick: 'III',
    skinType: 'mixta',
    concerns: ['acne', 'manchas_hiperpigmentacion', 'poros_textura'],
    allergies: ['Sin alergias cosméticas conocidas'],
    medicalConditions: ['Uso de anticonceptivos orales'],
    currentRoutineSummary: 'Limpiador con ácido salicílico diario + protector solar esporádico. Refiere brotes en mandíbula y marcas postinflamatorias.',
    assignedRoutineId: 'rout_1',
    sessions: [
      {
        id: 'sess_1',
        date: '2026-07-10',
        treatmentDone: 'Higiene facial profunda con espátula ultrasónica y peeling enzimático de papaya.',
        skinStateObserved: 'Manto hidrolipídico descompensado, comedones cerrados en zona malar y mentón. pH cutáneo 6.2.',
        cabinProductsUsed: ['Tónico descongestivo', 'Mascarilla purificante de caolín y zinc', 'Sérum Niacinamida 5%'],
        homeCareAdjustments: 'Suspender jabón alcalino. Introducir Syndet suave mañana y noche + FPS 50 diario.',
        nextReviewDate: '2026-08-12'
      },
      {
        id: 'sess_2',
        date: '2026-08-12',
        treatmentDone: 'Peeling químico suave con Ácido Azelaico 15% + Mascarilla calmante con Madecassoside.',
        skinStateObserved: 'Gran mejoría en textura cutánea (-40% comedones). Manchas post-acné más claras. Buena tolerancia.',
        cabinProductsUsed: ['Peeling Azelaico gel', 'Neutralizante', 'Sérum Ácido Hialurónico + Ceramidas'],
        homeCareAdjustments: 'Iniciar Retinal 0.05% 2 noches por semana con método sándwich.',
        nextReviewDate: '2026-09-15'
      }
    ],
    evolutionNotes: 'Evolución muy positiva. La adherencia al protector solar ha impedido la pigmentación de nuevas lesiones. La barrera cutánea se encuentra estable.',
    photos: [
      {
        id: 'ph_1',
        date: '2026-07-10',
        tag: 'Antes',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        notes: 'Presencia de comedones inflamatorios en barbilla y pómulos con rojez periférica.'
      },
      {
        id: 'ph_2',
        date: '2026-08-12',
        tag: 'Sesión 2',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        notes: 'Disminución notable de lesiones activas y mejoría general en el tono.'
      }
    ],
    createdAt: '2026-07-10'
  },
  {
    id: 'cli_2',
    fullName: 'Camila Morales',
    email: 'camila.m@outlook.com',
    phone: '+34 689 987 654',
    age: 38,
    gender: 'Femenino',
    fitzpatrick: 'II',
    skinType: 'seca',
    concerns: ['lineas_envejecimiento', 'deshidratacion', 'falta_luminosidad'],
    allergies: ['Fragancias artificiales / Linalool'],
    medicalConditions: ['Tendencia a dermatitis por contacto con frío'],
    currentRoutineSummary: 'Aplica cremas nutritivas pesadas pero siente la piel tirante al cabo de 2 horas. No utiliza sérums ni antioxidantes.',
    assignedRoutineId: 'rout_2',
    sessions: [
      {
        id: 'sess_1b',
        date: '2026-08-01',
        treatmentDone: 'Tratamiento de hidro-nutrición intensiva con electroporación transdérmica de ácido hialurónico multimolecular.',
        skinStateObserved: 'Estrato córneo deshidratado con microdescamación en entrecejo. Pérdida de turgencia.',
        cabinProductsUsed: ['Ampolla de Ácido Hialurónico 2%', 'Velo de colágeno marino', 'Crema de ceramidas'],
        homeCareAdjustments: 'Añadir sérum de Vitamina C estabilizada en AM y crema relipidizante con ceramidas NP.',
        nextReviewDate: '2026-09-05'
      }
    ],
    evolutionNotes: 'Cliente reporta sensación de frescura inmediata. El test de pliegue cutáneo muestra recuperación de elasticidad.',
    photos: [
      {
        id: 'ph_3',
        date: '2026-08-01',
        tag: 'Antes',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        notes: 'Piel mate, opaca y líneas finas acentuadas por deshidratación en contorno periorbital.'
      }
    ],
    createdAt: '2026-08-01'
  },
  {
    id: 'cli_3',
    fullName: 'Javier Domínguez',
    email: 'javier.d@gmail.com',
    phone: '+34 633 112 233',
    age: 34,
    gender: 'Masculino',
    fitzpatrick: 'III',
    skinType: 'sensible',
    concerns: ['rojeces_rosacea', 'deshidratacion', 'poros_textura'],
    allergies: ['Aceites esenciales puros'],
    medicalConditions: ['Rosácea eritematotelangiectásica diagnosticada'],
    currentRoutineSummary: 'Usa agua micelar sin enjuague y gel after-shave con alcohol que le causa ardor.',
    sessions: [
      {
        id: 'sess_1c',
        date: '2026-08-20',
        treatmentDone: 'Protocolo calmante vascular con terapia LED roja/azul y activos botánicos de Centella Asiática.',
        skinStateObserved: 'Eritema malar difuso y telangiectasias en aletas nasales. Sensación de calor facial.',
        cabinProductsUsed: ['Bruma termal de avena', 'Sérum Azeloglicina 10%', 'Crema barrera reparadora'],
        homeCareAdjustments: 'Eliminar after-shave con alcohol. Reemplazar por emulsión calmante y limpiador Syndet.',
        nextReviewDate: '2026-09-20'
      }
    ],
    evolutionNotes: 'Mejoría rápida del eritema tras 10 días de rutina calmante. Cero episodios de flushing intenso.',
    photos: [
      {
        id: 'ph_4',
        date: '2026-08-20',
        tag: 'Antes',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        notes: 'Rubor persistente en mejillas y nariz.'
      }
    ],
    createdAt: '2026-08-20'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app_1',
    clientName: 'Valentina Restrepo',
    clientEmail: 'valentina.r@gmail.com',
    clientPhone: '+34 612 345 678',
    serviceType: 'Seguimiento de Evolución',
    modality: 'Presencial (Gabinete)',
    date: '2026-09-15',
    time: '11:00',
    status: 'confirmada',
    notes: 'Revisión de tolerancia al Retinal 0.05% y evaluación de manchas.'
  },
  {
    id: 'app_2',
    clientName: 'Lucía Benítez',
    clientEmail: 'lucia.b@gmail.com',
    clientPhone: '+34 654 321 098',
    serviceType: 'Diagnóstico Facial Completo',
    modality: 'Virtual (Videollamada)',
    date: '2026-09-16',
    time: '16:30',
    status: 'confirmada',
    notes: 'Primera consulta para diseño de rutina anti-acné hormonal.'
  },
  {
    id: 'app_3',
    clientName: 'Camila Morales',
    clientEmail: 'camila.m@outlook.com',
    clientPhone: '+34 689 987 654',
    serviceType: 'Limpieza Profunda & Peeling',
    modality: 'Presencial (Gabinete)',
    date: '2026-09-18',
    time: '10:00',
    status: 'pendiente',
    notes: 'Sesión de mantenimiento hidronutritivo de temporada.'
  }
];
