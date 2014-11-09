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
                    layers = this.getChilds();

                for (i in layers) {
                    if (layers.hasOwnProperty(i)) {
                        if (fn.call(context, layers[i], i) === $break) {
                            break;
                        }
                    }
                }
            },
            map: function (handlerName, argArr) {
                var i = null,
                    layers = this.getChilds();

                for (i in layers) {
                    if (layers.hasOwnProperty(i)) {
                        layers[i][handlerName].apply(layers[i], argArr);
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