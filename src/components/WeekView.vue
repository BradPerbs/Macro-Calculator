<template>
  <div>
    <div class="week-view">
      <div v-for="day in week" :key="day.date" class="day">
        <Panel :header="day.name">
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
              :key="meal.id" 
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
          </div>
        </Panel>
      </div>
    </div>
    <h3>Available Meals</h3>
    <DataTable :value="meals" class="meal-list">
      <Column field="name" header="Name">
        <template #body="slotProps">
          <div 
            draggable="true" 
            @dragstart="onDragStart($event, slotProps.data.id)"
            class="draggable-meal"
          >
            {{ slotProps.data.name }}
          </div>
        </template>
      </Column>
      <Column field="protein" header="Protein (g)"></Column>
      <Column field="calories" header="Calories"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button 
            icon="pi pi-trash" 
            class="p-button-rounded p-button-danger" 
            @click="removeMealFromList(slotProps.data.id)" 
          />
        </template>
      </Column>
    </DataTable>

    <AddMealForm @meal-added="addMealToList" />

    <Button label="Clear Week" icon="pi pi-trash" @click="clearWeek" class="p-button-danger mb-3" />
  </div>
</template>

<script>
import AddMealForm from './AddMealForm.vue'
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

export default {
  name: 'WeekView',
  components: {
    AddMealForm,
    Panel,
    Chip,
    DataTable,
    Column,
    Button
  },
  data() {
    return {
      week: this.loadWeekData(),
      meals: this.loadMeals()
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
        day.meals.push({ ...meal })
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
  border: 2px dashed #ccc;
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
</style>