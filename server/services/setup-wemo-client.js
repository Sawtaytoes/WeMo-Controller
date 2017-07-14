const Wemo = require('wemo-client')

const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const wemo = new Wemo()
const deviceClients = new Map()

const storeWemoDeviceClient = deviceClient => deviceClients.set(deviceClient.device.friendlyName, deviceClient)

const discoverDevices = () => (
	wemo.discover((_, deviceInfo) => {
		logger.log('Device Found: %s %j', deviceInfo.host, deviceInfo.friendlyName)

		if (!deviceInfo) return

		const deviceClient = wemo.client(deviceInfo)

		deviceClient.on('error', err => logger.error('Error:', err.code))
		deviceClient.on('binaryState', value => logger.log(deviceInfo.friendlyName, 'set to:', value))

		storeWemoDeviceClient(deviceClient)
	})
)

const init = () => (
	discoverDevices()
)

const update = init

module.exports = {
	init,
	update,
	deviceClients,
}
