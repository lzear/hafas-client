'use strict'

const test = require('tap')
const format = require('../../format/products-filter')

const products = [
	{
		id: 'train',
		bitmasks: [1, 2],
		default: true
	},
	{
		id: 'bus',
		bitmasks: [4],
		default: true
	},
	{
		id: 'tram',
		bitmasks: [8, 32],
		default: false
	},
]

const ctx = {
	common: {},
	opt: {},
	profile: {
		products,
		formatProductsBitmask: (_, filter) => filter.bus ? 123 : 12345,
	}
}

test.test('formatProductsFilter works without customisations', (t) => {
	const filter = {}
	t.same(format(ctx, filter), {
		type: 'PROD',
		mode: 'INC',
		value: '12345'
	})
	t.end()
})

test.test('formatProductsFilter works with customisations', (t) => {
	t.equal(format(ctx, {
		bus: true
	}).value, '123')
	t.end()
})
