'use strict'

const tap = require('tap')

const createRestClient = require('../rest-exe')
const vbbRestProfile = require('../p/vbb-rest')
const res = require('./fixtures/vbb-rest-journeys.json')
const expected = require('./fixtures/vbb-rest-journeys.js')

const client = createRestClient(vbbRestProfile, 'fake-token', 'public-transport/hafas-client:test')
const {profile} = client

const opt = {
	results: null,
	stopovers: false,
	transfers: -1,
	transferTime: null,
	polylines: false,
	startWithWalking: true,
	when: '2021-09-30T20:30:00+02:00',
	products: {},
}

tap.test('parses journeys correctly (VBB rest.exe)', (t) => {
	const ctx = {profile, opt, res}
	const journeys = res.Trip.map(j => profile.parseJourney(ctx, j))

	t.same(journeys, expected)
	t.end()
})
