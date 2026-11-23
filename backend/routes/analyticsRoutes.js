const express = require('express');
const router = express.Router();
const { getOverviewAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/overview', getOverviewAnalytics);

module.exports = router;
