module.exports = {
	// Customer module configs
	Cache: {
		dbConfig: {
			host: 'mongodb://127.0.0.1',
			port: 27017,
			dbName: 'cache'
		},
        cacheConfig: {
            sizeLimit: 10,
            // Set low for development
            timeToLive: 5000
        }
	}
};
