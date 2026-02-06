export interface SolutionMainFeature {
  id: number;
  title: string;
  desc: string;
}

export interface SolutionFeature {
  text: string;
  /**
   * Clave del icono para que la capa de presentación decida qué icono renderizar.
   * Ej: 'Eye', 'Timer', 'AlertCircle', etc.
   */
  iconKey?: string;
}

export interface SolutionResumeItem {
  text: string;
}

export interface SolutionBenefit {
  num: number;
  text: string;
}

export interface SolutionFirstCharacteristic {
  text: string;
  iconKey?: string;
}

export interface Solution {
  /** Identificador interno y clave del objeto (ej: 'brain-monitor') */
  id: string;

  /** Título largo / hero text de la solución */
  title: string;

  /** Subtítulo corto de la solución */
  subtitle: string;

  /** Título de sección (ej: 'VZOR®️ Brain Monitor') */
  sectionTitle: string;

  /**
   * Clave o path de la imagen principal (hero).
   * La capa de presentación se encarga de mapear esta clave a un import real.
   */
  imgKey: string;

  /** Párrafos descriptivos principales */
  description: string[];

  /** Características principales con título y descripción larga */
  mainFeatures: SolutionMainFeature[];

  /**
   * Claves o paths de imágenes adicionales (galería / screenshots).
   * Igual que imgKey, la UI decide cómo resolverlas.
   */
  imgsKeys: string[];

  /** Lista de features cortos (bullets) que suelen ir con iconos */
  features: SolutionFeature[];

  /** Resumen en bullets (solo algunas soluciones lo usan) */
  resume?: SolutionResumeItem[];

  /** Beneficios numerados (solo algunas soluciones lo usan) */
  benefits?: SolutionBenefit[];

  /** Primer bloque de características (solo algunas soluciones lo usan) */
  firstCharact?: SolutionFirstCharacteristic[];
}


