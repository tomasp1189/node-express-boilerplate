const logger = require('winston');
const chai = require('chai');
let expect = chai.expect;

const keys = require('./config/keys').Cache;
const mongoose = require('mongoose');

require('./models/cacheSchema');
mongoose.Promise = global.Promise;
let Cache = mongoose.model('cache');

let cacheService = require('./models/cache')(Cache, 2000);

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

describe('Cache integration tests', function() {
	this.timeout(5000);
	beforeEach(function(done) {
		if (mongoose.connection.db) {
			return done();
		}

		mongoose.connect(
			`${keys.dbConfig.host}:${keys.dbConfig.port}/${keys.dbConfig.dbName}`,
			function() {
				return done();
			}
		);
	});
	it('should create a new entry if key is not found in cache', async function() {
		await Cache.remove({});
		let value = await cacheService.findOne('example-key');

		expect(value).not.to.be.an('undefined');
		expect(cacheService.latestHit).to.equal('miss');
	});
	it('should create a new value if TTL is exceeded', async function() {
		await Cache.remove({});
		cacheService.currentSize = 0;
		let value = await cacheService.findOne('example-key');
		await sleep(3000);
		let value2 = await cacheService.findOne('example-key');

		expect(value).not.to.be.an('undefined');
		expect(cacheService.latestHit).to.equal('hit');
		expect(value).not.to.equal(value2);
	});
	it('should update the oldest record if size limit reached', async function() {
		await Cache.remove({});
		cacheService.currentSize = 0;
		let value = await cacheService.findOne('example-key');
		await sleep(1000);
		let value2 = await cacheService.findOne('example-key2');
		await sleep(1000);
		let value3 = await cacheService.findOne('example-key3');

		expect(value).not.to.be.an('undefined');
		expect(value2).not.to.be.an('undefined');
		expect(value3).not.to.be.an('undefined');
		expect(cacheService.latestHit).to.equal('miss');
		expect(value2.id).to.equal(value3.id);
		expect(value2.key).not.to.equal(value3.key);
	});
});
