'use strict'

const DEBUG = /(^|,)hafas-client(,|$)/.test(process.env.DEBUG || '')

const pick = require('lodash/pick')
const fetchFromHafas = require('./fetch')
const {byErrorCode} = require('./errors')

const addErrorInfo = (err, errorCode, errorText, responseId) => {
	if (byErrorCode[errorCode]) {
		Object.assign(err, byErrorCode[errorCode])
		if (errorCode) err.hafasErrorCode = errorCode
		if (errorText) err.hafasErrorMessage = errorText
	} else {
		err.code = errorCode || null
		err.message = errorText || errorCode || null
		err.responseId = responseId || null
	}
}

// todo [breaking]: remove userAgent parameter
const request = async (ctx, userAgent, reqData) => {
	const {profile, opt} = ctx

	const body = profile.transformReqBody(ctx, {
		// todo: is it `eng` actually?
		// RSAG has `deu` instead of `de`
		lang: opt.language || profile.defaultLanguage || 'en',
		svcReqL: [reqData]
	})
	Object.assign(body, pick(profile, [
		'client', // client identification
		'ext', // ?
		'ver', // HAFAS protocol version
		'auth', // static authentication
	]))

	const req = {
		body: JSON.stringify(body),
	}
	if (DEBUG) console.error(req.body)

	const {
		body: b,
		errProps,
	} = await fetchFromHafas(ctx, userAgent, profile.endpoint, req)

	if (DEBUG) console.error(JSON.stringify(b))

	const err = new Error('')
	Object.assign(err, errProps)
	if (b.err && b.err !== 'OK') {
		addErrorInfo(err, b.err, b.errTxt, b.id)
		throw err
	}
	if (!b.svcResL || !b.svcResL[0]) {
		err.message = 'invalid response'
		throw err
	}
	if (b.svcResL[0].err !== 'OK') {
		addErrorInfo(err, b.svcResL[0].err, b.svcResL[0].errTxt, b.id)
		throw err
	}

	const res = b.svcResL[0].res
	return {
		res,
		common: profile.parseCommon({...ctx, res})
	}
}

module.exports = request
