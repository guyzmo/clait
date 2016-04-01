requirejs(["jquery", "react-dom", "react", "jsx!main"], function($, ReactDOM, React, Main) {
  $(function() {
    console.log(Main)
    //  ReactDOM.render(React.createElement(Main.Demo, null), document.querySelector('#app'));
    ReactDOM.render(React.createElement(Main, null), document.querySelector('#helloworld'))
  })
})
