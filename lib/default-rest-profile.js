'use strict'

const defaultProfile = require('./default-profile')
const request = require('./rest-request')
const parseWhen = require('../parse-rest/when')
const {parseLocation, parseLocationsResult} = require('../parse-rest/location')
const parsePolyline = require('../parse-rest/polyline')
const parseLine = require('../parse-rest/line')
const parseHint = require('../parse-rest/hint')
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

	formatDate,
	formatTime,
}

module.exports = defaultRestProfile
