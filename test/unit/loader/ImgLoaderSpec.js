/**YEngine2D
 * author：YYC
 * date：2014-02-25
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("ImgLoader", function () {
    var loader = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        loader = new YE.ImgLoader();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("该类为单例类", function () {
        testTool.judgeSingleInstance(YE.ImgLoader);
    });

    describe("ye_P_load", function () {
        var fakeImg = null;

        it("创建图片对象", function () {
            sandbox.stub(window, "Image");

            loader.ye_P_load("../a.png");

            expect(window.Image).toCalledOnce();
        });

        describe("测试onload、onerror", function () {
            beforeEach(function () {
                fakeImg = {
                    onload: function () {
                    },
                    onerror: function () {
                    }
                };
                sandbox.stub(window, "Image").returns(fakeImg);
            });


            it("图片加载完成后，令onload为空，调用LoaderManager的onResLoaded方法", function () {
                var fakeLoaderManager = sandbox.createSpyObj("onResLoaded");
                sandbox.stub(YE.LoaderManager, "getInstance").returns(fakeLoaderManager);

                loader.ye_P_load("../a.png");

                fakeImg.onload();
                expect(fakeImg.onload).toBeNull();
                expect(fakeLoaderManager.onResLoaded).toCalledOnce();
            });

            describe("将图片对象保存在容器中", function () {

            });

            it("如果加载失败，调用LoaderManager的onResError方法", function () {
                var fakeLoaderManager = sandbox.createSpyObj("onResError");
                sandbox.stub(YE.LoaderManager, "getInstance").returns(fakeLoaderManager);

                loader.ye_P_load("../a.png");

                fakeImg.onerror();
                expect(fakeLoaderManager.onResError).toCalledOnce();
            });
        });

        it("设置图片的加载路径", function () {
            var fakeImgPath = "../a.png";
            fakeImg = {};
            sandbox.stub(window, "Image").returns(fakeImg);

            loader.ye_P_load(fakeImgPath);

            expect(fakeImg.src).toEqual(fakeImgPath);
        });
    });
});
