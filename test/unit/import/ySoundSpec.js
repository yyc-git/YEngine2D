/**YSound 测试
 * author：YYC
 * date：2014-05-26
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("YSound", function () {
    var sound = null;
    var sandbox = null;
    var AudioType = null,
        PlayState = null,
        AudioBase = null,
        WebAudio = null,
        Html5Audio = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        sound = new YE.YSound({});
        AudioType = YE.YSound.AudioType;
        PlayState = YE.YSound.PlayState;
        AudioBase = sound.forTest_getAudioBase();
        WebAudio = sound.forTest_getWebAudio();
        Html5Audio = sound.forTest_getHtml5Audio();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("initWhenCreate", function () {
        describe("判断audioType，创建对应的audio实例并加载声音", function () {
            var audioObj = null;

            function judge(type, Class) {
                sandbox.stub(YE.YSound, "_audioType", type);
                sandbox.stub(Class, "create").returns(audioObj);
                sound.ye_config = {};

                sound.initWhenCreate();

                expect(Class.create).toCalledOnce();
                expect(audioObj.load).toCalledOnce();
            }

            beforeEach(function () {
                audioObj = sandbox.createStubObj("load");
            });

            it("如果audioType为web audio，则创建WebAudio实例并加载声音", function () {
                judge(AudioType.WEBAUDIO, WebAudio);
            });
            it("如果audioType为html5 audio，则创建Html5Audio实例并加载声音", function () {
                judge(AudioType.HTML5AUDIO, Html5Audio);
            });
            it("如果audioType为none，则给出日志提示并返回", function () {
                sandbox.stub(YE.YSound, "_audioType", AudioType.NONE);
                sandbox.stub(YE, "log");

                var result = sound.initWhenCreate();

                expect(YE.log).toCalledOnce();
                expect(result).toEqual(YE.returnForTest);
            });
            it("否则，返回", function () {
                sandbox.stub(YE.YSound, "_audioType", null);

                var result = sound.initWhenCreate();

                expect(result).toEqual(YE.returnForTest);
            });
        });
    });

    describe("play", function () {
        it("播放声音", function () {
            var obj = sandbox.createStubObj("play");
            YE.YSound._audioObj = obj;

            sound.play();

            expect(obj.play).toCalledOnce();
        });
    });

    describe("getPlayState", function () {
        it("获得播放状态", function () {
            var obj = sandbox.createStubObj("play");
            YE.YSound._audioObj = obj;

            sound.play();

            expect(obj.play).toCalledOnce();
        });
    });


    describe("AudioBase", function () {
        var audio = null;

        function getInstance() {
            var T = YYC.Class(AudioBase, {
                Init: function () {
                },
                Public: {
                    play: function () {
                    },
                    load: function () {
                    },
                    getPlayState: function () {
                    }
                }
            });

            return new T();
        }

        beforeEach(function () {
            audio = getInstance();
        });
        afterEach(function () {
        });

        describe("initWhenCreate", function () {
            describe("获得浏览器支持的声音文件url", function () {
                var fakeUrlArr = null;

                beforeEach(function () {
                    fakeUrlArr = ["../a.mp3", "../a.wav"];
                    audio.ye_P_urlArr = fakeUrlArr;
                });
                afterEach(function () {
                });

                it("如果浏览器为firefox，则它不支持mp3格式的声音文件", function () {
                    sandbox.stub(YE.Tool.judge.browser, "isFF").returns(true);
                    sandbox.stub(window, "Audio").returns({
                        canPlayType: sandbox.stub().returns(true)
                    });

                    audio.initWhenCreate();

                    expect(audio.ye_P_url).toEqual(fakeUrlArr[1]);
                });
                it("其它浏览器则根据canPlayType方法来判断", function () {
                    var fakeAudio = {
                        canPlayType: sandbox.stub()
                    };
                    sandbox.stub(YE.Tool.judge.browser, "isFF").returns(false);
                    sandbox.stub(window, "Audio").returns(fakeAudio);
                    fakeAudio.canPlayType.onCall(0).returns("");
                    fakeAudio.canPlayType.onCall(1).returns("maybe");

                    audio.initWhenCreate();

                    expect(audio.ye_P_url).toEqual(fakeUrlArr[1]);
                });
            });
        });
    });

    describe("Html5Audio", function () {
        var audio = null;

        beforeEach(function () {
            audio = new Html5Audio({});
        });
        afterEach(function () {
        });

        describe("load", function () {
            var fakeSound = null;

            function setParam(config) {
                audio.ye_P_urlArr = config.urlArr;
                audio.ye__onLoad = config.onLoad;
                audio.ye__onError = config.onError;
            }

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

                audio.load();

                expect(window.Audio).toCalledOnce();
            });

            describe("测试audio的事件绑定", function () {
                beforeEach(function () {
                });

                it("绑定canplaythrough事件，触发onLoad", function () {
                    var fakeOnload = sandbox.stub();
                    setParam({
                        onLoad: fakeOnload
                    });

                    audio.load();
                    fakeSound.addEventListener.firstCall.callArgOn(1, audio);

                    expect(fakeSound.addEventListener.firstCall.args[0]).toEqual("canplaythrough");
                    expect(fakeOnload).toCalledWith(audio);
                });

                describe("绑定ended事件，重置声音位置", function () {
                    beforeEach(function () {
                        fakeSound.load = sandbox.stub();
                    });

                    it("绑定ended事件", function () {
                        audio.load();

                        expect(fakeSound.addEventListener.thirdCall.args[0]).toEqual("ended");
                    });
                    it("chrome下调用load方法", function () {
                        sandbox.stub(YE.Tool.judge.browser, "isChrome").returns(true);

                        audio.load();
                        fakeSound.addEventListener.thirdCall.callArgOn(1, fakeSound);

                        expect(fakeSound.load).toCalledOnce();
                    });
                    it("firefox下重置currentTime属性", function () {
                        sandbox.stub(YE.Tool.judge.browser, "isChrome").returns(false);
                        sandbox.stub(YE.Tool.judge.browser, "isFF").returns(true);
                        fakeSound.currentTime = 100;

                        audio.load();
                        fakeSound.addEventListener.thirdCall.callArgOn(1, fakeSound);

                        expect(fakeSound.currentTime).toEqual(0);
                    });
                    it("其它浏览器下则报错", function () {
                        sandbox.stub(YE.Tool.judge.browser, "isChrome").returns(false);
                        sandbox.stub(YE.Tool.judge.browser, "isFF").returns(false);
                        sandbox.stub(YE.Tool.judge.browser, "isIE").returns(true);
                        sandbox.stub(YE, "error");

                        audio.load();
                        fakeSound.addEventListener.thirdCall.callArg(1);

                        expect(YE.error).toCalledOnce();
                    });
                });
                it("绑定error事件，触发onError，传入errorCode", function () {
                    var fakeOnError = sandbox.stub();
                    fakeSound.error = {code: 4};
                    setParam({
                        onError: fakeOnError
                    });

                    audio.load();

                    fakeSound.addEventListener.secondCall.callArgOn(1, fakeSound);
                    expect(fakeSound.addEventListener.secondCall.args[0]).toEqual("error");
                    expect(fakeOnError).toCalledWith("errorCode 4");
                });
            });

            it("加载声音", function () {
                var fakeUrl = "../a.mp3";
                audio.ye_P_url = fakeUrl;

                audio.load();

                expect(audio.ye__audio.src).toEqual(fakeUrl);
            });
        });

        describe("play", function () {
            it("播放声音", function () {
                audio.ye__audio = sandbox.createStubObj("play");

                audio.play();

                expect(audio.ye__audio.play).toCalledOnce();
            });
        });

        describe("getPlayState", function () {
            function setAudio(ended, currentTime) {
                audio.ye__audio = {
                    ended: ended,
                    currentTime: currentTime
                }
            }

            it("如果声音播放完毕，则返回END", function () {
                setAudio(true);

                expect(audio.getPlayState()).toEqual(PlayState.END);
            });
            it("如果声音正在播放，则返回PLAYING", function () {
                setAudio(false, 1);

                expect(audio.getPlayState()).toEqual(PlayState.PLAYING);
            });
            it("否则，则返回NONE", function () {
                setAudio(false, 0);

                expect(audio.getPlayState()).toEqual(PlayState.NONE);
            });
        });
    });


    describe("WebAudio", function () {
        var audio = null;

        beforeEach(function () {
            audio = new WebAudio({});
        });
        afterEach(function () {
        });

        describe("initWhenCreate", function () {
            it("初始化播放状态为NONE", function () {
                audio.stubParentMethod(sandbox, "initWhenCreate");
                audio.initWhenCreate();

                expect(audio.ye__playState).toEqual(PlayState.NONE);
            });
        });

        describe("load", function () {
            var url = null;

            beforeEach(function () {
                url = "../a.mp3";
                sandbox.stub(YE.$, "ajax");
            });

            it("使用ajax异步加载声音", function () {
                audio.ye_P_url = url;

                audio.load();

                expect(YE.$.ajax).toCalled();
                var arg = YE.$.ajax.firstCall.args[0];
                expect(arg.type).toEqual("get");
                expect(arg.url).toEqual(url);
                expect(arg.dataType).toEqual("arraybuffer");
            });

            describe("如果加载成功", function () {
                var ctx = null;

                beforeEach(function () {
                    ctx = sandbox.createStubObj("decodeAudioData");
                    sandbox.stub(YE.YSound, "_ctx", ctx);
                });

                it("解码数据", function () {
                    var arraybuffer = {};

                    audio.load(null, url);
                    YE.$.ajax.firstCall.args[0].success(arraybuffer);

                    expect(ctx.decodeAudioData.firstCall.args[0]).toEqual(arraybuffer);
                });
                it("如果解码成功，则保存buffer，触发onLoad", function () {
                    var buffer = {};
                    audio.ye__onLoad = sandbox.stub();

                    audio.load(null, url);
                    YE.$.ajax.firstCall.args[0].success({});
                    ctx.decodeAudioData.callArgOn(1, audio, buffer);

                    expect(audio.ye__buffer).toEqual(buffer);
                    expect(audio.ye__onLoad).toCalledWith(audio);
                });
                it("如果解码失败，则触发onError", function () {
                    audio.ye__onError = sandbox.stub();

                    audio.load(null, url);
                    YE.$.ajax.firstCall.args[0].success({});
                    ctx.decodeAudioData.callArgOnWith(2, audio, {err: "error"});

                    expect(audio.ye__onError).toCalledWith("error");

                });
            });

            describe("如果加载失败", function () {
                var obj = null;

                beforeEach(function () {
                    sandbox.stub(YE, "log");
                    obj = sandbox.createStubObj("load");
                    sandbox.stub(Html5Audio, "create").returns(obj);
                });
                afterEach(function () {
                });

                it("给出日志信息", function () {
                    audio.load(null, url);
                    YE.$.ajax.firstCall.args[0].error();

                    expect(YE.log).toCalled();
                });
                it("使用Html5Audio加载", function () {
                    audio.load(null, url);
                    YE.$.ajax.firstCall.args[0].error();

                    expect(Html5Audio.create).toCalled();
                    expect(obj.load).toCalled();
                });
            });
        });

        describe("play", function () {
            var ctx = null,
                source = null;

            beforeEach(function () {
                source = sandbox.createStubObj("connect", "start");
                ctx = {
                    createBufferSource: sandbox.stub().returns(source)
                };
                sandbox.stub(YE.YSound, "_ctx", ctx);
            });

            it("播放声音", function () {
                audio.ye__buffer = {};
                ctx.destination = {a: 1};

                audio.play();

                expect(source.buffer).toEqual(audio.ye__buffer);
                expect(source.connect).toCalledWith(ctx.destination);
                expect(source.start).toCalledWith(0);
            });

            describe("设置播放状态", function () {
                beforeEach(function () {
                    audio.ye__buffer = {
                        duration: 0.1
                    };
                });
                afterEach(function () {
                });

                it("设置为PLAYING", function () {
                    audio.play();

                    expect(audio.getPlayState()).toEqual(PlayState.PLAYING);
                });
                it("播放完毕后，设置播放状态为END", function () {
                    jasmine.clock().install();

                    audio.play();

                    jasmine.clock().tick(99);
                    expect(audio.getPlayState()).toEqual(PlayState.PLAYING);
                    jasmine.clock().tick(1);
                    expect(audio.getPlayState()).toEqual(PlayState.END);

                    jasmine.clock().uninstall();
                });
            });
        });

        describe("getPlayState", function () {
            it("获得播放状态", function () {
                audio.ye__playState = PlayState.PLAYING;

                expect(audio.getPlayState()).toEqual(PlayState.PLAYING);
            });
        });
    });
});
