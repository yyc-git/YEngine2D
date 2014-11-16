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
        },
        Protected: {
            ye_P_load: function (urlArr, key) {
                var self = this;

                YE.YSoundEngine.create({
                    urlArr: urlArr,
                    onload: function (sound) {
                        YE.LoaderManager.getInstance().onResLoaded();
                        self.ye_P_container.appendChild(key, sound);

                    },
                    onerror: function (msg) {
                        YE.LoaderManager.getInstance().onResError(urlArr, "错误原因：" + msg);
                    }
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