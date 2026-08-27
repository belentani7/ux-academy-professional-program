# Brief maestro de ejecución — UX Academy Growth Edition

## Mandato

Transformar **UX Academy** en una plataforma educativa trilingüe que parezca una experiencia editorial-producto propia y contemporánea. Debe atraer a personas que desean aprender UX, Product Design, el ecosistema de Google y marketing responsable, y después guiarlas hacia una práctica profunda y demostrable. El diseño debe comunicar claridad, curiosidad, rigor y posibilidad profesional; nunca debe imitar una interfaz propietaria ni sugerir afiliación, patrocinio o certificación de Google.

> El trabajo se evaluará por la calidad de las decisiones, la legibilidad del recorrido, la utilidad de los materiales, la transparencia sobre fuentes y licencias, y la capacidad de convertir interés en una siguiente acción clara. No se evaluará por una acumulación decorativa de efectos.

## Estrategia de producto y posicionamiento

La propuesta de valor combina tres elementos: formación aplicada de UX/Product Design, una biblioteca trilingüe de recursos de primer nivel y evidencia de trabajo real mediante proyectos, portfolio y capstone. La portada deberá expresar esta transformación con una narrativa breve: **comprender → practicar → demostrar**. Cada llamada a la acción llevará a una ruta identificable: explorar el currículo, iniciar la práctica o descubrir los itinerarios del ecosistema Google.

El posicionamiento debe explicar que el programa es una experiencia interna y original. Las referencias de Google, W3C, Figma, Design Council, YouTube y otras entidades se enlazan como fuentes externas atribuidas. No se deben copiar cursos, videos, capturas, logotipos, ejercicios protegidos, evaluaciones ni marcas gráficas ajenas. Solo se podrán reutilizar elementos cuando la fuente declare una licencia compatible y se preserve el aviso correspondiente.

## Sistema visual

La dirección visual combinará claridad de sistemas de diseño modernos con el carácter editorial de una academia: superficies luminosas, bloques cromáticos vivos pero moderados, tipografía de lectura con contraste, composición asimétrica y señales de aprendizaje visibles. La paleta debe usar blanco cálido como base, tinta casi negra para texto, verde profundo como ancla y una familia de acentos controlados —azul, coral, amarillo y lavanda— para diferenciar rutas o momentos, nunca para codificar información sin apoyo textual.

| Elemento | Decisión de diseño | Criterio de aceptación |
|---|---|---|
| Portada | Narrativa en tres actos con artefacto interactivo y prueba social no fabricada. | La propuesta, el CTA y el reconocimiento interno se entienden en el primer viewport. |
| Navegación | Jerarquía por trabajo: aprender, practicar, demostrar y profundizar. | Toda pantalla ofrece un siguiente paso y un retorno claro. |
| Tarjetas | Formas redondeadas, sombras discretas, etiquetas legibles y color con propósito. | Ninguna tarjeta depende exclusivamente del color para comunicar estado. |
| Tipografía | Titulares expresivos, cuerpo funcional y microcopy preciso. | Lectura cómoda en móvil y contraste AA como mínimo. |
| Motion | Movimiento breve que revela jerarquía o confirma una acción. | No bloquea lectura, teclado ni `prefers-reduced-motion`. |

## Motion y GSAP

GSAP se usará solo para transiciones visibles de alto valor: entrada del hero, progresión de artefactos, revelación de secciones al desplazarse y feedback de filtros. Las animaciones se registrarán y limpiarán con el ciclo de vida de React. Si la persona expresa preferencia por reducir movimiento, se desactivarán los desplazamientos y se mantendrá el contenido plenamente visible.

No se usarán animaciones de carga largas, desplazamiento horizontal forzado, parallax que dificulte la lectura, temporizadores que oculten contenido, ni efectos que simulen progreso académico. ScrollTrigger se utilizará con moderación y solo en páginas públicas o bloques decorativos; los formularios, evaluaciones y acciones de seguridad permanecerán inmediatos.

## Biblioteca editorial y audiovisual

El catálogo audiovisual debe curar, no duplicar. Cada ficha necesita título, organización o autor, tipo, idioma principal, nivel, duración cuando esté disponible, descripción de aprendizaje, URL original, condiciones de acceso y relación con una ruta curricular. Se priorizan documentación oficial, codelabs, canales educativos reconocidos, documentación de estándares, vídeos de conferencias publicados por sus organizadores y repositorios abiertos. Los vídeos se enlazan o se incrustan desde su fuente oficial cuando las políticas de la plataforma lo permiten; no se descargan ni se re-suben.

Los módulos de SEO y marketing deben enseñar la relación entre una necesidad humana, contenido útil, accesibilidad, rendimiento, medición proporcionada y distribución. Deben evitar técnicas de manipulación, promesas de ranking, compra de enlaces, cloaking, spam, extracción no autorizada y afirmaciones de resultados garantizados.

## Rutas de aprendizaje que se deben crear

1. **SEO y contenido útil**: intención, arquitectura de información, Search Console, SEO técnico, datos estructurados, Core Web Vitals y mejora basada en evidencia.
2. **Marketing responsable**: propuesta de valor, audiencias, creatividades, landing pages, medición, experimentación, Google Ads y ética de segmentación.
3. **Marca y distribución**: posicionamiento, narrativa, calendario editorial, YouTube Studio, formatos, accesibilidad audiovisual, comunidad y retrospectivas.
4. **Investigación aplicada con Google**: Workspace, Forms, Sheets, Looker Studio, automatización y documentación de decisiones.

Cada ruta tendrá objetivos, unidades trilingües, errores frecuentes, prácticas guiadas, una tarea individual, un proyecto o pieza de portfolio, rúbrica y fuentes con acceso/atribución claros.

## SEO técnico del sitio

La plataforma debe ser localizable y compartible. El sitio incluirá metadatos de título y descripción coherentes, idioma del documento, jerarquía semántica, enlaces descriptivos, `robots.txt`, `sitemap.xml`, manifest y datos estructurados válidos para organización educativa o curso cuando reflejen datos reales. Ningún dato estructurado debe declarar reseñas, puntuaciones, acreditaciones, instructores o precios inexistentes.

## Control de calidad

Antes de publicar, validar tipos, pruebas, compilación, rutas principales, navegación con teclado, contraste, foco, adaptación en móvil/tablet/escritorio, `prefers-reduced-motion`, metadatos, enlaces externos y estado de Git. La documentación debe diferenciar claramente contenido original, enlace público y contenido reutilizable con licencia declarada.
