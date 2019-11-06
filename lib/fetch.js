'use strict'

const ProxyAgent = require('https-proxy-agent')
const {isIP} = require('net')
const {Agent: HttpsAgent} = require('https')
const roundRobin = require('@derhuerst/round-robin-scheduler')
const createHash = require('create-hash')
const {stringify} = require('qs')
const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const {parse: parseContentType} = require('content-type')
const randomizeUserAgent = require('./randomize-user-agent')

const proxyAddress = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || null
const localAddresses = process.env.LOCAL_ADDRESS || null

if (proxyAddress && localAddresses) {
	console.error('Both env vars HTTPS_PROXY/HTTP_PROXY and LOCAL_ADDRESS are not supported.')
	process.exit(1)
}

const plainAgent = new HttpsAgent({
	keepAlive: true,
})
let getAgent = () => plainAgent

if (proxyAddress) {
	// todo: this doesn't honor `keepAlive: true`
	// related:
	// - https://github.com/TooTallNate/node-https-proxy-agent/pull/112
	// - https://github.com/TooTallNate/node-agent-base/issues/5
	const agent = new ProxyAgent(proxyAddress)
	getAgent = () => agent
} else if (localAddresses) {
	const agents = process.env.LOCAL_ADDRESS.split(',')
	.map((addr) => {
		const family = isIP(addr)
		if (family === 0) throw new Error('invalid local address:' + addr)
		return new HttpsAgent({
			localAddress: addr, family,
			keepAlive: true,
		})
	})
	const pool = roundRobin(agents)
	getAgent = () => pool.get()
}

const md5 = input => createHash('md5').update(input).digest()

const fetchFromHafas = async (ctx, userAgent, resource, req, opt = {}) => {
	const {profile} = ctx
	const {
		throwIfNotOk,
	} = {
		throwIfNotOk: true,
		...opt,
	}

	req = profile.transformReq(ctx, {
		agent: getAgent(),
		method: 'post',
		// todo: CORS? referrer policy?
		redirect: 'follow', // todo: superfluous?
		query: {},
		...req,
		headers: {
			'Content-Type': 'application/json',
			'Accept-Encoding': 'gzip, br, deflate', // todo: superfluous?
			'Accept': 'application/json',
			'user-agent': randomizeUserAgent(userAgent),
			'connection': 'keep-alive', // prevent excessive re-connecting
			...(req.headers || {}),
		},
	})

	if (profile.addChecksum || profile.addMicMac) {
		if (!Buffer.isBuffer(profile.salt) && 'string' !== typeof profile.salt) {
			throw new TypeError('profile.salt must be a Buffer or a string.')
		}
		// Buffer.from(buf, 'hex') just returns buf
		const salt = Buffer.from(profile.salt, 'hex')

		if (profile.addChecksum) {
			const checksum = md5(Buffer.concat([
				Buffer.from(req.body, 'utf8'),
				salt,
			]))
			req.query.checksum = checksum.toString('hex')
		}
		if (profile.addMicMac) {
			const mic = md5(Buffer.from(req.body, 'utf8'))
			req.query.mic = mic.toString('hex')

			const micAsHex = Buffer.from(mic.toString('hex'), 'utf8')
			const mac = md5(Buffer.concat([micAsHex, salt]))
			req.query.mac = mac.toString('hex')
		}
	}

	const url = resource + '?' + stringify(req.query)
	delete req.query // not part of the fetch() spec

	const res = await fetch(url, req)
	const errProps = {
		isHafasError: true, // todo [breaking]: rename to `isHafasClientError`
		request: req.body,
		fetchRequest: req, // todo [breaking]: rename to `request`
		url,
		response: res,
		statusCode: res.status, // todo [breaking]: remove
	}

	if (throwIfNotOk && !res.ok) {
		const err = new Error(res.statusText)
		Object.assign(err, errProps)
		throw err
	}

	let cType = res.headers.get('content-type')
	if (cType) {
		const {type} = parseContentType(cType)
		if (type !== 'application/json') {
			const err = new Error('invalid response content-type: ' + cType)
			Object.assign(err, errProps)
			throw err
		}
	}

	const body = await res.json()

	return {
		res,
		body,
		errProps,
	}
}

module.exports = fetchFromHafas
