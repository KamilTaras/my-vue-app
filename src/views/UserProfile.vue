<template>
  <div class="max-w-2xl mx-auto mt-5 p-5 bg-gray-700 rounded">
    <!-- User Profile Information -->
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-semibold text-white">User Profile</h2>
    </div>

    <div class="mb-5">
      <h3 class="text-xl font-semibold text-white">{{ username }}</h3>
      <p class="text-gray-300">Number of snippets: {{ snippetCount }}</p>
    </div>

    <!-- Programming Languages Chart -->
    <div v-if="snippetCount > 0">
      <PieChart :chart-data="languageChartData" :options="chartOptions" />
    </div>

    <!-- Contribution History Chart -->
    <div v-if="snippetCount > 0" class="mt-10">
      <h3 class="text-lg text-white mb-3">Commit History</h3>
      <CommitHistoryChart :weekly-contributions="weeklyContributions" />
    </div>

    <!-- Message when no snippets are available -->
    <div v-else class="text-center text-gray-400 my-5">No data</div>
  </div>
</template>

<script>
import axios from 'axios';
import PieChart from '@/components/PieChart.vue';
import CommitHistoryChart from '@/components/CommitHistoryChart.vue';
import Config from "../config.js";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "UserProfile",
  components: {
    PieChart,
    CommitHistoryChart,
  },
  data() {
    return {
      username: '',
      snippetCount: 0,
      languageChartData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            ],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
        },
      },
      weeklyContributions: {},
    };
  },
  created() {
    this.fetchUserProfile();
    this.fetchUserSnippets();
  },
  methods: {
    fetchUserProfile() {
      const username = localStorage.getItem('username');
      this.username = username ? username : 'Anonymous';
    },

    fetchUserSnippets() {
      const user_token = localStorage.getItem('user-token');
      const user_id = localStorage.getItem('user_id');
      axios.defaults.headers.common['Authorization'] = `Bearer ${user_token}`;

      axios.get(`${Config.BACKEND_URL}/api/v1/user_code_snippet/${user_id}`)
        .then((response) => {
          const snippets = response.data.data.filter(
            (snippet) => snippet.CodeSnippetVersions.length > 0
          );
          this.snippetCount = snippets.length;
          this.prepareLanguageChart(snippets);
          this.prepareCommitHistory(snippets);
        })
        .catch((error) => {
          console.error('There was an error fetching the code snippets:', error);
        });
    },

    prepareLanguageChart(snippets) {
      const languageUsage = {};

      snippets.forEach((snippet) => {
        const latestVersion = snippet.CodeSnippetVersions[snippet.CodeSnippetVersions.length - 1];
        const language = latestVersion.ProgramLanguage.Name;

        if (languageUsage[language]) {
          languageUsage[language]++;
        } else {
          languageUsage[language] = 1;
        }
      });

      this.languageChartData.labels = Object.keys(languageUsage);
      this.languageChartData.datasets[0].data = Object.values(languageUsage);
    },

    prepareCommitHistory(snippets) {
      const weeklyContributions = {};

      for (let i = 0; i < 52; i++) {
        const week = `Week ${i + 1}`;
        weeklyContributions[week] = 0;
      }

      snippets.forEach((snippet) => {
        snippet.CodeSnippetVersions.forEach((version) => {
          const date = new Date(version.CreatedAt);
          const yearStart = new Date(date.getFullYear(), 0, 1);
          const weekNumber = Math.ceil(((date - yearStart) / (24 * 60 * 60 * 1000) + 1) / 7);
          const weekLabel = `Week ${weekNumber}`;

          if (weekLabel in weeklyContributions) {
            weeklyContributions[weekLabel]++;
          }
        });
      });

      this.weeklyContributions = weeklyContributions;
    },
  },
};
</script>

<style scoped>
</style>
