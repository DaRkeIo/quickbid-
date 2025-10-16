/// <reference types="vite/client" />

declare module '@vitejs/plugin-react' {
  import { Plugin } from 'vite';
  
  function pluginReact(): Plugin;
  
  export default pluginReact;
}
