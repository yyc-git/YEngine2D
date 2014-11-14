/**YEngine2D
 * author：YYC
 * date：2014-01-21
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function(){
    YE.ActionInterval = YYC.AClass(YE.Action, {
        Init: function () {
            this.base();
        },
        Private: {
            ye__isStop: false
        },
        Public: {
            start: function () {
                this.ye__isStop = false;
            },
            reset: function () {
                this.base();

                this.ye__isStop = false;
            },
            stop: function () {
                this.ye__isStop = true;
            },
            isStop: function () {
                return this.ye__isStop;
            }
        }
    });
}());