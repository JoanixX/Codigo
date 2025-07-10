# React + TypeScript + Vite
Este template proporciona una configuración mínima para trabajar con React y Vite usando HMR y algunas reglas de ESLint.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
## ## ## ## ## ## ##
Documentacion piola
## ## ## ## ## ## ##

## ## ## ## ## ## ##
Instalacion
## ## ## ## ## ## ##
1) Inicializar el vite en el entorno:
npm create vite@latest
2) Crear el template del proyecto:
npm create vite@latest <nombre de la app> -- --template vue
(Elegir el framework React y la variante TypeScript + SWC)
3) Entrar a la carpeta donde se guardó el proyecto e instalar las dependencias npm:
npm install
4) Inicializar el servidor 

## ## ## ## ## ## ##
Carpeta "src/components"
## ## ## ## ## ## ##
# Documentación de componentes principales

## NFTCart.tsx
- Componente que muestra el carrito de NFTs seleccionados por el usuario.
- Utiliza localStorage para persistir el carrito entre sesiones.
- Permite eliminar NFTs del carrito.
- Si el carrito está vacío, muestra un mensaje.
- Si hay NFTs, los muestra en tarjetas con nombre, rareza, precio e imagen.
- Cada tarjeta tiene un botón para eliminar el NFT del carrito.

## NFTFavorites.tsx
- Componente que muestra los NFTs marcados como favoritos por el usuario.
- Utiliza localStorage para persistir la lista de favoritos entre sesiones.
- Permite eliminar NFTs de favoritos.
- Si no hay favoritos, muestra un mensaje informativo.
- Si hay favoritos, los muestra en tarjetas con nombre, rareza, precio e imagen.
- Cada tarjeta tiene un botón para eliminar el NFT de favoritos.

## NFTFilters.tsx
- Componente que permite filtrar la galería de NFTs por rareza.
- Recibe el filtro actual y una función para actualizarlo como props.
- Muestra botones para cada rareza (todos, común, raro, épico).
- Al hacer clic en un botón, actualiza el filtro activo.
- El botón activo se resalta visualmente.

## NFTGallery.tsx
- Página principal de la galería de NFTs.
- Permite filtrar NFTs por rareza usando NFTFilters.
- Permite marcar NFTs como favoritos y arrastrar NFTs al carrito (drag & drop).
- El estado de favoritos y carrito se guarda en localStorage.
- Muestra la galería de NFTs, el carrito y los favoritos en la misma página.
- Cada NFT se muestra en una tarjeta con imagen, nombre, rareza y precio.
- El usuario puede marcar/desmarcar favoritos y arrastrar NFTs al carrito.

## nftData.ts
- Archivo de datos ficticios de NFTs para la galería.
- Cada NFT tiene id, nombre, rareza, precio e imagen.
- Se utiliza para poblar la galería, el carrito y los favoritos.

## ## ## ## ## ## ##
Carpeta "src"
## ## ## ## ## ## ##

# Documentación de archivos principales

## src/App.tsx
- Componente principal de la aplicación React.
- Gestiona la navegación entre la landing page y las páginas de funcionalidades (Galería, Carrito, Favoritos, Wallet).
- Usa hash en la URL para cambiar de página sin recargar.
- Contiene la estructura de la landing (hero, secciones de información, contacto) y renderiza el resto de páginas según el estado.
- Controla la animación de aparición de secciones y el scroll automático al hacer clic en "Comenzar".
- Renderiza el Navbar y el Footer una sola vez.

## src/App.css
- Archivo global de estilos para toda la aplicación.
- Define el layout principal, centramiento, colores, tipografía y estilos de la landing y páginas internas.
- Incluye estilos para el hero, secciones, botones, animaciones, partículas de fondo y responsividad.
- Asegura que el contenido esté alineado y visualmente consistente en todas las páginas.

## src/components/Navbar.tsx
- Componente de barra de navegación superior.
- Muestra el logo a la izquierda y los enlaces de navegación a la derecha.
- Permite navegar entre la landing y las páginas de funcionalidades mediante enlaces hash.
- Usa estilos de Navbar.module.css para el diseño y responsividad.

## src/components/Navbar.module.css
- Estilos CSS para el Navbar.
- Define el layout horizontal, colores, espaciado, hover y responsividad de la barra de navegación.
- Asegura que el logo y los enlaces estén correctamente alineados y distribuidos.

## src/components/Footer.tsx
- Componente de pie de página.
- Muestra el copyright y enlaces a redes sociales.
- Usa estilos de Footer.module.css para el diseño y responsividad.

## src/components/Footer.module.css
- Estilos CSS para el Footer.
- Define el layout horizontal, colores, espaciado y responsividad del pie de página.
- Asegura que el texto y los íconos sociales estén alineados y distribuidos correctamente.

## src/index.css
- Archivo de estilos vacío para evitar duplicidad de estilos globales.
- Todos los estilos principales están en App.css.

## src/main.tsx
- Punto de entrada de la aplicación React.
- Renderiza el componente App dentro del elemento #root.
- Importa los estilos globales (index.css y App.css).

## src/vite-env.d.ts
- Archivo de declaración de tipos para Vite.
- Permite el autocompletado y tipado correcto en archivos .ts y .tsx usando Vite.

---

# (El resto del README permanece igual)