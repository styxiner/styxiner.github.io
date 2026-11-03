# Despliegue en GitHub Pages

## Configuración del repositorio (una sola vez)

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   Antes tenía configurado `angular-cli-ghpages`, que publica en una rama `gh-pages`. Ahora publica directamente
   el workflow `deploy.yml`. Cuando compruebe que el nuevo despliegue funciona, puedo borrar la rama `gh-pages`
   si existe.
2. **Settings → Pages → Custom domain: `styxiner.dev`** y marcar **Enforce HTTPS**. `public/CNAME` ya contiene el
   dominio y se copia al build.
3. **Settings → Actions → General → Workflow permissions:** basta con «Read repository contents». Cada workflow
   pide los permisos que necesita (`contents: write` solo el job que hace commit del JSON).
4. **Settings → Environments → github-pages:** GitHub lo crea con el primer despliegue. Si restrinjo las ramas,
   tengo que permitir `main`.

## Workflows

### `deploy.yml`

Se ejecuta con cada push a `main`, a mano (Actions → Deploy → Run workflow) o llamado desde `update-projects.yml`.

`pnpm install` → `check:scripts` → tests → `build` → sube `dist/styxiner.github.io/browser` → publica.
Si un test falla, no se publica nada y la versión anterior sigue en línea.

### `update-projects.yml`

Se ejecuta los lunes a las 00:00 UTC y también a mano (Actions → Update projects → Run workflow). Usa el
`GITHUB_TOKEN` del propio workflow, así que no he tenido que crear ningún secreto.

- Si el JSON no cambia: termina sin commit y sin desplegar.
- Si cambia: hace commit como `github-actions[bot]` y llama a `deploy.yml`.
- Si la API falla: el job falla (GitHub me avisa por correo) y la web sigue con los datos anteriores.

Llama a `deploy.yml` directamente porque un push hecho con `GITHUB_TOKEN` no dispara otros workflows: el commit
del bot no activaría el despliegue por sí solo.

El botón **Run workflow** solo aparece cuando el archivo del workflow está en la rama principal.

## Cosas a tener en cuenta

- **GitHub desactiva los workflows programados** de un repo público tras 60 días sin actividad. Si un día dejan de
  ejecutarse, toca entrar en Actions → Update projects y pulsar «Enable workflow».
- **Archivos que empiezan por punto.** `public/.well-known/webfinger` (Auth0) y `public/.nojekyll` se copian al
  build. `.nojekyll` ya no hace falta con el despliegue por Actions, pero no molesta.
- **Base href.** Con dominio propio la web vive en la raíz, así que `<base href="/">` es correcto. Si algún día la
  publicara en `styxiner.github.io/otro-repo/`, tendría que hacer el build con `--base-href /otro-repo/`.
- **Caché.** Los JS y CSS llevan un hash en el nombre (`outputHashing: all`), así que cada despliegue los renueva.
  `projects.json` no lleva hash: GitHub Pages lo cachea unos 10 minutos.

## Probar el build de producción en local

```bash
pnpm build
```

```bash
npx http-server dist/styxiner.github.io/browser -p 8080
```
