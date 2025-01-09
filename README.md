# Mapify

**Mapify** es una aplicación web que fue desarrollada de manera rápida y sencilla para repasar conceptos fundamentales del **Context API** de React en conjunto con hooks como **useReducer** y **useRef**, a través de la API de [mapbox](https://www.mapbox.com) para la visualización de mapas. Permite búsquedas de ubicaciones y marcado de puntos en el mapa, además de la posibilidad de crear una ruta entre dos puntos.

En próximas versiones se planea agregar la funcionalidad de guardar las rutas creadas y visualizarlas en un listado. También crear marcadores personalizados y la posibilidad de crear una ruta con varios puntos intermedios.

![Imagen de Mapify](/public/mapify.png)

## Instalación

1. Clona el repositorio en tu máquina local

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y agrega tu token de mapbox:

   ```bash
   VITE_MAPBOX_ACCESS_TOKEN=your_token_here
   ```

4. Corre el proyecto:

   ```bash
   npm start:dev
   ```
