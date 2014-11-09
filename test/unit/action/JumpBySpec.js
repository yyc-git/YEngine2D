describe("JumpBy", function () {
    var action = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = new YE.JumpBy();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("initWhenCreate", function () {
        it("如果跳跃高度height<0，则报错", function () {
            sandbox.stub(YE, "error");
            action = new YE.JumpBy(0.1, 1, 1, -1);

            action.initWhenCreate();

            expect(YE.error).toCalled();
        });

        describe("设置初始的动作x方向", function () {
            it("如果终点在起点左方，则动作x方向为left", function () {
                action = new YE.JumpBy(0.1, -2, 1, 10);

                action.initWhenCreate();

                expect(action.ye___directionX).toEqual("left");
            });
            it("否则为right", function () {
                action = new YE.JumpBy(0.1, 2, 1, 100);

                action.initWhenCreate();

                expect(action.ye___directionX).toEqual("right");
            });
        });
        describe("设置初始的动作y方向", function () {
            it("如果跳跃高度为0且终点在起点下方，则动作y方向为down", function () {
                action = new YE.JumpBy(0.1, 2, 1, 0);

                action.initWhenCreate();

                expect(action.ye___directionY).toEqual("down");
            });
            it("否则为up", function () {
                action = new YE.JumpBy(0.1, 2, 1, 100);

                action.initWhenCreate();

                expect(action.ye___directionY).toEqual("up");
            });
        });

        describe("计算精灵x方向总共移动的距离", function () {
            it("测试精灵往左方跳跃的情况", function () {
                action = new YE.JumpBy(0.1, -2, 1, 100);

                action.initWhenCreate();

                expect(action.ye___totalX).toEqual(2);
            });
            it("测试精灵往右方跳跃的情况", function () {
                action = new YE.JumpBy(0.1, 2, 1, 100);

                action.initWhenCreate();

                expect(action.ye___totalX).toEqual(2);
            });
        });
        describe("计算精灵y方向总共移动的距离，其中高度是以起点和终点中y坐标最小的点为基准", function () {
            it("测试终点在起点下方的情况", function () {
                action = new YE.JumpBy(0.1, 2, 20, 100);

                action.initWhenCreate();

                expect(action.ye___totalY).toEqual(220);
            });
            it("测试终点在起点上方的情况", function () {
                action = new YE.JumpBy(0.1, 2, -20, 100);

                action.initWhenCreate();

                expect(action.ye___totalY).toEqual(220);
            });
        });
    });

    describe("init", function () {
        var fakeTarget = null;

        beforeEach(function () {
            fakeTarget = {
                getPositionX: sandbox.stub().returns(20),
                getPositionY: sandbox.stub().returns(100)
            };
            sandbox.stub(action, "getTarget").returns(fakeTarget);
        });

        it("保存精灵坐标", function () {
            action.init();

            expect(action.ye___posX).toEqual(20);
            expect(action.ye___posY).toEqual(100);
        });

        describe("计算跳跃顶点的y坐标", function () {
            beforeEach(function () {
                sandbox.stub(action, "ye___height", 60);
            });

            it("测试终点在起点下方的情况", function () {
                sandbox.stub(action, "ye___y", 10);

                action.init();

                expect(action.ye___topY).toEqual(40);
            });
            it("测试终点在起点上方的情况", function () {
                sandbox.stub(action, "ye___y", -10);

                action.init();

                expect(action.ye___topY).toEqual(30);
            });
        });

        it("计算跳跃目的地坐标", function () {
            fakeTarget.getPositionX.returns(100);
            sandbox.stub(action, "ye___x", 10);
            fakeTarget.getPositionY.returns(200);
            sandbox.stub(action, "ye___y", -20);

            action.init();

            expect(action.ye___destX).toEqual(100 + 10);
            expect(action.ye___destY).toEqual(200 - 20);
        });
    });

    describe("update", function () {
        var fakeTarget = null;

        beforeEach(function () {
            fakeTarget = {
                setPosition: sandbox.stub(),
                setPositionX: sandbox.stub(),
                setPositionY: sandbox.stub()
            };
            sandbox.stub(action, "getTarget").returns(fakeTarget);
        });

        describe("如果完成了跳跃（根据跳跃时间判断）", function () {
            beforeEach(function () {
                sandbox.stub(action, "finish");
                sandbox.stub(action, "ye___elapsed", 1);
                sandbox.stub(action, "ye___duration", 1);
            });

            it("完成动作", function () {
                action.update();

                expect(action.finish).toCalledOnce();
            });
            it("将精灵定位到目的地坐标", function () {
                sandbox.stub(action, "ye___destX", 10);
                sandbox.stub(action, "ye___destY", 20);

                action.update();

                expect(fakeTarget.setPosition).toCalledWith(10, 20);
            });
        });

        describe("否则", function () {
            var time = null;

            beforeEach(function () {
                time = 0.1;
                sandbox.stub(action, "ye___elapsed", 0);
                sandbox.stub(action, "ye___duration", 1);
            });
            afterEach(function () {
            });

            describe("修改初始化时保存的精灵坐标，并将其设置为精灵的坐标", function () {
                beforeEach(function () {
                    sandbox.stub(action, "ye___totalX", 50);
                    sandbox.stub(action, "ye___totalY", 100);
                    sandbox.stub(action, "ye___topY", 20);
                });
                afterEach(function () {
                });

                it("跳过最高点后，进入下降过程，修正保存的坐标，并设置动作y方向为“down”", function () {
                    sandbox.stub(action, "ye___directionY", "up");
                    sandbox.stub(action, "ye___posY", 24);

                    action.update(time);

                    expect(action.ye___posY).toEqual(26);
                    expect(action.ye___directionY).toEqual("down");
                });
                it("设置修改后的坐标为精灵的坐标", function () {
                    sandbox.stub(action, "ye___directionX", "right");
                    sandbox.stub(action, "ye___directionY", "up");
                    sandbox.stub(action, "ye___posX", 30);
                    sandbox.stub(action, "ye___posY", 50);

                    action.update(time);

                    expect(fakeTarget.setPositionX).toCalledWith(35);
                    expect(fakeTarget.setPositionY).toCalledWith(40);
                });

                function judgeJumpUpAndJumpDown(directionX, posXye___beforeEdit, posXye___afterEdit) {
                    it("测试上升的情况", function () {
                        sandbox.stub(action, "ye___directionX", directionX);
                        sandbox.stub(action, "ye___directionY", "up");
                        sandbox.stub(action, "ye___posX", posXye___beforeEdit);
                        sandbox.stub(action, "ye___posY", 50);

                        action.update(time);

                        expect(action.ye___posX).toEqual(posXye___afterEdit);
                        expect(action.ye___posY).toEqual(40);
                    });
                    it("测试下降的情况", function () {
                        sandbox.stub(action, "ye___directionX", directionX);
                        sandbox.stub(action, "ye___directionY", "down");
                        sandbox.stub(action, "ye___posX", posXye___beforeEdit);
                        sandbox.stub(action, "ye___posY", 50);

                        action.update(time);

                        expect(action.ye___posX).toEqual(posXye___afterEdit);
                        expect(action.ye___posY).toEqual(60);
                    });
                }

                describe("测试终点在起点右方的情况", function () {
                    judgeJumpUpAndJumpDown("right", 30, 35);
                });

                describe("测试终点在起点左方的情况", function () {
                    judgeJumpUpAndJumpDown("left", 30, 25);
                });
            });

            it("记录已经过的时间", function () {
                action.update(time);

                expect(action.ye___elapsed).toEqual(0.1);
            });
        });
    });

    describe("copy", function () {
        it("返回动作副本", function () {
            var result = action.copy();

            expect(result).not.toBeSame(action);
            expect(result).toBeInstanceOf(YE.JumpBy);
        });
    });

    describe("reverse", function () {
        it("反转跳跃的距离", function () {
            sandbox.stub(action, "ye___x", 10);
            sandbox.stub(action, "ye___y", 20);

            var result = action.reverse();

            expect(result.ye___x).toEqual(-10);
            expect(result.ye___y).toEqual(-20);
        });
    });
});
