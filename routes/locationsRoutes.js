const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationsController');

router.get('/locations', locationsController.getAllLocations);
router.get('/locations/:id', locationsController.getLocationById);
router.post('/locations', locationsController.createLocation);
router.put('/locations/:id', locationsController.updateLocation);
router.delete('/locations/:id', locationsController.deleteLocation);

module.exports = router;