# Auditoría de calidad

**Fecha de revisión:** 27 de agosto de 2026  
**Cobertura:** UX Academy — Professional Program

## Resultado ejecutivo

La plataforma se revisó en sus recorridos públicos y en los componentes protegidos a través de la comprobación estática, pruebas unitarias y capturas responsivas. La versión entregable mantiene una identidad editorial consistente, un recorrido curricular de 17 módulos y controles de acceso en los flujos que almacenan progreso, evidencias, práctica, evaluación y certificados.

| Área | Resultado | Evidencia |
|---|---|---|
| Integridad de tipos | Conforme | `pnpm check` completado sin errores. |
| Pruebas unitarias | Conforme | 4 archivos de prueba, 9 pruebas aprobadas. |
| Compilación de producción | Conforme | `pnpm build` completado; rutas privadas y dependencias separadas en paquetes diferidos. |
| Curriculum | Conforme | 17 módulos, lecciones, objetivos, quizzes y material trilingüe validado. |
| Accesibilidad visual | Conforme en revisión base | Foco visible, semántica de formularios, contraste institucional y estructura móvil comprobada. |
| Diseño responsive | Conforme | Portada, catálogo y página de módulo comprobados a 390 × 844 px. |
| Seguridad de evidencias | Conforme | Propiedad por usuario, enlaces HTTPS, tipos permitidos, límite de 7 MB y almacenamiento externo. |
| Certificado | Conforme como reconocimiento interno | Emisión controlada por administrador tras validar reglas del programa y revisión estructurada del capstone. |
| Flujos críticos | Conforme en revisión de código y contratos | Practice Lab, evidencia, revisión de capstone y emisión se validan por procedimientos autenticados con controles de propiedad o rol. |
| Rendimiento de paquete | Conforme | Áreas privadas con carga diferida y paquetes separados; el mayor paquete de framework queda por debajo del umbral de 500 kB sin advertencias de tamaño. |

## Hallazgos visuales

La portada mantiene jerarquía editorial legible en móvil: navegación compacta, selector de idioma, acciones principales, declaración de certificado interno y artefacto de práctica permanecen visibles sin desbordamiento. El catálogo presenta los 17 módulos en una secuencia legible; la vista de módulo conserva, en una sola página móvil, su caso de estudio, competencias, progreso, lecciones, práctica, proyecto y glosario. La comprobación se repitió tras reiniciar el entorno de desarrollo, con las rutas de portada, catálogo y detalle de módulo disponibles.

> La revisión visual no sustituye las pruebas manuales con tecnologías asistivas. Antes de abrir la plataforma a estudiantes externos, conviene realizar pruebas de teclado, lector de pantalla y contraste con personas usuarias reales.

## Controles implementados

La práctica no revela una orientación antes de que la persona escriba un intento. La primera respuesta del mentor es formativa y no entrega una solución; la pista y el enfoque posible se revelan en etapas separadas. Los registros de práctica permanecen asociados al usuario y al módulo correspondiente.

Las entregas de proyecto exigen un borrador antes de recibir evidencias. Los archivos admitidos son PDF, PNG, JPG, WEBP y TXT con un máximo de 7 MB; los enlaces externos se restringen a HTTPS. La interfaz recuerda no incluir datos personales de participantes ni material confidencial.

La revisión de capstone está aislada al rol de administrador. Captura ocho dimensiones: investigación, IA responsable, wireframes y flujos, UI, accesibilidad, testing, documentación y caso de portfolio. El nivel global deriva de la dimensión con menor nivel alcanzado, lo que evita compensar una brecha crítica con una puntuación alta en otro criterio.

El flujo de certificado se valida en servidor: exige progreso curricular, puntuación de programa, examen final, cuatro proyectos y un capstone aprobado al nivel mínimo publicado. Los procedimientos de evidencia verifican tipo, tamaño y nombre de adjunto; los enlaces se limitan a HTTPS. La comprobación de producción separó las áreas privadas y dependencias de la portada, dejando el paquete de framework por debajo de 500 kB y sin advertencias de tamaño.

## Auditorías reproducibles de flujos críticos

| Flujo | Método de auditoría | Resultado reproducible |
|---|---|---|
| Practice Lab | Prueba de procedimiento `practice.submit`, `practice.reveal` e `history` con dependencias de persistencia y mentoría aisladas. | Comprueba que se crea el intento antes de generar la revisión, que hint/approach se solicitan por fase y que el historial usa el identificador autenticado. |
| Evidencia | Prueba unitaria de validación de tipo, nombre y decodificación. | Acepta PDF permitido y rechaza MIME no permitido o nombres de ruta. Las rutas tRPC exigen una entrega del propietario. |
| Capstone | Prueba unitaria de criterios y revisión de código del procedimiento administrativo. | El nivel global se deriva del criterio mínimo; los ocho criterios son obligatorios y la ruta exige rol de administrador. |
| Certificado | Revisión del validador de emisión interno. | Valida progreso, puntuación, examen, proyectos y nivel mínimo de capstone antes de registrar el certificado. |
| Accesibilidad | Revisión responsiva de portada, catálogo y detalle de módulo a 390 × 844 px; inspección de etiquetas de formularios y foco visible. | No se observó desbordamiento en las rutas revisadas. Queda recomendado un test con lector de pantalla y teclado antes de una cohorte externa. |
| Seguridad | Revisión de contratos de servidor, validación de archivos y controles por usuario/rol. | Mutaciones críticas requieren autenticación; revisión/emisión requiere rol administrador; adjuntos y enlaces tienen restricciones explícitas. |

## Próximo protocolo recomendado

| Prioridad | Acción antes de una cohorte externa |
|---|---|
| Alta | Ejecutar pruebas de teclado y lector de pantalla sobre lección, quiz, modal de proyecto y formulario de evidencia. |
| Alta | Designar al menos un administrador responsable de revisiones de capstone y emisión de certificados internos. |
| Media | Definir una política institucional de retención de evidencias antes de recopilar archivos de estudiantes. |
| Media | Añadir analítica agregada y consentida solo si existe una base legal y una política de privacidad publicada. |
