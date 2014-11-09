/**YEngine2D
 * author：YYC
 * date：2014-01-13
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Geometry", function () {
    describe("rect", function () {
        it("方法存在", function () {
            expect(YE.rect).toBeExist();
        });
        it("返回格式化的切片区域数据", function () {
           var imgData = YE.rect(1, 2, 10, 20);

            expect(imgData).toEqual({
                origin: {x: 1, y: 2},
                size: {width: 10, height: 20}
            });
        });
    });
});