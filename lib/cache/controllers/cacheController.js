const logger = require('winston');
const keys = require('../config/keys').Cache;
const mongoose = require('mongoose');
const cacheSchema = require('../models/cacheSchema');

mongoose.Promise = global.Promise;

const mongoUri = `${keys.dbConfig.host}:${keys.dbConfig.port}/${keys.dbConfig.dbName}`;
logger.debug(`mongoUri: ${mongoUri}`);
mongoose.connect(mongoUri);

const cacheService = require('../models/cache')(
	cacheSchema,
	keys.cacheConfig.timeToLive,
	keys.cacheConfig.sizeLimit
);

const findOne = function(req, res) {
	cacheService
		.findOne(req.params.key)
		.then(kvp => {
			if (kvp) {
				res.status(200).send({ kvp });
			} else {
				res.status(404);
			}
		})
		.catch(error => {
			logger.error(error);
			res.status(500).send(error);
		});
};
const find = function(req, res) {
	// cacheService
	// 	.find()
	// 	.then(kvp => {
	// 		if (kvp) {
	// 			res.status(200).send({ kvp });
	// 		} else {
	// 			res.status(404);
	// 		}
	// 	})
	// 	.catch(error => {
	// 		logger.error(error);
	// 		res.status(500).send(error);
	// 	});
};
const create = function(req, res) {
	let keyValue = req.body;
	if (!keyValue || !keyValue.key || !keyValue.value) {
		res
			.status(422)
			.send({ message: 'Body must be in {key: ..., value: ...} format' });
		return;
	}
	cacheService
		.create(keyValue.key, keyValue.body)
		.then(kvp => {
			res.status(200).send({ kvp });
		})
		.catch(error => {
			logger.error(error);
			res.status(500).send(error);
		});
};
const deleteAll = function(req, res) {
	cacheService
		.deleteAll()
		.then(() => {
			res.status(200).send({ message: 'Entire cache was succesfully deleted' });
		})
		.catch(error => {
			logger.error(error);
			res.status(500).send(error);
		});
};
const deleteOne = function(req, res) {
	cacheService
		.deleteOne(req.params.key)
		.then(kvp => {
			if (kvp) {
				res.status(200).send({ kvp });
			} else {
				res.status(404);
			}
		})
		.catch(error => {
			logger.error(error);
			res.status(500).send(error);
		});
};

module.exports = {
	find,
	findOne,
	create,
	deleteAll,
	deleteOne
};
