/**YEngine2D 节点类
 * author：YYC
 * date：2014-02-09
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
YE.Node = YYC.AClass(YE.Entity, {
    Private: {
        ye_parent: null,
        ye_zOrder: 0,

        ye_setZOrder: function (zOrder) {
            this.ye_zOrder = zOrder;
        }
    },
    Public: {
        getParent: function () {
            return this.ye_parent;
        },
        getZOrder: function () {
            return this.ye_zOrder;
        },

        Virtual: {
            init: function (parent) {
                this.ye_parent = parent;
            },

            //*钩子

            onStartLoop: function () {
            },
            onEndLoop: function () {
            },
            onEnter: function () {
            },
            onExit: function () {
            }
        }
    }
});
