const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get diet plan
const getDietPlan = async (req, res) => {
  try {
    const userId = req.user.userId
    
    const dietPlan = await prisma.dietPlan.findUnique({
      where: { userId },
      include: {
        meals: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    res.json(dietPlan)
  } catch (error) {
    console.error('Error fetching diet plan:', error)
    res.status(500).json({ error: 'Failed to fetch diet plan' })
  }
}

// Save diet plan (water intake)
const saveDietPlan = async (req, res) => {
  try {
    const userId = req.user.userId
    const { waterIntake } = req.body
    
    const dietPlan = await prisma.dietPlan.upsert({
      where: { userId },
      update: { waterIntake },
      create: { userId, waterIntake }
    })
    
    res.json(dietPlan)
  } catch (error) {
    console.error('Error saving diet plan:', error)
    res.status(500).json({ error: 'Failed to save diet plan' })
  }
}

// Add meal
const addMeal = async (req, res) => {
  try {
    const userId = req.user.userId
    const { name, calories, protein, carbs, fat, type } = req.body
    
    // Get or create diet plan
    let dietPlan = await prisma.dietPlan.findUnique({
      where: { userId }
    })
    
    if (!dietPlan) {
      dietPlan = await prisma.dietPlan.create({
        data: { userId, waterIntake: 0 }
      })
    }
    
    const meal = await prisma.meal.create({
      data: {
        dietPlanId: dietPlan.id,
        name,
        calories,
        protein,
        carbs,
        fat,
        type,
        consumed: false
      }
    })
    
    res.json(meal)
  } catch (error) {
    console.error('Error adding meal:', error)
    res.status(500).json({ error: 'Failed to add meal' })
  }
}

// Update meal
const updateMeal = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { consumed } = req.body
    
    // Verify meal belongs to user
    const meal = await prisma.meal.findFirst({
      where: {
        id: parseInt(id),
        dietPlan: { userId }
      }
    })
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' })
    }
    
    const updatedMeal = await prisma.meal.update({
      where: { id: parseInt(id) },
      data: { consumed }
    })
    
    res.json(updatedMeal)
  } catch (error) {
    console.error('Error updating meal:', error)
    res.status(500).json({ error: 'Failed to update meal' })
  }
}

// Delete meal
const deleteMeal = async (req, res) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    
    // Verify meal belongs to user
    const meal = await prisma.meal.findFirst({
      where: {
        id: parseInt(id),
        dietPlan: { userId }
      }
    })
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' })
    }
    
    await prisma.meal.delete({
      where: { id: parseInt(id) }
    })
    
    res.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error('Error deleting meal:', error)
    res.status(500).json({ error: 'Failed to delete meal' })
  }
}

module.exports = {
  getDietPlan,
  saveDietPlan,
  addMeal,
  updateMeal,
  deleteMeal
}