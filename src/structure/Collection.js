(function () {
    YE.Collection = YYC.Class({
        Init: function () {
            this.ye_childs = [];
        },
        Private: {
            ye_childs: null
        },
        Public: {
            getCount: function () {
                return this.ye_childs.length;
            },
            sort: function (func) {
                this.ye_childs.sort(func);
            },
            hasChild: function (child) {
                var func = null;

                if (YE.Tool.judge.isFunction(arguments[0])) {
                    func = arguments[0];

                    return this.ye_childs.contain(function (c, i) {
                        return func(c, i);
                    });
                }

                return this.ye_childs.contain(function (c, i) {
                    if (c === child ||
                        (c.getUid && child.getUid && c.getUid() === child.getUid())) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            },
            getChilds: function () {
                return this.ye_childs;
            },
            getChildAt: function (index) {
                return this.ye_childs[index];
            },
            addChild: function (child) {
                this.ye_childs.push(child);

                return this;
            },
            addChilds: function (childs) {
                var i = 0,
                    len = 0;

                if (!YE.Tool.judge.isArray(childs)) {
                    this.addChild(childs);
                }
                else {
                    for (i = 0, len = childs.length; i < len; i++) {
                        this.addChild(childs[i]);
                    }
                }

                return this;
            },
            removeAllChilds: function () {
                this.ye_childs = [];
            },
            forEach: function (fn, context) {
                this.ye_childs.forEach.apply(this.ye_childs, arguments);
            },
            map: function (handlerName, argArr) {
                this.ye_childs.map.apply(this.ye_childs, arguments);
            },
            filter: function (func) {
                return this.ye_childs.filter(func, this.ye_childs);
            },
            removeChildAt: function (index) {
                YE.error(index < 0, "序号必须大于等于0");

                this.ye_childs.splice(index, 1);
            },
            copy: function () {
                return YE.Tool.extend.extendDeep(this.ye_childs);
            },
            reverse: function () {
                this.ye_childs.reverse();
            },
            removeChild: function (obj, target) {
                if (YE.Tool.judge.isFunction(obj)) {
                    return this.ye_childs.removeChild(obj, target);
                }
                else if (obj.isInstanceOf && obj.isInstanceOf(YE.Entity)) {
                    return this.ye_childs.removeChild(function (e) {
                        return e.getUid() === obj.getUid();
                    });
                }
                else {
                    return this.ye_childs.removeChild(function (e) {
                        return e === obj;
                    });
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