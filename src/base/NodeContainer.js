/**YEngine2D 节点容器类
 * author：YYC
 * date：2014-02-18
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
YE.NodeContainer = YYC.AClass(YE.Node, {
    Init: function () {
        this.base();

        this.ye__childs = YE.Collection.create();
    },
    Private: {
        ye__isChangeZOrder: false,
        ye__childs: null
    },
    Protected: {
        Abstract: {
            ye_P_run: function () {
            }
        }
    },
    Public: {
        isSortAllChilds: true,

        reorderChild: function (child, zOrder) {
            this.ye__isChangeZOrder = true;

            child.ye_setZOrder(zOrder);
        },
        sortByZOrder: function () {
            if (this.ye__isChangeZOrder) {
                this.ye__isChangeZOrder = false;

                this.sort(function (child1, child2) {
                    return child1.getZOrder() - child2.getZOrder();
                });
            }
        },
        sort: function (func) {
            this.ye__childs.sort(func);
        },
        getChilds: function () {
            return this.ye__childs.getChilds();
        },
        getChildAt: function (index) {
            return this.ye__childs.getChildAt(index);
        },
        addChilds: function (childs, zOrder, tag) {
            var self = this;

            YE.error(!YE.Tool.judge.isArray(childs), "第一个参数必须为数组");

            if (zOrder) {
                this.ye__isChangeZOrder = true;
            }

            this.ye__childs.addChilds(childs);

            childs.forEach(function (child) {
                if (zOrder) {
                    child.ye_setZOrder(zOrder);
                }
                if (tag) {
                    child.addTag(tag);
                }
                child.init(self);
                child.onEnter();
            });
        },
        addChild: function (child, zOrder, tag) {
            this.ye__childs.addChild(child);

            if (zOrder) {
                this.ye__isChangeZOrder = true;
                child.ye_setZOrder(zOrder);
            }
            if (tag) {
                child.addTag(tag);
            }
            child.init(this);
            child.onEnter();
        },
        hasChild: function (child) {
            return this.ye__childs.hasChild(child);
        },
        getChildByTag: function (tag) {
            return YE.Tool.collection.getChildByTag(this.ye__childs, tag);
        },
        getChildsByTag: function (tag) {
            return YE.Tool.collection.getChildsByTag(this.ye__childs, tag);
        },
        removeChildByTag: function (tag) {
            YE.Tool.collection.removeChildByTag(this.ye__childs, tag, function (child) {
                child.onExit();
            });
        },
        removeChildsByTag: function (tag) {
            YE.Tool.collection.removeChildsByTag(this.ye__childs, tag, function (child) {
                child.onExit();
            });
        },
        removeChild: function (child) {
            child.onExit();
            this.ye__childs.removeChild(child);
        },
        removeAllChilds: function () {
            this.ye__childs.map("onExit");

            this.ye__childs.removeAllChilds();
        },
        iterate: function (handler, args) {
            if (YE.Tool.judge.isFunction(arguments[0])) {
                this.ye__childs.forEach.apply(this.ye__childs, arguments);
            }
            else {
                this.ye__childs.map.apply(this.ye__childs, arguments);
            }
        },
        //游戏主循环调用的方法
        run: function () {
            if (this.isSortAllChilds) {
                this.sortByZOrder();
            }

            this.ye_P_run();
        }
    }
});
