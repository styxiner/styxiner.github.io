# Editar el contenido

Todo lo que se lee en la web sale de unos pocos archivos. Ningún componente contiene textos, así que para
cambiar algo nunca tengo que tocar las plantillas.

| Quiero cambiar… | Archivo |
| --- | --- |
| Cualquier texto visible (presentación, sobre mí, títulos, botones…) | `src/app/i18n/es.ts` y `src/app/i18n/en.ts` |
| Nombre, redes, correo, flags de la sinopsis | `src/app/config/site.config.ts` |
| Tecnologías del stack | `src/app/config/skills.config.ts` |
| Certificaciones (datos) | `src/app/config/certifications.config.ts` |
| Qué proyectos salen y cómo se presentan | `scripts/projects.config.json` |
| Capturas de proyectos | `public/images/projects/` |
| Color de acento | `src/styles/_tokens.scss` |

Después de editar, `pnpm start` para verlo en local. Al hacer push a `main` se publica solo.

## Idiomas

La web está en español e inglés. El botón `LANG= es en` de la cabecera (dentro del menú en móvil) cambia todos
los textos al momento, sin recargar. La elección se guarda en el navegador; en la primera visita se usa el idioma
del navegador y, si no es ninguno de los dos, español.

Cada idioma es un archivo en `src/app/i18n/`:

- `es.ts` es la referencia: su estructura define qué textos existen.
- `en.ts` tiene que tener **exactamente las mismas claves**. Si añado un texto en `es.ts` y se me olvida en
  `en.ts`, el build falla y dice cuál falta. Por eso son `.ts` y no `.json`: un JSON no avisaría.

Para cambiar un texto lo busco en los dos archivos:

```ts
// es.ts
about: {
  title: 'Sobre mí',
  ...
// en.ts
about: {
  title: 'About me',
```

Lo que no se traduce (nombres de tecnologías, `[ OK ]`, comandos como `$ whoami`, fechas ISO) no está en los
diccionarios.

### Añadir otro idioma

1. Copiar `en.ts` como `fr.ts`, cambiar `export const en` por `export const fr` y traducir.
2. En `src/app/core/models/localized.model.ts`, añadir `'fr'` a `languages`.
3. En `src/app/i18n/i18n.service.ts`, añadir `fr` a `dictionaries`.
4. En `src/app/layout/header/lang-switch/lang-switch.ts`, añadir su nombre: `fr: 'Français'`.

Después del paso 2, el compilador marca cada sitio donde falta el idioma nuevo.

### Límite: buscadores y redes sociales

El cambio de idioma ocurre en el navegador. Google y las vistas previas al compartir el enlace (Open Graph) ven
la versión inicial en español de `src/index.html`. Si algún día quiero que `/en/` se indexe por separado, tendré
que generar una copia de la web por idioma en el build. Con GitHub Pages se puede, pero de momento no lo he hecho.

## Correo de contacto

`email` en `site.config.ts` está a `null` y por eso no aparece. Para mostrar una fila `mailto:` en Contacto:

```ts
email: 'mi@correo.com',
```

## Stack

Cada grupo es una línea con un flag (`--frontend`) y sus tecnologías, en `skills.config.ts`. El título del grupo,
que leen los lectores de pantalla, está traducido en `skills.groups.<flag>` de cada diccionario. Si añado un grupo
nuevo, su flag tiene que estar en los dos diccionarios o el build falla.

```ts
{ flag: 'security', skills: [{ name: 'Burp Suite' }, { name: 'Wireshark' }] },
```

Un grupo vacío muestra un hueco discontinuo «añadir aquí». No pongo niveles de dominio a propósito.

## Certificaciones

Los datos están en `certifications.config.ts` y la descripción, traducida, en `certs.descriptions.<id>` de cada
diccionario. CFHI está en estado `'in-progress'` y se muestra como `[ WAIT ] en preparación`. Cuando la consiga:

```ts
{
  id: 'cfhi',
  name: 'CFHI',
  issuer: 'Organización emisora',
  status: 'completed',
  earnedOn: '2027-01-15',
  badgeUrl: 'images/certs/cfhi.svg',
  verifyUrl: 'https://…',
},
```

La fecha y el enlace de verificación solo se muestran con `status: 'completed'`. Para añadir otra certificación:
otro objeto con un `id` nuevo y su descripción en `es.ts` y `en.ts`.

## Proyectos

Los proyectos **no se escriben a mano**: el script lee mis repositorios públicos. Cómo se presentan lo decido en
`scripts/projects.config.json`:

```jsonc
{
  "user": "styxiner",
  "includeForks": false,              // los forks no salen
  "exclude": ["styxiner", "styxiner.github.io"],
  "order": ["complyx"],               // estos primero y en este orden; el resto por último push
  "groups": [
    {
      "slug": "complyx",              // id de la tarjeta (y nombre de su imagen)
      "title": "Complyx",
      "repos": ["complyx-agent", "complyx-server", "complyx-api", "complyx-ui", "complyx"],
      "primary": "complyx-server",    // de aquí salen el lenguaje y, si falta, la descripción
      "repoUrl": "https://github.com/styxiner/complyx",
      "description": "…"
    }
  ],
  "overrides": {
    "complyx": { "featured": true },
    "odoo_hardware_manager": { "title": "Odoo Hardware Manager" }
  }
}
```

Un override acepta `title`, `description`, `image`, `liveUrl`, `topics` y `featured`. Las claves son el nombre
exacto del repo (distingue mayúsculas) o el `slug` del grupo; si una clave no coincide con nada, el script avisa.
Una tarjeta con `featured: true` ocupa dos columnas y lleva `[ PIN ]`.

### Descripciones en varios idiomas

La descripción que viene de GitHub está en un solo idioma y se muestra igual en los dos. Para traducirla pongo un
objeto en lugar de un texto, en un override o en un grupo:

```json
"EchoBot": {
  "description": {
    "es": "Echobot es un programa asistente…",
    "en": "EchoBot is an assistant…"
  }
}
```

Si falta un idioma, se usa el otro. Complyx, Odoo Hardware Manager, ShellText y EchoBot ya están traducidos.

### Regenerar los proyectos

Después de cambiar la configuración tengo tres opciones:

- **En local:** `pnpm projects` regenera `public/data/projects.json`; luego hago commit de los dos archivos.
  `pnpm projects:dry` muestra el resultado sin escribir nada.
- **Desde GitHub:** Actions → **Update projects** → **Run workflow**. Hace lo mismo que la ejecución de los
  lunes, con commit y despliegue si hay cambios.
- **Con la CLI de GitHub:** `gh workflow run update-projects.yml`.

### Topics

Ninguno de mis repos tiene topics todavía. Si los añado en GitHub (el engranaje junto a «About» en cada repo),
aparecerán en la tarjeta la próxima vez que se ejecute el script. También puedo forzarlos con `topics` en un
override.

## Imágenes de proyectos

Cada tarjeta usa la primera imagen que exista:

1. Un archivo en `public/images/projects/<slug>.webp` (también vale `.png`, `.jpg` o `.svg`).
2. La imagen social preview del repo, si la he personalizado en GitHub (Settings → Social preview).
   Solo se lee con token: en el workflow funciona, en local sin token no.
3. El campo `image` del override.
4. Ninguna: la tarjeta dibuja `$ ls -ld repo/` y la extensión del lenguaje.

Si una imagen falla al cargar, la tarjeta vuelve sola al dibujo del paso 4. Tamaño recomendado: 1280×640.

## Color de acento

En `src/styles/_tokens.scss` cambio `--accent` y `--accent-ink` (el color del texto sobre el acento). Estos son
los que probé:

| Acento | `--accent` | `--accent-ink` |
| --- | --- | --- |
| cian (actual) | `#5fd4e4` | `#061317` |
| verde | `#79dd8f` | `#07160b` |
| violeta | `#a99bff` | `#0e0a22` |
| ámbar | `#f0b54a` | `#1a1203` |

Si cambio el acento, también tengo que cambiar `theme-color` en `src/index.html` y el color del cursor en
`public/favicon.svg` para que coincidan.
