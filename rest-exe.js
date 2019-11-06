'use strict'

const defaultRestProfile = require('./lib/default-rest-profile')
const validateProfile = require('./lib/validate-profile')

const isNonEmptyString = str => 'string' === typeof str && str.length > 0

const createRestClient = (profile, token, userAgent) => {
	profile = {
		...defaultRestProfile,
		...profile
	}
	validateProfile(profile)
	if (!isNonEmptyString(profile.endpoint)) throw new Error('missing profile.endpoint')
	if (!isNonEmptyString(token)) throw new Error('missing token')
	if (!isNonEmptyString(userAgent)) throw new Error('missing userAgent')

	const client = {
	}
	Object.defineProperty(client, 'profile', {value: profile})
	return client
}

module.exports = createRestClient
