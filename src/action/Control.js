/**YEngine2D 控制动作基类
 * author：YYC
 * date：2014-04-23
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
YE.Control = YYC.AClass(YE.ActionInterval, {
    Init: function () {
        this.base();
    },
    Protected: {
        Virtual: {
            ye_P_iterate: function (method, arg) {
                var actions = this.getInnerActions();

                actions.map.apply(actions, arguments);
            }
        }
    },
    Public: {
        init: function () {
            this.ye_P_iterate("init");
        },
        onEnter: function () {
            this.ye_P_iterate("onEnter");
        },
        onExit: function () {
            this.ye_P_iterate("onExit");
        },
        setTarget: function (target) {
            this.base(target);

            this.ye_P_iterate("setTarget", [target]);
        },
        reverse: function () {
            this.ye_P_iterate("reverse");

            return this;
        },
        reset: function () {
            this.base();

            this.ye_P_iterate("reset");
        }
    },
    Abstract: {
        getInnerActions: function () {
        }
    }
});