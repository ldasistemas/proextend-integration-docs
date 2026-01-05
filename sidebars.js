// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introdução',
      customProps: {
        icon: 'lucide:book-open',
      },
    },

    {
      type: 'doc',
      id: 'visao-geral',
      label: 'Visão Geral',
      customProps: {
        icon: 'lucide:eye',
      },
    },

    {
      type: 'category',
      label: 'Conceitos',
      collapsible: true,
      collapsed: false,
      customProps: {
        icon: 'lucide:lightbulb',
      },
      items: [
        'conceitos-fundamentais',
        'identificadores-e-codes',
      ],
    },

    {
      type: 'category',
      label: 'Autenticação e Segurança',
      collapsible: true,
      collapsed: false,
      customProps: {
        icon: 'lucide:shield-check',
      },
      items: [
        'autenticacao',
        'sso',
      ],
    },

    {
      type: 'category',
      label: 'Sincronização',
      collapsible: true,
      collapsed: false,
      customProps: {
        icon: 'lucide:refresh-cw',
      },
      items: [
        'fluxo-de-sincronizacao',
      ],
    },

    {
      type: 'category',
      label: 'Recursos',
      collapsible: true,
      collapsed: true,
      customProps: {
        icon: 'lucide:wrench',
      },
      items: [
        'postman',
      ],
    },
  ],
};

export default sidebars;
