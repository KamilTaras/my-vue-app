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
              x: { 
                title: { display: true, text: 'Week', color: '#E0E0E0' },
                ticks: { color: '#E0E0E0' }
              },
              y: { 
                title: { display: true, text: 'Commits', color: '#E0E0E0' },
                ticks: { max: 10, stepSize: 1, color: '#E0E0E0' },
                beginAtZero: false
              },
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            },
            backgroundColor: '#111827'
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  </style>
  