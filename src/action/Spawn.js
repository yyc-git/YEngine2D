/**YEngine2D
 * author：YYC
 * date：2014-01-22
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function(){
    YE.Spawn = YYC.Class(YE.Control, {
        Init: function (actionArr) {
            this.base();

            this.ye____actions = actionArr;
        },
        Private: {
            ye____actions: null,

            ye____isFinish: function () {
                var isFinish = true;

                this.ye____actions.forEach(function (action, i) {
                    if (!action.isFinish()) {
                        isFinish = false;
                        return $break;
                    }
                });

                return isFinish;
            },
            ye____iterate: function (method, arg) {
                this.ye____actions.forEach(function (action, i) {
                    if (!action.isFinish()) {
                        action[method].apply(action, arg);
                    }
                });
            }
        },
        Public: {
            update: function (time) {
                if (this.ye____isFinish()) {
                    this.finish();
                }

                this.ye____iterate("update", [time]);
            },
            start: function () {
                this.base();

                this.ye_P_iterate("start");
            },
            copy: function () {
                var actions = [];

                this.ye____actions.forEach(function (action) {
                    actions.push(action.copy());
                });
                return YE.Spawn.create.apply(YE.Spawn, actions);
            },
            reverse: function () {
                this.ye____actions.reverse();

                this.base();

                return this;
            },
            stop: function () {
                this.base();

                this.ye_P_iterate("stop");
            },
            reset: function () {
                this.base();

                this.ye_P_iterate("reset");
            },
            getInnerActions: function () {
                return this.ye____actions;
            }
        },
        Static: {
            create: function () {
                var spawn = null;

                YE.assert(arguments.length >= 2, "应该有2个及以上动作");

                spawn = new this(Array.prototype.slice.call(arguments, 0));

                return spawn;
            }
        }
    });
}());