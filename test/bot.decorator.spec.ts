import { expect } from "chai";
import {
	BOT_COMMAND_NAME,
	BOT_EVENT,
	BOT_HANDLER_CLASS,
} from "../src/bot.constants";
import {Bob} from '../src/index'
describe("Bot.Service set Metadata", () => {
	it("TestClass should habe Metadata", () => {
		@Bob.Service()
		class TestClass {}

		expect(Reflect.hasMetadata(BOT_HANDLER_CLASS, TestClass)).equal(true);
	});
});

describe("Bot.Command set Metadata", () => {
	it("Test Class should have Metadata at BOT_COMMAND_NAME", () => {
		@Bob.Command("")
		class TestClass {}

		expect(Reflect.hasMetadata(BOT_COMMAND_NAME, TestClass)).equal(true);
	});

	it("Annotating TestClass with a should set a as metadata", () => {
		@Bob.Command("a")
		class TestClass {}

		expect(Reflect.getMetadata(BOT_COMMAND_NAME, TestClass)).equal("a");
	});

	it("Annotating TestClass with b should set b as metadata", () => {
		@Bob.Command("b")
		class TestClass {}

		expect(Reflect.getMetadata(BOT_COMMAND_NAME, TestClass)).equal("b");
	});
});

describe("Bot.Event set Metadata", () => {
	it("Test Class should have Metadata at BOT_COMMAND_NAME", () => {
		@Bob.Event("channelCreate")
		class TestClass {}

		expect(Reflect.hasMetadata(BOT_EVENT, TestClass)).equal(true);
	});

	it("Annotating TestClass with channelCreate should set channelCreate as metadata", () => {
		@Bob.Event("channelCreate")
		class TestClass {}

		expect(Reflect.getMetadata(BOT_EVENT, TestClass)).equal(
			"channelCreate"
		);
	});

	it("Annotating TestClass with emojiCreate should set emojiCreate as metadata", () => {
		@Bob.Event("emojiCreate")
		class TestClass {}

		expect(Reflect.getMetadata(BOT_EVENT, TestClass)).equal("emojiCreate");
	});
});
