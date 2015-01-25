/**YEngine2D
 * author：YYC
 * date：2015-01-25
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    var TYPE = {
        ".eot": "embedded-opentype",
        ".ttf": "truetype",
        ".woff": "woff",
        ".svg": "svg"
    };

    YE.FontLoader = YYC.Class(YE.Entity, {
        Init: function () {
            this.base();

//            this.ye_container = YE.Hash.create();
//            this.ye_loadedUrl = YE.Collection.create();
        },
        Private: {
            _loadFont: function (urls, familyName) {
//                var doc = document, path = cc.path, TYPE = this.TYPE, fontStyle = cc.newElement("style");
//                fontStyle.type = "text/css";
//                doc.body.appendChild(fontStyle);

                var fontStyleEle = YE.$.newElement("style"),
                    fontStr = null,
                    path = YE.Tool.path,
                    type = null;

                document.body.appendChild(fontStyleEle);

                fontStr = "@font-face { font-family:" + familyName + "; src:";

                if (YE.Tool.judge.isArray(urls)) {
                    urls.forEach(function (url) {
                        type = path.extname(url).toLowerCase();
                        fontStr += "url('" + url + "') format('" + TYPE[type] + "'),";
                    });
                    fontStr = fontStr.replace(/,$/, ";");


//                    fontStr += (index == urls.length - 1) ? ";" : ",";
                }
                else if (YE.Tool.judge.isString(urls)) {
                    type = path.extname(urls).toLowerCase();
                    fontStr += "url('" + urls + "') format('" + TYPE[type] + "');";
                }


//                fontStr += "url('" + url + "') format('" + TYPE[type] + "');";

                fontStyleEle.textContent += fontStr + "};";

                YE.LoaderManager.getInstance().onResLoaded();

//                //<div style="font-family: PressStart;">.</div>
//                var preloadDiv = cc.newElement("div");
//                var _divStyle =  preloadDiv.style;
//                _divStyle.fontFamily = name;
//                preloadDiv.innerHTML = ".";
//                _divStyle.position = "absolute";
//                _divStyle.left = "-100px";
//                _divStyle.top = "-100px";
//                doc.body.appendChild(preloadDiv);
            }
        },
        Public: {
            load: function (urls, id) {
//                var key = id ? id : url;
//
//                if (this.ye_loadedUrl.hasChild(url)) {
//                    YE.LoaderManager.getInstance().onResLoaded();
//                    return this.get(key);
//                }
//
//                this.ye_loadedUrl.addChild(url);
//
//                this.ye_P_load(url, key);

//                var type = null,
//                    name = null;


                //todo 待是否已加载过该数据

//                if (this.ye_loadedUrl.hasChild(urls)) {
//                    YE.LoaderManager.getInstance().onResLoaded();
////                    return this.get(key);
//                    return;
//                }

                this._loadFont(urls, id);

//                if(YE.Tool.judge.isArray(urls)){
//                    this._loadFont(urls);
//                }
//                else if(YE.Tool.judge.isString(urls){
//                    type = YE.Tool.path.extname(url);
//                    name = YE.Tool.path.basename(url, type);
//
//                    this._loadFont(url, name, type);
//                }

//                type = YE.Tool.path.extname(url);
//                name = YE.Tool.path.basename(url, type);
//
//                this._loadFont(url, name, type);
//
//                this.ye_loadedUrl.addChild(url);
            }
        },
        Static: {
            _instance: null,

            getInstance: function () {
                if (this._instance === null) {
                    this._instance = new this();
                }
                return this._instance;
            }
        }
    });
}());


