# Informe de Auditoría: ux-academy-professional-program

- **Fecha:** 2026-08-27
- **Stack detectado:** React 19 + Vite 7 + TypeScript 5.9 + Tailwind 4 (client), Express 4.22 + tRPC 11.18 + Drizzle ORM 0.45 + mysql2 (server), pnpm monorepo, SQL (MySQL), vitest 2
- **Commits analizados:** 1 (728cbb4 — inicial, 189 archivos, 31 213 líneas). Rama analizada: `main`
- **Veredicto:** mejorable (sin secretos reales; 1 crítica CVE y 18+ CVEs altos en dependencias resueltos en esta auditoría; riesgos residuales documentados)

---

## Lo mejor del repo

1. **Disciplina de seguridad inusual para un repo sin CI.** OAuth con nonce CSRF ligado a cookie `__Host-` (`server/_core/oauth.ts`, `shared/const.ts`), sesiones JWT con algoritmo fijado HS256 (`server/_core/sdk.ts`), verificación de propiedad en cada mutación de datos, rol admin en revisión/emisión, validación estricta de entradas con zod, enlaces de evidencia solo HTTPS y archivos con allow-list de tipos y límite de 7 MB (`server/evidence.ts`, `server/routers.ts`). Todo el acceso a datos usa Drizzle ORM (SQL parametrizado, sin riesgo de inyección).
2. **Calidad editorial trilingüe coherente (es/pt/en)** en currículo, evaluaciones, práctica, capstone y ruta Google, con decisiones de producto documentadas (`docs/`, `materials/`) y una auditoría de calidad verificable (`docs/QUALITY_AUDIT.md`).
3. **Ingeniería robusta:** retry con backoff exponencial jitter + respeto a `Retry-After` en llamadas LLM, fallback editorial para el mentor, mapeo de errores de servicios externos, code-splitting con framework bajo 500 kB gzip, y una suite de 22 pruebas que pasa junto a `pnpm check` y `pnpm build`.

---

## Hallazgos CRÍTICOS

En estado previo: 1 crítica (`fast-xml-parser` DoS, GHSA-m7jm-9gc2-mpf2) alcanzable vía `@aws-sdk/client-s3@3.907.0`, que **no se importa en ningún módulo fuente** (`package.json:16-17`). **RESUELTO** en la rama `agent/auditoria-2026-08-27` eliminando las dos dependencias AWS SDK sin uso (el storage usa presign de Forge, `server/storage.ts`).

Sin secretos reales filtrados en el código versionado (scaneo regex + búsqueda por nombre de archivo; `.env` correctamente ignorado por `.gitignore`).

## Hallazgos ALTOS (estado previo y resolución)

| Hallazgo | Evidencia | Resolución |
|---|---|---|
| Dependencias AWS SDK sin uso arrastrando 1 crítica + 6 altos + moderados (fast-xml-parser, @smithy) | `package.json:16` | ✅ Eliminadas (`security:` commit) |
| axios 1.12 con 12 CVEs altos (SSRF/prototype pollution) | `package.json:49` | ✅ `^1.20.0` |
| @trpc/server 11.6 prototype pollution (GHSA-43p4-m455-4f4j) | `package.json:46-48` | ✅ `^11.18.0` |
| express 4.21.2 → path-to-regexp ReDoS (GHSA-37ch-88jc-xwx2) | `package.json:58` | ✅ `^4.22.2` |
| drizzle-orm 0.44 (GHSA-gpj5-g38j-94v9) | `package.json:56` | ✅ `^0.45.2` |
| nanoid 5.1.x DoS loop (GHSA-28wg-ghj8-5hjv) | `package.json:64` | ✅ `^5.1.16` |
| Residual: streamdown@1.4.0 → mermaid 11.12 / dompurify 3.3 (XSS moderado/bajo) y recharts → lodash (pollution alta) | `pnpm-lock.yaml` | ⏳ Documentado; no corregido (componentes en uso, reemplazo requiere iteración dedicada) |

Resultado `pnpm audit --prod` tras corrección: **81 → 36** (críticas 1→0; altas 21→3; moderadas 49→28; bajas 10→5).

## Hallazgos MEDIOS

- **Sin CI/CD** (no hay `.github/workflows/`, `.gitlab-ci.yml` ni Dockerfile). Recomendado: GitHub Actions con `pnpm install --frozen-lockfile && pnpm check && pnpm test && pnpm build && pnpm audit --prod`.
- **`server/_core/voiceTranscription.ts` es código muerto** (no está conectado a ningún router) y su patrón de ejemplo hace fetch server-side de una URL de audio (patrón SSRF si se conectara sin validación de URL). `server/routers.ts` no lo referencia. No se eliminó por regla de no borrar; decidir si integrar o eliminar.
- **Sin `.env.example`**: `server/_core/env.ts` define el contrato de variables (VITE_APP_ID, JWT_SECRET, DATABASE_URL, OAUTH_SERVER_URL, OWNER_OPEN_ID, BUILT_IN_FORGE_API_URL, BUILT_IN_FORGE_API_KEY, PORT, VITE_OAUTH_PORTAL_URL). Generar una plantilla ayudaría a desplegar en un segundo entorno.
- **`JWT_SECRET` vacío no valida en arranque** (`server/_core/env.ts`): si se omite en producción, las sesiones fallarán en verify (auth rota) o, peor, comportamientos no deterministas. Recomendado: guard de arranque que falle rápido ante configuración incompleta en NODE_ENV=production.
- **`/manus-storage/*`** (`server/_core/storageProxy.ts`) redirige a URLs firmadas sin autenticación por petición; la autorización depende de que las claves (con sufijo hash) sean inobtenibles. Correcto como diseño actual, pero revisar antes de cohortes externas.
- **Sin rate-limiting** en `practice.submit/reveal` (invoca LLM por intento): superficie de abuso/coste. `server/routers.ts:80-92`.
- **Falta archivo LICENSE** pese a `"license": "MIT"` en `package.json`. Repo privado: decisión del propietario (no se generó por prudencia).

## Añadido por el auditor

Rama `agent/auditoria-2026-08-27` → PR #1 (https://github.com/belentani7/ux-academy-professional-program/pull/1)

- **security (da63a98):** `package.json` + `pnpm-lock.yaml`: elimina `@aws-sdk/client-s3` y `@aws-sdk/s3-request-presigner`; sube axios, @trpc (client/react-query/server), express, drizzle-orm y nanoid a versiones parcheadas.
- **chore (8ecf9f0):** `.gitignore` (+ `.manus-logs/`), `README.md` (typo `drizze/`→`drizzle/`), `docs/QUALITY_AUDIT.md` (totales de pruebas reales: 9 archivos / 22 pruebas).

Verificación ejecutada tras los cambios: `pnpm check` ✅, `pnpm test` (22/22) ✅, `pnpm build` ✅, `pnpm audit --prod` ✅.

## Próximos pasos recomendados

1. Integrar el PR de auditoría y añadir CI (GitHub Actions) que bloquee ante `pnpm audit --prod` con severidad alta.
2. Evaluar reemplazo o pin de `streamdown`/`recharts` (overrides de mermaid ≥11.16.1, dompurify ≥3.4.13, lodash ≥4.18.1) con prueba visual del showcase y del chat.
3. Guard de configuración en arranque (fallo rápido si JWT_SECRET/DATABASE_URL/OUATH vars faltan en producción).
4. Definir `.env.example` y, si se abrirá a cohortes externas, decidir policy de retención de evidencias y rate-limiting del mentor.
5. Decidir el destino de `voiceTranscription.ts` (integrar con validación estricta de audioUrl o eliminar).

## No tocado (pero anotado)

- `server/_core/voiceTranscription.ts` (código muerto / patrón SSRF de ejemplo) — no se eliminó.
- Uso de `crypto.randomUUID()` global sin import en `server/storage.ts:25` (depende de Node ≥19; se recomienda `import crypto from "node:crypto"`).
- Comentarios con rutas internas (`/home/ubuntu/skills/...`) en `server/_core/sdk.ts:325` y `server/_core/heartbeat.ts:9` — filtración menor de infraestructura.
- Dependencia `add` en devDependencies (`package.json:91`) sin uso — probable residuo del template.
- Alias `@assets` → `attached_assets` inexistente (`vite.config.ts:161`) — inofensivo, sin importaciones.
- Middleware debug `vitePluginManusDebugCollector` registra `networkRequests`/`sessionReplay` en dev (`vite.config.ts:77-151`); mitigado añadiendo `.manus-logs/` a `.gitignore`.
- Almacenamiento de respuestas y feedback del alumno en claro en BD (esperado para un MVP educativo).