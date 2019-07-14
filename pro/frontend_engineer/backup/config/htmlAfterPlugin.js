const pluginName = "HtmlAfterPlugin";

const hackCode = `
(function(){
  var check = document.createElement('script');
  if(!('noModule' in check) && 'onbeforeload' in check){
      var support = false;
      document.addEventListener('beforelod',function(e){
          if(e.target===check){
              support=true;
          }else if(!e.target.hasAttribute('nomodule') || !support){
              return;
          }
          e.preventDefault();
      },true);

      check.type='module';
      check.src='.';
      document.appendChild(check);
      check.revove();
  }

}());
`;

class HtmlAfterPlugin {
  constructor(options) {
    this.isHack = options.isHack;
  }
  apply(complier) {
    complier.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
        pluginName,
        (htmlPluginData, cb) => {
          // if (this.isHack) {
          //   htmlPluginData.body.push({
          //     tagName: "script",
          //     closeTag: true,
          //     innerHTML: hackCode
          //   });
          // }
          htmlPluginData.body.forEach(tag => {
            if (tag.tagName == "script") {
              if (/.bundle./.test(tag.attributes.src)) {
                delete tag.attributes.type;
                tag.attributes.nomodule = "";
              } else {
                tag.attributes.type = "module";
              }
            }
          });

          cb(null, htmlPluginData);
        }
      );
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(
        pluginName,
        htmlPluginData => {
          htmlPluginData.html = htmlPluginData.html.replace(
            /\snomodule=""/g,
            " nomodule"
          );
        }
      );
    });
  }
}

module.exports = HtmlAfterPlugin;
