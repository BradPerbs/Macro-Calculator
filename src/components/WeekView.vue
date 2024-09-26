<template>
  <div>
    <div class="week-view">
      <div v-for="day in week" :key="day.date" class="day">
        <Panel 
          :header="day.name" 
          :class="{ 
            'goal-reached': isDailyGoalReached(day), 
            'current-day': isCurrentDay(day)
          }"
        >
          <div 
            class="drop-zone"
            :class="{ 'drag-over': day.isDragOver }"
            @drop="onDrop($event, day)"
            @dragover.prevent
            @dragenter.prevent="onDragEnter(day)"
            @dragleave.prevent="onDragLeave(day)"
          >
            <Chip 
            v-for="(meal, index) in day.meals" 
            :key="meal.uniqueId || meal.id" 
            :label="meal.name" 
            removable 
            @remove="removeMeal(day, index)"
            >
            <template #content>
                {{ meal.name }} (Protein: {{ meal.protein }}g, Calories: {{ meal.calories }})
            </template>
            </Chip>

          </div>
          <div class="day-total">
            Total: Protein {{ dayTotal(day).protein }}g, Calories {{ dayTotal(day).calories }}
            <span v-if="isDailyGoalReached(day)" class="goal-indicator">🎉 Goal Reached!</span>
          </div>
        </Panel>
      </div>
    </div>
    <h3>Available Meals</h3>
    <div class="available-meals-grid">
      <div 
        v-for="meal in meals" 
        :key="meal.id" 
        class="meal-item draggable-meal"
        draggable="true"
        @dragstart="onDragStart($event, meal.id)"
        >
        <div class="meal-content">
          <div class="meal-name">{{ meal.name }}</div>
          <div class="meal-details">
            Protein: {{ meal.protein }}g, Calories: {{ meal.calories }}
          </div>
        </div>
        <Button 
          icon="pi pi-trash" 
          class="p-button-rounded p-button-danger p-button-sm delete-button" 
          @click="removeMealFromList(meal.id)" 
        />
      </div>
    </div>

    <AddMealForm @meal-added="addMealToList" />

    <Button label="Clear Week" icon="pi pi-trash" @click="clearWeek" class="p-button-danger mb-3" />
  </div>
</template>

<script>
import AddMealForm from './AddMealForm.vue'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
import Button from 'primevue/button'

export default {
  name: 'WeekView',
  components: {
    AddMealForm,
    Panel,
    Chip,
    Button
  },
  props: {
    proteinGoal: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      week: this.loadWeekData(),
      meals: this.loadMeals()
    }
  },
  mounted() {
    // Add sample meals if there are no meals
    if (this.meals.length === 0) {
      this.addSampleMeals();
    }
    
    // Add a sample meal to Monday if it's empty
    if (this.week[0].meals.length === 0) {
      this.addSampleMealToMonday();
    }
  },
  methods: {
    clearWeek() {
      this.week = this.week.map(day => ({ ...day, meals: [] }));
      this.saveWeekData();
    },
    loadWeekData() {
      const savedWeek = localStorage.getItem('weekData')
      if (savedWeek) {
        return JSON.parse(savedWeek).map(day => ({ ...day, isDragOver: false }))
      } else {
        return [
          { name: 'Monday', date: '2024-09-23', meals: [], isDragOver: false },
          { name: 'Tuesday', date: '2024-09-24', meals: [], isDragOver: false },
          { name: 'Wednesday', date: '2024-09-25', meals: [], isDragOver: false },
          { name: 'Thursday', date: '2024-09-26', meals: [], isDragOver: false },
          { name: 'Friday', date: '2024-09-27', meals: [], isDragOver: false },
          { name: 'Saturday', date: '2024-09-28', meals: [], isDragOver: false },
          { name: 'Sunday', date: '2024-09-29', meals: [], isDragOver: false },
        ]
      }
    },
    loadMeals() {
      const savedMeals = localStorage.getItem('meals')
      return savedMeals ? JSON.parse(savedMeals) : []
    },
    saveWeekData() {
      localStorage.setItem('weekData', JSON.stringify(this.week))
    },
    saveMeals() {
      localStorage.setItem('meals', JSON.stringify(this.meals))
    },
    onDragStart(event, mealId) {
      event.dataTransfer.setData('mealId', mealId)
      
      // Create a clone of the dragged element
      const draggedEl = event.target.cloneNode(true)
      draggedEl.style.opacity = '1'
      draggedEl.style.position = 'absolute'
      draggedEl.style.top = '-1000px'
      document.body.appendChild(draggedEl)
      
      // Set the custom drag image
      event.dataTransfer.setDragImage(draggedEl, 0, 0)
      
      // Remove the clone after a short delay
      setTimeout(() => {
        document.body.removeChild(draggedEl)
      }, 0)
    },
    onDragEnter(day) {
      day.isDragOver = true
    },
    onDragLeave(day) {
      day.isDragOver = false
    },
    onDrop(event, day) {
      day.isDragOver = false
      const mealId = event.dataTransfer.getData('mealId')
      const meal = this.findMealById(mealId)
      if (meal) {
        const newMeal = { ...meal, uniqueId: Date.now() }
        day.meals.push(newMeal)
        this.saveWeekData()
      }
    },
    findMealById(id) {
      return this.meals.find(meal => meal.id === parseInt(id))
    },
    dayTotal(day) {
      return day.meals.reduce((total, meal) => {
        total.protein += meal.protein
        total.calories += meal.calories
        return total
      }, { protein: 0, calories: 0 })
    },
    removeMeal(day, index) {
      day.meals.splice(index, 1)
      this.saveWeekData()
    },
    addMealToList(meal) {
      this.meals.push(meal)
      this.saveMeals()
    },
    removeMealFromList(id) {
      const index = this.meals.findIndex(meal => meal.id === id)
      if (index !== -1) {
        this.meals.splice(index, 1)
        this.saveMeals()
      }
    },
    isDailyGoalReached(day) {
      return this.dayTotal(day).protein >= this.proteinGoal
    },
    addSampleMeals() {
      const sampleMeals = [
        { id: 1, name: 'Chicken Breast', protein: 31, calories: 165 },
        { id: 2, name: 'Greek Yogurt', protein: 17, calories: 100 },
        { id: 3, name: 'Protein Shake', protein: 25, calories: 120 },
        { id: 4, name: 'Salmon Fillet', protein: 22, calories: 206 },
        { id: 5, name: 'Egg Whites', protein: 26, calories: 126 }
      ];
      this.meals = sampleMeals;
      this.saveMeals();
    },
    addSampleMealToMonday() {
      const mondayMeal = { ...this.meals[0], uniqueId: Date.now() };
      this.week[0].meals.push(mondayMeal);
      this.saveWeekData();
    },
    isCurrentDay(day) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return day.name === dayNames[dayOfWeek];
    }
  }
}
</script>

<style scoped>
.week-view {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.day {
  flex: 0 0 calc(100% / 7 - 10px);
  min-width: 200px;
}

.drop-zone {
  min-height: 100px;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px dashed #ced8e4;
  border-radius: 10px;
  transition: border-color 0.3s ease;
}

.drop-zone.drag-over {
  border: 2px dashed #7ca3ff;
  padding:5px;
}

.day-total {
  font-weight: bold;
  margin-top: 10px;
}

.goal-indicator {
  color: #4caf50;
  margin-left: 10px;
}

.meal-list {
  margin-top: 20px;
}

:deep(.p-chip) {
  margin-right: 5px;
  margin-bottom: 5px;
}

.draggable-meal {
  cursor: move;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  display: inline-block;
}

.draggable-meal:hover {
  background-color: #e0e0e0;
}

.p-chip {
  background-color: #fff;
  color: #495057;
  border-radius: 16px;
  padding: 0 0.5rem;
  border: 1px solid #ededed;
}

.available-meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.meal-item {
  background-color: #fff;
  border-radius: 15px;
  padding: 0.75rem;
  cursor: move;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ededed;
}

.meal-item:hover {
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.meal-content {
  flex-grow: 1;
  margin-right: 0.5rem;
}

.meal-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-details {
  font-size: 0.8rem;
}

.delete-button {
  flex-shrink: 0;
  scale: 0.8;
}

.meal-card {
  background-color: #f0f0f0;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.meal-content {
  flex-grow: 1;
  margin-right: 0.5rem;
}

.meal-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.meal-details {
  font-size: 0.8rem;
}

.delete-button {
  flex-shrink: 0;
}

:deep(.goal-reached .p-panel-header) {
  background-color: #4caf50;
  color: white;
}

:deep(.current-day .p-panel-header) {
  background-color: #2196f3;
  color: white;
}

:deep(.current-day.goal-reached .p-panel-header) {
  background-color: #4caf50;
  color: white;
}

.p-panel .p-panel-header {
  padding: 1rem;
  background: #f8f9fa;
    background-color: rgb(248, 249, 250);
  color: #495057;
  border-top-right-radius: 15px !important;
  border-top-left-radius: 15px !important;
}
</style>