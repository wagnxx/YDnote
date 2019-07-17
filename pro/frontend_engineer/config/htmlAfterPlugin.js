const pluginName = "HtmlAfterPlugin";

const assetsHelp = function(data) {
  let js = [];
  let css = [];
  const dir = {
    js: item => `<script class="lazyload-js" src="${item}"></script>`,
    css: item => `<link rel="stylesheet" href="${item}" />`
  };
  for (let jsitem of data.js) {
    js.push(dir.js(jsitem));
  }
  for (let cssitem of data.css) {
    css.push(dir.js(cssitem));
  }
  return {
    js,
    css
  };
};

class HtmlAfterPlugin {
  constructor(options) {
    this.isHack = options.isHack;
  }
  apply(complier) {
    complier.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
        pluginName,
        htmlPluginData => {
          // const D
          // htmlPluginData.assets.chunks
          let _html = htmlPluginData.html;
          const result = assetsHelp(htmlPluginData.assets);
          _html = _html.replace(/@components/g, "../../../components");
          _html = _html.replace("<!--injectjs-->", result.js.join(""));
          _html = _html.replace("<!--injectcss-->", result.css.join(""));

          htmlPluginData.html = _html;
        }
      );
    });
  }
}

module.exports = HtmlAfterPlugin;
