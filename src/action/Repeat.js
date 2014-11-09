/**YEngine2D 重复动作类
 * author：YYC
 * date：2014-01-19
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
YE.Repeat = YYC.Class(YE.Control, {
    Init: function (action, times) {
        this.base();

        this.ye____innerAction = action;
        this.ye____times = times;
    },
    Private: {
        ye____innerAction: null,
        ye____originTimes: 0,
        ye____times: 0
    },
    Public: {
        initWhenCreate: function () {
            this.ye____originTimes = this.ye____times;
        },
        update: function (time) {
            if (this.ye____times === 0) {
                this.finish();

                return;
            }
            this.ye____innerAction.update(time);

            if (this.ye____innerAction.isFinish()) {
                this.ye____times -= 1;

                if (this.ye____times !== 0) {
                    this.ye____innerAction.reset();
                }
            }
        },
        copy: function () {
            return YE.Repeat.create(this.ye____innerAction.copy(), this.ye____times);
        },
        reset: function () {
            this.base();

            this.ye____times = this.ye____originTimes;
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
        create: function (action, times) {
            var repeat = new this(action, times);

            repeat.initWhenCreate();

            return repeat;
        }
    }
});