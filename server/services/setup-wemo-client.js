const Wemo = require('wemo-client')

const dir = require(`${global.baseDir}global-dirs`)
const logger = require(`${dir.utils}logger`)

const wemo = new Wemo()
const deviceClients = new Map()

const logBinaryStateChange = deviceInfo => value => (
	logger.log(deviceInfo.friendlyName, 'set to:', value)
)

const logDeviceFound = deviceInfo => (
	logger.log('Device Found: %s %j', deviceInfo.host, deviceInfo.friendlyName)
)

const logError = err => logger.logError('Error:', err.code)

const storeWemoDeviceClient = deviceClient => (
	deviceClients.set(deviceClient.device.friendlyName, deviceClient)
)

const discoverDevices = () => (
	wemo.discover((_, deviceInfo) => {
		logDeviceFound(deviceInfo)

		if (!deviceInfo) return

		const deviceClient = wemo.client(deviceInfo)

		deviceClient
		.on('binaryState', logBinaryStateChange(deviceInfo))
		.on('error', logError)

		storeWemoDeviceClient(deviceClient)
	})
)

const init = discoverDevices

const update = init

module.exports = {
	init,
	update,
	deviceClients,
}
