/**YEngine2D
 * author：YYC
 * date：2014-10-27
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("yeQuery", function () {
    var query = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        query = YE.$;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("ajax", function () {
        it("实现了ajax方法", function () {
            expect(query.ajax).toBeDefined();
        });
    });

    describe("dom操作", function () {
        beforeEach(function () {
            $("body").append($("<div id='yeQueryTest'></div>"));
        });
        afterEach(function () {
            $("#yeQueryTest").remove();
        });

        it("选择dom元素", function () {
            var dom = query("#yeQueryTest");

            expect(dom.get(0).id).toEqual("yeQueryTest");
        });

        describe("prepend", function () {
            it("插入元素，将其作为第一个子元素", function () {
                query("#yeQueryTest").prepend("<span id='a'></span>");

                expect(query("#yeQueryTest").get(0).firstChild.id).toEqual("a");
            });
        });
    });
});