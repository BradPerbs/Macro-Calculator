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
            <div v-for="(meal, index) in day.meals" :key="meal.uniqueId || meal.id" class="meal-card">
              <div class="meal-content">
                <div class="meal-name">{{ meal.name }}</div>
                <div class="meal-details">
                  Protein: {{ meal.protein }}g, Calories: {{ meal.calories }}
                </div>
              </div>
              <Button 
                icon="pi pi-trash" 
                class="p-button-rounded p-button-danger p-button-sm delete-button" 
                @click="removeMeal(day, index)" 
              />
            </div>
          </div>
          <div class="day-total">
            Total: Protein {{ dayTotal(day).protein }}g, Calories {{ dayTotal(day).calories }}
            <span v-if="isDailyGoalReached(day)" class="goal-indicator"><br/>Goal Reached! 🎉</span>
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

    <Button label="Clear Week" icon="pi pi-trash" @click="clearWeek" class="p-button-danger p-button-sm" />
  </div>
</template>

<script>
import AddMealForm from './AddMealForm.vue'
import Panel from 'primevue/panel'
import Button from 'primevue/button'

export default {
  name: 'WeekView',
  components: {
    AddMealForm,
    Panel,
    Button
  },
  props: {
    proteinGoal: {
      type: Number,
      default: 120
    }
  },
  data() {
    return {
      week: this.loadWeekData(),
      meals: this.loadMeals()
    }
  },
  mounted() {
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
      const draggedEl = event.target.cloneNode(true)
      draggedEl.style.opacity = '1'
      draggedEl.style.position = 'absolute'
      draggedEl.style.top = '-1000px'
      document.body.appendChild(draggedEl)
      event.dataTransfer.setDragImage(draggedEl, 0, 0)
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