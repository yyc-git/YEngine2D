/**YEngine2D
 * author：YYC
 * date：2014-01-11
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
(function () {
    YE.rect = function (x, y, w, h) {
        return { origin: {x: x, y: y}, size: {width: w, height: h} };
    };

    //todo 测试
    YE.size = function (width, height) {
        return {width: width, height: height};
    }
}());
