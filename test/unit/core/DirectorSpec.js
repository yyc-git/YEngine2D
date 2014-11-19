/**YEngine2D
 * author：YYC
 * date：2013-12-24
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Director", function () {
    var director = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        director = new YE.Director();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("该类为单例类", function () {
        testTool.judgeSingleInstance(YE.Director);
    });

    describe("setCurrentScene", function () {
        it("如果当前场景存在，则调用当前场景的onexit", function () {
            var fakeScene1 = sandbox.createSpyObj("onExit");
            director.ye_currentScene = fakeScene1;
            var fakeScene2 = sandbox.createSpyObj("onEnter");

            director.setCurrentScene(fakeScene2);

            expect(fakeScene1.onExit).toCalledOnce();

        });
        it("设置场景为当前使用场景", function () {
            var fakeScene = sandbox.createSpyObj("onEnter");

            director.setCurrentScene(fakeScene);

            expect(director.getCurrentScene()).toEqual(fakeScene);
        });
        it("调用场景onenter", function () {
            var fakeScene = sandbox.createSpyObj("onEnter");

            director.setCurrentScene(fakeScene);

            expect(fakeScene.onEnter).toCalledOnce();
        });
    });

    describe("getCurrentScene", function () {
        it("获得当前使用场景", function () {
        });
    });

    describe("runWithScene", function () {
        var fakeScene = null;

        beforeEach(function () {
            fakeScene = sandbox.createSpyObj("init", "onEnter");
            sandbox.stub(director, "ye_startLoop");
        });

        it("设置当前场景，获得场景类实例", function () {
            sandbox.stub(director, "setCurrentScene");

            director.runWithScene(fakeScene);

            expect(director.setCurrentScene).toCalledOnce();
        });
        it("初始化场景", function () {
            director.runWithScene(fakeScene);

            expect(fakeScene.init).toCalledWith(director);
        });
        it("获得开始时间（毫秒）", function () {
        });
        it("初始化游戏状态", function () {
            director.ye_gameState = YE.Director.GameState.END;

            director.runWithScene(fakeScene);

            expect(director.ye_gameState).toEqual(YE.Director.GameState.NORMAL);
        });
        it("启动主循环", function () {
            director.runWithScene(fakeScene);

            expect(director.ye_startLoop).toCalledOnce();
        });
    });

    describe("setLoopIntervalAndRestart", function () {
        it("设置主循环的间隔时间", function () {
            var interval = 100;

            director.setLoopIntervalAndRestart(interval);

            expect(director.ye_loopInterval).toEqual(interval);
        });
        it("更新主循环", function () {
            sandbox.stub(director, "ye_endNextLoop");
            sandbox.stub(director, "ye_startLoop");

            director.setLoopIntervalAndRestart();

            expect(director.ye_endNextLoop).toCalledOnce();
            expect(director.ye_startLoop).toCalledAfter(director.ye_endNextLoop);
        });
    });

    describe("resumeRequestAnimFrameLoop", function () {
        it("恢复使用requestNextAnimationFrame实现主循环", function () {
            sandbox.stub(director, "ye_endNextLoop");
            sandbox.stub(director, "ye_startLoop");

            director.resumeRequestAnimFrameLoop();

            expect(director.ye_loopInterval).toEqual(1 / YE.Director.STARTING_FPS);
            expect(director.ye_endNextLoop).toCalledOnce();
            expect(director.ye_startLoop).toCalledAfter(director.ye_endNextLoop);
        });
    });


    describe("ye_startLoop", function () {
        beforeEach(function () {
            sandbox.stub(director, "ye_loopBody");
        });

//        it("设置游戏状态为NORMAL", function () {
//            director.ye_startLoop();
//
//            expect(director.ye_gameState).toEqual(YE.Director.GameState.NORMAL);
//        });

        describe("如果使用setInterval实现主循环", function () {
            beforeEach(function () {
                sandbox.stub(director, "ye_isToUseIntervalLoop").returns(true);
                sandbox.stub(window, "setInterval");
            });

            it("加入setInterval循环", function () {
                director.ye_startLoop();

                expect(window.setInterval).toCalledOnce();
            });
            it("循环间隔时间为ye_loopInterval * 1000", function () {
                director.ye_startLoop();

                expect(window.setInterval.args[0][1]).toEqual(director.ye_loopInterval * 1000);
            });
            it("执行循环主体", function () {
                var fakeDateNow = 10;
                sandbox.stub(director, "ye_getTimeNow").returns(fakeDateNow);

                director.ye_startLoop();
                window.setInterval.callArgOn(0, director);

                expect(director.ye_loopBody).toCalledWith(fakeDateNow);
            });
            it("设置循环类型为INTERVAL", function () {
                director.ye_startLoop();

                expect(director.ye_loopType).toEqual(YE.Director.LoopType.INTERVAL);
            });
        });

        describe("如果使用requestNextAnimationFrame实现主循环", function () {
            beforeEach(function () {
                sandbox.stub(director, "ye_isToUseIntervalLoop").returns(false);
                sandbox.stub(window, "requestNextAnimationFrame");
            });

            it("如果当前存在request主循环，则设置退出主循环标志位为false（使主循环不会退出）并返回", function () {
                director.ye_isRequestAnimFrameLoopAdded = true;
                director.ye_endLoop = true;

                var result = director.ye_startLoop();

                expect(director.ye_endLoop).toBeFalsy();
                expect(result).toEqual(YE.returnForTest);
            });

            describe("否则", function(){
                beforeEach(function(){
                    director.ye_isRequestAnimFrameLoopAdded = false;
                });

                it("加入requestNextAnimationFrame循环回调函数", function () {
                    window.requestNextAnimationFrame.returns(1);

                    director.ye_startLoop();

                    expect(window.requestNextAnimationFrame).toCalledOnce();
                    expect(director.ye_loopId).toEqual(1);
                });

                describe("测试循环回调函数", function () {
                    it("执行循环主体", function () {
                        var time = 1;

                        director.ye_startLoop();
                        window.requestNextAnimationFrame.callArgOnWith(0, director, time);

                        expect(director.ye_loopBody).toCalledWith(time);
                    });
                    it("如果要停止循环，则不加入下一次的requestNextAnimationFrame循环回调函数，" +
                        "并标志为当前没有加入request主循环", function () {
                        director.ye_startLoop();
                        director.ye_endLoop = true;
                        window.requestNextAnimationFrame.callArgOnWith(0, director);

                        expect(director.ye_isRequestAnimFrameLoopAdded).toBeFalsy();
                        expect(window.requestNextAnimationFrame).toCalledOnce();

                    });
                });

                it("设置循环类型为REQUESTANIMATIONFRAME", function () {
                    director.ye_startLoop();

                    expect(director.ye_loopType).toEqual(YE.Director.LoopType.REQUESTANIMATIONFRAME);
                });
            });
        });
    });

    describe("ye_endNextLoop，终止下次循环（本次循环不会终止）", function () {
        it("停止setInterval的循环", function () {
            sandbox.stub(window, "clearInterval");
            director.ye_loopId = 1;

            director.ye_endNextLoop();

            expect(window.clearInterval).toCalledWith(1);
        });
        it("设置停止循环标志位true", function () {
            director.ye_endLoop = false;

            director.ye_endNextLoop();

            expect(director.ye_endLoop).toBeTruthy();
        });
    });

    describe("测试循环内容ye_loopBody", function () {
        var fakeScene = null;

        beforeEach(function () {
            fakeScene = sandbox.createSpyObj("run", "startLoop", "endLoop");
            director.ye_currentScene = fakeScene;
            sandbox.stub()
        });

        describe("更新fps", function () {
            it("如果是第一次执行，则令fps为初始值60", function () {
                director.ye_loopBody();

                expect(director.getFps()).toEqual(60);
            });

            describe("计算实际的fps", function () {
                it("如果主循环为interval循环", function () {
                    director.ye_loopType = YE.Director.LoopType.INTERVAL;
                    director.ye_loopInterval = 10;

                    director.ye_loopBody();

                    expect(director.getFps()).toEqual(0.1);
                });
                it("如果主循环为request循环", function () {
                    director.ye_loopType = YE.Director.LoopType.REQUESTANIMATIONFRAME;
                    director.ye_lastTime = 100;

                    director.ye_loopBody(1100);

                    expect(director.getFps()).toEqual(1);
                });
            });
        });

        it("更新gameTime", function () {
            sandbox.stub(director, "ye_getTimeNow").returns(1100);
            director.ye_startTime = 100;

            director.ye_loopBody();

            expect(director.gameTime).toEqual(1);
        });

        it("调用场景的startLoop", function () {
            director.ye_loopBody();

            expect(fakeScene.startLoop).toCalledOnce();
        });
        it("启动当前场景", function () {
            director.ye_loopBody();

            expect(fakeScene.run).toCalledOnce();
        });
        it("调用场景的endLoop", function () {
            director.ye_loopBody();

            expect(fakeScene.endLoop).toCalledOnce();
        });
    });

    describe("getFps", function () {
    });

    describe("getPixPerFrame", function () {
        it("计算精灵每帧移动的距离（单位为像素pix），fps为常量", function () {
            var fps = 60;
            var sandbox = sinon.sandbox.create();
            sandbox.stub(YE.main, "getConfig").returns({
                isDebug: true
            });
            sandbox.stub(YE.Director, "STARTING_FPS", fps);

            expect(director.getPixPerFrame(1)).toEqual(1 / YE.Director.STARTING_FPS);

            sandbox.restore();
        });
//        it("否则，计算精灵每帧移动的距离（单位为像素pix）。距离=精灵每秒移动像素值（即速度）*每一帧持续的秒数（即1/fps）", function () {
//            var sandbox = sinon.sandbox.create();
//            sandbox.stub(YE.main, "getConfig").returns({
//                isDebug: false
//            });
//            director.ye_fps = 10;
//
//            expect(director.getPixPerFrame(2)).toEqual(0.2);
//
//            sandbox.restore();
//        });
    });

    describe("end", function () {
        beforeEach(function () {
            sandbox.stub(director, "ye_endNextLoop");
            sandbox.stub(YE.Tool.asyn, "clearAllTimer");
        });

        it("停止下次主循环", function () {
            director.end();

            expect(director.ye_endNextLoop).toCalledOnce();
        });
        it("游戏状态设为END", function () {
            director.end();

            expect(director.ye_gameState).toEqual(YE.Director.GameState.END);
        });
        it("停止所有计时器", function () {
            var index = 10;
            director.setTimerIndex(index);

            director.end();

            expect(YE.Tool.asyn.clearAllTimer).toCalledWith(index);
        });
    });
//
    describe("pause", function () {
        it("如果已经暂停了，则返回", function () {
            director.ye_gameState = YE.Director.GameState.PAUSE;

            var result = director.pause();

            expect(result).toEqual(YE.returnForTest);
        });

        describe("否则", function () {
            beforeEach(function () {
                director.ye_gameState = YE.Director.GameState.NORMAL;
            });
            afterEach(function () {
            });

            it("保存间隔时间", function () {
                director.ye_loopInterval = 100;

                director.pause();

                expect(director.ye_lastLoopInterval).toEqual(director.ye_loopInterval);
            });
            it("停止主循环", function () {
                sandbox.stub(director, "ye_endNextLoop");

                director.pause();

                expect(director.ye_endNextLoop).toCalledOnce();
            });
            it("设置游戏状态为PAUSE", function () {
                director.pause();

                expect(director.ye_gameState).toEqual(YE.Director.GameState.PAUSE);
            });
        });
    });

    describe("resume", function () {
        beforeEach(function () {
            sandbox.stub(director, "ye_endNextLoop");
            sandbox.stub(director, "ye_startLoop");
        });

        it("如果没有暂停，则返回", function () {
            director.ye_gameState = YE.Director.GameState.NORMAL;

            var result = director.resume();

            expect(result).toEqual(YE.returnForTest);
        });

        describe("否则", function () {
            beforeEach(function () {
                director.ye_gameState = YE.Director.GameState.PAUSE;
            });

            it("恢复间隔时间", function () {
                director.ye_lastLoopInterval = 100;

                director.resume();

                expect(director.ye_loopInterval).toEqual(director.ye_lastLoopInterval);
            });
            it("重启主循环", function () {
                director.resume();

                expect(director.ye_endNextLoop).toCalledOnce();
                expect(director.ye_startLoop).toCalledAfter(director.ye_endNextLoop);
            });
            it("设置游戏状态为NORMAL", function () {
                director.resume();

                expect(director.ye_gameState).toEqual(YE.Director.GameState.NORMAL);
            });
        });
    });

    describe("initWhenCreate", function () {
        it("初始化主循环间隔时间", function () {
            director.initWhenCreate();

            expect(director.ye_loopInterval).toEqual(1 / YE.Director.STARTING_FPS);
        });
    });
});