({
    preserveLicenseComments: false,
    optimize: "uglify2",
    uglify2: {
        output: {
            beautify: false,
            comments: false
        },
        compress: {
            drop_console: true
        }
    },
    paths: {
        jquery:         "src/static/scripts/js/vendors/jquery/dist/jquery.js",
        jsx:            "src/static/scripts/js/vendors/jsx-requirejs-plugin/js/jsx",
        JSXTransformer: "src/static/scripts/js/vendors/jsx-requirejs-plugin/js/JSXTransformer",
        text:           "src/static/scripts/js/vendors/requirejs-text/text",
        react:          "src/static/scripts/js/vendors/react/react-with-addons.min"
    },
    jsx: {
        fileExtension: ".jsx"
    },
    stubModules: ["jsx", "JSXTransformer", "text"]
})
