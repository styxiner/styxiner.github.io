// Spanish is the reference language: en.ts must have exactly the same keys,
// and the build fails if one is missing. Add a language by copying this file
// (see docs/CONTENIDO.md).

export const es = {
  meta: {
    title: 'styxiner · security analyst and developer',
    description:
      'Portfolio de styxiner: analista de ciberseguridad y desarrollador. Proyectos, stack, certificaciones y contacto.',
  },

  nav: {
    skipLink: 'Saltar al contenido',
    sections: 'Secciones',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    language: 'Idioma',
    online: 'online',
    items: {
      about: { label: 'about', hint: 'sobre mí' },
      stack: { label: 'stack', hint: 'tecnologías' },
      projects: { label: 'proyectos', hint: 'repos' },
      certs: { label: 'certs', hint: 'certificaciones' },
      contact: { label: 'contacto', hint: 'redes' },
    },
  },

  hero: {
    manual: 'Manual del desarrollador',
    role: 'Security analyst and developer.',
    intro:
      'Practicante de ciberseguridad y desarrollador. Construyo herramientas, interfaces y servicios, y me interesa entender cómo se protegen.',
    synopsisLabel: 'SINOPSIS',
    synopsisArgument: 'idea',
    philosophyLabel: 'FILOSOFÍA',
    philosophy: 'Entender cómo funciona algo antes de confiar en ello.',
    cta: 'ver proyectos',
    activity: 'Actividad reciente en GitHub',
    loadingActivity: 'leyendo projects.json…',
  },

  about: {
    label: 'Descripción',
    title: 'Sobre mí',
    paragraphs: [
      {
        title: 'Quién soy.',
        text: 'Soy analista de ciberseguridad y desarrollador de software, con especial interés en la automatización y la protección de sistemas. Me motiva encontrar soluciones a problemas reales, mejorar procesos y seguir aprendiendo en un sector en constante evolución.',
      },
      {
        title: 'Trayectoria.',
        text: 'Desde marzo de 2024 trabajo en el ámbito de la ciberseguridad, participando en tareas de automatización, monitorización, detección y respuesta ante incidentes, gestión de vulnerabilidades, auditorías y administración de identidades. Actualmente trabajo en Complyx mientras continúo ampliando mi formación y conocimientos.',
      },
      {
        title: 'Orientación.',
        text: 'Mi enfoque combina la ciberseguridad y el desarrollo de software, buscando automatizar procesos, mejorar la eficiencia operativa y fortalecer la seguridad de los sistemas. Me interesa especialmente la detección proactiva de amenazas, la gestión de riesgos y el desarrollo de herramientas que aporten valor a los equipos de seguridad.',
      },
    ],
    facts: [
      { key: 'rol', value: 'Security analyst and developer' },
      { key: 'ubicación', value: 'España' },
      { key: 'enfoque', value: 'Ciberseguridad, desarrollo de software' },
      { key: 'ahora', value: 'Preparando CFHI, trabajando en Complyx' },
      {
        key: 'intereses',
        value:
          'No sólo me gusta la ciberseguridad y el desarrollo. También me gusta tocar el piano y practicar artes marciales!',
      },
    ],
  },

  skills: {
    label: 'Dependencias',
    title: 'Tecnologías y herramientas',
    empty: 'añadir en skills.config.ts',
    groups: {
      languages: 'Lenguajes',
      frontend: 'Frontend',
      backend: 'Backend',
      security: 'Ciberseguridad',
      tools: 'Herramientas',
      os: 'Sistemas operativos',
    },
  },

  projects: {
    label: 'Véase también',
    title: 'Proyectos',
    synced: 'sincronizado desde github.com/styxiner',
    filter: 'Filtrar por lenguaje',
    loading: 'cargando data/projects.json…',
    error: 'No se pudo leer data/projects.json. Los repositorios siguen en',
    empty: '# no hay proyectos públicos que mostrar todavía',
    featured: 'destacado',
    noDescription: '# sin descripción en GitHub',
    repositories: 'repositorios',
    preview: 'Vista previa de',
    archived: 'archivado',
    demo: 'demo',
  },

  certs: {
    label: 'Certificaciones',
    title: 'Certificaciones',
    completed: 'obtenida',
    inProgress: 'en preparación',
    issuer: 'emisor',
    earnedOn: 'obtenida',
    verification: 'verificación',
    verify: 'verificar',
    pending: 'por completar',
    noBadge: 'sin insignia',
    badge: 'Insignia',
    next: 'siguiente certificación',
    // One entry per certification id in certifications.config.ts.
    descriptions: {
      cfhi: 'Estudiando para la certificación.',
    },
  },

  contact: {
    label: 'Autor',
    title: 'hablemos',
    lede: 'Si quieres comentar un proyecto, una idea o algo de seguridad, escríbeme por cualquiera de estos canales.',
    open: 'abrir',
    write: 'escribir',
    email: 'Correo',
  },

};

export type Translations = typeof es;
