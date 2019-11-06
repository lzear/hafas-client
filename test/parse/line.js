'use strict'

const tap = require('tap')
const parse = require('../../parse/line')

const profile = {
	products: [
		{id: 'train', mode: 'train', bitmasks: [1]},
		{id: 'ferry', mode: 'watercraft', bitmasks: [2]},
		{id: 'bus', mode: 'bus', bitmasks: [4, 8]}
	]
}
const ctx = {
	data: {},
	opt: {},
	profile
}

tap.test('parses lines correctly', (t) => {
	const input = {
		line: 'foo line',
		cls: 2,
		prodCtx: {
			lineId: 'Foo ',
			num: 123
		}
	}
	const expected = {
		type: 'line',
		id: 'foo',
		mode: 'watercraft',
		product: 'ferry',
		fahrtNr: 123,
		name: 'foo line',
		public: true
	}

	t.same(parse(ctx, input), expected)

	t.same(parse(ctx, {
		...input, line: null, addName: input.line
	}), expected)
	t.same(parse(ctx, {
		...input, line: null, name: input.line
	}), expected)
	// prodCtx.catCode instead of cls
	t.same(parse(ctx, {
		...input, cls: null, prodCtx: {...input.prodCtx, catCode: input.cls},
	}), expected)

	// no prodCtx.lineId
	t.same(parse(ctx, {
		...input, prodCtx: {...input.prodCtx, lineId: null}
	}), {
		...expected, id: 'foo-line'
	})
	// no prodCtx
	t.same(parse(ctx, {
		...input, prodCtx: undefined
	}), {
		...expected, id: 'foo-line', fahrtNr: null
	})
	t.end()
})
