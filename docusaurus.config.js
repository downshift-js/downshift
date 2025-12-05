// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Downshift',
  url: 'https://downshift-js.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'downshift-js', // Usually your GitHub org/user name.
  projectName: 'downshift', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        pages: {
          path: 'docusaurus/pages',
          include: ['**/*.{js,jsx,tsx}'],
        },
      }),
    ],
  ],
  plugins: [
    // @ts-ignore
    () => ({
      name: 'configure-webpack-target',
      configureWebpack(webpackConfig, isServer) {
        webpackConfig.target = isServer ? 'node' : 'web'
      },
    }),
    require.resolve('./docusaurus/plugins/webpack5polyfills.js'),
  ],
}

module.exports = config
