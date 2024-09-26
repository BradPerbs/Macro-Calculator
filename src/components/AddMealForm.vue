<template>
  <div class="add-meal-form">
    <h3>Add New Meal</h3>
    <form @submit.prevent="addMeal">
      <InputText v-model="name" placeholder="Meal Name" required />
      <InputNumber v-model="protein" placeholder="Protein (g)" required />
      <InputNumber v-model="calories" placeholder="Calories" required />
      <Button type="submit" label="Add Meal" icon="pi pi-plus" :loading="loading"/>
    </form>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

export default {
  name: 'AddMealForm',
  components: {
    InputText,
    InputNumber,
    Button
  },
  methods: {
    addMeal() {
      const newMeal = {
        id: Date.now(), // Using timestamp as a simple unique id
        name: this.name,
        protein: this.protein,
        calories: this.calories
      }
      this.$emit('meal-added', newMeal)
      this.name = ''
      this.protein = null
      this.calories = null
    }
  }
}
</script>

<style scoped>
.add-meal-form {
  margin-bottom: 20px;
}
.add-meal-form :deep(.p-inputtext) {
  margin-right: 10px;
}
</style>
