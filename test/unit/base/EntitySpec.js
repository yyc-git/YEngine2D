/**YEngine2D
 * author：YYC
 * date：2014-02-08
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Entity", function () {
    var entity = null;
    var sandbox = null;

    function getInstance() {
        var T = YYC.Class(YE.Entity, {
            Init: function () {
                this.base();
            },
            Public: {
            }
        });

        return new T();
    }


    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        entity = getInstance();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        it("设置实体的uid", function () {
            var count = YE.Entity.count;

            YE.Entity.count = 1;

            entity = getInstance();
            entity = getInstance();

            expect(entity.getUid()).toEqual(2);

            YE.Entity.count = count;
        });
        it("创建ye_entity_cacheData容器", function () {
            entity = getInstance();

            expect(entity.ye_entity_cacheData).toBeInstanceOf(YE.Hash);
        });
    });


    describe("setCacheData", function () {
        it("设置缓存数据", function () {
            entity.setCacheData("a", [1, 2]);

            expect(entity.getCacheData("a")).toEqual([1, 2]);
        });
    });

    describe("getCacheData", function () {
        it("根据key值获得缓存数据", function () {
        });
    });

    describe("getUid", function () {
        it("获得实体uid", function () {
        });
    });

    describe("setTag", function () {
        it("设置标签", function () {
            var tag = "a";

            entity.setTag(tag);

            expect(entity.getTag()).toEqual([tag]);
        });
        it("可以设置多个标签", function () {
            var tag = ["a", "b"];

            entity.setTag(tag);

            expect(entity.getTag()).toEqual(tag);
        });
    });

    describe("addTag", function () {
        it("加入标签", function () {
            entity.addTag("a");
            entity.addTag("b");

            expect(entity.getTag()).toEqual(["a", "b"]);
        });
    });

    describe("removeTag", function () {
        it("移除标签", function () {
            entity.addTag(["a", "b", "c"]);

            entity.removeTag("a");
            entity.removeTag("d");

            expect(entity.getTag()).toEqual(["b", "c"]);
        });
    });

    describe("getTag", function () {
        it("获得标签", function () {
        });
    });

    describe("hasTag，判断元素是否有指定标签（完全匹配）", function () {
        it("如果entity的tag为单个标签", function () {
            entity.setTag("abc");

            expect(entity.hasTag("abc")).toBeTruthy();
            expect(entity.hasTag("a")).toBeFalsy();
        });
        it("如果entity的tag为数组", function () {
            entity.setTag(["abc", "b"]);

            expect(entity.hasTag("abc")).toBeTruthy();
            expect(entity.hasTag("b")).toBeTruthy();
            expect(entity.hasTag("a")).toBeFalsy();
        });
    });

    describe("containTag，判断元素是否包含指定标签（要匹配大小写）", function () {
        it("如果entity的tag为String", function () {
            entity.setTag("abc");

            expect(entity.containTag("a")).toBeTruthy();
            expect(entity.containTag("abc")).toBeTruthy();
            expect(entity.containTag("A")).toBeFalsy();
        });
        it("如果entity的tag为数组", function () {
            entity.setTag(["abc", 1]);

            expect(entity.containTag("a")).toBeTruthy();
            expect(entity.containTag(1)).toBeTruthy();
            expect(entity.containTag(2)).toBeFalsy();
        });
    });

});

