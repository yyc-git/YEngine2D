/**YEngine2D
 * author：YYC
 * date：2014-05-17
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    var _instance = null;

    YE.SoundLoader = YYC.Class(YE.Loader, {
        Init: function () {
            this.base();

            this.ye__resArr = YE.Collection.create();
        },
        Private: {
            ye__resArr: null
        },
        Protected: {
            ye_P_load: function (url, key) {
                var self = this;

                YE.YSound.create({
                    urlArr: urlArr,
                    onLoad: function (sound) {
                    YE.LoaderManager.getInstance().onResLoaded();
                        self.ye_P_container.appendChild(key, sound);

                    },
                    onError: function (msg) {
                        YE.LoaderManager.getInstance().onResError(urlArr, "错误原因：" + msg);
                    }
                });
            }
        },
        Public: {
            add: function (resArr) {
                this.ye__resArr.addChilds(resArr);
            },
            load: function () {
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
                var self = this;

                if (this.ye__resArr.getCount() === 0) {
                    return;
                }

                var urlArr = this.ye__resArr.getChildAt(0);
                this.ye__resArr.removeChildAt(0);

                if (this.ye_loadedUrl.hasChild(urlArr.id)) {
                    YE.LoaderManager.getInstance().onResLoaded();
//                    return this.get(key);
                    this.load();
                    return;
                }


                YE.SoundManager.getInstance().createSound(urlArr.url, function () {
                    YE.LoaderManager.getInstance().onResLoaded();
                    self.ye_P_container.appendChild(urlArr.id, this);
                    self.load();
                }, function (code) {
                    YE.LoaderManager.getInstance().onResError(urlArr, "错误原因：code" + code);
                });
            }
        },
        Static: {
            getInstance: function () {
                if (_instance === null) {
                    _instance = new this();
                }
                return _instance;
            }
        }
    });
}());