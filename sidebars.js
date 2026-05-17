// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introdução',
      customProps: {
        icon: 'lucide:file-text',
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
        icon: 'lucide:lock',
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
        icon: 'lucide:arrow-right-left',
      },
      items: [
        'fluxo-de-sincronizacao',
        'tratamento-de-erros',
        'remocao',
      ],
    },

    {
      type: 'doc',
      id: 'relatorios',
      label: 'Relatórios e Consultas',
      customProps: {
        icon: 'lucide:bar-chart-2',
      },
    },

    {
      type: 'doc',
      id: 'logs-de-integracoes',
      label: 'Logs de Integrações',
      customProps: {
        icon: 'lucide:activity',
      },
    },

  ],
};

export default sidebars;
