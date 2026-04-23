const prisma = require('../db/prisma')

// Get diet plan
const getDietPlan = async (req, res) => {
  try {
    const userId = req.user.userId

    const dietPlan = await prisma.DietPlan.findUnique({
      where: { userId },
      include: {
        meals: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!dietPlan) return res.json(null)

    // Deduplicate: keep only the latest meal per type
    const seenTypes = new Set()
    const uniqueMeals = dietPlan.meals.filter(meal => {
      if (seenTypes.has(meal.type)) return false
      seenTypes.add(meal.type)
      return true
    })

    // Clean up duplicate meals in DB
    const keepIds = uniqueMeals.map(m => m.id)
    await prisma.Meal.deleteMany({
      where: { dietPlanId: dietPlan.id, id: { notIn: keepIds } }
    })

    res.json({ ...dietPlan, meals: uniqueMeals })
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
    
    const dietPlan = await prisma.DietPlan.upsert({
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
    let dietPlan = await prisma.DietPlan.findUnique({
      where: { userId }
    })

    if (!dietPlan) {
      dietPlan = await prisma.DietPlan.create({
        data: { userId, waterIntake: 0 }
      })
    }

    // Delete existing meal of same type before creating new one
    await prisma.Meal.deleteMany({
      where: { dietPlanId: dietPlan.id, type }
    })

    const meal = await prisma.Meal.create({
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
    const meal = await prisma.Meal.findFirst({
      where: {
        id: parseInt(id),
        dietPlan: { userId }
      }
    })
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' })
    }
    
    const updatedMeal = await prisma.Meal.update({
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
    const meal = await prisma.Meal.findFirst({
      where: {
        id: parseInt(id),
        dietPlan: { userId }
      }
    })
    
    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' })
    }
    
    await prisma.Meal.delete({
      where: { id: parseInt(id) }
    })
    
    res.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error('Error deleting meal:', error)
    res.status(500).json({ error: 'Failed to delete meal' })
  }
}

// Delete meal by type
const deleteMealByType = async (req, res) => {
  try {
    const userId = req.user.userId
    const { type } = req.params

    const dietPlan = await prisma.DietPlan.findUnique({ where: { userId } })
    if (!dietPlan) return res.status(404).json({ error: 'Diet plan not found' })

    await prisma.Meal.deleteMany({
      where: { dietPlanId: dietPlan.id, type }
    })

    res.json({ message: 'Meal deleted successfully' })
  } catch (error) {
    console.error('Error deleting meal by type:', error)
    res.status(500).json({ error: 'Failed to delete meal' })
  }
}

module.exports = {
  getDietPlan,
  saveDietPlan,
  addMeal,
  updateMeal,
  deleteMeal,
  deleteMealByType
}