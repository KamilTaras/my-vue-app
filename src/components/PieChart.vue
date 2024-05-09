<!-- PieChart.vue -->
<template>
    <div>
      <Pie v-if="loaded" :data="chartData" :options="options" />
    </div>
  </template>
  
  <script>
  import { Pie } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  export default {
    name: "PieChart",
    components: {
      Pie,
    },
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      options: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        loaded: false,
      };
    },
    mounted() {
      // Ensure the chart is loaded before rendering it
      this.loaded = true;
    },
  };
  </script>
  
  <style scoped>
  </style>
  