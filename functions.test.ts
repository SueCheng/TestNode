import {add} from "./functions"

describe('add function', () => {
    it('should return the sum of a and b', () => {
        expect(add(3,5)).toBe(8)
    });
});