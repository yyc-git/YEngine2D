/**YEngine2D
 * author：YYC
 * date：2014-04-21
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function(){
    YE.DelayTime = YYC.Class(YE.ActionInterval, {
        Init: function (delayTime) {
            this.base();

            this.___delayTime = delayTime;
        },
        Private: {
            ___delayTime: -1,
            ___elapsed: -1,
            ___firstTick: true
        },
        Public: {
            reverse: function () {
                return this;
            },
            update: function (time) {
                if (this.___firstTick) {
                    this.___firstTick = false;
                    this.___elapsed = 0;

                    return YE.returnForTest;
                }
                this.___elapsed += time;

                if (this.___elapsed >= this.___delayTime) {
                    this.finish();
                }
            },
            copy: function () {
                return YE.DelayTime.create(this.___delayTime);
            }
        },
        Static: {
            create: function (delayTime) {
                var action = new this(delayTime);

                return action;
            }
        }
    });
}());