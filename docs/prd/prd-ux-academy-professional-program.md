# PRD -- ux-academy-professional-program
Fecha: 2026-09-25 | Estado: Draft (auditoria automatica, requiere revision humana) | Autor: auditoria belentani7 (NOIACORE)

## 1. Problema

UX Academy es una plataforma de aprendizaje **trilingüe (español, português e inglés)** para desarrollar capacidades de UX y Product Design desde fundamentos hasta práctica profesional. El proyecto está diseñado como una experiencia educativa original y práctica: las lecciones conectan conceptos, evidencia, actividades, proyectos, rúbricas y un capstone revisado internamente.

## 2. Usuarios objetivo

- **Primario**: usuario final que necesita resolver el caso de uso de ux-academy-professional-program.
- **Secundario**: equipo/persona que mantiene y despliega el proyecto.
- **Terciario**: agentes CLI que operan sobre el repositorio.

## 3. Features (MoSCoW)

| ID | Feature | MoSCoW |
|---|---|---|
| F1 | Funcionalidad principal del repositorio | Must |
| F2 | Flujo de usuario critico | Must |
| F3 | Persistencia / datos | Must |
| F4 | Despliegue y observabilidad | Must |
| F90 | Checklist de produccion (build, tests, deploy, seguridad) | Should |
| F91 | Documentacion viva (esta cadena) | Must |

## 4. Criterios de aceptacion (GWT)

### F1 -- Funcionalidad principal del repositorio
- Given el usuario en el contexto de ux-academy-professional-program / When usa Funcionalidad principal del repositorio / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F2 -- Flujo de usuario critico
- Given el usuario en el contexto de ux-academy-professional-program / When usa Flujo de usuario critico / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F3 -- Persistencia / datos
- Given el usuario en el contexto de ux-academy-professional-program / When usa Persistencia / datos / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F4 -- Despliegue y observabilidad
- Given el usuario en el contexto de ux-academy-professional-program / When usa Despliegue y observabilidad / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.


## 5. Metricas de exito

- Build reproducible en un comando.
- CI verde en cada PR.
- Cero secretos en el repositorio.
- Documentacion actualizada en el mismo PR que el codigo.

## 6. Out of scope

- Funcionalidad no descrita en el README vigente.
- Cambios que rompan compatibilidad sin ADR que lo justifique.
