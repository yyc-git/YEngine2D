/**YEngine2D
 * author：YYC
 * date：2014-05-17
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Loader", function () {
    var loader = null;
    var sandbox = null;

    function getInstance() {
        var T = YYC.Class(YE.Loader, {
            Init: function () {
                this.base();
            },
            Public: {
                ye_P_load: function () {
                }
            }
        });

        return new T();
    }

    beforeEach(function () {
        loader = getInstance();
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        it("创建ye_P_container容器", function () {
            loader = getInstance();

            expect(loader.ye_P_container).toBeInstanceOf(YE.Hash);
        });
        it("创建ye_loadedUrl容器", function () {
            loader = getInstance();

            expect(loader.ye_loadedUrl).toBeInstanceOf(YE.Collection);
        });
    });


    describe("get", function () {
        it("从容器中获得加载的资源对象", function () {
            var fakeResource = {};
            sandbox.stub(loader.ye_P_container, "getValue").returns(fakeResource);

            var data = loader.get("../a.mp3");

            expect(data).toEqual(fakeResource);
        });
    });
//
    describe("load", function () {
        describe("如果已经加载了资源", function () {
            beforeEach(function () {
                sandbox.stub(loader.ye_loadedUrl, "hasChild").returns(true);
            });

            it("调用LoaderManager的onResLoaded方法", function () {
                var fakeLoaderManager = sandbox.createSpyObj("onResLoaded");
                sandbox.stub(YE.LoaderManager, "getInstance").returns(fakeLoaderManager);

                loader.load("../a.mp3");

                expect(fakeLoaderManager.onResLoaded).toCalledOnce();
            });
            it("直接返回加载的数据", function () {
                var fakeResource = {};
                sandbox.stub(loader, "get").returns(fakeResource);

                var data = loader.load("../a.mp3");

                expect(data).toEqual(fakeResource);
            });
        });


        describe("加载资源", function () {
            beforeEach(function () {
                sandbox.stub(loader, "ye_P_load");
            });

            it("如果传入了id，则key为id", function () {
                var url = "../a.png",
                    id = "a";

                loader.load(url, id);

                expect(loader.ye_P_load).toCalledWith(url, id);
            });
            it("否则，key为url", function () {
                var url = "../a.png";

                loader.load(url);

                expect(loader.ye_P_load).toCalledWith(url, url);
            });
            it("加载资源", function () {
                var url = "a.png",
                    id = "a";

                loader.load(url, id);

                expect(loader.ye_P_load).toCalledWith(url, id);
            });
        });
    });

});