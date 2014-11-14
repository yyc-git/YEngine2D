/**YSoundEngine 测试
 * author：YYC
 * date：2014-05-26
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("YSoundEngine", function () {
    var engine = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        engine = new YE.YSoundEngine({});
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("initWhenCreate", function () {
        function setParam(config){
            engine.ye_urlArr = config.urlArr;
            engine.ye_onload = config.onload;
            engine.ye_onerror = config.onerror;
        }

        beforeEach(function () {
            sandbox.stub(engine, "ye_load");
        });

        it("如果浏览器不支持Audio对象，则提示并返回", function () {
            sandbox.stub(window, "Audio", undefined);
            sandbox.stub(YE, "log");

            var result = engine.initWhenCreate();

            expect(result).toEqual(YE.returnForTest);
            expect(YE.log).toCalledOnce();
        });

        describe("使用Html5 Audio API加载声音", function () {
            var fakeSound = null;

            beforeEach(function () {
                fakeSound = {
                    src: null,
                    addEventListener: sandbox.stub()
                };
                sandbox.stub(window, "Audio").returns(fakeSound);
            });
            afterEach(function () {
            });

            it("创建声音对象", function () {
                setParam({url: ["../a.mp3"]});

                engine.initWhenCreate();

                expect(window.Audio).toCalledOnce();
            });

            describe("测试audio的事件绑定", function () {
                beforeEach(function () {
                });

                it("绑定onload到canplaythrough事件", function () {
                    var fakeOnload = sandbox.stub();
                    setParam({
                        onload: fakeOnload
                    });

                    engine.initWhenCreate();
                    fakeSound.addEventListener.firstCall.callArgOn(1, fakeSound);

                    expect(fakeSound.addEventListener.firstCall.args[0]).toEqual("canplaythrough");
                });

                describe("绑定ended事件，重置声音位置", function () {
                    beforeEach(function () {
                        fakeSound.load = sandbox.stub();
                    });

                    it("绑定ended事件", function () {
                        engine.initWhenCreate();

                        expect(fakeSound.addEventListener.thirdCall.args[0]).toEqual("ended");
                    });
                    it("chrome下调用load方法", function () {
                        sandbox.stub(YE.Tool.judge.browser, "isChrome").returns(true);

                        engine.initWhenCreate();
                        fakeSound.addEventListener.thirdCall.callArgOn(1, fakeSound);

                        expect(fakeSound.load).toCalledOnce();
                    });
                    it("firefox下重置currentTime属性", function () {
                        sandbox.stub(YE.Tool.judge.browser, "isChrome").returns(false);
                        sandbox.stub(YE.Tool.judge.browser, "isFF").returns(true);
                        fakeSound.currentTime = 100;

                        engine.initWhenCreate();
                        fakeSound.addEventListener.thirdCall.callArgOn(1, fakeSound);

                        expect(fakeSound.currentTime).toEqual(0);
                    });
                    it("其它浏览器下则报错", function () {
                        sandbox.stub(YE.Tool.judge.browser, "isChrome").returns(false);
                        sandbox.stub(YE.Tool.judge.browser, "isFF").returns(false);
                        sandbox.stub(YE.Tool.judge.browser, "isIE").returns(true);
                        sandbox.stub(YE, "error");

                        engine.initWhenCreate();
                        fakeSound.addEventListener.thirdCall.callArg(1);

                        expect(YE.error).toCalledOnce();
                    });
                });
                it("绑定onerror到error事件，传入errorCode", function () {
                    var fakeOnerror = sandbox.stub();
                    fakeSound.error = {code: 4};
                    setParam({
                        onerror: fakeOnerror
                    });

                    engine.initWhenCreate();

                    fakeSound.addEventListener.secondCall.callArgOn(1, fakeSound);
                    expect(fakeSound.addEventListener.secondCall.args[0]).toEqual("error");
                    expect(fakeOnerror).toCalledWith(fakeSound.error.code);
                });
            });

            it("加载声音", function () {
                setParam({url: ["../a.mpe"]});

                engine.initWhenCreate();

                expect(engine.ye_load).toCalledOnce();
            });
        });
    });

    describe("ye_load", function () {
        beforeEach(function () {
            engine.ye_audio = {
                src: null
            };
        });

        describe("获得浏览器支持的声音文件url", function () {
            var fakeUrlArr = null;

            beforeEach(function () {
                fakeUrlArr = ["../a.mp3", "../a.wav"];
                engine.ye_urlArr = fakeUrlArr;
            });
            afterEach(function () {
            });

            it("如果浏览器为firefox，则它不支持mp3格式的声音文件", function () {
                sandbox.stub(YE.Tool.judge.browser, "isFF").returns(true);
                sandbox.stub(window, "Audio").returns({
                    canPlayType: sandbox.stub().returns(true)
                });

                engine.ye_load();

                expect(engine.ye_audio.src).toEqual(fakeUrlArr[1]);
            });
            it("其它浏览器则根据canPlayType方法来判断", function () {
                var fakeAudio = {
                    canPlayType: sandbox.stub()
                };
                sandbox.stub(YE.Tool.judge.browser, "isFF").returns(false);
                sandbox.stub(window, "Audio").returns(fakeAudio);
                fakeAudio.canPlayType.onCall(0).returns("");
                fakeAudio.canPlayType.onCall(1).returns("maybe");

                engine.ye_load();

                expect(engine.ye_audio.src).toEqual(fakeUrlArr[1]);
            });
        });

        it("设置声音的加载路径", function () {
            var fakeUrl = "../a.mp3";
            sandbox.stub(engine, "ye_getCanPlayUrl").returns(fakeUrl);

            engine.ye_load();

            expect(engine.ye_audio.src).toEqual(fakeUrl);
        });
    });

    describe("play", function () {
        it("播放声音", function () {
            var fakeAudio = sandbox.createSpyObj("play");
            sandbox.stub(engine, "ye_audio", fakeAudio);

            engine.play();

            expect(fakeAudio.play).toCalledOnce();
        });
    });
});
