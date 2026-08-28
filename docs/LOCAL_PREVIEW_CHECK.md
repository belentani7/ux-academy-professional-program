# Comprobación visual local

Fecha: 28 de agosto de 2026.

La portada en `http://localhost:3000/` muestra los CTA **Comenzar** y **Comenzar sin registro**, ambos dirigidos al aula sin iniciar OAuth. El botón flotante **Mentor IA** aparece en la portada y abre un panel con mentoría contextual, dictado, lectura de página y laboratorio de escritura.

La ruta `/dashboard` carga el layout del aula sin mostrar una pantalla de login. En el entorno local no hay `DATABASE_URL`, por lo que el servidor no puede materializar un usuario anónimo persistente y el dashboard muestra un estado vacío; la navegación y la biblioteca pública siguen disponibles. En el despliegue con base de datos administrada, `createContext` crea la identidad anónima y emite la cookie firmada.

La ruta `/growth` muestra **35 fuentes y canales**, los filtros temáticos y las nuevas tarjetas para NNGroup, W3C WAI, Figma, Femke.design, VAexperience, UX Salon y Caler Edwards. Se conservan los enlaces a las fuentes originales y el aviso de que UX Academy no descarga ni republica vídeos.
