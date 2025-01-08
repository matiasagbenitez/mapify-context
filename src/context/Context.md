# Context API en React: Estructura de Archivos Comunes

En el contexto de la **Context API** de React, los archivos como `XProvider.tsx`, `XContext.ts`, y `XReducer.ts` son estructuras comunes utilizadas para manejar el estado compartido de una manera organizada. Aquí está su propósito:

---

### **1. `XContext.ts`:**

Este archivo define el **contexto** que se usará para compartir datos entre componentes sin necesidad de pasar props manualmente por cada nivel del árbol de componentes.

- **Contenido típico:**

  ```tsx
  import { createContext } from "react";

  interface XContextType {
    state: any;
    dispatch: React.Dispatch<any>;
  }

  const XContext = createContext<XContextType | undefined>(undefined);

  export default XContext;
  ```

- **Propósito:**
  - Centraliza el contexto para que cualquier componente dentro del árbol pueda accederlo.
  - Define el contrato (tipos de datos) para los datos que compartirá.

---

### **2. `XProvider.tsx`:**

Este archivo implementa el **proveedor** del contexto, que se encarga de proporcionar el estado y las funciones necesarias a los componentes hijos.

- **Contenido típico:**

  ```tsx
  import React, { useReducer } from "react";
  import XContext from "./XContext";
  import xReducer, { initialState } from "./XReducer";

  const XProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(xReducer, initialState);

    return (
      <XContext.Provider value={{ state, dispatch }}>
        {children}
      </XContext.Provider>
    );
  };

  export default XProvider;
  ```

- **Propósito:**
  - Proveer el contexto a los componentes del árbol envolviendo la aplicación o partes de ella.
  - Inicializa el estado y conecta el reducer (si lo hay) para manejar cambios en el estado.

---

### **3. `XReducer.ts`:**

Este archivo contiene el **reducer** que define cómo cambiar el estado global basado en acciones específicas.

- **Contenido típico:**

  ```tsx
  export const initialState = {
    user: null,
    isAuthenticated: false,
  };

  export type Action = { type: "LOGIN"; payload: any } | { type: "LOGOUT" };

  const xReducer = (state = initialState, action: Action) => {
    switch (action.type) {
      case "LOGIN":
        return { ...state, user: action.payload, isAuthenticated: true };
      case "LOGOUT":
        return { ...state, user: null, isAuthenticated: false };
      default:
        return state;
    }
  };

  export default xReducer;
  ```

- **Propósito:**
  - Define las reglas para actualizar el estado en respuesta a acciones.
  - Funciona junto con `useReducer` en el `XProvider`.

---

### **Diferencia entre Estado Global y Contexto Global:**

1. **Estado Global:**

   - Se refiere a un único estado compartido por toda la aplicación (o una parte significativa de ella).
   - Es manejado por herramientas como Redux, Zustand, o la combinación de `useReducer` y `useContext`.
   - Proporciona un control estructurado y centralizado del estado.

2. **Contexto Global:**
   - Es una herramienta para **compartir datos** entre componentes sin pasar props explícitamente.
   - La **Context API** facilita el acceso a datos en el árbol de componentes, pero no tiene lógica integrada para manejar cambios en el estado.
   - Cuando se combina con `useReducer`, puede usarse para manejar estado global.

---

### **Resumen:**

- **`XContext.ts`** define el contexto.
- **`XProvider.tsx`** implementa el proveedor para compartir el contexto con los componentes hijos.
- **`XReducer.ts`** define cómo manejar los cambios en el estado (si se usa un reducer).

El **estado global** se enfoca en la lógica y la estructura centralizada del estado, mientras que el **contexto global** es más bien el mecanismo para compartir datos en el árbol de componentes.
