/**YEngine2D
 * author：YYC
 * date：2014-02-25
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("JsonLoader", function () {
    var loader = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        loader = new YE.JsonLoader();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("该类为单例类", function () {
        testTool.judgeSingleInstance(YE.JsonLoader);
    });

    describe("get", function () {
        it("从容器中获得加载的json数据", function () {
            var fakeJsonData = {
                frames: {}
            };
            sandbox.stub(loader.ye_P_container, "getValue").returns(fakeJsonData);

            var data = loader.get("../a.json");

            expect(data).toEqual(fakeJsonData);
        });
    });

    describe("ye_P_load", function () {
        describe("异步读取json文件", function () {
            beforeEach(function () {
                sandbox.stub(loader.ye_P_container, "hasChild").returns(false);
                  sandbox.stub(YE.$, "ajax");
            });

//            it("调用jquery的ajax方法，异步访问", function () {
//                loader.ye_P_load("../a.json");
//
//                expect(YE.$.ajax.lastCall.args[0].async).toBeTruthy();
//            });

            describe("如果成功获得数据", function () {
                it("将数据保存在容器中", function () {
                    var fakeData = {frames: {}},
                        jsonPath = "../a.json",
                        fakeId = "a";
                    sandbox.stub(loader.ye_P_container, "addChild");

                    loader.ye_P_load(jsonPath, fakeId);

                    YE.$.ajax.lastCall.args[0].success(fakeData);
                    expect(loader.ye_P_container.addChild).toCalledWith(fakeId, fakeData);
                });
                it("调用LoaderManager的onResLoaded方法", function () {
                    var fakeLoaderManager = {
                        onResLoaded: sandbox.stub()
                    };
                    sandbox.stub(YE.LoaderManager, "getInstance").returns(fakeLoaderManager);

                    loader.ye_P_load("");

                    YE.$.ajax.lastCall.args[0].success({});
                    expect(fakeLoaderManager.onResLoaded).toCalledOnce();
                });
            });

            it("如果加载失败，调用LoaderManager的onResError方法", function () {
                var fakeLoaderManager = {
                    onResError: sandbox.stub()
                };
                sandbox.stub(YE.LoaderManager, "getInstance").returns(fakeLoaderManager);

                loader.ye_P_load("");

                YE.$.ajax.lastCall.args[0].error(
                    {readyState: 404, status: 4, responseText: ""},
                    "",
                    {message: "error"}
                );
                expect(fakeLoaderManager.onResError).toCalledOnce();
            });
        });
    });

});
