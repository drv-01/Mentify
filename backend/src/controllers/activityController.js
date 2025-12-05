const prisma = require('../db/prisma');

const getActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const activities = await prisma.Activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
};

const createActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, action, timestamp } = req.body;

    const activity = await prisma.Activity.create({
      data: {
        userId,
        type,
        action,
        timestamp: timestamp || new Date().toLocaleString()
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create activity' });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await prisma.Activity.deleteMany({
      where: { 
        id: parseInt(id),
        userId 
      }
    });

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete activity' });
  }
};

module.exports = { getActivities, createActivity, deleteActivity };