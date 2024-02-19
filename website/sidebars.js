module.exports = {
  sidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['overview', 'installation', 'windows-installation', 'usage'],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      items: ['tutorials/hotel-search'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Couchbase Lite v3.0 Docs',
          href: 'https://docs.couchbase.com/couchbase-lite/3.0/index.html',
        },
        {
          type: 'link',
          label: 'N1QL Query Strings',
          href:
            'https://docs.couchbase.com/couchbase-lite/3.0/c/query-n1ql-mobile.html#introduction',
        },
      ],
    },
  ],
};
