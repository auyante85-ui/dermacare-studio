/**
 * Utility to generate direct purchase / official brand web links
 * for cosmetic products and recommendations in Spain & Europe.
 */

export interface ProductLinkInfo {
  url: string;
  storeName: string;
  brandWebsite?: string;
  isOfficial: boolean;
}

// Map of leading skincare brands in Spain & Europe with official web stores and search endpoints
const BRAND_STORE_MAP: Record<string, { officialWeb: string; searchUrl: (q: string) => string; storeLabel: string }> = {
  'isdin': {
    officialWeb: 'https://www.isdin.com/es-ES/',
    searchUrl: (q) => `https://www.isdin.com/es-ES/buscar?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial ISDIN'
  },
  'la roche-posay': {
    officialWeb: 'https://www.laroche-posay.es/',
    searchUrl: (q) => `https://www.laroche-posay.es/buscar?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial La Roche-Posay'
  },
  'vichy': {
    officialWeb: 'https://www.vichy.es/',
    searchUrl: (q) => `https://www.vichy.es/buscar?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial Vichy Laboratoires'
  },
  'cantabria labs': {
    officialWeb: 'https://www.cantabrialabs.es/',
    searchUrl: (q) => `https://www.cantabrialabs.es/?s=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial Cantabria Labs'
  },
  'endocare': {
    officialWeb: 'https://www.cantabrialabs.es/marcas/endocare/',
    searchUrl: (q) => `https://www.cantabrialabs.es/?s=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial Endocare'
  },
  'heliocare': {
    officialWeb: 'https://www.cantabrialabs.es/marcas/heliocare/',
    searchUrl: (q) => `https://www.cantabrialabs.es/?s=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial Heliocare'
  },
  'caudalie': {
    officialWeb: 'https://es.caudalie.com/',
    searchUrl: (q) => `https://es.caudalie.com/search?q=${encodeURIComponent(q)}`,
    storeLabel: 'Boutique Oficial Caudalie'
  },
  'weleda': {
    officialWeb: 'https://www.weleda.es/',
    searchUrl: (q) => `https://www.weleda.es/buscar?q=${encodeURIComponent(q)}`,
    storeLabel: 'Tienda Oficial Weleda Bio'
  },
  'medik8': {
    officialWeb: 'https://medik8.es/',
    searchUrl: (q) => `https://medik8.es/search?q=${encodeURIComponent(q)}`,
    storeLabel: 'Tienda Oficial Medik8 España'
  },
  'skinceuticals': {
    officialWeb: 'https://www.skinceuticals.es/',
    searchUrl: (q) => `https://www.skinceuticals.es/buscar?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial SkinCeuticals'
  },
  'eucerin': {
    officialWeb: 'https://www.eucerin.es/',
    searchUrl: (q) => `https://www.eucerin.es/busqueda?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial Eucerin'
  },
  'avène': {
    officialWeb: 'https://www.eau-thermale-avene.es/',
    searchUrl: (q) => `https://www.eau-thermale-avene.es/busqueda?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial Eau Thermale Avène'
  },
  'bioderma': {
    officialWeb: 'https://www.bioderma.es/',
    searchUrl: (q) => `https://www.bioderma.es/busqueda?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial Bioderma Laboratoire'
  },
  'sesderma': {
    officialWeb: 'https://www.sesderma.com/es_es/',
    searchUrl: (q) => `https://www.sesderma.com/es_es/catalogsearch/result/?q=${encodeURIComponent(q)}`,
    storeLabel: 'Tienda Oficial Sesderma'
  },
  'cerave': {
    officialWeb: 'https://www.cerave.es/',
    searchUrl: (q) => `https://www.cerave.es/buscar?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial CeraVe'
  },
  'the ordinary': {
    officialWeb: 'https://theordinary.com/es-es',
    searchUrl: (q) => `https://theordinary.com/es-es/search?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial The Ordinary (DECIEM)'
  },
  'nuxe': {
    officialWeb: 'https://es.nuxe.com/',
    searchUrl: (q) => `https://es.nuxe.com/search?q=${encodeURIComponent(q)}`,
    storeLabel: 'Boutique Oficial Nuxe París'
  },
  'apivita': {
    officialWeb: 'https://www.apivita.com/es/',
    searchUrl: (q) => `https://www.apivita.com/es/catalogsearch/result/?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial APIVITA'
  },
  'dr. hauschka': {
    officialWeb: 'https://www.drhauschka.es/',
    searchUrl: (q) => `https://www.drhauschka.es/buscar?q=${encodeURIComponent(q)}`,
    storeLabel: 'Web Oficial Dr. Hauschka'
  },
  'ziaja': {
    officialWeb: 'https://onlineziaja.com/',
    searchUrl: (q) => `https://onlineziaja.com/buscar?controller=search&s=${encodeURIComponent(q)}`,
    storeLabel: 'Tienda Oficial Ziaja'
  },
  'deliplus': {
    officialWeb: 'https://tienda.mercadona.es/',
    searchUrl: (q) => `https://tienda.mercadona.es/search-results?query=${encodeURIComponent(q)}`,
    storeLabel: 'Tienda Oficial Mercadona'
  }
};

/**
 * Normalizes and extracts matching brand info
 */
export function detectBrandKey(text: string): string | null {
  const lower = text.toLowerCase();
  for (const key of Object.keys(BRAND_STORE_MAP)) {
    if (lower.includes(key)) {
      return key;
    }
  }
  return null;
}

/**
 * Returns structured purchasing information with a reliable direct URL
 */
export function getProductBuyInfo(
  productName: string,
  brand?: string,
  explicitUrl?: string,
  explicitStore?: string
): ProductLinkInfo {
  // If an explicit URL has been provided, use it
  if (explicitUrl && explicitUrl.startsWith('http')) {
    return {
      url: explicitUrl,
      storeName: explicitStore || 'Tienda / Web Oficial',
      isOfficial: true
    };
  }

  const query = `${productName} ${brand || ''}`.trim();
  const brandKey = (brand ? detectBrandKey(brand) : null) || detectBrandKey(productName);

  if (brandKey && BRAND_STORE_MAP[brandKey]) {
    const info = BRAND_STORE_MAP[brandKey];
    // Clean product search query for the specific brand
    const searchClean = productName
      .replace(new RegExp(brandKey, 'gi'), '')
      .replace(/[^\w\s\+áéíóúÁÉÍÓÚñÑ]/gi, ' ')
      .trim();

    return {
      url: info.searchUrl(searchClean || productName),
      storeName: explicitStore || info.storeLabel,
      brandWebsite: info.officialWeb,
      isOfficial: true
    };
  }

  // Fallback: Direct search in top Spanish / European dermopharmacy & beauty portals
  // Generates direct Google Shopping / Promofarma / Primor query
  const safeQuery = encodeURIComponent(query);
  return {
    url: `https://www.promofarma.com/es/search?q=${safeQuery}`,
    storeName: 'Promofarma / Dermofarmacia',
    isOfficial: false
  };
}
