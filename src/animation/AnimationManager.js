/**YEngine2D
 * author：YYC
 * date：2014-02-27
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function(){
    YE.AnimationManager = YYC.Class(YE.CollectionManager, {
        Init: function () {
            this.base();
        },
        Public: {
        },
        Static: {
            create: function () {
                return new this();
            }
        }
    });
}());