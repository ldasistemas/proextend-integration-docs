// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ProExtend Integration API',
  tagline: 'Documentação oficial para integração com a API ProExtend',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://ldasistemas.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',


  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ldasistemas', // Usually your GitHub org/user name.
  projectName: 'proextend-integration-docs', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // Serve docs at the site's root
          sidebarPath: './sidebars.js',
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        language: ["en", "pt"],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
        searchBarShortcut: true,
        searchBarShortcutHint: true,
      }),
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
        rel: 'stylesheet',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'Documentação técnica completa para integração de sistemas de gestão acadêmica com o ProExtend - plataforma especializada em gestão de projetos, eventos e cursos de extensão universitária. Inclui especificações de API, autenticação, sincronização de dados e SSO.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'ProExtend, API, Integração, Documentação, REST API, ERP Acadêmico, Gestão Acadêmica, Extensão Universitária, Projetos de Extensão, Cursos de Extensão, Eventos Acadêmicos, Gestão de Projetos, SSO, Single Sign-On, Sincronização de Dados, Sistema de Ensino, Certificação Acadêmica',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'ProExtend',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'ProExtend Integration API',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:title',
        content: 'ProExtend Integration API - Documentação Oficial',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content: 'Documentação técnica para integração com o ProExtend - plataforma especializada em gestão de projetos, eventos e cursos de extensão universitária.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:url',
        content: 'https://ldasistemas.github.io/proextend-integration-docs/',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image',
        content: 'https://ldasistemas.github.io/proextend-integration-docs/img/logo.svg',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:locale',
        content: 'pt_BR',
      },
    },
    // Twitter Card Meta Tags
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'ProExtend Integration API - Documentação Oficial',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:description',
        content: 'Documentação técnica para integração com o ProExtend - plataforma especializada em gestão de projetos, eventos e cursos de extensão universitária.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:image',
        content: 'https://ldasistemas.github.io/proextend-integration-docs/img/logo.svg',
      },
    },
    // Additional SEO Tags
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#0980D8',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: 'https://ldasistemas.github.io/proextend-integration-docs/',
      },
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo.svg',
      metadata: [
        {
          name: 'google-site-verification',
          content: 'your-google-verification-code', // Substituir quando configurar Google Search Console
        },
      ],
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: 'Integração ProExtend API',
        logo: {
          alt: 'ProExtend Logo',
          src: 'img/logo.svg',
          height: 24,
        },
        items: [
          {
            href: 'https://proextend.com.br/',
            label: 'ProExtend',
            position: 'right',
            className: 'header-proextend-link',
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'javascript', 'typescript'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
    }),
};

export default config;
