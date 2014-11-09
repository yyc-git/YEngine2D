/**YEngine2D 动画管理类
 * author：YYC
 * date：2014-02-27
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
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
