import { useState } from 'react';

/**
 * Hook para alternar entre valor nominal e valor presente (deflacionado).
 * Inicializa como false (nominal).
 */
export default function useValorPresenteToggle(initial: boolean = false): [boolean, (v: boolean) => void] {
  const [valorPresente, setValorPresente] = useState(initial);
  return [valorPresente, setValorPresente];
}
