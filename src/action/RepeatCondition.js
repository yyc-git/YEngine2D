/**YEngine2D 条件重复类
 * author：YYC
 * date：2014-04-25
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
YE.RepeatCondition = YYC.Class(YE.Control, {
    Init: function (action, context, conditionFunc) {
        this.base();

        this.ye____innerAction = action;
        this.ye____context = context || window;
        this.ye____conditionFunc = conditionFunc;
    },
    Private: {
        ye____innerAction: null,
        ye____context: null,
        ye____conditionFunc: null
    },
    Public: {
        initWhenCreate: function () {
            YE.error(!this.ye____conditionFunc, "必须传入重复条件");
        },
        update: function (time) {
            if (!!this.ye____conditionFunc.call(this.ye____context) === false || this.ye____innerAction.isFinish()) {
                this.finish();
                return;
            }

            this.ye____innerAction.update(time);
        },
        copy: function () {
            return YE.RepeatCondition.create(this.ye____innerAction.copy(), this.ye____context, this.ye____conditionFunc);
        },
        start: function () {
            this.base();

            this.ye____innerAction.start();
        },
        stop: function () {
            this.base();

            this.ye____innerAction.stop();
        },
        getInnerActions: function () {
            return [this.ye____innerAction];
        }
    },
    Static: {
        create: function (action, context, conditionFunc) {
            var repeat = new this(action, context, conditionFunc);

            repeat.initWhenCreate();

            return repeat;
        }
    }
});