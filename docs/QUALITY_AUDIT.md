# Auditoría de calidad

**Fecha de revisión:** 27 de agosto de 2026  
**Cobertura:** UX Academy — Professional Program y Growth Edition

## Resultado ejecutivo

La plataforma se revisó en sus recorridos públicos y en los componentes protegidos a través de la comprobación estática, pruebas unitarias y capturas responsivas. La versión incluye el programa original de 17 módulos, la ampliación Google previamente documentada y un Growth Studio con cuatro rutas de SEO, marketing responsable, marca audiovisual y Research Ops con IA. Los flujos que almacenan progreso, evidencias, práctica, evaluación y certificados conservan sus controles de acceso.

| Área | Resultado | Evidencia |
|---|---|---|
| Integridad de tipos | Conforme | `pnpm check` completado sin errores. |
| Pruebas unitarias | Conforme | 10 archivos de prueba, 25 pruebas aprobadas. |
| Compilación de producción | Conforme | `pnpm build` completado sin advertencias de tamaño; rutas privadas y dependencias separadas en paquetes diferidos. |
| Curriculum | Conforme | 17 módulos, lecciones, objetivos, quizzes y material trilingüe validado. |
| Accesibilidad visual | Conforme en revisión base | Foco visible, semántica de formularios, contraste institucional y estructura móvil comprobada. |
| Diseño responsive | Conforme | Portada, catálogo y página de módulo comprobados a 390 × 844 px. |
| Seguridad de evidencias | Conforme | Propiedad por usuario, enlaces HTTPS, tipos permitidos, límite de 7 MB y almacenamiento externo. |
| Certificado | Conforme como reconocimiento interno | Emisión controlada por administrador tras validar reglas del programa y revisión estructurada del capstone. |
| Flujos críticos | Conforme en revisión de código y contratos | Practice Lab, evidencia, revisión de capstone y emisión se validan por procedimientos autenticados con controles de propiedad o rol. |
| Rendimiento de paquete | Conforme | Áreas privadas con carga diferida; framework 396.62 kB, motion 115.93 kB y sin advertencias de tamaño. |
| Ruta del ecosistema Google | Conforme | 16 itinerarios, 48 unidades y 32 fuentes con estado de acceso, licencia o condición de enlace; se verificó en escritorio y móvil. |
| Growth Studio | Conforme | 4 rutas originales, 16 lecciones aplicadas y 21 recursos audiovisuales, cursos o documentos curados con fuente y condición de acceso; comprobado públicamente en escritorio y móvil. |
| Motion | Conforme | GSAP + ScrollTrigger animan la jerarquía de portada y revelaciones de sección; `prefers-reduced-motion` conserva la experiencia estática. |
| SEO técnico público | Conforme | Título, descripción, metadatos sociales, color de interfaz, manifest y reglas de robots; las rutas autenticadas se excluyen de rastreo. |

## Hallazgos visuales

La portada Growth Edition usa una jerarquía editorial de alto contraste, retícula sutil y un artefacto de aprendizaje con el bucle **pregunta → práctica → evidencia**. En escritorio (1440 × 1000 px), los bloques de método y Growth Studio mantienen una lectura clara y acciones reconocibles. En móvil (390 × 844 px), navegación compacta, selector de idioma, acciones, declaración de certificado interno, artefacto de práctica y tarjetas se reordenan sin desbordamiento horizontal. El catálogo conserva los 17 módulos en una secuencia legible; la vista de módulo conserva caso de estudio, competencias, progreso, lecciones, práctica, proyecto y glosario.

> La revisión visual no sustituye las pruebas manuales con tecnologías asistivas. Antes de abrir la plataforma a estudiantes externos, conviene realizar pruebas de teclado, lector de pantalla y contraste con personas usuarias reales.

## Controles implementados

La práctica no revela una orientación antes de que la persona escriba un intento. La primera respuesta del mentor es formativa y no entrega una solución; la pista y el enfoque posible se revelan en etapas separadas. Los registros de práctica permanecen asociados al usuario y al módulo correspondiente.

Las entregas de proyecto exigen un borrador antes de recibir evidencias. Los archivos admitidos son PDF, PNG, JPG, WEBP y TXT con un máximo de 7 MB; los enlaces externos se restringen a HTTPS. La interfaz recuerda no incluir datos personales de participantes ni material confidencial.

La revisión de capstone está aislada al rol de administrador. Captura ocho dimensiones: investigación, IA responsable, wireframes y flujos, UI, accesibilidad, testing, documentación y caso de portfolio. El nivel global deriva de la dimensión con menor nivel alcanzado, lo que evita compensar una brecha crítica con una puntuación alta en otro criterio.

El flujo de certificado se valida en servidor: exige progreso curricular, puntuación de programa, examen final, cuatro proyectos y un capstone aprobado al nivel mínimo publicado. Los procedimientos de evidencia verifican tipo, tamaño y nombre de adjunto; los enlaces se limitan a HTTPS. La comprobación de producción separó las áreas privadas, motion, primitives, datos e iconos; el paquete de framework quedó en 396.62 kB y el de motion en 115.93 kB, sin advertencias de tamaño.

La ampliación de Google conserva la navegación y contenido UX existentes. La ruta utiliza el selector global de idioma, filtra los dieciséis dominios y expone para cada uno objetivos, tres prácticas, brief, entregable, límite de práctica y recursos externos. La comprobación visual confirmó que el selector de dominios, las tarjetas de itinerario y el contenido de detalle se reordenan sin desbordamiento horizontal en un viewport de 390 px.

Growth Studio introduce cuatro rutas propias: SEO y contenido útil, marketing y conversión responsables, marca audiovisual y distribución, y Research Ops con IA. Cada una presenta resultados, cuatro lecciones con objetivo, conceptos, error frecuente, práctica guiada, práctica independiente, brief de portfolio, entregable, rúbrica y fuentes. La biblioteca ofrece filtros por SEO, marketing, vídeo, Workspace, IA y UX; los materiales externos siempre abren en origen y muestran editorial, tipo y contexto de uso. La política de licencias y la matriz de fuentes se documentan en [`GROWTH_RESEARCH.md`](GROWTH_RESEARCH.md).

La revisión visual de Growth Studio confirmó la página pública a 1440 × 1000 px y 390 × 844 px. En escritorio, la lista de rutas y el estudio activo se mantienen en columnas con una biblioteca audiovisual visible; en móvil se convierten en una secuencia vertical sin desplazamiento horizontal. La ruta usa encabezados jerárquicos, `details/summary` nativos para lecciones expandibles, etiquetas asociadas al selector de idioma, enlaces externos con destino claro y botones semánticos para los filtros. Las animaciones de portada usan únicamente opacidad y transformación, y se registran dentro de `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`; las personas que prefieren menos movimiento reciben el contenido sin estado inicial oculto ni dependencia funcional de animación.

## Auditorías reproducibles de flujos críticos

| Flujo | Método de auditoría | Resultado reproducible |
|---|---|---|
| Practice Lab | Prueba de procedimiento `practice.submit`, `practice.reveal` e `history` con dependencias de persistencia y mentoría aisladas. | Comprueba que se crea el intento antes de generar la revisión, que hint/approach se solicitan por fase y que el historial usa el identificador autenticado. |
| Evidencia | Prueba unitaria de validación de tipo, nombre y decodificación. | Acepta PDF permitido y rechaza MIME no permitido o nombres de ruta. Las rutas tRPC exigen una entrega del propietario. |
| Capstone | Prueba unitaria de criterios y revisión de código del procedimiento administrativo. | El nivel global se deriva del criterio mínimo; los ocho criterios son obligatorios y la ruta exige rol de administrador. |
| Certificado | Revisión del validador de emisión interno. | Valida progreso, puntuación, examen, proyectos y nivel mínimo de capstone antes de registrar el certificado. |
| Accesibilidad | Revisión responsiva de portada, catálogo y detalle de módulo a 390 × 844 px; inspección de etiquetas de formularios y foco visible. | No se observó desbordamiento en las rutas revisadas. Queda recomendado un test con lector de pantalla y teclado antes de una cohorte externa. |
| Seguridad | Revisión de contratos de servidor, validación de archivos y controles por usuario/rol. | Mutaciones críticas requieren autenticación; revisión/emisión requiere rol administrador; adjuntos y enlaces tienen restricciones explícitas. |
| Growth y audiovisual | Prueba de integridad de cuatro rutas y 21 fuentes; revisión visual de la portada a 1440 y 390 px. | Las rutas tienen traducción ES/PT/EN, cuatro lecciones y vínculos trazables; los medios se enlazan desde el editor original. |
| Motion | Revisión del uso de `gsap.matchMedia` y captura con `prefers-reduced-motion` respetado por diseño. | Las entradas y revelaciones usan `transform` y `opacity`; la experiencia no depende de animación para su comprensión. |
| SEO técnico | Inspección de `index.html`, `robots.txt` y manifest. | Metadatos describen la portada; rutas con progreso, evidencias, notas, revisión y certificado están excluidas del rastreo. |
| Growth Studio público | Capturas a 1440 × 1000 px y 390 × 844 px; inspección de enlace y directivas de robots. | La superficie de descubrimiento y biblioteca se abre sin autenticación, mantiene idioma y semántica, y puede rastrearse; datos del aula continúan excluidos. |

## Próximo protocolo recomendado

| Prioridad | Acción antes de una cohorte externa |
|---|---|
| Alta | Ejecutar pruebas de teclado y lector de pantalla sobre lección, quiz, modal de proyecto y formulario de evidencia. |
| Alta | Designar al menos un administrador responsable de revisiones de capstone y emisión de certificados internos. |
| Media | Definir una política institucional de retención de evidencias antes de recopilar archivos de estudiantes. |
| Media | Añadir analítica agregada y consentida solo si existe una base legal y una política de privacidad publicada. |
