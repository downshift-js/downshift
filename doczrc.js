export default {
  port: 6006,
  src: './docs/',
  menu: [
    'Home',
    'Tests',
  ],
  themeConfig: {
    initialColorMode: 'light',
    showDarkModeSwitch: false,
    breakpoints: ['920px'],
    logo: {
      src: '/public/logo/downshift.svg',
      margin: 'auto',
      width: 128,
    },
    styles: {
      Container: {
        width: ['100%', '75%'],
      },
      inlineCode: {
        bg: 'blockquote.bg',
      },
    },
  },
}
