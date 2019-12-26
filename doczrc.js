export default {
  port: 6006,
  files: './docs/**/*.{md,markdown,mdx}',
  menu: [
    'Home',
    'Downshift',
    {name: 'Hooks', menu: ['useSelect', 'useCombobox']},
    'Tests',
  ],
}
