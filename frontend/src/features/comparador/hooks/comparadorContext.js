import { createContext } from "react";

/** Cantidad máxima de productos que se pueden comparar a la vez. */
export const MAXIMO_PRODUCTOS = 4;

/** Contexto con la selección del comparador. Se usa a través de `useComparador()`. */
export const ComparadorContext = createContext(null);
