# AGENTS.md -- ux-academy-professional-program

Reglas para agentes y personas que trabajen en este repositorio.

## Proposito del proyecto

Trilingual UX/Product Design learning platform ÔÇö practice exercises, evaluation system, and capstone projects

Stack detectado: Node.js, Next.js, React, Vite, Tailwind, TypeScript, GSAP, Deploy: vercel.json, netlify.toml.

## Regla dura (aditiva)

**Nunca romper lo que ya funciona.** Los cambios deben ser aditivos o compatibles
hacia atras. Si un cambio puede romper build, tests o interfaz, justificalo y
pruebalo antes de fusionar. No eliminar archivos ni reescribir modulos completos
sin necesidad demostrada.

## Fuente de verdad

Cada dato vive en un unico lugar (single source of truth). No duplicar contenido
entre archivos. La documentacion vive en `docs/` y se actualiza en el mismo PR
que el cambio (Spec-Code Convergence).

## Seguridad

- Sin secretos en git (claves, tokens, endpoints privados). Usar variables de entorno.
- Validacion de entrada y autorizacion por endpoint si hay backend.
- Errores al cliente genericos; detalle solo en logs.

## Comandos

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run deploy`
- `npm run check`
- `npm run format`

## Commits

Commits convencionales: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`, `perf:`.

## CI

Mantener la integracion continua en verde. No fusionar cambios que rompan tests,
lint o build.

## Documentacion obligatoria antes de codigo

PRD -> SRS -> SDD -> ADR -> Plan (ver `docs/`). Gate: sin documento no se codifica.
