#!/usr/bin/env node
'use strict'

const mri = require('mri')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'silent', 's',
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    rest-supported-services <profile>
Examples:
    rest-supported-services vbb-rest
\n`)
	process.exit(0)
}

const {join} = require('path')
const createRestClient = require('../../rest-exe')

const SERVICES = [
	// from HAFAS ReST API v2.15.1 documentation
	[
		'location.name', // Location Search by Name
	],
	[
		'location.nearbystops', // Location Search by Coordinate
	],
	[
		'location.boundingbox', // Location Search in a bounding box
	],
	[
		'location.search', // Location Search
	],
	[
		'location.walkinglinks', // Walking Links by Location
	],
	[
		'location.data', // Location Data
	],
	[
		'location.details) ', // Location Details
	],
	[
		'addresslookup', // Address Lookup
	],
	[
		'trip', // Trip Search
	],
	[
		'interval', // Interval Trip Search
	],
	[
		'partialtripsearch', // Partial Trip Search
	],
	[
		'partialtripsearch.v2', // Partial Trip Search V2
	],
	[
		'manyToMany', // M:N Search
	],
	[
		'recon', // Reconstruction
	],
	[
		'reconMatch', // Reconstruction Match
	],
	[
		'reconConvert', // Reconstruction Converter
	],
	[
		'sot', // Search on Trip
	],
	[
		'trip.alternatives', // Trip Alternatives
	],
	[
		'gisroute', // GIS Route by Context
	],
	[
		'departureBoard', // Departure Board
	],
	[
		'arrivalBoard', // Arrival Board
	],
	[
		'journeyDetail', // Journey Detail
	],
	[
		'journeyMatch', // Journey Match
	],
	[
		'journeyPos', // Journey Position
	],
	[
		'journeyValidation', // Journey Validation
	],
	[
		'journeyTrackMatch', // Journey Track Match
	],
	[
		'reachability', // Reachability search services
	],
	[
		'trainSearch', // Train Search
	],
	[
		'linesearch', // Line Search
	],
	[
		'linematch', // Line Match
	],
	[
		'lineinfo', // Line Info
	],
	[
		'linesched', // Line Schedules
	],
	[
		'himsearch', // HIM Search
	],
	[
		'feed', // RSS Feed
	],
	[
		'rtarchive', // Real Time Archive Gateway
	],
	[
		'datainfo', // Data Information
	],
	[
		'tti', // Time Table Information
	],
	[
		'walkinglinks', // Walking Links
	],
	[
		'trafficmessages/datex2', // Traffic Messages (Datex II)
	],
	[
		'downloads', // Download Service
	],
	// XSD Service
	// GraphQL Service
]

const profile = require(join(__dirname, '..', '..', 'p', argv._[0]))

const token = process.env.TOKEN
if (!token) {
	console.error('Missing or empty TOKEN env var.')
	process.exit(1)
}

// todo
// const transformReq = (ctx, req) => ({})
const client = createRestClient({
	...profile,
	// transformReq,
}, token, 'public-transport/hafas-client:rest-supported-services')

const checkIfServiceIsSupported = async (service) => {
	// try {
		await client.locations('hbf', {results: 1})
	// } catch (err) {
	// 	if (err && err.code === 'VERSION') return false
	// 	const wrapped = new Error(`check for ${version} support failed with an unknown error`)
	// 	wrapped.originalError = err
	// 	throw wrapped
	// }
	// return true
}

;(async () => {
	for (const svc of SERVICES) {
		if (await checkIfServiceIsSupported(svc)) {
			console.log(svc + ' is supported ✔︎')
		} else {
			console.log(svc + ' is not supported ✘')
		}
	}
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})
