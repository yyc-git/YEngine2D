/**YEngine2D
 * author：YYC
 * date：2013-12-28
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Scene.js", function () {
    var scene = null;
    var sandbox = null;

    function getInstance() {
        return YE.Scene.create();
    }

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        scene = getInstance();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("ye_P_run", function () {
        it("调用每个layer的run方法", function () {
            sandbox.stub(scene, "iterate");

            scene.ye_P_run();

            expect(scene.iterate).toCalledWith("run");
        });
    });

    describe("addChilds", function () {
        it("设置layer的zIndex为zOrder", function () {
            var layers = sandbox.createSpyObj("map");
            scene.stubParentMethodByAClass(sandbox, "addChilds");

            scene.addChilds(layers, 10);

            expect(layers.map).toCalledWith("setZIndex", 10);
        });
    });

    describe("addChild", function () {
        it("设置每个layer的zIndex为zOrder", function () {
            var layer = sandbox.createSpyObj("setZIndex");
            scene.stubParentMethodByAClass(sandbox, "addChild");

            scene.addChild(layer, 10);

            expect(layer.setZIndex).toCalledWith(10);
        });
    });

    describe("startLoop", function () {
        beforeEach(function () {
            sandbox.stub(scene, "iterate");
            sandbox.stub(scene, "onStartLoop");
        });

        it("调用onstartLoop", function () {
            scene.startLoop();

            expect(scene.onStartLoop).toCalledOnce();
        });
        it("调用每个layer的startLoop", function () {
            scene.startLoop();

            expect(scene.iterate).toCalledWith("startLoop");
        });
        it("先调用自己的onstartLoop，再调用每个layer的startLoop", function () {
            scene.startLoop();

            expect(scene.iterate).toCalledAfter(scene.onStartLoop);
        });
    });

    describe("endLoop", function () {
        beforeEach(function () {
            sandbox.stub(scene, "iterate");
            sandbox.stub(scene, "onEndLoop");
        });

        it("调用onendLoop", function () {
            scene.endLoop();

            expect(scene.onEndLoop).toCalledOnce();
        });
        it("调用每个layer的endLoop", function () {
            scene.endLoop();

            expect(scene.iterate).toCalledWith("endLoop");
        });
        it("先调用每个layer的endLoop，再调用自己的onendLoop", function () {
            scene.endLoop();

            expect(scene.iterate).toCalledBefore(scene.onEndLoop);
        });
    });
});
