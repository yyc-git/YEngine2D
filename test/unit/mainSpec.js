/**YEngine2D
 * author：YYC
 * date：2014-07-27
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("main", function () {
    var main = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        main = YE.main;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("加入main.js依赖的全局方法", function () {
        describe("namespace", function () {
            var namespace_forTest = null;

            beforeEach(function () {
                namespace_forTest = "ye_namespace_forTest";
            });
            afterEach(function () {
                testTool.deleteMember(window, namespace_forTest);
            });

            it("测试namespace方法存在", function () {
                expect(namespace).toBeFunction();
            });

            it("测试命名空间不能为空", function () {
                expect(namespace).toThrow();
            });


            it("测试创建单个命名空间成功", function () {
                namespace(namespace_forTest);

                expect(window[namespace_forTest]).toBeDefined();
            });
            it("测试创建多个命名空间成功", function () {
                namespace("ye_namespace_forTest.Button");
                namespace("ye_namespace_forTest.Button.Test");

                expect(window[namespace_forTest].Button).toBeDefined();
                expect(window[namespace_forTest].Button.Test).toBeDefined();
            });

            it("测试返回命名空间", function () {
                var n = namespace(namespace_forTest);

                expect(n).toEqual({});
            });
            it("测试返回的命名空间可以使用", function () {
                var button = namespace("ye_namespace_forTest.Button");

                expect(button.test).not.toBeDefined();

                button.test = function () {
                };

                expect(button.test).toBeFunction();
            });
            it("如果使用namespace创建的命名空间已经存在，则直接返回该命名空间", function () {
                window[namespace_forTest] = {};
                window[namespace_forTest].a = 1;

                namespace(namespace_forTest).b = 2;

                expect(window[namespace_forTest].a).toEqual(1);
                expect(window[namespace_forTest].b).toEqual(2);
            });
        });
    });

    describe("调试", function () {
        it("YE增加属性testReturn", function () {
            expect(YE.returnForTest).toBeExist();
        });

        describe("log", function () {
            //手动测试
            it("如果配置为调试状态和在页面上显示调试信息，则调试信息显示在页面上", function () {
//                var fake = sinon.fake.createObj("YE.Config");
//                fake.replace({
//                    IS_SHOW_DEBUG_ON_PAGE: true,
//                                    DEBUG: true
//                });
//
//                YE.log("调试信息");
//                YE.log("调试信息2");
//
//                fake.restore();
            });
        });

        describe("assert", function () {
            describe("如果配置为调试状态", function () {
                beforeEach(function () {
                    sandbox.stub(YE.main, "getConfig").returns({
                        isDebug: true
                    });
                });


                it("如果console.assert方法存在，则调用该方法", function () {
                    var t = 1;
                    sandbox.stub(console, "assert", sandbox.spy());

                    YE.assert(t !== 1, "断言信息");

                    expect(console.assert.args[0][1]).toEqual(("断言信息"));
                });

                describe("否则", function () {
                    it("如果console.log存在，则调用console.log", function () {
                        var t = 1;
                        sandbox.stub(console, "assert", undefined);
                        sandbox.stub(console, "log", sandbox.stub());

                        YE.assert(t !== 1, "断言信息");

                        expect(console.log).toCalledOnce();
                        expect(console.log).toCalledWith("断言：断言信息");
                    });
                    it("否则，调用alert", function () {
                        var t = 1;
                        sandbox.stub(console, "assert", undefined);
                        sandbox.stub(console, "log", undefined);
                        sandbox.stub(window, "alert", sandbox.stub());

                        YE.assert(t !== 1, "断言信息");

                        expect(window.alert).toCalledOnce();
                        expect(window.alert).toCalledWith("断言：断言信息");
                    });
                });
            });
        });

        describe("error", function () {
            it("如果发生错误，则抛出异常并终止程序", function () {
                expect(function () {
                    YE.error(true, "error");
                }).toThrow(new Error("error"));
            })
        });
    });

    describe("ye_loadJsLoader", function () {
        var fakeJsLoader = null;

        beforeEach(function () {
            fakeJsLoader = {
                add: sandbox.stub(),
                loadSync: sandbox.stub()
            };
            sandbox.stub(main.forTest_getJsLoader(), "create").returns(fakeJsLoader);
        });
        afterEach(function () {
        });

        describe("加载引擎文件", function () {
            beforeEach(function () {
            });
            afterEach(function () {
            });

            it("如果不是单一的引擎文件，则加载引擎文件", function () {
                main.ye_config.isSingleEngineFile = false;
                var engineDir = "../script/yEngine2D/",
                    engineFilePaths = ["a.js", "a/b.js"];
                main.ye_config.engineDir = engineDir;
                main.ye_config.engineFilePaths = engineFilePaths;
                main.ye_engineFilePaths = engineFilePaths;

                main.ye_loadJsLoader();

                expect(fakeJsLoader.add.withArgs(engineDir + engineFilePaths[0])).toCalledOnce();
                expect(fakeJsLoader.add.withArgs(engineDir + engineFilePaths[1])).toCalledOnce();
                expect(fakeJsLoader.loadSync).toCalledAfter(fakeJsLoader.add);
            });
            it("否则，不加载引擎文件", function () {
                main.ye_config.isSingleEngineFile = true;
                var engineFilePaths = ["a.js", "a/b.js"];

                main.ye_loadJsLoader();

                expect(fakeJsLoader.add).not.toCalled();
            });
        });

        it("加载用户文件", function () {
            var userFilePaths = ["c.js", "../d.js"];
            main.ye_config.userFilePaths = userFilePaths;

            main.ye_loadJsLoader();

            expect(fakeJsLoader.add.withArgs(userFilePaths[0])).toCalledOnce();
            expect(fakeJsLoader.add.withArgs(userFilePaths[1])).toCalledOnce();
            expect(fakeJsLoader.loadSync).toCalledAfter(fakeJsLoader.add);
        });
        it("文件加载完成后，调用配置的onload方法", function () {
            var fakeOnLoad = sandbox.stub();
            main.ye_config.onload = fakeOnLoad;

            main.ye_loadJsLoader();

            expect(fakeJsLoader.onload).toEqual(fakeOnLoad);
        });
    });

    describe("setConfig", function () {
        beforeEach(function () {
            sandbox.stub(window, "addEventListener");
        });
        afterEach(function () {
        });

        it("设置配置项", function () {
            main.setConfig({isDebug: true});

            expect(main.getConfig().isDebug).toBeTruthy();
        });

        describe("如果配置为自动加载，则在dom加载完成后加载引擎和用户文件", function () {
            it("绑定DOMContentLoaded事件", function () {
                main.setConfig({isAutoLoadWhenDomReady: true});

                expect(window.addEventListener.firstCall.args[0]).toEqual("DOMContentLoaded");
            });
            it("加载引擎和用户文件", function () {
                sandbox.stub(main, "ye_loadJsLoader");

                main.setConfig({isAutoLoadWhenDomReady: true});
                window.addEventListener.callArg(1);

                expect(main.ye_loadJsLoader).toCalled();
            });
        });
    });

    describe("load", function () {
        beforeEach(function () {
            console.log = sandbox.stub();
        });
        afterEach(function () {
        });

        it("如果已配置为DOM加载完成后自动加载文件，则提示并不加载", function () {
            main.ye_config.isLoadWhenDomReady = true;

            var result = main.load();

            expect(console.log).toCalledOnce();
            expect(result).toBeFalsy();
        });
        it("如果已经加载过文件，则提示并不加载", function () {
            main.ye_config.isLoadWhenDomReady = false;

            var result = main.load();

            expect(console.log).toCalledOnce();
            expect(result).toBeFalsy();
        });
        it("否则，加载文件", function () {
            sandbox.stub(main, "ye_loadJsLoader");

            main.load();

            expect(main.ye_loadJsLoader).toBeTruthy();
        });
    });
});
