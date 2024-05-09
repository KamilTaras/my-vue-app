<!-- CommitHistoryChart.vue -->
<template>
    <div>
      <canvas ref="commitChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default {
    name: "CommitHistoryChart",
    props: {
      weeklyContributions: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        chartInstance: null,
      };
    },
    mounted() {
      this.renderChart();
    },
    watch: {
      weeklyContributions: {
        immediate: true,
        deep: true,
        handler() {
          this.renderChart();
        },
      },
    },
    methods: {
      renderChart() {
        if (this.chartInstance) {
          this.chartInstance.destroy(); // Destroy previous instance to avoid duplicates
        }
  
        const weekLabels = Object.keys(this.weeklyContributions);
        const data = Object.values(this.weeklyContributions);

        if (this.$refs.commitChart === undefined) {
          return;
        }

        this.chartInstance = new ChartJS(this.$refs.commitChart.getContext('2d'), {
          type: 'bar',
          data: {
            labels: weekLabels,
            datasets: [{
              label: 'Commits per Week',
              data,
              backgroundColor: '#36A2EB',
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: { title: { display: true, text: 'Week' } },
              y: { title: { display: true, text: 'Commits' }, beginAtZero: true },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  