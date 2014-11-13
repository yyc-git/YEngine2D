/**YEngine2D
 * author：YYC
 * date：2014-01-19
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
YE.RepeatForever = YYC.Class(YE.Control, {
    Init: function (action) {
        this.base();

        this.ye____innerAction = action;
    },
    Private: {
        ye____innerAction: null
    },
    Public: {
        update: function (time) {
            this.ye____innerAction.update(time);

            if (this.ye____innerAction.isFinish()) {
                this.ye____innerAction.reset();
            }
        },
        isFinish: function () {
            return false;
        },
        copy: function () {
            return YE.RepeatForever.create(this.ye____innerAction.copy());
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
        create: function (action) {
            var repeat = new this(action);

            return repeat;
        }
    }
});
