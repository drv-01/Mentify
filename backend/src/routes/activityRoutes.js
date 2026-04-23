const { Router } = require('express');
const { getActivities, createActivity, deleteActivity, getStreak, adjustStreak } = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

router.get('/', authenticateToken, getActivities);
router.post('/', authenticateToken, createActivity);
router.get('/streak', authenticateToken, getStreak);
router.post('/adjust-streak', authenticateToken, adjustStreak);
router.delete('/:id', authenticateToken, deleteActivity);

module.exports = router;