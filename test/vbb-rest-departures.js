'use strict'

const tap = require('tap')

const createRestClient = require('../rest-exe')
const vbbRestProfile = require('../p/vbb-rest')
const res = require('./fixtures/vbb-rest-departures.json')
const expected = require('./fixtures/vbb-rest-departures.js')

const client = createRestClient(vbbRestProfile, 'fake-token', 'public-transport/hafas-client:test')
const {profile} = client

const opt = {
	direction: null,
	duration: 10,
	linesOfStops: true,
	remarks: true,
	stopovers: true,
	includeRelatedStations: true,
	when: '2021-09-30T20:30:00+02:00',
	products: {},
}

tap.test('parses departures correctly (VBB rest.exe)', (t) => {
	const ctx = {profile, opt, res}
	const departures = res.Departure.map(dep => profile.parseDeparture(ctx, dep))

	t.same(departures, expected)
	t.end()
})
