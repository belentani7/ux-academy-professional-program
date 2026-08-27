# UX Academy — Professional Program

UX Academy es una plataforma de aprendizaje **trilingüe (español, português e inglés)** para desarrollar capacidades de UX y Product Design desde fundamentos hasta práctica profesional. El proyecto está diseñado como una experiencia educativa original y práctica: las lecciones conectan conceptos, evidencia, actividades, proyectos, rúbricas y un capstone revisado internamente.

> **Aviso de certificación:** el *Certificate of Completion* es un reconocimiento interno de UX Academy. No es una certificación oficial de Google ni supone afiliación, patrocinio o aprobación de Google.

## Alcance entregado

| Componente | Implementación |
|---|---|
| Recorrido curricular | 17 módulos progresivos, lecciones con objetivos explícitos, ejemplos, errores frecuentes, ejercicios, glosario, quiz y aplicación profesional. |
| Idiomas | Selector global y contenidos consistentes en español, português e inglés. |
| Aprendizaje | Catálogo, detalle de módulo, lección, notas, dashboard, puntos, badges, siguiente actividad y progreso persistente. |
| Práctica | Practice Lab con intento obligatorio, feedback formativo basado en la respuesta, pista, enfoque posible e historial. |
| Evaluación | Quizzes por módulo, examen final, cuatro proyectos progresivos y capstone integrador. |
| Capstone | Entrega, adjuntos, matriz de ocho criterios, nivel derivado, decisión interna y emisión controlada del certificado. |
| Evidencias | Enlaces HTTPS y adjuntos permitidos mediante almacenamiento externo, vinculados al propietario de la entrega. |
| Recursos | Biblioteca de referencias oficiales, educativas y complementarias verificadas. |

## Arquitectura

El proyecto utiliza React, TypeScript, Tailwind, Express, tRPC, Drizzle ORM y una base de datos relacional. La autenticación está integrada mediante OAuth. Todas las mutaciones de progreso, notas, evaluación, mentoría, evidencias y certificado se realizan a través de procedimientos autenticados.

```text
client/                  interfaz React, rutas y componentes
server/                  procedimientos tRPC, mentoría, seguridad y datos
drizze/                  esquema y migraciones de base de datos
shared/                  currículo, evaluación y tipos compartidos
materials/               plantillas de investigación, proyecto y portfolio
docs/                    decisiones de producto, arquitectura y auditoría
```

## Puesta en marcha

El entorno administrado inyecta las credenciales necesarias para autenticación, base de datos, almacenamiento y mentoría. No cree ni suba archivos `.env` al repositorio.

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

Las migraciones ya forman parte del proyecto. En otro entorno compatible, revise cada migración antes de aplicarla y mantenga el esquema de Drizzle sincronizado con la base de datos.

## Seguridad, privacidad y evaluación

Las evidencias se autorizan por usuario y por entrega. La plataforma permite archivos PDF, PNG, JPG, WEBP y TXT de hasta 7 MB; los enlaces externos deben usar HTTPS. No se deben adjuntar datos personales de participantes, investigación identificable, secretos de empresa ni activos sin autorización.

El mentor proporciona retroalimentación formativa solo después de un intento. La primera etapa analiza fortalezas y oportunidades; una pista y un enfoque posible se solicitan de manera separada. El feedback no sustituye la revisión de una persona ni emite una calificación o certificación.

El certificado interno requiere completar las lecciones, alcanzar la puntuación mínima de programa, aprobar el examen final, presentar los cuatro proyectos y lograr el nivel mínimo definido en los ocho criterios del capstone. La emisión es una acción explícita del administrador tras revisar estos requisitos.

## Calidad

La suite automatizada cubre autenticación, reglas de nivel de capstone, restricciones de evidencia e integridad del currículo. Se ejecuta mediante:

```bash
pnpm check && pnpm test
```

La auditoría funcional y responsive se encuentra en [`docs/QUALITY_AUDIT.md`](docs/QUALITY_AUDIT.md).

## Mantenimiento operativo

| Área | Procedimiento de mantenimiento |
|---|---|
| Migraciones | Modifique primero `drizzle/schema.ts`, genere una migración con Drizzle, revise el SQL y aplíquelo solo después de revisar sus efectos. No elimine tablas ni evidencias sin un plan de retención aprobado. |
| Contenido y traducciones | Mantenga `shared/courseContent.ts` y `shared/assessmentContent.ts` como fuente editorial. Toda lección, pregunta y recurso nuevo debe incluir las tres variantes lingüísticas y pasar `pnpm test`. |
| Referencias | Compruebe que las URLs de la biblioteca permanecen disponibles al menos una vez por cohorte. Actualice títulos, alcance y versión de los estándares cuando la fuente oficial cambie. |
| Capstone | Un administrador revisa los ocho criterios, registra el nivel por dimensión, documenta la retroalimentación y fija la decisión. El nivel global se deriva del criterio más bajo; no lo sustituya por una autoevaluación. |
| Certificados internos | Un administrador debe usar el control de validación y emisión solamente después de verificar el progreso, puntuación, examen, proyectos y capstone. El registro no debe presentarse como credencial de Google. |
| Evidencias | Conserve solo archivos autorizados y necesarios. Si una evidencia debe dejar de estar disponible, retire su referencia de la base de datos de acuerdo con la política institucional; evite recopilar datos identificables de participantes. |

Antes de cada actualización de entrega, ejecute `pnpm check && pnpm test && pnpm build`, revise los recorridos afectados en móvil y escritorio y actualice la auditoría de calidad con resultados verificables.

## Referencias principales

El currículo emplea referencias como contexto y aprendizaje complementario; no reproduce materiales con derechos reservados. La biblioteca dentro de la plataforma contiene las URLs operativas.

1. [W3C — Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
2. [W3C — ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
3. [Material Design 3](https://m3.material.io/)
4. [Figma Help Center](https://help.figma.com/)
5. [Nielsen Norman Group — Usability Testing 101](https://www.nngroup.com/articles/usability-testing-101/)
6. [Design Council — Double Diamond](https://www.designcouncil.org.uk/resources/the-double-diamond/)

## Licencia y uso

El contenido original de esta entrega se ofrece como base educativa del proyecto. Quien opere una cohorte debe revisar sus obligaciones locales sobre privacidad, accesibilidad, protección de datos, propiedad intelectual y acreditación antes de ofrecerla comercialmente.
