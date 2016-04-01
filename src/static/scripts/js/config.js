requirejs.config({
  baseUrl: "/scripts/js",
  paths: {
    jquery: "/vendors/jquery/dist/jquery",
    jsx: "/vendors/jsx-requirejs-plugin/js/jsx",
    JSXTransformer: "/vendors/jsx-requirejs-plugin/js/JSXTransformer",
    react: "/vendors/react/react-with-addons",
    'react-dom': "/vendors/react/react-dom",
    text: "/vendors/requirejs-text/text"
  },
  jsx: {
    fileExtension: ".jsx"
  }
})
