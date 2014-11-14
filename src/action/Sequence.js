/**YEngine2D
 * author：YYC
 * date：2014-01-20
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function(){
YE.Sequence = YYC.Class(YE.Control, {
    Init: function () {
        this.base();
    },
    Private: {
        ye____actions: null,
        ye____currentAction: null,
        ye____actionIndex: -1
    },
    Public: {
        initWhenCreate: function (actionArr) {
            this.ye____actions = YE.Collection.create();

            this.ye____actions.addChilds(actionArr);
            this.ye____currentAction = this.ye____actions.getChildAt(0);
            this.ye____actionIndex = 0;
        },
        update: function (time) {
            if (this.ye____actionIndex === this.ye____actions.getCount()) {
                this.finish();
                return;
            }

            this.ye____currentAction = this.ye____actions.getChildAt(this.ye____actionIndex);

            if (!this.ye____currentAction.isFinish()) {
                this.ye____currentAction.update(time);

                return YE.returnForTest;
            }

            this.ye____actionIndex += 1;

            this.update(time);
        },
        copy: function () {
            var actionArr = [];

            this.ye____actions.forEach(function (action) {
                actionArr.push(action.copy());
            });

            return YE.Sequence.create.apply(YE.Sequence, actionArr);
        },
        reverse: function () {
            this.ye____actions.reverse();

            this.base();

            return this;
        },
        reset: function () {
            this.base();

            this.ye____actionIndex = 0;
            this.ye____actions.map("reset");
        },
        start: function () {
            this.base();

            this.ye____currentAction.start();
        },
        stop: function () {
            this.base();

            this.ye____currentAction.stop();
        },
        getInnerActions: function () {
            return this.ye____actions;
        }
    },
    Static: {
        create: function (actions) {
            var actionArr = null,
                sequence = null;

            YE.assert(arguments.length >= 2, "应该有2个及以上动作");

            actionArr = Array.prototype.slice.call(arguments, 0);

            sequence = new this();
            sequence.initWhenCreate(actionArr);

            return sequence;
        }
    }
});
    });
}());