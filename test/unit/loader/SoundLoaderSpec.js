/**YEngine2D
 * author：YYC
 * date：2014-05-17
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("SoundLoader", function () {
    var loader = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        loader = new YE.SoundLoader();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("该类为单例类", function () {
        testTool.judgeSingleInstance(YE.SoundLoader);
    });

    describe("get", function () {
        it("从容器中获得加载的声音对象", function () {
            var fakeSound = {};
            sandbox.stub(loader.ye_P_container, "getValue").returns(fakeSound);

            var data = loader.get("../a.mp3");

            expect(data).toEqual(fakeSound);
        });
    });

    describe("ye_P_load", function () {
        describe("调用YSoundEngine加载声音", function () {
            var fakeSound = null;

            beforeEach(function () {
                fakeSound = {};
                sandbox.stub(YE.YSoundEngine, "create");
            });
            afterEach(function () {
            });


            it("设置声音的加载路径", function () {
                var fakeSoundUrl = ["../a.mp3"];

                loader.ye_P_load(fakeSoundUrl);

                expect(YE.YSoundEngine.create.args[0][0].url).toEqual(fakeSoundUrl);
            });

            describe("测试audio的事件绑定", function () {
                describe("测试onload", function () {
                    var fakeLoaderManager = null;

                    beforeEach(function () {
                        fakeLoaderManager = sandbox.createSpyObj("onResLoaded");
                        sandbox.stub(YE.LoaderManager, "getInstance").returns(fakeLoaderManager);
                    });

                    it("调用LoaderManager的onResLoaded方法", function () {
                        loader.ye_P_load(["../a.mp3"]);
                        YE.YSoundEngine.create.args[0][0].onload.call(fakeSound, null);

                        expect(fakeLoaderManager.onResLoaded).toCalledOnce();
                    });
                    it("将声音对象加入到容器中。同一个key可对应多个声音对象", function () {
                        var fakeSoundUrl = ["../a.mp3"],
                            fakeSoundId = "a";
                        sandbox.stub(loader.ye_P_container, "appendChild");

                        loader.ye_P_load(fakeSoundUrl, fakeSoundId);
                        YE.YSoundEngine.create.args[0][0].onload.call(fakeSound, null);

                        expect(loader.ye_P_container.appendChild).toCalledWith(fakeSoundId, fakeSound);
                    });
                });

                describe("测试onerror", function () {
                    var fakeLoaderManager = null;

                    beforeEach(function () {
                        fakeLoaderManager = sandbox.createSpyObj("onResError");
                        sandbox.stub(YE.LoaderManager, "getInstance").returns(fakeLoaderManager);
                    });

                    it("调用LoaderManager的onResError方法，给出错误的code信息", function () {
                        sandbox.stub(fakeSound, "error", {
                            code: 4
                        });

                        loader.ye_P_load(["../a.mp3"]);
                        YE.YSoundEngine.create.args[0][0].onerror.call(fakeSound, null);

                        expect(fakeLoaderManager.onResError).toCalledOnce();
                    });
                });
            });
        });
    });
});