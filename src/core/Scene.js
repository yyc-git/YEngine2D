/**YEngine2D 场景类
 * author：YYC
 * date：2013-12-24
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
(function () {
    YE.Scene = YYC.AClass(YE.NodeContainer, {
        Protected: {
            ye_P_run: function () {
                this.iterate("run");
            }
        },
        Public: {
            addChilds: function (childs, zOrder, tag) {
                this.base(childs, zOrder, tag);

                if (zOrder) {
                    childs.map("setZIndex", zOrder);
                }
            },
            addChild: function (child, zOrder, tag) {
                this.base(child, zOrder, tag);

                if (zOrder) {
                    child.setZIndex(zOrder);
                }
            },
            startLoop: function () {
                this.onStartLoop();
                this.iterate("startLoop");
            },
            endLoop: function () {
                this.iterate("endLoop");
                this.onEndLoop();
            }
        },
        Static: {
            create: function () {
                var T = YYC.Class(YE.Scene, {
                    Init: function () {
                        this.base();
                    },
                    Public: {
                    }
                });

                return new T();
            }
        }
    });
}());