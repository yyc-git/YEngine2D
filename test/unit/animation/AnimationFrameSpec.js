/**YEngine2D
 * author：YYC
 * date：2014-01-13
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("AnimationFrame", function () {
    var animationFrame =null;
    var sandbox = null;

    beforeEach(function () {
        animationFrame = new YE.AnimationFrame();
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        it("获得精灵的所有帧动画，这是一个Hash集合", function () {
        });
    });


    describe("getSpriteFrames", function () {
        it("获得精灵的所有帧动画", function () {
        });
    });

    describe("getAnim", function () {
        it("根据动画名获得动画", function () {
            var fakeAnimate = {};

            animationFrame.addAnim("walk", fakeAnimate);

            expect(animationFrame.getAnim("walk")).toEqual(fakeAnimate);
        });
    });

    describe("getAnims", function () {
        it("获得hash容器的所有元素（object对象）", function () {
            var anims = {
                "anim1": {}
            };
            sandbox.stub(animationFrame, "ye_spriteFrames", {
                getChilds: sandbox.stub().returns(anims)
            });

            expect(animationFrame.getAnims()).toEqual(anims);
        });
    });

    describe("addAnim", function () {
//        it("如果当前动画存在，则断言", function () {
//            var animationFrame = new YE.AnimationFrame({
//                    "walk": fakeAnimate
//                }
//            );
//
//            expect(function () {
//                animationFrame.addAnim("walk", {});
//            }).toAssert();
//        });
        it("加入动画（如果动画已存在，则更新之）", function () {
            var fakeAnimate = {};

            animationFrame.addAnim("walk", fakeAnimate);

            expect(animationFrame.getAnim("walk")).toEqual(fakeAnimate);
        });
    });
})
;
