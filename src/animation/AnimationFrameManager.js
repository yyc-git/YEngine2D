/**YEngine2D
 * author：YYC
 * date：2014-04-20
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
YE.AnimationFrameManager = YYC.Class(YE.Entity, {
    Init: function () {
        this.ye_animationFrame = YE.AnimationFrame.create();
    },
    Private: {
        ye_animationFrame: null
    },
    Public: {
        initAndReturnAnim: function (animName, tag) {
            var anim = null;

            if (YE.Tool.judge.isString(arguments[0])) {
                anim = this.getAnim(arguments[0]);
            }
            else {
                anim = arguments[0];
            }

            if (tag) {
                anim.setTag(tag);
            }

            anim.start();

            return anim;
        },
        stopAnim: function (animName) {
            this.getAnim(animName).stop();
        },
        startAnim: function (animName) {
            this.getAnim(animName).start();
        },
        getAnim: function (animName) {
            return this.ye_animationFrame.getAnim(animName);
        },
        getAnims: function () {
            return this.ye_animationFrame.getAnims();
        },
        addAnim: function (animName, anim) {
            anim.setTag(animName);
            this.ye_animationFrame.addAnim(animName, anim);
        },
        resetAnim: function (animName) {
            this.getAnim(animName).reset();
        }
    },
    Static: {
        create: function () {
            return new this();
        }
    }
});
