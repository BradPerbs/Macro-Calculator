<template>
  <div id="app">
    <Card>
      <template #title>
        Macro Tracker
      </template>
      <template #content>
        <div class="protein-goal-input">
          <label for="proteinGoal">Daily Protein Goal (g): </label>
          <InputNumber id="proteinGoal" v-model="proteinGoal" :min="0" :step="1" />
        </div>
        <WeekView :proteinGoal="proteinGoal" />
      </template>
    </Card>
  </div>
</template>

<script>
import WeekView from './components/WeekView.vue'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import './assets/main.css'

export default {
  name: 'App',
  components: {
    WeekView,
    Card,
    InputNumber
  },
  data() {
    return {
      proteinGoal: 100 // Default value, you can change this
    }
  }
}
</script>
