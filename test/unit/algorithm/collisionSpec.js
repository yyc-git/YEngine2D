/**YEngine2D
 * author：YYC
 * date：2014-01-14
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("collision", function () {
    beforeEach(function () {
    });
    afterEach(function () {
    });

    describe("col_Between_Rects", function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        it("矩形间的碰撞检测，若碰撞则返回true，否则返回false（矩阵相邻判定为没有碰撞）", function () {
            var check = YE.collision.col_Between_Rects;

            expect(check(YE.rect(1, 2, 10, 20), YE.rect(2, 3, 20, 30))).toBeTruthy();
            expect(check(YE.rect(1, 2, 10, 20), YE.rect(2, 3, 4, 5))).toBeTruthy();
            expect(check(YE.rect(1, 2, 10, 20), YE.rect(1, 1, 8, 10))).toBeTruthy();

            expect(check(YE.rect(1, 2, 10, 20), YE.rect(0, 0, 0.5, 0.5))).toBeFalsy();
            expect(check(YE.rect(1, 2, 10, 20), YE.rect(20, 1, 10, 20))).toBeFalsy();
            expect(check(YE.rect(1, 2, 10, 20), YE.rect(1, 22, 10, 20))).toBeFalsy();
        });
    });

});
