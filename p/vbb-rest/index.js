'use strict'

const pick = require('lodash/pick')
const vbbMgateProfile = require('../vbb')

const vbbRestProfile = {
	...pick(vbbMgateProfile, [
		'ver',
		'defaultLanguage', 'locale', 'timezone',
		'products',
	]),

	// todo: the production endpoint is https://fahrinfo.vbb.de/restproxy/2.10/
	endpoint: 'https://vbb.demo.hafas.de/fahrinfo/restproxy/2.15/',
}

module.exports = vbbRestProfile
