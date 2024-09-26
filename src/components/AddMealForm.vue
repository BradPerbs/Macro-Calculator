<template>
  <div class="add-meal-form">
    <h3>Add New Meal</h3>
    <form @submit.prevent="addMeal">
      <InputText v-model="name" placeholder="Meal Name" required />
      <InputNumber v-model="protein" placeholder="Protein (g)" :min="0" :step="1" required />
      <InputNumber v-model="calories" placeholder="Calories" :min="0" :step="1" required />
      <Button type="submit" label="Add Meal" />
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
  data() {
    return {
      name: '',
      protein: null,
      calories: null
    }
  },
  methods: {
    addMeal() {
      if (this.name && this.protein !== null && this.calories !== null) {
        const newMeal = {
          id: Date.now(),
          name: this.name,
          protein: this.protein,
          calories: this.calories
        }
        this.$emit('meal-added', newMeal)
        this.resetForm()
      }
    },
    resetForm() {
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
.add-meal-form :deep(.p-inputtext),
.add-meal-form :deep(.p-inputnumber) {
  margin-right: 10px;
  margin-bottom: 10px;
}

.p-button{
    vertical-align: initial !important;
}
</style>
