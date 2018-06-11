var cacheController = require('./controllers/cacheController');
var router = require('express').Router({ mergeParams: true });

module.exports = router;

router.get('/cache/:key', cacheController.findOne);
router.delete('/cache/:key', cacheController.deleteOne);
router.post('/cache/', cacheController.create);