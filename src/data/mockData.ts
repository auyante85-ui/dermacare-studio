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
    subtitle: 'Nos permite identificar la tasa de secreción sebácea basal, el grosor epidérmico y la pérdida de agua.',
    options: [
      {
        id: 'opt_madura',
        label: 'Piel Madura / Pérdida de Densidad',
        description: 'Sequedad marcada, adelgazamiento de la piel, pérdida de turgencia y arrugas o flacidez evidentes.',
        scoreWeight: { skinType: 'madura', hydrationScore: -3 }
      },
      {
        id: 'opt_menopausica',
        label: 'Piel en Menopausia / Cambios Hormonales',
        description: 'Sequedad repentina, afinamiento epidérmico, mayor sensibilidad, sofocos ocasionales y descolgamiento.',
        scoreWeight: { skinType: 'menopausica', hydrationScore: -4 }
      },
      {
        id: 'opt_grasa',
        label: 'Brillante y oleosa en todo el rostro',
        description: 'Sensación de pesadez o poros visibles en frente, nariz y mejillas.',
        scoreWeight: { skinType: 'grasa', oilScore: 3 }
      },
      {
        id: 'opt_mixta',
        label: 'Zona T brillante y mejillas normales o secas',
        description: 'La zona central produce sebo mientras los laterales se sienten cómodos o tirantes.',
        scoreWeight: { skinType: 'mixta', oilScore: 2 }
      },
      {
        id: 'opt_seca',
        label: 'Tirante, áspera o con falta de flexibilidad',
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
        description: 'Sensibilidad reactiva ocasional o tras exposición.',
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
    title: '3. ¿Cuáles son tus principales objetivos o preocupaciones cutáneas hoy?',
    subtitle: 'Enfocaremos los activos biológicos específicos para tus metas.',
    options: [
      {
        id: 'concern_menopausia',
        label: 'Menopausia / Climaterio: Sequedad extrema, sofocos y flacidez',
        description: 'Pérdida estrogénica, atrofia dérmica, fragilidad capilar y necesidad de redensificación.'
      },
      {
        id: 'concern_madura',
        label: 'Piel Madura: Arrugas profundas, descolgamiento y falta de firmeza',
        description: 'Estimulación avanzada de colágeno, elastina, redensificación y nutrición profunda.'
      },
      {
        id: 'concern_manchas',
        label: 'Manchas solares, melasma o marcas post-inflamatorias',
        description: 'Tono irregular, léntigos y desequilibrio en la melanogénesis.'
      },
      {
        id: 'concern_deshidratacion',
        label: 'Deshidratación profunda, falta de brillo y aspecto opaco',
        description: 'Recuperar la jugosidad, agua dérmica y luminosidad natural.'
      },
      {
        id: 'concern_acne',
        label: 'Acné, puntos negros, comedones o poros dilatados',
        description: 'Control de sebo, textura irregular y brotes bacterianos.'
      },
      {
        id: 'concern_rojeces',
        label: 'Rojeces persistentes, cuperosis o tendencia a rosácea',
        description: 'Calmar la inflamación endotelial y fortalecer capilares.'
      }
    ]
  },
  {
    id: 'exposicion_solar_habitos',
    category: 'habitos',
    title: '4. ¿Cuál es tu nivel de exposición solar y uso de protector solar?',
    subtitle: 'La radiación UV es el factor #1 del fotoenvejecimiento y daño oxidativo.',
    options: [
      {
        id: 'sol_diario_spf',
        label: 'Uso protector solar a diario y reaplico si hay sol directo',
        description: 'Excelente hábito de fotoprotección preventiva.'
      },
      {
        id: 'sol_ocasional',
        label: 'Solo uso protector solar cuando voy a la playa o hace sol intenso',
        description: 'Fotoprotección intermitente que requiere regularizarse.'
      },
      {
        id: 'sol_pantallas',
        label: 'Paso muchas horas en interiores frente a pantallas y casi no uso SPF',
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
    id: 'fitoestrogenos',
    name: 'Fitoestrógenos & Isoflavonas de Soja / Trébol Rojo',
    inci: 'Glycine Soja (Soybean) Isoflavones / Trifolium Pratense Extract',
    category: 'Calmante/Barrera',
    bestFor: ['menopausia_climaterio', 'piel_madura', 'deshidratacion', 'flacidez_densidad'],
    suitableForSkin: ['madura', 'menopausica', 'seca', 'sensible', 'normal'],
    applicationTime: 'AM/PM',
    optimalPh: '5.0 - 6.5',
    concentrationRange: '1% - 5%',
    benefits: [
      'Compensan la pérdida de estrógenos en la piel durante la perimenopausia y menopausia',
      'Aumentan el grosor dérmico y estimulan la producción natural de colágeno y elastina',
      'Calman la tirantez, mejoran la densidad cutánea y atenúan sofocos/flushing facial'
    ],
    incompatibleWith: [],
    synergies: ['Ácido Hialurónico', 'Ceramidas', 'Péptidos Tensores', 'Niacinamida'],
    pregnancySafe: false,
    sunSensitivityRisk: false,
    description: 'Moléculas vegetales bio-idénticas fundamentales para pieles maduras y climatéricas que sufren afinamiento epidérmico y sequedad hormonal.'
  },
  {
    id: 'peptidos_cobre',
    name: 'Péptidos de Cobre (GHK-Cu) & Complejos Tensores',
    inci: 'Copper Tripeptide-1 / Palmitoyl Tripeptide-38 (Matrixyl)',
    category: 'Antioxidante',
    bestFor: ['piel_madura', 'menopausia_climaterio', 'lineas_envejecimiento', 'flacidez_densidad'],
    suitableForSkin: ['madura', 'menopausica', 'seca', 'normal', 'mixta', 'sensible'],
    applicationTime: 'AM/PM',
    optimalPh: '5.5 - 7.0',
    concentrationRange: '0.5% - 2%',
    benefits: [
      'Potente señalizador para regeneración celular dérmica profunda y cicatrización',
      'Aumenta la síntesis de colágeno tipos I, III y IV hasta un 70%',
      'Mejora notablemente la firmeza del óvalo facial y atenúa arrugas estáticas'
    ],
    incompatibleWith: ['Ácido L-Ascórbico puro a pH ácido simultáneo', 'Ácidos exfoliantes fuertes directos en el mismo paso'],
    synergies: ['Ácido Hialurónico', 'Niacinamida', 'Ceramidas', 'Escualano'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'Péptidos de alta tecnología biológica para remodelación dérmica y reafirmación sin irritar ni descamar la piel.'
  },
  {
    id: 'proxylane',
    name: 'Pro-Xylane (C-Glicósido Bioactivo)',
    inci: 'Hydroxypropyl Tetrahydropyrantriol',
    category: 'Calmante/Barrera',
    bestFor: ['menopausia_climaterio', 'piel_madura', 'flacidez_densidad', 'lineas_envejecimiento'],
    suitableForSkin: ['madura', 'menopausica', 'seca', 'sensible', 'normal'],
    applicationTime: 'AM/PM',
    optimalPh: '5.5 - 6.5',
    concentrationRange: '3% - 30%',
    benefits: [
      'Estimula la síntesis de glucosaminoglicanos (GAGs) redensificando la matriz extracelular',
      'Refuerza la unión dermo-epidérmica (UDE) devolviendo volumen al rostro',
      'Aporta soporte mecánico frente al descolgamiento del óvalo facial'
    ],
    incompatibleWith: [],
    synergies: ['Ácido Hialurónico', 'Extracto de Cassia', 'Ceramidas', 'Retinoides'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'Activo patentado pionero en dermatología clínica para revertir los efectos de la caída hormonal y el envejecimiento intrínseco.'
  },
  {
    id: 'aceite_onagra',
    name: 'Aceite de Onagra Bio & Ácido Gamma-Linolénico (GLA)',
    inci: 'Oenothera Biennis (Evening Primrose) Oil',
    category: 'Calmante/Barrera',
    bestFor: ['menopausia_climaterio', 'piel_madura', 'deshidratacion', 'rojeces_rosacea'],
    suitableForSkin: ['madura', 'menopausica', 'seca', 'sensible'],
    applicationTime: 'PM',
    optimalPh: 'N/A (Fase oleosa)',
    concentrationRange: '2% - 100% puro',
    benefits: [
      'Aporte intensivo de ácidos grasos esenciales Omega-6 para sellar la barrera',
      'Reduce la deshidratación transepidérmica severa típica de la menopausia',
      'Efecto emoliente, suavizante y antiinflamatorio duradero'
    ],
    incompatibleWith: [],
    synergies: ['Ceramidas', 'Vitamina E', 'Manteca de Karité', 'Centella Asiática'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'El aceite vegetal de oro para la mujer en transición hormonal. Nutre en profundidad, flexibiliza la piel rígida y devuelve el confort inmediato.'
  },
  {
    id: 'niacinamida',
    name: 'Niacinamida (Vitamina B3)',
    inci: 'Niacinamide',
    category: 'Seborregulador',
    bestFor: ['acne', 'poros_textura', 'manchas_hiperpigmentacion', 'deshidratacion', 'rojeces_rosacea', 'piel_madura'],
    suitableForSkin: ['grasa', 'mixta', 'seca', 'normal', 'sensible', 'madura', 'menopausica'],
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
    bestFor: ['manchas_hiperpigmentacion', 'falta_luminosidad', 'lineas_envejecimiento', 'piel_madura'],
    suitableForSkin: ['normal', 'mixta', 'seca', 'grasa', 'madura'],
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
    bestFor: ['lineas_envejecimiento', 'acne', 'poros_textura', 'manchas_hiperpigmentacion', 'piel_madura', 'flacidez_densidad'],
    suitableForSkin: ['grasa', 'mixta', 'normal', 'seca', 'madura'],
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
    pregnancySafe: false,
    sunSensitivityRisk: true,
    description: 'Beta-hidroxiácido soluble en grasa por excelencia. Penetra los poros taponados para limpiar en profundidad y erradicar puntos negros y filamentos sebáceos.'
  },
  {
    id: 'acido_hialuronico',
    name: 'Ácido Hialurónico Multimolecular',
    inci: 'Sodium Hyaluronate / Hydrolyzed Hyaluronic Acid',
    category: 'Hidratante/Humectante',
    bestFor: ['deshidratacion', 'lineas_envejecimiento', 'rojeces_rosacea', 'piel_madura', 'menopausia_climaterio'],
    suitableForSkin: ['seca', 'sensible', 'mixta', 'grasa', 'normal', 'madura', 'menopausica'],
    applicationTime: 'AM/PM',
    optimalPh: '5.0 - 7.0',
    concentrationRange: '1% - 2%',
    benefits: [
      'Retiene hasta 1000 veces su peso molecular en agua',
      'El alto peso hidrata y protege la superficie; el bajo peso molecular penetra a capas más profundas',
      'Efecto turgencia y relleno temporal de microarrugas de deshidratación'
    ],
    incompatibleWith: [],
    synergies: ['Todos los principios activos (Glicerina, Ceramidas, Vitamina C, Retinol)'],
    pregnancySafe: true,
    sunSensitivityRisk: false,
    description: 'Molécula humectante estrella. Debe aplicarse sobre la piel ligeramente húmeda y sellarse con crema para evitar la evaporación transepidérmica.'
  },
  {
    id: 'ceramidas',
    name: 'Complejo de Ceramidas (NP, AP, EOP) + Colesterol',
    inci: 'Ceramide NP, Ceramide AP, Phytosphingosine',
    category: 'Calmante/Barrera',
    bestFor: ['deshidratacion', 'rojeces_rosacea', 'lineas_envejecimiento', 'piel_madura', 'menopausia_climaterio'],
    suitableForSkin: ['seca', 'sensible', 'normal', 'mixta', 'grasa', 'madura', 'menopausica'],
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
    bestFor: ['rojeces_rosacea', 'acne', 'manchas_hiperpigmentacion', 'menopausia_climaterio'],
    suitableForSkin: ['sensible', 'mixta', 'grasa', 'normal', 'menopausica'],
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

// Comprehensive cosmetic products catalog representing Spain & European market with direct official purchase links
export const COSMETIC_PRODUCTS: CosmeticProduct[] = [
  // ==========================================
  // 1. TRATAMIENTOS PARA PIEL MADURA & MENOPAUSIA
  // ==========================================
  {
    id: 'prod_meno_1',
    name: 'Neovadiol Redensificante Crema de Día / Noche Peri & Post Menopausia',
    brand: 'Vichy',
    category: 'Crema Hidratante',
    mainActives: ['Proxylane concentrado', 'Extracto de Cassia', 'Ácido Hialurónico Puro', 'Niacinamida'],
    skinTypes: ['madura', 'menopausica', 'seca', 'normal'],
    concerns: ['menopausia_climaterio', 'piel_madura', 'flacidez_densidad', 'deshidratacion'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '36,90 €',
    priceRange: 'farmacia',
    certification: 'Dermofarmacia Francesa Especializada en Menopausia',
    description: 'Tratamiento formulado específicamente para compensar los impactos visibles de las variaciones hormonales en la piel: sequedad, pérdida de densidad y descolgamiento.',
    purchaseUrl: 'https://www.vichy.es/buscar?q=neovadiol+menopausia',
    storeName: 'Web Oficial Vichy Laboratoires',
    brandWebsite: 'https://www.vichy.es/'
  },
  {
    id: 'prod_meno_2',
    name: 'Substiane [+] Tratamiento Reconstituyente Antiedad Fundamental',
    brand: 'La Roche-Posay',
    category: 'Crema Hidratante',
    mainActives: ['Linactyl + Pro-Xylane (complejo regenerador dérmico)', 'Agua Termal', 'Neurosensina'],
    skinTypes: ['madura', 'menopausica', 'seca', 'sensible'],
    concerns: ['piel_madura', 'menopausia_climaterio', 'flacidez_densidad', 'deshidratacion'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '39,50 €',
    priceRange: 'farmacia',
    certification: 'Dermofarmacia Alta Tolerancia',
    description: 'Restaura la sustancia fundamental de la piel madura y frena el descolgamiento de las facciones cutáneas en rostro y cuello.',
    purchaseUrl: 'https://www.laroche-posay.es/buscar?q=substiane',
    storeName: 'Web Oficial La Roche-Posay',
    brandWebsite: 'https://www.laroche-posay.es/'
  },
  {
    id: 'prod_meno_3',
    name: 'Isdinceutics Age Contour Crema Reafirmante Facial & Cuello',
    brand: 'ISDIN',
    category: 'Crema Hidratante',
    mainActives: ['Syn-Hycan (tripéptido remodelador)', 'Carnosina (antiglicación)', 'Alteromonas Ferment'],
    skinTypes: ['madura', 'menopausica', 'normal', 'seca', 'mixta'],
    concerns: ['piel_madura', 'flacidez_densidad', 'lineas_envejecimiento'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '52,95 €',
    priceRange: 'farmacia',
    certification: 'Dermofarmacia Española Premium',
    description: 'Triple acción anti-edad: antipolución, remodelante del óvalo facial y antiglicación para mantener la elasticidad de las fibras dérmicas.',
    purchaseUrl: 'https://www.isdin.com/es-ES/buscar?q=isdinceutics+age+contour',
    storeName: 'Web Oficial ISDIN',
    brandWebsite: 'https://www.isdin.com/es-ES/'
  },
  {
    id: 'prod_meno_4',
    name: 'Crema de Noche Redensificante de Onagra & Centella Bio',
    brand: 'Weleda',
    category: 'Limpieza e Hidratación Facial Natural',
    mainActives: ['Aceite de Onagra Bio', 'Extracto de Centella Asiática', 'Manteca de Karité Bio', 'Aceite de Germen de Trigo'],
    skinTypes: ['madura', 'menopausica', 'seca', 'sensible'],
    concerns: ['menopausia_climaterio', 'piel_madura', 'deshidratacion', 'flacidez_densidad'],
    texture: 'Crema',
    usageTime: 'PM',
    priceEstimated: '26,50 €',
    priceRange: 'natural_eco',
    certification: 'Certificado NATRUE / 100% Cosmética Natural Bio',
    description: 'Nutrición botánica profunda con alto contenido en ácidos grasos poliinsaturados Omega-6 que reactiva la renovación celular nocturna en pieles maduras.',
    purchaseUrl: 'https://www.weleda.es/buscar?q=onagra',
    storeName: 'Tienda Oficial Weleda',
    brandWebsite: 'https://www.weleda.es/'
  },
  {
    id: 'prod_meno_5',
    name: 'Resveratrol-Lift Crema Cachemir Redensificante',
    brand: 'Caudalie',
    category: 'Limpieza e Hidratación Facial Natural',
    mainActives: ['Resveratrol de Vid de Burdeos', 'Colágeno Vegano Tipo 1 Patentado', 'Ácido Hialurónico Multimolecular'],
    skinTypes: ['madura', 'menopausica', 'normal', 'seca', 'mixta'],
    concerns: ['piel_madura', 'flacidez_densidad', 'lineas_envejecimiento'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '48,90 €',
    priceRange: 'natural_eco',
    certification: 'Clean Skincare / 98% Origen Natural',
    description: 'Fórmula que reafirma y tensa la piel multiplicando por 5 la producción natural de colágeno propio según estudios in vitro.',
    purchaseUrl: 'https://es.caudalie.com/search?q=resveratrol+lift+cachemir',
    storeName: 'Boutique Oficial Caudalie',
    brandWebsite: 'https://es.caudalie.com/'
  },
  {
    id: 'prod_meno_6',
    name: 'Jazmín Crema Facial Antiarrugas 50+ con Isoflavonas y Calcio',
    brand: 'Ziaja',
    category: 'Crema Hidratante',
    mainActives: ['Manteca de Jazmín', 'Fitoestrógenos de Soja', 'Complejo de Calcio', 'Ácido Hialurónico'],
    skinTypes: ['madura', 'menopausica', 'seca'],
    concerns: ['menopausia_climaterio', 'piel_madura', 'deshidratacion', 'flacidez_densidad'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '6,90 €',
    priceRange: 'economico',
    description: 'Solución accesible diseñada para pieles a partir de 50 años que aporta densidad, compensa el déficit de lípidos y calma la sequedad persistente.',
    purchaseUrl: 'https://onlineziaja.com/buscar?controller=search&s=jazmin+50',
    storeName: 'Tienda Oficial Ziaja',
    brandWebsite: 'https://onlineziaja.com/'
  },
  {
    id: 'prod_meno_7',
    name: 'Multi-Peptide + Copper Peptides 1% Serum',
    brand: 'The Ordinary',
    category: 'Sérum',
    mainActives: ['Péptidos de Cobre GHK-Cu 1%', 'Matrixyl 3000', 'Syn-Ake', 'Ácido Hialurónico'],
    skinTypes: ['madura', 'menopausica', 'normal', 'seca', 'mixta'],
    concerns: ['piel_madura', 'lineas_envejecimiento', 'flacidez_densidad'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '32,80 €',
    priceRange: 'economico',
    description: 'Sérum avanzado con péptidos de cobre puro para restaurar la integridad dérmica, combatir el envejecimiento cronológico y mejorar la firmeza.',
    purchaseUrl: 'https://theordinary.com/es-es/multi-peptide-copper-peptides-1-serum-100625.html',
    storeName: 'Web Oficial The Ordinary (DECIEM)',
    brandWebsite: 'https://theordinary.com/es-es'
  },
  {
    id: 'prod_meno_8',
    name: 'A.G.E. Interrupter Advanced Crema Antiglicación & Firmeza',
    brand: 'SkinCeuticals',
    category: 'Crema Hidratante',
    mainActives: ['Proxylane concentrado 30%', 'Flavonoides de Frutos Silvestres', 'Ácido Glicirretínico', 'Péptidos'],
    skinTypes: ['madura', 'menopausica', 'seca', 'normal'],
    concerns: ['piel_madura', 'menopausia_climaterio', 'flacidez_densidad', 'lineas_envejecimiento'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '198,00 €',
    priceRange: 'alta_cosmetica',
    certification: 'Cosmecéutica Médica Avanzada',
    description: 'El estándar de oro mundial contra la glicación de las fibras de colágeno y la pérdida de elasticidad en pieles maduras.',
    purchaseUrl: 'https://www.skinceuticals.es/buscar?q=a.g.e.+interrupter',
    storeName: 'Web Oficial SkinCeuticals',
    brandWebsite: 'https://www.skinceuticals.es/'
  },
  {
    id: 'prod_meno_9',
    name: 'Triple Lipid Restore 2:4:2 Tratamiento Lipídico Antiedad',
    brand: 'SkinCeuticals',
    category: 'Crema Hidratante',
    mainActives: ['Ceramidas Puras 2%', 'Colesterol Natural 4%', 'Ácidos Grasos Esenciales 2%'],
    skinTypes: ['madura', 'menopausica', 'seca', 'sensible'],
    concerns: ['deshidratacion', 'menopausia_climaterio', 'piel_madura', 'rojeces_rosacea'],
    texture: 'Crema',
    usageTime: 'PM',
    priceEstimated: '155,00 €',
    priceRange: 'alta_cosmetica',
    certification: 'Alta Cosmecéutica',
    description: 'Razón patentada 2:4:2 que reconstruye la barrera lipídica agotada por la edad o la menopausia, rellenando la textura y devolviendo la luminosidad.',
    purchaseUrl: 'https://www.skinceuticals.es/buscar?q=triple+lipid',
    storeName: 'Web Oficial SkinCeuticals',
    brandWebsite: 'https://www.skinceuticals.es/'
  },

  // ==========================================
  // 2. DERMOFARMACIA CLÍNICA ESPAÑOLA Y EUROPEA
  // ==========================================
  {
    id: 'prod_farm_1',
    name: 'Hyaluron-Filler + 3x Effect Día SPF 15 / Noche',
    brand: 'Eucerin',
    category: 'Crema Hidratante',
    mainActives: ['Ácido Hialurónico de Alto y Bajo Peso', 'Saponina Bioactiva', 'Enoxolona'],
    skinTypes: ['seca', 'normal', 'mixta', 'madura'],
    concerns: ['lineas_envejecimiento', 'deshidratacion', 'piel_madura'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '32,50 €',
    priceRange: 'farmacia',
    certification: 'Dermofarmacia Europea',
    description: 'Fórmula dermatológica para hidratar y rellenar arrugas estimulando la producción endógena de ácido hialurónico.',
    purchaseUrl: 'https://www.eucerin.es/busqueda?q=hyaluron+filler+3x',
    storeName: 'Web Oficial Eucerin',
    brandWebsite: 'https://www.eucerin.es/'
  },
  {
    id: 'prod_farm_2',
    name: 'Hyalu B5 Sérum Reparador Redensificante',
    brand: 'La Roche-Posay',
    category: 'Sérum',
    mainActives: ['Ácido Hialurónico Puro Doble Peso', 'Vitamina B5 (Pantenol 5%)', 'Madecassoside'],
    skinTypes: ['seca', 'sensible', 'normal', 'mixta', 'madura', 'menopausica'],
    concerns: ['deshidratacion', 'lineas_envejecimiento', 'rojeces_rosacea', 'piel_madura'],
    texture: 'Gel',
    usageTime: 'AM/PM',
    priceEstimated: '38,50 €',
    priceRange: 'farmacia',
    certification: 'Dermofarmacia Francesa',
    description: 'Sérum reparador y redensificante que restaura la elasticidad y alivia la sensación de tirantez.',
    purchaseUrl: 'https://www.laroche-posay.es/buscar?q=hyalu+b5',
    storeName: 'Web Oficial La Roche-Posay',
    brandWebsite: 'https://www.laroche-posay.es/'
  },
  {
    id: 'prod_farm_3',
    name: 'Fotoprotector Fusion Water MAGIC SPF 50',
    brand: 'ISDIN',
    category: 'Protector Solar',
    mainActives: ['Filtros Solares UVA/UVB de Amplio Espectro', 'Ácido Hialurónico', 'Extracto de Alga Mediterránea'],
    skinTypes: ['grasa', 'mixta', 'normal', 'sensible', 'madura', 'menopausica'],
    concerns: ['manchas_hiperpigmentacion', 'lineas_envejecimiento', 'deshidratacion', 'piel_madura'],
    texture: 'Fluido Ligero',
    usageTime: 'AM',
    priceEstimated: '22,95 €',
    priceRange: 'farmacia',
    certification: 'Dermofarmacia Española',
    description: 'Fotoprotección facial diaria de fase acuosa, acabado sedoso y alta tolerancia ocular.',
    purchaseUrl: 'https://www.isdin.com/es-ES/buscar?q=fusion+water+magic',
    storeName: 'Web Oficial ISDIN',
    brandWebsite: 'https://www.isdin.com/es-ES/'
  },
  {
    id: 'prod_farm_4',
    name: 'Azelac RU Sérum Liposomado Despigmentante',
    brand: 'Sesderma',
    category: 'Sérum',
    mainActives: ['Ácido Azelaico Liposomado', '4-Butilresorcinol', 'Ácido Tranexámico'],
    skinTypes: ['sensible', 'mixta', 'grasa', 'normal', 'seca', 'madura'],
    concerns: ['manchas_hiperpigmentacion', 'rojeces_rosacea', 'menopausia_climaterio'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '34,95 €',
    priceRange: 'farmacia',
    certification: 'Dermocosmética Española',
    description: 'Sérum despigmentante para unificar el tono y reducir manchas solares o marcas sin fotosensibilizar.',
    purchaseUrl: 'https://www.sesderma.com/es_es/catalogsearch/result/?q=azelac+ru',
    storeName: 'Tienda Oficial Sesderma',
    brandWebsite: 'https://www.sesderma.com/es_es/'
  },
  {
    id: 'prod_farm_5',
    name: 'Crema Hidratante con 3 Ceramidas Esenciales',
    brand: 'CeraVe',
    category: 'Crema Hidratante',
    mainActives: ['Ceramidas 1, 3, 6-II', 'Ácido Hialurónico', 'Tecnología MVE'],
    skinTypes: ['seca', 'sensible', 'normal', 'mixta', 'madura', 'menopausica'],
    concerns: ['deshidratacion', 'rojeces_rosacea', 'menopausia_climaterio'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '13,50 €',
    priceRange: 'farmacia',
    description: 'Emulsión para recuperar los lípidos fundamentales del manto epicutáneo y prevenir la pérdida hídrica.',
    purchaseUrl: 'https://www.cerave.es/buscar?q=crema+hidratante+ceramidas',
    storeName: 'Web Oficial CeraVe',
    brandWebsite: 'https://www.cerave.es/'
  },
  {
    id: 'prod_farm_6',
    name: 'Hyaluron Activ B3 Crema Regeneradora Celular',
    brand: 'Avène',
    category: 'Crema Hidratante',
    mainActives: ['Niacinamida 6%', 'Ácido Hialurónico Puro', 'Agua Termal'],
    skinTypes: ['sensible', 'normal', 'seca', 'mixta', 'madura'],
    concerns: ['lineas_envejecimiento', 'deshidratacion', 'piel_madura'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '39,90 €',
    priceRange: 'farmacia',
    certification: 'Dermofarmacia Termal',
    description: 'Reafirma la piel y estimula la renovación celular con alta tolerancia para pieles sensibles o maduras.',
    purchaseUrl: 'https://www.eau-thermale-avene.es/busqueda?q=hyaluron+activ+b3',
    storeName: 'Web Oficial Eau Thermale Avène',
    brandWebsite: 'https://www.eau-thermale-avene.es/'
  },
  {
    id: 'prod_farm_7',
    name: 'Sensibio H2O Agua Micelar Dermatológica',
    brand: 'Bioderma',
    category: 'Limpiador',
    mainActives: ['Micelas de Ésteres de Glicerol', 'Extracto de Pepino Calmante'],
    skinTypes: ['sensible', 'normal', 'seca', 'mixta', 'grasa', 'madura', 'menopausica'],
    concerns: ['rojeces_rosacea', 'deshidratacion', 'menopausia_climaterio'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '14,90 €',
    priceRange: 'farmacia',
    description: 'Referencia en higiene facial sin aclarado que respeta la película protectora hidrolipídica.',
    purchaseUrl: 'https://www.bioderma.es/busqueda?q=sensibio+h2o',
    storeName: 'Web Oficial Bioderma Laboratoire',
    brandWebsite: 'https://www.bioderma.es/'
  },
  {
    id: 'prod_farm_8',
    name: 'Heliocare 360 Age Active Fluid SPF 50',
    brand: 'Cantabria Labs',
    category: 'Protector Solar',
    mainActives: ['Fernblock+', 'Complejo Triple Antiedad (Ácido Hialurónico, Serina, Trehalosa)', 'Soft Focus'],
    skinTypes: ['madura', 'menopausica', 'normal', 'seca', 'mixta', 'sensible'],
    concerns: ['lineas_envejecimiento', 'manchas_hiperpigmentacion', 'piel_madura'],
    texture: 'Fluido Ligero',
    usageTime: 'AM',
    priceEstimated: '25,95 €',
    priceRange: 'farmacia',
    certification: 'Fotoprotección Médica Avanzada',
    description: 'Fotoprotector ultraligero que previene y repara el fotoenvejecimiento con tecnología Fernblock y péptidos hidratantes.',
    purchaseUrl: 'https://www.cantabrialabs.es/?s=heliocare+age+active+fluid',
    storeName: 'Web Oficial Cantabria Labs',
    brandWebsite: 'https://www.cantabrialabs.es/'
  },
  {
    id: 'prod_farm_9',
    name: 'Factor G Renew Crema Rejuvenecedora',
    brand: 'Sesderma',
    category: 'Crema Hidratante',
    mainActives: ['7 Factores de Crecimiento Biotecnológicos', 'Células Madre de Malus Domestica', 'Centella Asiática'],
    skinTypes: ['madura', 'menopausica', 'seca', 'normal'],
    concerns: ['piel_madura', 'flacidez_densidad', 'lineas_envejecimiento'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '47,50 €',
    priceRange: 'farmacia',
    certification: 'Genocosmética Española',
    description: 'Multiplica por 3 la síntesis de colágeno y elastina para tensar el óvalo facial y devolver turgencia dérmica.',
    purchaseUrl: 'https://www.sesderma.com/es_es/catalogsearch/result/?q=factor+g+renew',
    storeName: 'Tienda Oficial Sesderma',
    brandWebsite: 'https://www.sesderma.com/es_es/'
  },

  // ==========================================
  // 3. ALTA COSMÉTICA & COSMECÉUTICA AVANZADA
  // ==========================================
  {
    id: 'prod_alta_1',
    name: 'Endocare Cellage Firming Cream (Reafirmante Intensiva)',
    brand: 'Cantabria Labs',
    category: 'Crema Hidratante',
    mainActives: ['IFC-CAF (Factores de Crecimiento)', 'Wharton Gel Complex', 'Péptidos Tensores'],
    skinTypes: ['normal', 'seca', 'mixta', 'madura', 'menopausica'],
    concerns: ['lineas_envejecimiento', 'deshidratacion', 'piel_madura', 'flacidez_densidad'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '54,50 €',
    priceRange: 'alta_cosmetica',
    certification: 'Biotecnología Médica',
    description: 'Tratamiento redensificante formulado para contrarrestar la flacidez y reforzar la firmeza en pieles maduras.',
    purchaseUrl: 'https://www.cantabrialabs.es/?s=endocare+cellage+firming',
    storeName: 'Web Oficial Cantabria Labs',
    brandWebsite: 'https://www.cantabrialabs.es/'
  },
  {
    id: 'prod_alta_2',
    name: 'Crystal Retinal 6 Sérum Noche con Retinaldehído',
    brand: 'Medik8',
    category: 'Sérum',
    mainActives: ['Retinaldehído Encapsulado 0.06%', 'Ácido Hialurónico', 'Vitamina E', 'Glicerina'],
    skinTypes: ['mixta', 'normal', 'seca', 'madura'],
    concerns: ['lineas_envejecimiento', 'poros_textura', 'manchas_hiperpigmentacion', 'piel_madura'],
    texture: 'Fluido Ligero',
    usageTime: 'PM',
    priceEstimated: '79,00 €',
    priceRange: 'alta_cosmetica',
    certification: 'Cosmecéutica Avanzada',
    description: 'Renovador celular nocturno que actúa 11 veces más rápido que el retinol clásico, alisando arrugas y redensificando.',
    purchaseUrl: 'https://medik8.es/search?q=crystal+retinal+6',
    storeName: 'Tienda Oficial Medik8 España',
    brandWebsite: 'https://medik8.es/'
  },
  {
    id: 'prod_alta_3',
    name: 'Liquid Peptides Sérum Reafirmante Multicapa 30%',
    brand: 'Medik8',
    category: 'Sérum',
    mainActives: ['Complejo Peptídico al 30%', 'Matrixyl Synthe 6', 'Argirelox', 'Ácido Hialurónico Prebiótico'],
    skinTypes: ['madura', 'menopausica', 'normal', 'seca', 'mixta', 'sensible'],
    concerns: ['lineas_envejecimiento', 'piel_madura', 'flacidez_densidad', 'deshidratacion'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '64,00 €',
    priceRange: 'alta_cosmetica',
    certification: 'Cosmecéutica Avanzada',
    description: 'Complejo intensivo de péptidos dirigidos con sistema de encapsulación para atenuar arrugas de expresión y flacidez dérmica.',
    purchaseUrl: 'https://medik8.es/search?q=liquid+peptides',
    storeName: 'Tienda Oficial Medik8 España',
    brandWebsite: 'https://medik8.es/'
  },
  {
    id: 'prod_alta_4',
    name: 'Premier Cru La Crema Antiedad Global',
    brand: 'Caudalie',
    category: 'Crema Hidratante',
    mainActives: ['Tecnología TET8 con Honokiol', 'Resveratrol de Vid', 'Viniferina'],
    skinTypes: ['seca', 'normal', 'mixta', 'madura'],
    concerns: ['lineas_envejecimiento', 'manchas_hiperpigmentacion', 'deshidratacion', 'piel_madura'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '89,00 €',
    priceRange: 'alta_cosmetica',
    certification: 'Fitocosmética Premium',
    description: 'Cuidado antiedad integral para corregir 8 marcadores de la edad: arrugas, firmeza, volumen, elasticidad, manchas, hidratación y luminosidad.',
    purchaseUrl: 'https://es.caudalie.com/search?q=premier+cru+crema',
    storeName: 'Boutique Oficial Caudalie',
    brandWebsite: 'https://es.caudalie.com/'
  },

  // ==========================================
  // 4. COSMÉTICA NATURAL / BIO CERTIFICADA
  // ==========================================
  {
    id: 'prod_nat_1',
    name: 'Skin Food Crema Nutritiva Reparadora Facial',
    brand: 'Weleda',
    category: 'Limpieza e Hidratación Facial Natural',
    mainActives: ['Extracto de Pensamiento Silvestre', 'Manzanilla Bio', 'Caléndula', 'Cera de Abeja'],
    skinTypes: ['seca', 'sensible', 'normal', 'madura', 'menopausica'],
    concerns: ['deshidratacion', 'lineas_envejecimiento', 'rojeces_rosacea', 'menopausia_climaterio'],
    texture: 'Bálsamo',
    usageTime: 'AM/PM',
    priceEstimated: '10,95 €',
    priceRange: 'natural_eco',
    certification: 'Certificado NATRUE / Cosmética 100% Natural',
    description: 'Fórmula vegetal suiza para reparar intensamente zonas desvitalizadas, devolver flexibilidad y confort a pieles secas o maduras.',
    purchaseUrl: 'https://www.weleda.es/buscar?q=skin+food',
    storeName: 'Tienda Oficial Weleda',
    brandWebsite: 'https://www.weleda.es/'
  },
  {
    id: 'prod_nat_2',
    name: 'Vinoclean Aceite Tratante Desmaquillante 100% Vegetal',
    brand: 'Caudalie',
    category: 'Limpieza e Hidratación Facial Natural',
    mainActives: ['Aceite de Almendra Dulce Bio', 'Aceite de Pepitas de Uva', 'Aceite de Ricino'],
    skinTypes: ['seca', 'mixta', 'sensible', 'normal', 'grasa', 'madura', 'menopausica'],
    concerns: ['deshidratacion', 'poros_textura'],
    texture: 'Aceite',
    usageTime: 'PM',
    priceEstimated: '18,50 €',
    priceRange: 'natural_eco',
    certification: 'Clean Skincare / 100% Ingredientes Origen Natural',
    description: 'Primer paso de doble limpieza suave que emulsiona con agua convirtiéndose en leche para retirar restos de fotoprotección y maquillaje.',
    purchaseUrl: 'https://es.caudalie.com/search?q=vinoclean+aceite',
    storeName: 'Boutique Oficial Caudalie',
    brandWebsite: 'https://es.caudalie.com/'
  },
  {
    id: 'prod_nat_3',
    name: 'Crème Fraîche de Beauté Hidratante 48h Calmante',
    brand: 'Nuxe',
    category: 'Limpieza e Hidratación Facial Natural',
    mainActives: ['Leche Vegetal de Almendra Dulce', 'Extracto de Alga Roja Bio', 'Manteca de Karité'],
    skinTypes: ['normal', 'seca', 'sensible', 'mixta', 'madura'],
    concerns: ['deshidratacion', 'rojeces_rosacea'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '28,90 €',
    priceRange: 'natural_eco',
    certification: 'Cosmética Natural Francesa (97% Origen Natural)',
    description: 'Infusión botánica hidratante que calma de inmediato la sensación de tirantez y protege la barrera frente a la polución urbana.',
    purchaseUrl: 'https://es.nuxe.com/search?q=creme+fraiche+beaute',
    storeName: 'Boutique Oficial Nuxe París',
    brandWebsite: 'https://es.nuxe.com/'
  },
  {
    id: 'prod_nat_4',
    name: 'Queen Bee Sérum Antiedad Holístico con Jalea Real',
    brand: 'Apivita',
    category: 'Limpieza e Hidratación Facial Natural',
    mainActives: ['Jalea Real Griega Encapsulada', 'Extracto de Propóleo Patentado', 'Miel Fermentada'],
    skinTypes: ['seca', 'normal', 'mixta', 'madura', 'menopausica'],
    concerns: ['lineas_envejecimiento', 'deshidratacion', 'piel_madura', 'flacidez_densidad'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '62,00 €',
    priceRange: 'natural_eco',
    certification: 'Cosmética Natural Mediterránea (99% Natural)',
    description: 'Sérum redensificante y tensor que reduce arrugas profundas, mejora la firmeza y redefine el contorno facial con jalea real liposomal.',
    purchaseUrl: 'https://www.apivita.com/es/catalogsearch/result/?q=queen+bee+serum',
    storeName: 'Web Oficial APIVITA',
    brandWebsite: 'https://www.apivita.com/es/'
  },
  {
    id: 'prod_nat_5',
    name: 'Crema Regeneradora Intensiva de Día para Piel Madura',
    brand: 'Dr. Hauschka',
    category: 'Limpieza e Hidratación Facial Natural',
    mainActives: ['Flores de Endrino', 'Aceite de Almendras Dulces', 'Extracto de Kalanchoe', 'Cera de Carnauba'],
    skinTypes: ['madura', 'menopausica', 'seca'],
    concerns: ['piel_madura', 'menopausia_climaterio', 'deshidratacion', 'flacidez_densidad'],
    texture: 'Crema',
    usageTime: 'AM',
    priceEstimated: '56,00 €',
    priceRange: 'natural_eco',
    certification: 'Certificado BDIH / NATRUE Bio-Dinámico',
    description: 'Tratamiento bio-dinámico que refuerza la resistencia de la piel madura, aportando firmeza y elasticidad natural.',
    purchaseUrl: 'https://www.drhauschka.es/buscar?q=regeneradora+intensiva',
    storeName: 'Web Oficial Dr. Hauschka',
    brandWebsite: 'https://www.drhauschka.es/'
  },
  {
    id: 'prod_nat_6',
    name: 'Merveillance Lift Crema Polvo Reafirmante',
    brand: 'Nuxe',
    category: 'Limpieza e Hidratación Facial Natural',
    mainActives: ['Aceite de Microalga Ultra-Corrector', 'Escualano Vegetal'],
    skinTypes: ['normal', 'mixta', 'madura'],
    concerns: ['lineas_envejecimiento', 'flacidez_densidad', 'piel_madura'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '41,50 €',
    priceRange: 'natural_eco',
    certification: '96% Ingredientes de Origen Natural',
    description: 'Infundida con microalga rica en ácidos grasos para alisar arrugas y devolver firmeza al instante.',
    purchaseUrl: 'https://es.nuxe.com/search?q=merveillance+lift',
    storeName: 'Boutique Oficial Nuxe París',
    brandWebsite: 'https://es.nuxe.com/'
  },

  // ==========================================
  // 5. OPCIONES ACCESIBLES / LOW-COST
  // ==========================================
  {
    id: 'prod_eco_1',
    name: 'Natural Moisturizing Factors + PhytoCeramides',
    brand: 'The Ordinary',
    category: 'Crema Hidratante',
    mainActives: ['FitoCeramidas de Alta Densidad', 'Factores Naturales de Hidratación (NMF)', 'Ácidos Grasos Libres'],
    skinTypes: ['madura', 'menopausica', 'seca', 'normal', 'sensible'],
    concerns: ['deshidratacion', 'menopausia_climaterio', 'piel_madura'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '22,50 €',
    priceRange: 'economico',
    description: 'Crema nutritiva intensiva para pieles con sequedad crónica o maduras que necesitan reponer lípidos y sellar la barrera cutánea.',
    purchaseUrl: 'https://theordinary.com/es-es/natural-moisturizing-factors-phytoceramides-face-cream-100609.html',
    storeName: 'Web Oficial The Ordinary (DECIEM)',
    brandWebsite: 'https://theordinary.com/es-es'
  },
  {
    id: 'prod_eco_2',
    name: 'Sérum Ácido Hialurónico + Ceramidas',
    brand: 'Deliplus (Mercadona)',
    category: 'Sérum',
    mainActives: ['Ácido Hialurónico Multimolecular', 'Ceramidas Vegetales'],
    skinTypes: ['seca', 'mixta', 'normal', 'sensible', 'madura'],
    concerns: ['deshidratacion', 'lineas_envejecimiento'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '5,50 €',
    priceRange: 'economico',
    description: 'Sérum humectante accesible para retener el agua en las capas superficiales de la piel.',
    purchaseUrl: 'https://tienda.mercadona.es/search-results?query=serum+acido+hialuronico',
    storeName: 'Tienda Oficial Mercadona',
    brandWebsite: 'https://tienda.mercadona.es/'
  },
  {
    id: 'prod_eco_3',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'Sérum',
    mainActives: ['Niacinamida 10%', 'Zinc PCA 1%'],
    skinTypes: ['grasa', 'mixta'],
    concerns: ['acne', 'poros_textura', 'manchas_hiperpigmentacion'],
    texture: 'Fluido Ligero',
    usageTime: 'AM/PM',
    priceEstimated: '6,60 €',
    priceRange: 'economico',
    description: 'Fórmula para regular brillos, suavizar la textura de poros y atenuar imperfecciones.',
    purchaseUrl: 'https://theordinary.com/es-es/niacinamide-10-zinc-1-serum-100436.html',
    storeName: 'Web Oficial The Ordinary (DECIEM)',
    brandWebsite: 'https://theordinary.com/es-es'
  },
  {
    id: 'prod_eco_4',
    name: 'Multi-Peptide + HA Serum ("Buffet")',
    brand: 'The Ordinary',
    category: 'Sérum',
    mainActives: ['Complejo Matrixyl 3000', 'Syn-Ake', 'Péptidos Tensores', 'Ácido Hialurónico'],
    skinTypes: ['normal', 'seca', 'mixta', 'madura', 'menopausica'],
    concerns: ['lineas_envejecimiento', 'deshidratacion', 'piel_madura'],
    texture: 'Gel',
    usageTime: 'AM/PM',
    priceEstimated: '18,90 €',
    priceRange: 'economico',
    description: 'Complejo de péptidos múltiples formulado para mejorar la firmeza y atenuar líneas de expresión.',
    purchaseUrl: 'https://theordinary.com/es-es/multi-peptide-ha-serum-100613.html',
    storeName: 'Web Oficial The Ordinary (DECIEM)',
    brandWebsite: 'https://theordinary.com/es-es'
  },
  {
    id: 'prod_eco_5',
    name: 'Crema Facial Regeneradora Antiarrugas 24k Gold & Péptidos',
    brand: 'Deliplus (Mercadona)',
    category: 'Crema Hidratante',
    mainActives: ['Péptidos de Colágeno', 'Ácido Hialurónico', 'Oro Coloidal'],
    skinTypes: ['madura', 'menopausica', 'seca', 'normal'],
    concerns: ['piel_madura', 'flacidez_densidad', 'lineas_envejecimiento'],
    texture: 'Crema',
    usageTime: 'AM/PM',
    priceEstimated: '5,00 €',
    priceRange: 'economico',
    description: 'Tratamiento facial nutritivo accesible para revitalizar pieles maduras con pérdida de elasticidad.',
    purchaseUrl: 'https://tienda.mercadona.es/search-results?query=crema+facial+oro+peptidos',
    storeName: 'Tienda Oficial Mercadona',
    brandWebsite: 'https://tienda.mercadona.es/'
  },
  {
    id: 'prod_eco_6',
    name: 'Retinol 0.2% in Squalane',
    brand: 'The Ordinary',
    category: 'Sérum',
    mainActives: ['Retinol Puro 0.2%', 'Escualano Vegetal 100%'],
    skinTypes: ['seca', 'normal', 'mixta', 'madura'],
    concerns: ['lineas_envejecimiento', 'manchas_hiperpigmentacion', 'piel_madura'],
    texture: 'Aceite',
    usageTime: 'PM',
    priceEstimated: '8,90 €',
    priceRange: 'economico',
    description: 'Solución en aceite de escualano para iniciar la retinización progresiva sin deshidratar.',
    purchaseUrl: 'https://theordinary.com/es-es/retinol-02-in-squalane-serum-100439.html',
    storeName: 'Web Oficial The Ordinary (DECIEM)',
    brandWebsite: 'https://theordinary.com/es-es'
  }
];

// Empty client records list so users can create records from scratch
export const INITIAL_CLIENTS: ClinicalRecord[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];
