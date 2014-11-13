/**YEngine2D
 * author：YYC
 * date：2014-10-04
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
YE.JumpBy = YYC.Class(YE.ActionInterval, {
    Init: function (duration, x, y, height) {
        this.base();

        this.ye___duration = duration;
        this.ye___x = x;
        this.ye___y = y;
        this.ye___height = height;
    },
    Private: {
        ye___elapsed: 0,
        ye___topY: 0,
        ye___topX: 0,
        ye___x: 0,
        ye___y: 0,
        ye___destX: 0,
        ye___destY: 0,
        ye___posX: 0,
        ye___posY: 0,
        ye___directionX: null,
        ye___directionY: null,

        ye___isFinish: function () {
            return this.ye___elapsed >= this.ye___duration;
        },
        ye___computeTotalDistance: function () {
            this.ye___totalX = Math.abs(this.ye___x);
            this.ye___totalY = this.ye___height * 2 + Math.abs(this.ye___y);
        },
        ye___computeDestPos: function () {
            this.ye___destX = this.ye___posX + this.ye___x;
            this.ye___destY = this.ye___posY + this.ye___y;
        },
        ye___initDirection: function () {
            if (this.ye___height === 0 && this.ye___y > 0) {
                this.ye___directionY = "down";
            }
            else {
                this.ye___directionY = "up";
            }

            if (this.ye___x > 0) {
                this.ye___directionX = "right";
            }
            else {
                this.ye___directionX = "left";
            }
        },
        ye___savePosition: function () {
            var target = null;

            target = this.getTarget();

            this.ye___posX = target.getPositionX();
            this.ye___posY = target.getPositionY();
        },
        ye___computeTopY: function () {
            this.ye___topY = Math.min(this.ye___posY, this.ye___posY + this.ye___y) - this.ye___height;
        },
        ye___setTargetToDest: function () {
            this.getTarget().setPosition(this.ye___destX, this.ye___destY);
        },
        ye___computeMoveDistance: function (time) {
            var ratio = null,
                moveX = null,
                moveY = null;

            ratio = time / this.ye___duration;
            moveX = ratio * this.ye___totalX;
            moveY = ratio * this.ye___totalY;

            return [moveX, moveY];
        },
        ye___setPosX: function (moveX) {
            if (this.ye___directionX === "left") {
                this.ye___posX -= moveX;
            }
            else {
                this.ye___posX += moveX;
            }

            this.getTarget().setPositionX(this.ye___posX);
        },
        ye___setPosY: function (moveY) {
            if (this.ye___directionY === "up") {
                this.ye___posY -= moveY;

                if (this.ye___isJumpOverTopPoint()) {
                    this.ye___enterDownProcess();
                }
            }
            else if (this.ye___directionY === "down") {
                this.ye___posY += moveY;
            }

            this.getTarget().setPositionY(this.ye___posY);
        },
        ye___isJumpOverTopPoint: function () {
            return this.ye___posY <= this.ye___topY;
        },
        ye___enterDownProcess: function () {
            this.ye___directionY = "down";
            this.ye___posY = this.ye___topY + (this.ye___topY - this.ye___posY);
        }
    },
    Public: {
        initWhenCreate: function () {
            YE.error(this.ye___height < 0, "高度必须为非负值");

            this.ye___computeTotalDistance();
            this.ye___initDirection();
        },
        init: function () {
            //初始化时保存精灵跳跃前的坐标，然后在跳跃的过程中基于该坐标变换。
            //相对于跳跃过程中基于精灵的坐标变换，可避免受到用户修改精灵坐标的影响
            this.ye___savePosition();

            this.ye___computeTopY();
            this.ye___computeDestPos();
        },
        update: function (time) {
            var target = null,
                dis = null;

            target = this.getTarget();

            if (this.ye___isFinish()) {
                this.finish();
                this.ye___setTargetToDest();
                return;
            }

            dis = this.ye___computeMoveDistance(time);

            this.ye___setPosX(dis[0]);
            this.ye___setPosY(dis[1]);

            this.ye___elapsed += time;
        },
        copy: function () {
            return YE.JumpBy.create(this.ye___duration, this.ye___x, this.ye___y, this.ye___height);
        },
        reverse: function () {
            return YE.JumpBy.create(this.ye___duration, -this.ye___x, -this.ye___y, this.ye___height);
        }
    },
    Static: {
        create: function (duration, x, y, height) {
            var action = new this(duration, x, y, height);

            action.initWhenCreate();

            return action;
        }
    }
});