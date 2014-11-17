/**YEngine2D
 * author：YYC
 * date：2013-12-20
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    var _instance = null;

    var GameState = {
        NORMAL: 0,
        PAUSE: 1,
        END: 2
    };

    var LoopType = {
        NONE: 0,
        REQUESTANIMATIONFRAME: 1,
        INTERVAL: 2
    };

    YE.Director = YYC.Class(YE.Entity, {
        Init: function () {
            this.base();
        },
        Private: {
            ye_STARTING_FPS: 60,

            ye_startTime: 0,
            ye_lastTime: 0,

            ye_fps: 0,
            ye_loopInterval: 0,
            ye_lastLoopInterval: 0,

            ye_currentScene: null,

            ye_loopId: null,
            //主循环类型
            ye_loopType: null,

            ye_isRequestAnimFrameLoopAdded: false,

            //内部游戏状态
            ye_gameState: null,
            //计时器序号
            ye_timerIndex: 0,

            ye_endLoop: false,


            ye_getTimeNow: function () {
                return +new Date();
            },
            ye_loopBody: function (time) {
                this.ye_tick(time);

                this.ye_currentScene.startLoop();
                this.ye_currentScene.run();
                this.ye_currentScene.endLoop();
            },
            ye_tick: function (time) {
                this.ye_updateFps(time);
                this.gameTime = (this.ye_getTimeNow() - this.ye_startTime) / 1000;
                this.ye_lastTime = time;
            },
            ye_updateFps: function (time) {
                if (this.ye_loopType === LoopType.INTERVAL) {
                    this.ye_fps = 1 / this.ye_loopInterval;
                    return;
                }

                if (this.ye_lastTime === 0) {
                    this.ye_fps = this.ye_STARTING_FPS;
                }
                else {
                    this.ye_fps = 1000 / (time - this.ye_lastTime);
                }
            },
            ye_isToUseIntervalLoop: function () {
                return this.ye_loopInterval !== 1 / this.ye_STARTING_FPS;
            },
            ye_startLoop: function () {
                var self = this,
                    mainLoop = null;

                if (this.ye_isToUseIntervalLoop()) {
                    this.ye_loopId = window.setInterval(function mainLoop() {
                        self.ye_loopBody(self.ye_getTimeNow());
                    }, this.ye_loopInterval * 1000);

                    this.ye_loopType = LoopType.INTERVAL;
                }
                else {
                    this.ye_endLoop = false;

                    if (this.ye_isRequestAnimFrameLoopAdded) {
                        return YE.returnForTest;
                    }

                    mainLoop = function (time) {
                        self.ye_loopBody(time);

                        if (self.ye_endLoop) {
                            self.ye_isRequestAnimFrameLoopAdded = false;
                            return;
                        }

                        self.ye_loopId = window.requestNextAnimationFrame(mainLoop);
                    };
                    this.ye_loopId = window.requestNextAnimationFrame(mainLoop);
                    this.ye_loopType = LoopType.REQUESTANIMATIONFRAME;
                }

                this.ye_isRequestAnimFrameLoopAdded = true;
            },
            ye_endNextLoop: function () {
                window.clearInterval(this.ye_loopId);
                this.ye_endLoop = true;
            },
            ye_restart: function () {
                this.ye_endNextLoop();
                this.ye_startLoop();
            }
        },
        Public: {
            //游戏运行时间，单位为秒
            gameTime: 0,

            initWhenCreate: function () {
                this.ye_loopInterval = 1 / this.ye_STARTING_FPS;
            },
            runWithScene: function (scene) {
                scene.init(this);
                this.setCurrentScene(scene);

                this.ye_startTime = this.ye_getTimeNow();
                this.ye_gameState = GameState.NORMAL;

                this.ye_startLoop();
            },
            setCurrentScene: function (scene) {
                if (this.ye_currentScene) {
                    this.ye_currentScene.onExit();
                }

                this.ye_currentScene = scene;
                scene.onEnter();
            },
            getCurrentScene: function () {
                return this.ye_currentScene;
            },
            getFps: function () {
                return this.ye_fps;
            },
            getPixPerFrame: function (speed) {
//                if (YE.main.getConfig().isDebug) {
                return speed / this.ye_STARTING_FPS;
//                }
//
//                return speed / this.ye_fps;
            },
            end: function () {
                this.ye_endNextLoop();
                this.ye_gameState = GameState.END;
                YE.Tool.asyn.clearAllTimer(this.ye_timerIndex);
            },
            pause: function () {
                if (this.ye_gameState === GameState.PAUSE) {
                    return YE.returnForTest;
                }

                ////降低cpu消耗
                //this.setLoopIntervalAndRestart(1);

                this.ye_lastLoopInterval = this.ye_loopInterval;
                this.ye_endNextLoop();
                this.ye_gameState = GameState.PAUSE;
            },
            resume: function () {
                if (this.ye_gameState !== GameState.PAUSE) {
                    return YE.returnForTest;
                }

                this.ye_loopInterval = this.ye_lastLoopInterval;
                this.ye_restart();
                this.ye_gameState = GameState.NORMAL;
            },
            /**
             * 设置主循环间隔时间
             * @param interval 间隔时间（单位为秒）
             */
            setLoopIntervalAndRestart: function (interval) {
                this.ye_loopInterval = interval;
                this.ye_restart();
            },
            resumeRequestAnimFrameLoop: function () {
                this.ye_loopInterval = 1 / this.ye_STARTING_FPS;
                this.ye_restart();
            },
            /**
             * 设置定时器起始序号，用于stop中清除所有定时器
             * @param index
             */
            setTimerIndex: function (index) {
                this.ye_timerIndex = index;
            },

            //*供测试使用
            forTest_getGameState: function () {
                return GameState;
            },
            forTest_getLoopType: function () {
                return LoopType;
            }
        },
        Static: {
            getInstance: function () {
                if (_instance === null) {
                    _instance = new this();
                    _instance.initWhenCreate();
                }
                return _instance;
            }
        }
    });
}());