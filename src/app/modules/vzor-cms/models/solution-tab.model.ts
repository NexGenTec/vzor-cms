/**
 * Modelo para el sub módulo "Tabs Soluciones" del CMS.
 * Refleja la estructura del array `tabs` que usas en el sitio público.
 */

export interface SolutionTabSolution {
  /** Identificador interno de la solución dentro del tab (1, 2, 3, ...) */
  id: number;
  title: string;
  desc: string;
  /** Clase de color Tailwind / custom (ej: "bg-[var(--color-vzor-blue-300)]/30") */
  color: string;
  /** Clave de imagen, ej: "infraMonitor", "appsMonitor", etc. */
  imgKey: string;
  /** Ruta relativa, ej: "solutions/infra-monitor" */
  href: string;
}

export interface SolutionTab {
  /** id lógico del tab, ej: "suite360", "aiops", "itmgmt" */
  id: string;
  label: string;
  href: string;
  /** Color principal del tab, ej: "#00B5E2" */
  color: string;
  /** Título del bloque de contenido del tab */
  contentTitle: string;
  /** Texto descriptivo del bloque de contenido del tab */
  contentText: string;
  /** Lista de soluciones que pertenecen a este tab */
  solutions: SolutionTabSolution[];
  createdAt: Date;
  updatedAt: Date;
  selected?: boolean;
}

export type CreateSolutionTabRequest = Omit<SolutionTab, 'createdAt' | 'updatedAt' | 'selected'>;

export type UpdateSolutionTabRequest = Partial<CreateSolutionTabRequest>;

