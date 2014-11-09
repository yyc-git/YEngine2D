/**YEngine2D
 * author：YYC
 * date：2014-02-05
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Graphics", function () {
    var fakeContext = {},
        graphics = null;

    function init() {
        $("body").append($("<canvas id='graphics_canvas' width='1000px' height='1000px'" +
            "style='border:1px solid red;position:absolute;top:0px;left:0px;'>"));
        fakeContext = $("#graphics_canvas")[0].getContext("2d");
        graphics = YE.Graphics.create(fakeContext);
    }

    function removeCanvas() {
        $("#graphics_canvas").remove();
    }

    beforeEach(function () {
    });
    afterEach(function () {
//          removeCanvas();
    });

    describe("构造函数", function () {
        it("获得context", function () {
        });
    });

    describe("setContext", function () {
        it("设置context", function () {
            var fakeContext = {a: 1};
            graphics = YE.Graphics.create({});

            graphics.setContext(fakeContext);

            expect(graphics.ye_context).toEqual(fakeContext);
        });
    });


    describe("drawPolygon", function () {
        it("绘制多边形", function () {
//            init();
//            var polygon = [
//                [100,100],
//                [100,200],
//                [200,300],
//                [300,100]
//            ];
//
//            graphics.drawPolygon("rgba(255,0,0,1)", 1, polygon);
        });
    });

    describe("fillPolygon", function () {
        it("填充多边形", function () {
//            init();
//            var polygon = [
//                [100,100],
//                [100,200],
//                [200,300],
//                [300,100]
//            ];
//
//            graphics.fillPolygon("rgba(255,0,0,1)", polygon);
        });
    });

    describe("fillMultiplePolygon", function () {
        it("一次填充多个多边形", function () {
//            init();
//            var polygon1 = [
//                [100,100],
//                [100,200],
//                [200,300],
//                [300,100]
//                ],
//             polygon2 = [
//                [500,100],
//                [500,200],
//                [600,300],
//                [700,100]
//            ];
//
//            graphics.fillMultiplePolygon("rgba(255,0,0,1)", [polygon1, polygon2]);
        });
    });

    describe("drawCircle", function () {
        it("绘制圆形", function () {
//            init();
//
//            graphics.drawCircle("rgba(255,0,0,1)", 1, 100, 100, 20);
        });
    });

    describe("fillCircle", function () {
        it("填充圆形", function () {
//            init();
//
//            graphics.fillCircle("rgba(255,0,0,1)", 100, 100, 20);
        });
    });

    describe("drawLifeBar", function () {
        it("绘制血条", function () {
//            init();
//
//            graphics.drawLifeBar([100, 200, 300, 100], 1, 50, "rgba(0,255,0,0.5)", "rgba(255,0,0,0.5)");
        });
    });

    describe("drawDiamondBox", function () {
        it("绘制菱形框", function () {
//            init();
//
//            graphics.drawDiamondBox("rgba(0,255,0,0.5)", 1, [300,300], 0.8, 200);
        });
    });

    describe("fillDiamondBox", function () {
        it("填充菱形框", function () {
//            init();
//
//            graphics.fillDiamondBox("rgba(255,0,0,0.5)", [300,300], 0.8, 200);
        });
    });

    describe("fillMultipleDiamondBox", function () {
        it("一次填充多个菱形框", function () {
//            init();
//
//            graphics.fillMultipleDiamondBox("rgba(255,0,0,0.5)", [[300,300],[600,600]], 0.8, 200);
        });
    });
});
