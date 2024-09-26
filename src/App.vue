<template>
  <div id="app">
    <Card>
      <template #title>
        Macro Tracker
      </template>
      <template #content>
        <WeekView />
      </template>
    </Card>
  </div>
</template>

<script>
import WeekView from './components/WeekView.vue'
import Card from 'primevue/card'

export default {
  name: 'App',
  components: {
    WeekView,
    Card
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
