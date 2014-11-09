/**YEngine2D
 * author：YYC
 * date：2013-01-20
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Tool.js", function () {
    var tool = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        tool = YE.Tool;
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("工具类", function () {
        describe("集合", function () {
            describe("根据tag操作", function () {
                var child1 = null,
                    child2 = null ,
                    child3 = null;
                var childs = null;

                beforeEach(function () {
                    child1 = {
                        getTag: function () {
                            return ["aa"];
                        }
                    };
                    child2 = {
                        getTag: function () {
                            return ["aac", "bb", "cc"];
                        }
                    };
                    child3 = {
                        getTag: function () {
                            return ["cc"];
                        }
                    };
                    child4 = {
                        getTag: function () {
                            return null;
                        }
                    };
                    childs = YE.Collection.create();
                    childs.addChilds([child1, child2, child3, child4]);
                });

                describe("getChildByTag", function () {
                    it("如果参数为一个标签，则获得tag为该标签的第一个元素", function () {
                        expect(tool.collection.getChildByTag(childs, "a")).toEqual(null);
                        expect(tool.collection.getChildByTag(childs, "cc")).toEqual(child2);
                    });
                    it("如果参数为标签数组，则获得tag为数组中任一标签的第一个元素", function () {
                        var result = tool.collection.getChildByTag(childs, ["bb", "cc"]);

                        expect(result).toEqual(child2);
                    });
                });

                describe("getChildsByTag", function () {
                    it("如果参数为一个标签，则获得tag为该标签的元素", function () {
                        expect(tool.collection.getChildsByTag(childs, "a")).toEqual([]);
                        expect(tool.collection.getChildsByTag(childs, "cc")).toEqual([child2, child3]);
                    });
                    it("如果参数为标签数组，则获得tag为数组中任一标签的元素", function () {
                        var result = tool.collection.getChildsByTag(childs, ["aa", "b", "cc"]);

                        expect(result).toEqual([child1, child2, child3]);
                    });
                });

                describe("removeChildByTag", function () {
                    it("如果参数为一个标签，则删除tag为该标签的第1个元素", function () {
                        tool.collection.removeChildByTag(childs, "cc");

                        expect(childs.getChilds()).toEqual([child1, child3, child4]);
                    });
                    it("如果参数为标签数组，则删除tag为数组中任一标签的第1个元素", function () {
                        tool.collection.removeChildByTag(childs, ["aa", "cc"]);

                        expect(childs.getChilds()).toEqual([child2, child3, child4]);
                    });
                    it("如果传入了回调函数func，则在删除child时触发func", function () {
                        var func = sandbox.stub();

                        tool.collection.removeChildByTag(childs, "cc", func);

                        expect(func).toCalledWith(child2);
                    });
                });

                describe("removeChildsByTag", function () {
                    it("如果参数为一个标签，则删除tag为该标签的元素", function () {
                        tool.collection.removeChildsByTag(childs, "cc");

                        expect(childs.getChilds()).toEqual([child1, child4]);
                    });
                    it("如果参数为标签数组，则删除tag为数组中任一标签的元素", function () {
                        tool.collection.removeChildsByTag(childs, ["aa", "bb"]);

                        expect(childs.getChilds()).toEqual([child3, child4]);
                    });
                    it("如果传入了回调函数func，则在删除child时触发func", function () {
                        var func = sandbox.stub();

                        tool.collection.removeChildsByTag(childs, "cc", func);

                        expect(func.firstCall).toCalledWith(child2);
                        expect(func.secondCall).toCalledWith(child3);
                    });
                });
            });
        });
    });
});