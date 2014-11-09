/**YEngine2D
 * author：YYC
 * date：2014-04-20
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("CollectionManager.js", function () {
    var manager = null;
    var sandbox = null;

    function getInstance() {
        var T = YYC.Class(YE.CollectionManager, {
        });

        return new T();
    }

    function addChild(child) {
        manager.ye_P_childs.addChild(child);
    }

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        manager = getInstance();
    });
    afterEach(function () {
        sandbox.restore();
    });


    describe("构造函数", function () {
        it("创建childs集合", function () {
            var manager = getInstance();

            expect(manager.ye_P_childs).toBeInstanceOf(YE.Collection);
        });
    });

    describe("update", function () {
        var fakeChild1 = null,
            fakeChild2 = null;

        function buildFakeFps() {
            sandbox.stub(YE.Director, "getInstance").returns({
                getFps: function () {
                    return 10;
                }
            });
        }

        function removeChild(child) {
            manager.ye_P_childs.removeChild(function (e) {
                return child.getUid() === e.getUid();
            });
        }

        function buildFakeChild(uid) {
            return {
                isStop: sandbox.stub().returns(false),
                isFinish: sandbox.stub().returns(false),
                update: sandbox.stub(),
                getUid: sandbox.stub().returns(uid)
            };
        }

        beforeEach(function () {
            fakeChild1 = buildFakeChild(1);
            fakeChild2 = buildFakeChild(2);
        });

        describe("遍历容器", function () {
            it("如果元素不存在，则返回（修复“如果遍历的动作删除了动作序列中某个动作，则在后面的遍历中会报错”的bug）", function () {
                sandbox.stub(fakeChild1, "update", function () {
                    removeChild(fakeChild2);
                });
                sandbox.spy(fakeChild1, "update");
                addChild(fakeChild1);
                addChild(fakeChild2);

                manager.update();

                expect(fakeChild1.update).toCalled();
                expect(fakeChild2.update).not.toCalled();   //因为fakeChild2已被删除了，因此遍历到fakeChild2时直接返回
            });
            it("如果元素已经完成，则容器中删除该元素", function () {
                sandbox.stub(manager, "removeChild");
                fakeChild1.isStop.returns(false);
                fakeChild1.isFinish.returns(true);
                addChild(fakeChild1);

                manager.update();

                expect(manager.removeChild).toCalledWith(fakeChild1);
                expect(fakeChild1.isFinish).toCalledBefore(fakeChild1.isStop);
            });
            it("如果元素停止，则不执行该元素的update方法", function () {
                fakeChild1.isStop.returns(true);
                fakeChild1.isFinish.returns(false);
                addChild(fakeChild1);

                manager.update();

                expect(fakeChild1.update.callCount).toEqual(0);
            });
            it("否则，执行元素的update方法，传入游戏主循环的间隔时间（以秒为单位）", function () {
                buildFakeFps();
                fakeChild1.isFinish.returns(false);
                fakeChild2.isFinish.returns(false);
                addChild(fakeChild1);
                addChild(fakeChild2);

                manager.update();

                expect(fakeChild1.update).toCalledWith(1 / 10);
                expect(fakeChild2.update).toCalledWith(1 / 10);
            });
        });
    });

    describe("getCount", function () {
        it("获得容器元素个数", function () {
            addChild({});

            expect(manager.getCount()).toEqual(1);
        });
    });


    describe("addChild", function () {
        var fakeChild = null;

        beforeEach(function () {
            fakeChild = {
                init: sandbox.stub(),
                onEnter: sandbox.stub(),
                setTarget: sandbox.stub()
            };
            sandbox.stub(manager, "hasChild").returns(false);
        });

        it("设置元素的target", function () {
            var target = {};

            manager.addChild(fakeChild, target);

            expect(fakeChild.setTarget).toCalledWith(target);
        });
        it("加入该元素", function () {
            sandbox.spy(manager.ye_P_childs, "addChild");

            manager.addChild(fakeChild);

            expect(manager.ye_P_childs.addChild).toCalledWith(fakeChild);
        });
        it("初始化元素（在设置元素的target之后）", function () {
            manager.addChild(fakeChild);

            expect(fakeChild.init).toCalledAfter(fakeChild.setTarget);
        });
        it("调用元素的onenter子", function () {
            manager.addChild(fakeChild);

            expect(fakeChild.onEnter).toCalledAfter(fakeChild.init);
        });
    });

    describe("removeChild", function () {
        var fakeChild = null;

        beforeEach(function () {
            fakeChild = {
                onExit: sandbox.stub(),
//                reset: sandbox.stub(),
                getUid: function () {
                    return 1;
                }
            };
            addChild(fakeChild);
        });

        it("调用元素的onexit钩子", function () {
            manager.removeChild(fakeChild);

            expect(fakeChild.onExit).toCalledOnce();
        });
        it("如果设置重置标志为true，则重置元素", function () {
            fakeChild.reset = sandbox.stub();

            manager.removeChild(fakeChild, true);

            expect(fakeChild.reset).toCalledOnce();
        });
        it("删除指定元素（uid匹配）", function () {
            manager.removeChild(fakeChild);

            expect(manager.hasChild(fakeChild)).toBeFalsy();
        });
    });

    describe("removeAllChilds", function () {
        var fakeChild1 = null,
            fakeChild2 = null;

        beforeEach(function () {
            fakeChild1 = {
                onExit: sandbox.stub()
//                reset: sandbox.stub()
            };
            fakeChild2 = {
                onExit: sandbox.stub(),
//                reset: sandbox.stub(),
                a: 2
            };
            addChild(fakeChild1);
            addChild(fakeChild2);
        });

        it("调用每个元素的onexit钩子", function () {
            manager.removeAllChilds();

            expect(fakeChild1.onExit).toCalledOnce();
            expect(fakeChild2.onExit).toCalledOnce();
        });
        it("如果设置重置标志位true，则重置所有元素", function () {
            fakeChild1.reset = sandbox.stub();
            fakeChild2.reset = sandbox.stub();

            manager.removeAllChilds(true);

            expect(fakeChild1.reset).toCalledOnce();
            expect(fakeChild2.reset).toCalledOnce();
        });
        it("删除所有元素", function () {
            manager.removeAllChilds();

            expect(manager.hasChild(fakeChild1)).toBeFalsy();
            expect(manager.hasChild(fakeChild2)).toBeFalsy();
        });
    });

    describe("hasChild", function () {
        it("如果参数为空，则返回false", function () {
            expect(manager.hasChild()).toBeFalsy();
        });
        it("如果参数为元素，判断容器中是否已加入该元素", function () {
            var fakeChild = {
            };
            sandbox.stub(manager.ye_P_childs, "hasChild").returns(true);

            var result = manager.hasChild(fakeChild);

            expect(result).toBeTruthy();
            expect(manager.ye_P_childs.hasChild).toCalledWith(fakeChild);
        });
        it("如果参数为tag，则判断是否有具有该tag的元素", function () {
            var fakeAnim = {
                hasTag: sandbox.stub()
            };
            addChild(fakeAnim);
            fakeAnim.hasTag.withArgs("a").returns(true);
            fakeAnim.hasTag.withArgs("b").returns(false);

            expect(manager.hasChild("a")).toBeTruthy();
            expect(manager.hasChild("b")).toBeFalsy();
        });
    });

    describe("getChilds", function () {
        it("获得所有元素", function () {
            var fakeChild1 = {
                    a: 10
                },
                fakeChild2 = {};
            addChild(fakeChild1);
            addChild(fakeChild2);

            expect(manager.getChilds().length).toEqual(2);
        });
    });
});
