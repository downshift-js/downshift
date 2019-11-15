

 const files = /(.md|.mdx|.markdown)$/i;

 export default {
  port: 6006,
  files: `./docs/**/${files}`,
  menu: ['Home', {name: 'useSelect', menu: ['Usage', 'UI Libraries']}, 'Tests'],
}
