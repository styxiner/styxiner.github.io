# Sistema de diseño

Quería que la web se leyera como una página de manual de Unix bien maquetada. Los guiños a Linux están en los
detalles (etiquetas, metadatos, estados), sin disfrazar la página de terminal.

## Principios

- **Plano.** Líneas de 1px, radio de 2px, superficies lisas. Nada de gradientes, sombras, blur ni pastillas
  redondeadas: es lo que hace que un portfolio parezca una plantilla genérica.
- **Un solo acento.** Lo uso poco: el cursor, `[ OK ]`, el botón principal y la línea superior de la tarjeta
  destacada. Ámbar y coral son solo para estados (en curso, error).
- **Convenciones reales en vez de decoración.** Cada elemento técnico imita algo que existe de verdad:

| Elemento | Referencia |
| --- | --- |
| `STYXINER(1)` y nombres de sección en la columna izquierda | Cabecera y secciones de `man(1)` |
| `SINOPSIS`: `styxiner [--build] … idea` | Negrita para literales, subrayado para argumentos, como en man |
| `[ OK ]`, `[ WAIT ]`, `[FAILED]`, `[ *  ]` | Mensajes de arranque de systemd |
| Sección activa, filtro elegido, idioma, fila de contacto al pasar el ratón | Vídeo inverso, como una selección en terminal |
| `LANG= es en` | Variable de entorno `LANG` |
| Tarjeta sin imagen: `$ ls -ld repo/` + `.py` | Salida de `ls` |
| Tarjeta de grupo: `tree -L 1 complyx/` | Salida de `tree` |
| `--lang=all python rust` | Opciones largas de un comando |
| `$ whoami`, `$ finger styxiner`, `$ ls /etc/ssl/certs` | El comando que «produciría» cada sección |
| 404: `No manual entry for …` | Mensaje de `man` cuando no encuentra una página |

## Color

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#0c0e11` | Fondo |
| `--surface` | `#12151a` | Paneles y tarjetas al pasar el ratón |
| `--line` / `--line-strong` | `#22272f` / `#353c47` | Bordes |
| `--text` | `#dfe3e8` | Texto principal |
| `--text-muted` | `#8e97a3` | Texto secundario (contraste 6.5:1) |
| `--text-faint` | `#7a838f` | Metadatos y etiquetas (5.0:1 sobre el fondo, 4.8:1 sobre `--surface`) |
| `--accent` | `#5fd4e4` | Acento configurable |
| `--warn` / `--danger` | `#e8c46a` / `#ef8a80` | En curso / error |

Ajusté `--text-faint` hasta que cumpliera el contraste mínimo de WCAG AA (4.5:1), porque lo uso en texto pequeño
como fechas y etiquetas.

## Tipografía

- **JetBrains Mono**: el nombre, los nombres de sección, la navegación, los metadatos y todo lo que sería salida
  de terminal.
- **Instrument Sans**: lo que se lee: rol, títulos de sección, descripciones y párrafos.

La escala va de `--step--2` a `--step-4`. Los dos tamaños grandes usan `clamp()` para crecer con la pantalla.

## Movimiento

- Una sola duración, 140ms, para hover y foco.
- Lo único que se mueve solo es el cursor del hero, el del pie y el asterisco de carga.
- Las secciones se asientan al entrar con `animation-timeline: view()`. Es CSS puro: empiezan al 35% de opacidad
  (nunca invisibles) y los navegadores sin soporte simplemente las muestran.
- Con `prefers-reduced-motion: reduce` se desactivan todas las animaciones y el scroll suave.

## Responsive

| Ancho | Navegación | Secciones | Proyectos |
| --- | --- | --- | --- |
| < 640 | Menú desplegable con filas grandes y el selector de idioma | Nombre de sección encima del título | 1 columna |
| ≥ 640 | Igual | Igual | 2 columnas, destacado a lo ancho |
| ≥ 900 | Enlaces y selector de idioma en la barra | Igual | 2 columnas |
| ≥ 1024 | Igual | Columna de margen fija, como en man | 2 columnas |
| ≥ 1100 | Igual | Contenido limitado a 1180px | 3 columnas, destacado ocupa 2 con el árbol a un lado |

## Accesibilidad

- Enlace «Saltar al contenido» al pulsar Tab.
- Foco visible en todo lo interactivo (contorno de 1px del color de acento).
- Un solo `h1`; cada sección es una región con su `h2`.
- Lo decorativo (`STYXINER(1)`, cursores, árbol de la tarjeta) lleva `aria-hidden`.
- Los estados de carga y error de proyectos se anuncian con `role="status"` y `role="alert"`.
- El menú móvil se cierra con Escape.
- Cada idioma del selector se anuncia con su nombre en su propio idioma («Español», «English») y `<html lang>`
  cambia con él.
