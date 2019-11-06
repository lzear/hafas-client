'use strict'

const defaultProfile = require('./default-profile')
const request = require('./rest-request')

const defaultRestProfile = {
	...defaultProfile,

	request,
}

module.exports = defaultRestProfile
