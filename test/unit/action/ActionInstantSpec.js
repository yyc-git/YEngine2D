/**YEngine2D
 * author：YYC
 * date：2014-10-04
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("ActionInstant", function () {
    var action = null;

    function getInstance() {
        var T = YYC.Class(YE.ActionInterval, {
            Public: {
                copy: function () {
                },
                update: function () {
                },
                reverse: function () {
                }
            }
        });
        return new T();
    }

    beforeEach(function () {
        action = getInstance();

    });

    describe("start", function () {
        it("空方法", function () {
            expect(action.start).toBeExist();
        });
    });

    describe("stop", function () {
        it("空方法", function () {
            expect(action.stop).toBeExist();
        });
    });

    describe("isStop", function () {
        it("返回false", function () {
            expect(action.isStop()).toBeFalsy();
        });
    });

});
