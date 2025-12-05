const { Router } = require('express');
const { getActivities, createActivity, deleteActivity } = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

router.get('/', authenticateToken, getActivities);
router.post('/', authenticateToken, createActivity);
router.delete('/:id', authenticateToken, deleteActivity);

module.exports = router;