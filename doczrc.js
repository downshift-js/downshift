export default {
  port: 6006,
  src: './docs/',
  menu: [
    'Home',
    'Downshift',
    {name: 'Hooks', menu: ['useCombobox', 'useMultipleSelection', 'useSelect']},
    'Tests',
  ],
  themeConfig: {
    initialColorMode: 'light',
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
        fontWeight: 'bold'
      }
    },
  },
}
