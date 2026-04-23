const prisma = require('../db/prisma');

const getActivities = async (req, res) => {
  try {
    const userId = req.user.userId;
    
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
    const userId = req.user.userId;
    const { type, action, timestamp } = req.body;

    // Validate required fields
    if (!type || !action) {
      return res.status(400).json({ message: 'Type and action are required' });
    }

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
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Failed to create activity', error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
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

const getStreak = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // First, check for a manual streak override
    const manualStreak = await prisma.Activity.findFirst({
      where: { userId, type: 'MANUAL_STREAK' },
      orderBy: { createdAt: 'desc' }
    });

    if (manualStreak) {
      return res.status(200).json({ streak: parseInt(manualStreak.action) || 0 });
    }

    // Fetch all activities for the user
    const activities = await prisma.Activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });

    if (activities.length === 0) {
      return res.status(200).json({ streak: 0 });
    }

    // Extract dates (YYYY-MM-DD) and remove duplicates
    const activeDates = [...new Set(activities.map(a => a.createdAt.toISOString().split('T')[0]))];
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If no activity today and no activity yesterday, streak is 0
    if (activeDates[0] !== today && activeDates[0] !== yesterday) {
      return res.status(200).json({ streak: 0 });
    }

    // Calculate consecutive days
    let currentDate = new Date(activeDates[0]);
    streak = 1;

    for (let i = 1; i < activeDates.length; i++) {
      const prevDate = new Date(activeDates[i]);
      const diffTime = Math.abs(currentDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }

    res.status(200).json({ streak });
  } catch (error) {
    console.error('Error calculating streak:', error);
    res.status(500).json({ message: 'Failed to calculate streak' });
  }
};

const adjustStreak = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { adjustment } = req.body;

    // Get current streak (either manual or calculated)
    const latestManual = await prisma.Activity.findFirst({
      where: { userId, type: 'MANUAL_STREAK' },
      orderBy: { createdAt: 'desc' }
    });

    let currentStreak = 0;
    if (latestManual) {
      currentStreak = parseInt(latestManual.action) || 0;
    } else {
      // Calculate real streak
      const activities = await prisma.Activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      });

      if (activities.length > 0) {
        const activeDates = [...new Set(activities.map(a => a.createdAt.toISOString().split('T')[0]))];
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (activeDates[0] === today || activeDates[0] === yesterday) {
          currentStreak = 1;
          let currentDate = new Date(activeDates[0]);
          for (let i = 1; i < activeDates.length; i++) {
            const prevDate = new Date(activeDates[i]);
            if (Math.ceil(Math.abs(currentDate - prevDate) / (1000 * 60 * 60 * 24)) === 1) {
              currentStreak++;
              currentDate = prevDate;
            } else break;
          }
        }
      }
    }

    const newStreak = Math.max(0, currentStreak + adjustment);

    await prisma.Activity.create({
      data: {
        userId,
        type: 'MANUAL_STREAK',
        action: newStreak.toString(),
        timestamp: new Date().toISOString()
      }
    });

    res.status(200).json({ streak: newStreak });
  } catch (error) {
    console.error('Error adjusting streak:', error);
    res.status(500).json({ message: 'Failed to adjust streak' });
  }
};

module.exports = { getActivities, createActivity, deleteActivity, getStreak, adjustStreak };