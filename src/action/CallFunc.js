/**YEngine2D 调用方法类
 * author：YYC
 * date：2014-04-21
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
YE.CallFunc = YYC.Class(YE.ActionInstant, {
    Init: function (func, context, dataArr) {
        this.base();

        this.ye___context = context || window;
        this.ye___callFunc = func;
        this.ye___dataArr = dataArr;
    },
    Private: {
        ye___context: null,
        ye___callFunc: null,
        ye___dataArr: null
    },
    Public: {
        reverse: function () {
            return this;
        },
        update: function (time) {
            if (this.ye___callFunc) {
                this.ye___callFunc.call(this.ye___context, this.getTarget(), this.ye___dataArr);
            }

            this.finish();
        },
        copy: function () {
            return new YE.CallFunc(this.ye___context, this.ye___callFunc, YE.Tool.extend.extendDeep(this.ye___dataArr));
        }
    },
    Static: {
        create: function (func, context, args) {
            var dataArr = Array.prototype.slice.call(arguments, 2),
                action = new this(func, context, dataArr);

            return action;
        }
    }
});