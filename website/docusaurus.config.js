module.exports = {
  title: 'Couchbase Lite',
  tagline: 'Offline-enabled mobile apps powered by Couchbase Lite',
  url: 'https://ionic.io',
  trailingSlash: false,
  baseUrl: '/docs/couchbase-lite/',
  baseUrlIssueBanner: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  organizationName: 'ionic-team',
  projectName: 'enterprise-couchbase-lite',
  titleDelimiter: '-',
  themeConfig: {
    prism: {
      additionalLanguages: ['java', 'groovy'],
    },
    navbar: {
      title: 'Couchbase Lite',
      logo: {
        alt: 'Couchbase Lite Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          label: 'Platform',
          position: 'right',
          items: [
            {
              href: 'https://capacitorjs.com/docs',
              label: 'Capacitor',
              target: '_blank',
              rel: null,
              className: 'link--outbound',
            },
            {
              href: 'https://ionicframework.com/docs',
              label: 'Framework',
              target: '_blank',
              rel: null,
              className: 'link--outbound',
            },
            {
              href: 'https://ionic.io/docs/appflow',
              label: 'Appflow',
              target: null,
              rel: null,
            },
            {
              to: 'https://ionic.io/docs/identity-vault',
              label: 'Identity Vault',
            },
            {
              href: 'https://ionic.io/docs/auth-connect',
              label: 'Auth Connect',
              target: null,
              rel: null,
            },
            {
              href: 'https://ionic.io/docs/secure-storage',
              label: 'Secure Storage',
              target: null,
              rel: null,
            },
            {
              href: 'https://ionic.io/docs/premier-plugins',
              label: 'Premier Plugins',
              target: null,
              rel: null,
            },
          ],
        },
      ],
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    tagManager: {
      trackingID: 'GTM-TKMGCBC',
    },
    prism: {
      theme: { plain: {}, styles: [] },
      additionalLanguages: ['shell-session'],
    },
  },
  plugins: [
    '@ionic-internal/docusaurus-plugin-tag-manager',
    'docusaurus-plugin-sass',
  ],
  themes: ['@ionic-internal/docusaurus-theme'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        pages: false,
        theme: {
          customCss: ['prismjs/themes/prism-tomorrow.css'],
        },
      },
    ],
  ],
};
