# styxiner.github.io

Portfolio personal de **styxiner**, publicado en [styxiner.dev](https://styxiner.dev).

Es una web estática en español e inglés hecha con Angular 22 y alojada en GitHub Pages. No tiene backend ni base de datos.
La sección de proyectos se actualiza sola: un workflow de GitHub Actions consulta la API de GitHub una vez por semana,
genera `public/data/projects.json` y vuelve a desplegar la web si algo ha cambiado.

## Puesta en marcha

Requisitos: Node 24 y pnpm 11 (la versión exacta está en `packageManager` de `package.json`).

```bash
pnpm install
```

```bash
pnpm start
```

La web queda en http://localhost:4200.

| Comando | Qué hace |
| --- | --- |
| `pnpm start` | Servidor de desarrollo con recarga automática |
| `pnpm build` | Build de producción en `dist/styxiner.github.io/browser` |
| `pnpm test --watch=false` | Tests unitarios con Vitest, una sola pasada |
| `pnpm projects` | Regenera `public/data/projects.json` desde GitHub |
| `pnpm projects:dry` | Igual, pero imprime el resultado sin escribir nada |
| `pnpm check:scripts` | Comprueba los tipos del script de proyectos |

Para `pnpm projects` no hace falta token. Sin él la API permite 60 peticiones por hora y no se leen las imágenes
social preview. Con un token se leen también esas imágenes:

```bash
GITHUB_TOKEN=ghp_xxx pnpm projects
```

## Dónde está cada cosa

```
src/
  styles/                tokens de diseño, estilos base y breakpoints
  app/
    i18n/                textos de la web: es.ts y en.ts, uno por idioma
    config/              datos: redes, stack, certificaciones
    core/models/         tipos compartidos por Angular y por el script
    core/services/       ProjectsService, que lee projects.json
    shared/              piezas reutilizables: icono, sección de manual, etiqueta de estado
    layout/              cabecera y pie
    features/            una carpeta por sección de la página
public/
  data/projects.json     GENERADO por el workflow, no se edita a mano
  images/projects/       capturas opcionales de proyectos (<repo>.webp)
scripts/
  fetch-projects.mts     genera projects.json
  projects.config.json   control editorial: excluir, agrupar, destacar, renombrar
.github/workflows/       deploy.yml y update-projects.yml
docs/                    guías del proyecto
```

## Documentación

- [docs/CONTENIDO.md](docs/CONTENIDO.md): cómo cambiar textos, stack, certificaciones, proyectos e imágenes.
- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md): cómo está construido y por qué.
- [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md): GitHub Pages, workflows y qué hacer si algo falla.
- [docs/DISENO.md](docs/DISENO.md): el sistema visual (color, tipografía, interacción) y sus reglas.
