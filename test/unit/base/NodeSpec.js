/**YEngine2D
 * author：YYC
 * date：2014-02-09
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Node", function () {
    var node = null;

    function getInstance() {
        var T = YYC.Class(YE.Node, {
            Init: function () {
                this.base();
            },
            Public: {
            }
        });

        return new T();
    }


    beforeEach(function () {
        node = getInstance();
    });
    afterEach(function () {
    });

    describe("init", function () {
        it("获得父节点", function () {
            var container = {};

            node.init(container);

            expect(node.getParent()).toEqual(container);
        });
    });

    describe("getParent", function () {
        it("获得父节点", function () {
        });
    });

    describe("getZOrder", function () {
        it("获得zOrder", function () {
        });
    });

    describe("ye_setZOrder", function () {
        it("设置元素z轴的显示顺序", function () {
            node.ye_setZOrder(1);

            expect(node.getZOrder()).toEqual(1);
        });
    });

    describe("外部钩子", function () {
        it("onstartLoop存在", function () {
            expect(node.onStartLoop).toBeExist();
        });
        it("onendLoop存在", function () {
            expect(node.onEndLoop).toBeExist();
        });
//        it("onbeforeRun存在", function () {
//            expect(node.onbeforeRun).toBeExist();
//        });
//        it("onendRun存在", function () {
//            expect(node.onafterRun).toBeExist();
//        });
        it("onenter存在", function () {
            expect(node.onEnter).toBeExist();
        });
        it("onexit存在", function () {
            expect(node.onExit).toBeExist();
        });
    });
});