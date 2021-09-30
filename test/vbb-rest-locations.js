'use strict'

const tap = require('tap')

const createRestClient = require('../rest-exe')
const vbbRestProfile = require('../p/vbb-rest')
const res = require('./fixtures/vbb-rest-locations.json')
const expected = require('./fixtures/vbb-rest-locations.js')

const client = createRestClient(vbbRestProfile, 'fake-token', 'public-transport/hafas-client:test')
const {profile} = client

const opt = {
	fuzzy: true,
	results: 5,
	stops: true,
	addresses: true,
	poi: true,
	linesOfStops: true,
	when: '2021-09-30T20:30:00+02:00',
	products: {},
}

tap.test('parses locations correctly (VBB rest.exe)', (t) => {
	const ctx = {profile, opt, res}
	const locations = res.stopLocationOrCoordLocation.map(res => profile.parseLocationsResult(ctx, res))

	t.same(locations, expected)
	t.end()
})
