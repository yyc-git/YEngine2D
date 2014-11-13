/**YEngine2D
 * author：YYC
 * date：2014-04-20
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    YE.CollectionManager = YYC.AClass(YE.Entity, {
        Init: function () {
            this.ye_P_childs = YE.Collection.create();
        },
        Private: {
        },
        Protected: {
            ye_P_childs: null
        },
        Public: {
            update: function () {
                var self = this,
                    removeQueue = [],
                    time = null;

                time = 1 / YE.Director.getInstance().getFps();

                this.ye_P_childs.forEach(function (child) {
                    //修复“如果遍历的动作删除了动作序列中某个动作，则在后面的遍历中会报错”的bug
                    if (!child) {
                        return;
                    }

                    if (child.isFinish()) {
                        removeQueue.push(child);
                        return;
                    }
                    if (child.isStop()) {
                        return;
                    }

                    child.update(time);
                });

                removeQueue.forEach(function (child) {
                    self.removeChild(child);
                });
            },
            getCount: function () {
                return this.ye_P_childs.getCount();
            },
            addChild: function (child, target) {
                child.setTarget(target);
                this.ye_P_childs.addChild(child);
                child.init();
                child.onEnter();
            },
            removeChild: function (child, isReset) {
                child.onExit();
                if (isReset === true) {
                    child.reset();
                }

                this.ye_P_childs.removeChild(function (e) {
                    return child.getUid() === e.getUid();
                });
            },
            removeAllChilds: function (isReset) {
                this.ye_P_childs.map("onExit");
                if (isReset === true) {
                    this.ye_P_childs.map("reset");
                }

                this.ye_P_childs.removeAllChilds();
            },
            hasChild: function (child) {
                var actionName = null;

                if (!child) {
                    return false;
                }

                if (YE.Tool.judge.isString(arguments[0])) {
                    actionName = arguments[0];

                    return this.ye_P_childs.hasChild(function (c) {
                        return c.hasTag(actionName);
                    });
                }

                return this.ye_P_childs.hasChild(child);
            },
            getChilds: function () {
                return this.ye_P_childs.getChilds();
            }
        }
    });
}());