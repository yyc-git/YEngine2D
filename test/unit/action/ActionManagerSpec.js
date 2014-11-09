describe("ActionManager.js", function () {
    var manager = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        manager = YE.ActionManager.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("根据tag操作", function () {
        describe("getChildByTag", function () {
            it("调用YE.Tool.collection.getChildByTag", function () {
                sandbox.stub(YE.Tool.collection, "getChildByTag");

                manager.getChildByTag("aa");

                expect(YE.Tool.collection.getChildByTag).toCalledWith(manager.ye_P_childs, "aa");
            });
        });

        describe("getChildsByTag", function () {
            it("调用YE.Tool.collection.getChildsByTag", function () {
                sandbox.stub(YE.Tool.collection, "getChildsByTag");

                manager.getChildsByTag("aa");

                expect(YE.Tool.collection.getChildsByTag).toCalledWith(manager.ye_P_childs, "aa");
            });
        });

        describe("removeChildByTag", function () {
            beforeEach(function () {
                sandbox.stub(YE.Tool.collection, "removeChildByTag");
            });

            it("调用YE.Tool.collection.removeChildByTag", function () {
                manager.removeChildByTag("aa");

                expect(YE.Tool.collection.removeChildByTag.args[0][0]).toEqual(manager.ye_P_childs);
                expect(YE.Tool.collection.removeChildByTag.args[0][1]).toEqual("aa");
            });
            it("删除时触发child的onexit方法，如果设置重置标志为true，则还要触发child的reset方法", function () {
                manager.removeChildByTag("aa");

                var fakeChild = sandbox.createStubObj("onExit", "reset");
                YE.Tool.collection.removeChildByTag.getCall(0).callArgWith(2, fakeChild);

                expect(fakeChild.onExit).toCalled();
                expect(fakeChild.reset).not.toCalled();

                manager.removeChildByTag("aa", true);
                YE.Tool.collection.removeChildByTag.getCall(1).callArgWith(2, fakeChild);

                expect(fakeChild.reset).toCalled();
                expect(fakeChild.onExit).toCalledBefore(fakeChild.reset);
            });
        });

        describe("removeChildsByTag", function () {
            beforeEach(function () {
                sandbox.stub(YE.Tool.collection, "removeChildsByTag");
            });

            it("调用YE.Tool.collection.removeChildByTag", function () {
                manager.removeChildsByTag("aa");

                expect(YE.Tool.collection.removeChildsByTag.args[0][0]).toEqual(manager.ye_P_childs);
                expect(YE.Tool.collection.removeChildsByTag.args[0][1]).toEqual("aa");
            });
            it("删除时触发child的onexit方法，如果设置重置标志为true，则还要触发child的reset方法", function () {
                manager.removeChildsByTag("aa");

                var fakeChild = sandbox.createStubObj("onExit", "reset");
                YE.Tool.collection.removeChildsByTag.getCall(0).callArgWith(2, fakeChild);

                expect(fakeChild.onExit).toCalledBefore(fakeChild.reset);

                manager.removeChildsByTag("aa", true);
                YE.Tool.collection.removeChildsByTag.getCall(1).callArgWith(2, fakeChild);

                expect(fakeChild.reset).toCalled();
                expect(fakeChild.onExit).toCalledBefore(fakeChild.reset);
            });
        });
    });
});