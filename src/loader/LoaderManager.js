/**YEngine2D
 * author：YYC
 * date：2014-02-24
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    var _instance = null;

    YE.LoaderManager = YYC.Class(YE.Entity, {
        Init: function () {
            this.base();
        },
        Private: {
            ye_resCount: 0,
            ye_currentLoadedCount: 0,

            ye_isFinishLoad: function () {
                var self = this;

                if (this.getCurrentLoadedCount() === this.getResourceCount()) {
                    if (this.onload) {
                        this.onload();
                    }
                    else {
                        YE.assert(false, "没有定义onload");
                    }
                }
                else {
                    if (this.onloading) {
                        setTimeout(function () {
                            self.onloading(self.getCurrentLoadedCount(), self.getResourceCount())
                        }, 16);
                    }
                    setTimeout(function () {
                        self.ye_isFinishLoad.call(self);
                    }, 16);
                }
            }
        },
        Public: {
            getResourceCount: function () {
                return this.ye_resCount;
            },
            getCurrentLoadedCount: function () {
                return this.ye_currentLoadedCount;
            },
            preload: function (resources) {
                var self = this;

                resources.forEach(function (res) {
                    switch (res.type) {
                        case "image":
                            YE.ImgLoader.getInstance().load(res.url, res.id);
                            self.ye_resCount += 1;
                            break;
                        case "json":
                            YE.JsonLoader.getInstance().load(res.url, res.id);
                            self.ye_resCount += 1;
                            break;
                        case "sound":
                            YE.SoundLoader.getInstance().load(res.url, res.id);
                            self.ye_resCount += 1;
                            break;
                        default:
                            YE.error(true, "type错误");
                            break;
                    }
                });

                this.ye_isFinishLoad();
            },
            reset: function () {
                this.ye_resCount = 0;
                this.ye_currentLoadedCount = 0;
            },
            onResLoaded: function () {
                this.ye_currentLoadedCount += 1;
            },
            onResError: function (path, err) {
                YE.log("加载" + path + "资源失败");
                if(err){
                    YE.log(err);
                }
            },
            //*钩子
            onloading: undefined,
            onload: undefined
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