import { describe, it, expect } from "vitest";
import { getDictionary } from "../src/lib/get-dictionary";
import { TDictionary } from "../src/lib/dictionaries/base";
describe("translations API tests", () => {
    it("Should return a dictionary for EN locale", () => {
        const dictionary: TDictionary = getDictionary("en");
        expect(dictionary).toBeDefined();
    });
    it("Should return a dictionary for DE locale", () => {
        const dictionary: TDictionary = getDictionary("de");
        expect(dictionary).toBeDefined();
    });
});