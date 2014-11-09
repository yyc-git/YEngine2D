/**YEngine2D
 * author：YYC
 * date：2014-02-25
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("LoaderManager", function () {
    var manager = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        manager = new YE.LoaderManager();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("该类为单例类", function () {
        testTool.judgeSingleInstance(YE.LoaderManager);
    });

    describe("preload", function () {
        beforeEach(function () {
            sandbox.stub(manager, "ye_isFinishLoad");
        });

        describe("加载图片资源", function () {
            var fakeLoader = null,
                res = null;

            beforeEach(function () {
                fakeLoader = sandbox.createSpyObj("load");
                sandbox.stub(YE.ImgLoader, "getInstance").returns(fakeLoader);
                res = [
                    {type: "image", url: "../a.png"},
                    {type: "image", url: "../b.png"}
                ];

                manager.preload(res);
            });

            it("异步加载图片", function () {
                expect(fakeLoader.load.firstCall.args[0]).toEqual(res[0].url);
                expect(fakeLoader.load.secondCall.args[0]).toEqual(res[1].url);
            });
            it("资源总数加1", function () {
                expect(manager.getResourceCount()).toEqual(2);
            });
        });

        describe("加载json", function () {
            var fakeLoader = null,
                res = null;

            beforeEach(function () {
                fakeLoader = sandbox.createSpyObj("load");
                sandbox.stub(YE.JsonLoader, "getInstance").returns(fakeLoader);
                res = [
                    {type: "json", url: "../a.json", id: "a"},
                    {type: "json", url: "../b.json", id: "b"}
                ];

                manager.preload(res);
            });

            it("异步加载json", function () {
                expect(fakeLoader.load.firstCall.args).toEqual([res[0].url, res[0].id]);
                expect(fakeLoader.load.secondCall.args).toEqual([res[1].url, res[1].id]);
            });
            it("资源总数加1", function () {
                expect(manager.getResourceCount()).toEqual(2);
            });
        });

//        describe("进行初始化", function () {
//            it("加入初始化数组", function () {
//                var func1 = function () {
//                    },
//                    func2 = function () {
//                    },
//                    res = [
//                        {type: "init", func: func1},
//                        {type: "init", func: func2}
//                    ];
//
//                manager.preload(res);
//
//                expect(manager.ye_initFuncArr.getCount()).toEqual(2);
//            });
//        });


        it("轮询是否加载完成，调用相应的方法", function () {
            manager.preload([]);

            expect(manager.ye_isFinishLoad).toCalledOnce();
        });
    });

    describe("ye_isFinishLoad", function () {
        describe("如果加载完成", function () {
            beforeEach(function () {
                sandbox.stub(manager, "getCurrentLoadedCount").returns(1);
                sandbox.stub(manager, "getResourceCount").returns(1);
            });

            describe("如果用户定义了onload", function () {
                beforeEach(function () {
                    manager.onload = function () {
                    };
                });
                afterEach(function () {
                });

//                it("遍历初始化数组，调用每个方法", function () {
//                    var func1 = sandbox.stub(),
//                        func2 = sandbox.stub();
//                    manager.ye_initFuncArr.addChilds([func1, func2]);
//
//                    manager.ye_isFinishLoad();
//
//                    expect(func1).toCalledBefore(func2);
//                });
                it("调用onload", function () {
                    manager.onload = sandbox.stub();

                    manager.ye_isFinishLoad();

                    expect(manager.onload).toCalledOnce();
                });
            });

            it("否则，断言", function () {
                sandbox.stub(YE.main, "getConfig").returns({
                    isDebug: true
                });

                expect(function () {
                    manager.ye_isFinishLoad();
                }).toAssert();
            });
        });

        describe("否则", function () {
            beforeEach(function () {
                sandbox.stub(manager, "getCurrentLoadedCount").returns(1);
                sandbox.stub(manager, "getResourceCount").returns(2);
            });

            it("如果用户定义了onloading，则16ms后调用onloading", function () {
                manager.onloading = sandbox.stub();
                jasmine.clock().install();

                manager.ye_isFinishLoad();

                jasmine.clock().tick(16);
                expect(manager.onloading).toCalledOnce();

                jasmine.clock().uninstall();
            });
            it("进行下一次轮询", function () {
                sandbox.spy(manager, "ye_isFinishLoad");
                manager.onloading = function () {
                };
                jasmine.clock().install();

                manager.ye_isFinishLoad();

                jasmine.clock().tick(16);
                expect(manager.ye_isFinishLoad.callCount).toEqual(2);

                jasmine.clock().uninstall();
            });
        });
    });

    describe("getResourceCount", function () {
        it("返回资源总数", function () {
        });
    });

    describe("getCurrentLoadedCount", function () {
        it("返回当前已加载的资源数", function () {
        });
    });

    describe("reset", function () {
        it("重置资源计数", function () {
            manager.ye_resCount = 10;
            manager.ye_currentLoadedCount = 5;

            manager.reset();

            expect(manager.getResourceCount()).toEqual(0);
            expect(manager.getCurrentLoadedCount()).toEqual(0);
        });
    });

    describe("onResLoaded", function () {
        it("已加载的资源数加1", function () {
            manager.ye_currentLoadedCount = 0;

            manager.onResLoaded();

            expect(manager.ye_currentLoadedCount).toEqual(1);
        });
    });

    describe("onResError", function () {
        it("打印资源路径和错误信息", function () {
            sandbox.stub(YE, "log");

            manager.onResError("../a.png", "错误");

            expect(YE.log).toCalledTwice();
        });
    });

});
