'use strict'

const pick = require('lodash/pick')
const dbMgateProfile = require('../db')

const dbRestProfile = {
	...pick(dbMgateProfile, [
		'ver',
		'defaultLanguage', 'locale', 'timezone',
		'products',
	]),

	endpoint: 'https://db-streckenagent.hafas.de/restproxy/',
}

module.exports = dbRestProfile
