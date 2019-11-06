'use strict'

const defaultProfile = require('./default-profile')
const request = require('./rest-request')
const parseWhen = require('../parse-rest/when')
const {parseLocation, parseLocationsResult} = require('../parse-rest/location')
const parsePolyline = require('../parse-rest/polyline')
const parseLine = require('../parse-rest/line')
const parseHint = require('../parse-rest/hint')
const parseStopover = require('../parse-rest/stopover')
const {parseArrival, parseDeparture} = require('../parse-rest/arrival-or-departure')
const parseJourneyLeg = require('../parse-rest/journey-leg')
const parseJourney = require('../parse-rest/journey')
const formatDate = require('../format-rest/date')
const formatTime = require('../format-rest/time')

const defaultRestProfile = {
	...defaultProfile,

	request,

	parseWhen,
	parseLocation, parseLocationsResult,
	parsePolyline,
	parseLine,
	parseHint,
	parseStopover,
	parseArrival, parseDeparture,
	parseJourneyLeg,
	parseJourney,

	formatDate,
	formatTime,
}

module.exports = defaultRestProfile
