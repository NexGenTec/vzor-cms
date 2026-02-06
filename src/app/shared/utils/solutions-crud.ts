import { Solution } from '../models/solutions.model';
import { solutionsData } from '../dummy/solutions.dummy';

/**
 * Helpers simples para trabajar con `solutionsData`.
 * Están pensados como utilidades internas (por ahora sobre datos en memoria).
 */

/** Devuelve todas las soluciones como array, manteniendo el id como clave principal. */
export function getAllSolutions(): Solution[] {
  return Object.values(solutionsData);
}

/** Obtiene una solución por id (por ejemplo: 'brain-monitor'). */
export function getSolutionById(id: string): Solution | undefined {
  return solutionsData[id];
}

/** Crea una nueva solución. Si ya existe el id, lanza un error. */
export function createSolution(solution: Solution): void {
  if (solutionsData[solution.id]) {
    throw new Error(`Ya existe una solución con id "${solution.id}"`);
  }
  solutionsData[solution.id] = solution;
}

/** Actualiza parcialmente una solución existente. */
export function updateSolution(id: string, partial: Partial<Solution>): void {
  const current = solutionsData[id];
  if (!current) {
    throw new Error(`No existe solución con id "${id}"`);
  }
  solutionsData[id] = { ...current, ...partial, id: current.id };
}

/** Elimina una solución por id. */
export function deleteSolution(id: string): void {
  if (!solutionsData[id]) {
    throw new Error(`No existe solución con id "${id}"`);
  }
  delete solutionsData[id];
}


