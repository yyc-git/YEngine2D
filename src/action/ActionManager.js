/**YEngine2D
 * author：YYC
 * date：2014-01-11
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    YE.ActionManager = YYC.Class(YE.CollectionManager, {
        Init: function () {
            this.base();
        },
        Public: {
            getChildByTag: function (tag) {
                return YE.Tool.collection.getChildByTag(this.ye_P_childs, tag);
            },
            getChildsByTag: function (tag) {
                return YE.Tool.collection.getChildsByTag(this.ye_P_childs, tag);
            },
            removeChildByTag: function (tag, isReset) {
                YE.Tool.collection.removeChildByTag(this.ye_P_childs, tag, function (child) {
                    child.onExit();
                    if (isReset) {
                        child.reset();
                    }
                });
            },
            removeChildsByTag: function (tag, isReset) {
                YE.Tool.collection.removeChildsByTag(this.ye_P_childs, tag, function (child) {
                    child.onExit();
                    if (isReset) {
                        child.reset();
                    }
                });
            }
        },
        Static: {
            create: function () {
                return new this();
            }
        }
    });
}());