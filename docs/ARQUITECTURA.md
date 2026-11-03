# Arquitectura

## La idea

Quería que la sección de proyectos se mantuviera sola sin que la web dependiera de la API de GitHub en cada
visita. Así que GitHub es la fuente de datos, un script la convierte en un JSON estático una vez por semana y
Angular solo lee ese JSON.

```
GitHub API ──(lunes, GitHub Actions)──▶ scripts/fetch-projects.mts ──▶ public/data/projects.json
                                                                              │
                                     Angular (ProjectsService) ◀──── fetch ───┘
```

Lo que gano con esto: carga rápida (un archivo pequeño desde mi propio dominio), ningún límite de peticiones para
quien visita la web y ningún token en el frontend. Si la API falla, falla el workflow y el JSON anterior sigue
publicado.

## Tipos compartidos

`src/app/core/models/project.model.ts` define la forma del JSON y el script lo importa con `import type`. Si
cambio un campo en el modelo, `pnpm check:scripts` falla hasta que el script genere lo mismo. Así me aseguro de
que el JSON y Angular no se desincronizan.

El script está en TypeScript (`.mts`) y Node 24 lo ejecuta directamente sin compilar, porque elimina los tipos
al cargarlo. Eso obliga a usar solo sintaxis «borrable» (nada de `enum` ni de parámetros con modificadores);
`scripts/tsconfig.json` lo comprueba con `erasableSyntaxOnly`.

## Angular

- **Sin router.** Es una sola página que se navega con anclas (`#projects`). Como no hay rutas, GitHub Pages no
  tiene nada que resolver y me ahorro el truco de copiar `index.html` a `404.html`. `public/404.html` es una
  página propia («No manual entry for…»).
- **Componentes standalone con `OnPush`.** Cada sección de `features/` es independiente y solo pinta datos de
  `config/`, de `i18n/` o del servicio.
- **Signals.** `ProjectsService` usa `httpResource`, que expone la petición como signals (`isLoading`,
  `hasError`, `projects`). Los componentes derivan lo que necesitan con `computed`; por ejemplo, el filtro por
  lenguaje es un `signal` y la lista visible un `computed` sobre él.
- **Contenido en TypeScript, datos generados en JSON.** Lo que escribo yo está en `i18n/*.ts` (textos) y
  `config/*.ts` (datos): lo comprueba el compilador y no necesita ninguna petición. Lo que escribe el bot está en
  `public/data/projects.json`.

Un detalle que me encontré: en Angular 22, `resource.value()` lanza una excepción cuando la petición ha fallado.
Por eso el servicio lee el valor a través de `hasValue()`; si no, un JSON roto tiraría la página entera en vez de
mostrar `[FAILED]`.

### Traducciones

No uso ninguna librería de i18n. Con dos idiomas y textos que cambian poco, me basta un servicio pequeño.

- `i18n/es.ts` exporta el diccionario español y su tipo, `Translations = typeof es`. `en.ts` se declara como
  `Translations`, así que TypeScript exige las mismas claves en los dos.
- `I18n` (`i18n/i18n.service.ts`) guarda el idioma en un `signal` y expone `t = computed(() => diccionario)`.
  Los componentes hacen `protected readonly t = inject(I18n).t` y en la plantilla `{{ t().about.title }}`.
  Al cambiar `lang`, todas las plantillas que leen `t()` se repintan sin recargar.
- Un `effect` mantiene sincronizados `<html lang>`, `<title>` y la meta description, para los lectores de
  pantalla y las pestañas.
- Los textos que vienen de fuera (descripciones de proyectos) usan `LocalizedText`: un string o `{ es, en }`.
  `pickText()` elige el idioma actual y, si falta, cualquier otro.

Descarté `@angular/localize` (el i18n oficial) porque genera una web por idioma en el build y extrae los textos
de las plantillas a XLIFF. Es mejor para SEO, pero editar es mucho más pesado y cambiar de idioma implica cambiar
de URL.

### Piezas compartidas

| Pieza | Para qué |
| --- | --- |
| `app-man-section` | Disposición de página de manual: nombre de sección en la columna izquierda, contenido a la derecha |
| `app-status-tag` | Etiquetas al estilo systemd: `[ OK ]`, `[ WAIT ]`, `[FAILED]` y el asterisco de carga |
| `app-icon` | Iconos Lucide como SVG en línea; solo los que uso, sin librería |
| `app-lang-switch` | Selector `LANG= es en` de la cabecera |

### Estilos

- `src/styles/_tokens.scss`: variables CSS de color, tipografía, espaciado y duración. Todo lo demás las usa.
- `src/styles/_base.scss`: reset, `.wrap` (márgenes laterales), `.section-title`, `.lede`, `.note`, `.draft`,
  foco visible y `prefers-reduced-motion`.
- `src/styles/_breakpoints.scss`: mixin `bp.up(md)`. Angular lo encuentra gracias a
  `stylePreprocessorOptions.includePaths` en `angular.json`.
- Cada componente tiene su propio SCSS encapsulado y es mobile-first: estilos base para móvil y `@include bp.up()`
  para pantallas mayores.

Las fuentes (Instrument Sans y JetBrains Mono) las sirvo desde mi propio dominio con los paquetes
`@fontsource-variable/*`. Así evito las peticiones a Google Fonts, que en la UE dan problemas con el RGPD.

Ojo con Prettier en dos plantillas donde los espacios importan: la etiqueta `[ OK ]` de `status-tag.ts` y las
líneas del `tree` de `project-card.html`. Las dejé marcadas con `<!-- prettier-ignore -->`.

## El script de proyectos

`scripts/fetch-projects.mts`, en orden:

1. Lee y valida `projects.config.json`: un repo no puede estar en dos grupos y `primary` tiene que ser del grupo.
   Si la clave de un override no coincide con ningún repo, avisa.
2. Pide a la API REST mi usuario y todos mis repos públicos, de 100 en 100.
3. Si hay token, pide por GraphQL las imágenes social preview personalizadas. Si esto falla, avisa y sigue.
4. Quita forks y excluidos, une los grupos en una sola tarjeta y aplica los overrides.
5. Ordena: primero los de `order`, después por fecha de último push.
6. Compara con el JSON actual ignorando `generatedAt`. Si no hay cambios, no escribe nada y el workflow no hace
   commit.

Protecciones: cualquier error HTTP termina el script con código 1 sin tocar el archivo, y si la API devuelve 0
proyectos cuando antes había alguno, lo trato como error.

## Tests

`pnpm test --watch=false` ejecuta Vitest con jsdom. Solo pruebo lo que tiene lógica:

- el servicio de proyectos (éxito y error);
- la tarjeta (imagen, fallback, árbol de grupo, descripción vacía y traducida);
- la etiqueta de estado;
- el servicio de idioma y `pickText`;
- que la página tenga todas las secciones a las que enlaza el menú.
