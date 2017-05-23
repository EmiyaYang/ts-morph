﻿import {expect} from "chai";
import {ClassDeclaration, MethodDeclaration, PropertyDeclaration, GetAccessorDeclaration, SetAccessorDeclaration, ExpressionWithTypeArguments} from "./../../../compiler";
import {getInfoFromText} from "./../testHelpers";

describe(nameof(ClassDeclaration), () => {
    describe(nameof<ClassDeclaration>(d => d.getExtends), () => {
        it("should return undefined when no extends clause exists", () => {
            const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier { }");
            expect(firstChild.getExtends()).to.be.undefined;
        });

        it("should return a heritage clause when an extends clause exists", () => {
            const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier extends Base { }");
            expect(firstChild.getExtends()).to.be.instanceOf(ExpressionWithTypeArguments);
        });
    });

    describe(nameof<ClassDeclaration>(d => d.setExtends), () => {
        it("should set an extends", () => {
            const {firstChild, sourceFile} = getInfoFromText<ClassDeclaration>("  class Identifier {}  ");
            firstChild.setExtends("Base");
            expect(sourceFile.getFullText()).to.equal("  class Identifier extends Base {}  ");
        });

        it("should set an extends when an implements exists", () => {
            const {firstChild, sourceFile} = getInfoFromText<ClassDeclaration>("class Identifier implements IBase {}");
            firstChild.setExtends("Base");
            expect(sourceFile.getFullText()).to.equal("class Identifier extends Base implements IBase {}");
        });

        it("should set an extends when the brace is right beside the identifier", () => {
            const {firstChild, sourceFile} = getInfoFromText<ClassDeclaration>("  class Identifier{}  ");
            firstChild.setExtends("Base");
            expect(sourceFile.getFullText()).to.equal("  class Identifier extends Base {}  ");
        });

        it("should set an extends when an extends already exists", () => {
            const {firstChild, sourceFile} = getInfoFromText<ClassDeclaration>("class Identifier extends Base1 {}");
            firstChild.setExtends("Base2");
            expect(sourceFile.getFullText()).to.equal("class Identifier extends Base2 {}");
        });

        it("should throw an error when providing invalid input", () => {
            const {firstChild, sourceFile} = getInfoFromText<ClassDeclaration>("class Identifier extends Base1 {}");
            expect(() => firstChild.setExtends("")).to.throw();
            expect(() => firstChild.setExtends("  ")).to.throw();
            expect(() => firstChild.setExtends(5 as any)).to.throw();
        });
    });

    describe(nameof<ClassDeclaration>(d => d.getConstructor), () => {
        it("should return undefined when no constructor exists", () => {
            const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier { }");
            expect(firstChild.getConstructor()).to.be.undefined;
        });

        it("should return the constructor when it exists", () => {
            const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier { constructor() { } }");
            expect(firstChild.getConstructor()!.getText()).to.equal("constructor() { }");
        });
    });

    describe(nameof<ClassDeclaration>(d => d.getInstanceMethods), () => {
        describe("no methods", () => {
            it("should not have any methods", () => {
                const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {\n}\n");
                expect(firstChild.getInstanceMethods().length).to.equal(0);
            });
        });

        describe("has methods", () => {
            const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {\nstatic prop2: string;\nstatic method() {}\nprop: string;\nmethod1() {}\nmethod2() {}\n}\n");

            it("should get the right number of methods", () => {
                expect(firstChild.getInstanceMethods().length).to.equal(2);
            });

            it("should get a method of the right instance of", () => {
                expect(firstChild.getInstanceMethods()[0]).to.be.instanceOf(MethodDeclaration);
            });
        });
    });

    describe(nameof<ClassDeclaration>(d => d.getInstanceProperties), () => {
        describe("no properties", () => {
            it("should not have any properties", () => {
                const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {\n}\n");
                expect(firstChild.getInstanceProperties().length).to.equal(0);
            });
        });

        describe("has properties", () => {
            const code = "class Identifier {\nstatic prop2: string;\nstatic method() {}\ninstanceProp: string;\nprop2: number;method1() {}\n" +
                "get prop(): string {return '';}\nset prop(val: string) {}\n}\n";
            const {firstChild} = getInfoFromText<ClassDeclaration>(code);

            it("should get the right number of properties", () => {
                expect(firstChild.getInstanceProperties().length).to.equal(4);
            });

            it("should get a property of the right instance of", () => {
                expect(firstChild.getInstanceProperties()[0]).to.be.instanceOf(PropertyDeclaration);
            });

            it("should get a property of the right instance of for the get accessor", () => {
                expect(firstChild.getInstanceProperties()[2]).to.be.instanceOf(GetAccessorDeclaration);
            });

            it("should get a property of the right instance of for the set accessor", () => {
                expect(firstChild.getInstanceProperties()[3]).to.be.instanceOf(SetAccessorDeclaration);
            });
        });
    });

    describe(nameof<ClassDeclaration>(d => d.getStaticMethods), () => {
        describe("no static methods", () => {
            it("should not have any static methods", () => {
                const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {\n}\n");
                expect(firstChild.getStaticMethods().length).to.equal(0);
            });
        });

        describe("has static methods", () => {
            const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {\nstatic prop2: string;\nstatic method() {}\nprop: string;\nmethod1() {}\nmethod2() {}\n}\n");

            it("should get the right number of static methods", () => {
                expect(firstChild.getStaticMethods().length).to.equal(1);
            });

            it("should get a method of the right instance of", () => {
                expect(firstChild.getStaticMethods()[0]).to.be.instanceOf(MethodDeclaration);
            });
        });
    });

    describe(nameof<ClassDeclaration>(d => d.getStaticProperties), () => {
        describe("no static properties", () => {
            it("should not have any properties", () => {
                const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {\n}\n");
                expect(firstChild.getStaticProperties().length).to.equal(0);
            });
        });

        describe("has static properties", () => {
            const code = "class Identifier {\nstatic prop2: string;\nstatic method() {}\nprop: string;\nprop2: number;method1() {}\n" +
                "\nstatic get prop(): string { return ''; }\nstatic set prop(val: string) {}\n}";
            const {firstChild} = getInfoFromText<ClassDeclaration>(code);

            it("should get the right number of static properties", () => {
                expect(firstChild.getStaticProperties().length).to.equal(3);
            });

            it("should get a property of the right instance of", () => {
                expect(firstChild.getStaticProperties()[0]).to.be.instanceOf(PropertyDeclaration);
            });

            it("should get a property of the right instance of for the get accessor", () => {
                expect(firstChild.getStaticProperties()[1]).to.be.instanceOf(GetAccessorDeclaration);
            });

            it("should get a property of the right instance of for the set accessor", () => {
                expect(firstChild.getStaticProperties()[2]).to.be.instanceOf(SetAccessorDeclaration);
            });
        });
    });

    describe(nameof<ClassDeclaration>(d => d.getInstanceMembers), () => {
        const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {\nstatic prop2: string;\nstatic method() {}\nprop: string;\nprop2: number;method1() {}\n}\n");
        it("should get the right number of instance members", () => {
            expect(firstChild.getInstanceMembers().length).to.equal(3);
        });
    });

    describe(nameof<ClassDeclaration>(d => d.getStaticMembers), () => {
        const {firstChild} = getInfoFromText<ClassDeclaration>("class Identifier {\nstatic prop2: string;\nstatic method() {}\nprop: string;\nprop2: number;method1() {}\n}\n");
        it("should get the right number of static members", () => {
            expect(firstChild.getStaticMembers().length).to.equal(2);
        });
    });

    describe(nameof<ClassDeclaration>(d => d.getAllMembers), () => {
        const code = "class Identifier {\nconstructor() {}\nstatic prop2: string;\nstatic method() {}\nprop: string;\nprop2: number;method1() {}\n}\n";
        const {firstChild} = getInfoFromText<ClassDeclaration>(code);
        it("should get the right number of instance, static, and constructor members", () => {
            expect(firstChild.getAllMembers().length).to.equal(6);
        });
    });
});