# MAPEO FCC → UX Academy (17 módulos) — Diseña evidencia, no opiniones.

Marca: light paper `#F3EFE7` + ink `#0E2035`, CTA lime, Space Grotesk titulares + DM Sans cuerpo. Tokens en `open-school/shared/BELENTANI-DESIGN-SYSTEM.md`. Voz ES/PT/EN en `VOZ-Y-LENGUAJE.md`.
Adaptación obligatoria: traducir títulos, término técnico EN en mono, intro 2 líneas + Qué harás + Evidencia.

Fuente literal BSD-3: https://github.com/freeCodeCamp/freeCodeCamp
Clon sparse (no copiar todo el repo, pesa GB):

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/freeCodeCamp/freeCodeCamp.git _fcc-upstream
cd _fcc-upstream
git sparse-checkout set curriculum/challenges/_meta
```

## Mapeo
| UX Módulo | FCC fuente literal a importar |
|---|---|
| 01 Fundamentos UX | Responsive Web Design (HTML/CSS proyectos) |
| 02 Research | FCC `interview-guide` propio + Moodle `mod/questionnaire` |
| 03 Synthesis | FCC Data Viz (D3) ideas |
| 04 Proto | Front End Libraries (React) |
| 05 Design System | FCC CSS + Moodle theme patrones |
| 06 Test | Quality Assurance cert |
| 07 Accesibilidad | Moodle WCAG 2.1 AA checklist |
| 08-17 Practice/Capstone | FCC 50 proyectos por cert → adaptar a rúbricas UX |

## Acción
- Copiar solo `curriculum/challenges/` necesarios a `materials/fcc-import/upstream/`
- Mantener header BSD + atribución en NOTICE.
- No copiar `client/` entero de FCC (Next.js propio ya existe).
