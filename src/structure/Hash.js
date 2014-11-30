/**YEngine2D
 * author：YYC
 * date：2014-01-11
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    YE.Hash = YYC.Class({
        Init: function () {
            this.ye_childs = {};
        },
        Private: {
            ye_childs: null
        },
        Public: {
            getChilds: function () {
                return this.ye_childs;
            },
            getValue: function (key) {
                return this.ye_childs[key];
            },
            addChild: function (key, value) {
                this.ye_childs[key] = value;

                return this;
            },
            appendChild: function (key, value) {
                if (YE.Tool.judge.isArray(this.ye_childs[key])) {
                    this.ye_childs[key].push(value);
                }
                else {
                    this.ye_childs[key] = [value];
                }

                return this;
            },
            removeChild: function (key) {
                this.ye_childs[key] = undefined;
            },
            hasChild: function (key) {
                return !!this.ye_childs[key];
            },
            forEach: function (fn, context) {
                var i = null,
                    childs = this.ye_childs;

                for (i in childs) {
                    if (childs.hasOwnProperty(i)) {
                        if (fn.call(context, childs[i], i) === $break) {
                            break;
                        }
                    }
                }
            },
            map: function (handlerName, argArr) {
                var i = null,
                    childs = this.ye_childs;

                for (i in childs) {
                    if (childs.hasOwnProperty(i)) {
                        childs[i][handlerName].apply(childs[i], argArr);
                    }
                }
            }
        },
        Static: {
            create: function () {
                return new this();
            }
        }
    });
}());