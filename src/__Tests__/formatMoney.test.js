import formatMoney from '../lib/formatMoney'

describe('formatMoney Function', () => {
    it('works with fractiona dollars', () => {
        expect(formatMoney(1)).toEqual('$0.01');
        expect(formatMoney(10)).toEqual('$0.10');
        expect(formatMoney(50)).toEqual('$0.50');
    });

    it('leaves cents off for whole dollars', () => {
        expect(formatMoney(5000)).toEqual('$50');
        expect(formatMoney(100)).toEqual('$1');
        expect(formatMoney(50000)).toEqual('$500');
    });

    it('works with whole and fractionl numbers', () => {
        expect(formatMoney(5012)).toEqual('$50.12');
        expect(formatMoney(101)).toEqual('$1.01');
        expect(formatMoney(11000)).toEqual('$11.00');
    });
})