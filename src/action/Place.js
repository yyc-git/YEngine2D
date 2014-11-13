/**YEngine2D
 * author：YYC
 * date：2014-10-04
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
YE.Place = YYC.Class(YE.ActionInstant, {
    Init: function (x, y) {
        this.base();

        this.ye___posX = x;
        this.ye___posY = y;
    },
    Private: {
        ye___posX: null,
        ye___posY: null
    },
    Public: {
        update: function (time) {
            var target = null;

            target = this.getTarget();

            target.setPositionX(this.ye___posX);
            target.setPositionY(this.ye___posY);

            this.finish();
        },
        copy: function () {
            return YE.Place.create(this.ye___posX, this.ye___posY);
        },
        reverse: function () {
            this.ye___posX = -this.ye___posX;
            this.ye___posY = -this.ye___posY;

            return this;
        }
    },
    Static: {
        create: function (x, y) {
            var action = new this(x, y);

            return action;
        }
    }
});