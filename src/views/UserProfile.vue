<template>
  <div class="max-w-5xl mx-auto mt-5 p-5 bg-gray-700 rounded">
    <!-- User Profile Information -->
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-semibold text-white">User Profile</h2>
    </div>

    <div v-if="showSuccess" class="bg-green-500 text-white px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{{ successMessage }}</span>
      <button @click="dismissSuccess" class="absolute top-0 bottom-0 right-0 px-4 py-3 text-lg">
        &times;
      </button>
    </div>

    <div v-if="showError" class="bg-red-500 text-white px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{{ errorMessage }}</span>
      <button @click="dismissError" class="absolute top-0 bottom-0 right-0 px-4 py-3 text-lg">
        &times;
      </button>
    </div>
    
    <!-- Edit First Name and Last Name Form -->
    <div class="mt-10 mb-10">
      <form @submit.prevent="updateProfile">
        <div class="mb-3">
          <input
            type="text"
            v-model="first_name"
            placeholder="First Name"
            class="p-2 rounded bg-gray-600 text-white w-full"
          />
        </div>
        <div class="mb-3">
          <input
            type="text"
            v-model="last_name"
            placeholder="Last Name"
            class="p-2 rounded bg-gray-600 text-white w-full"
          />
        </div>
        <button type="submit" class="p-2 bg-blue-500 rounded text-white">Update Profile</button>
      </form>
    </div>
    
    <div>
      <h3 class="text-xl font-semibold text-white">{{ username }}</h3>
      <p class="text-gray-300">Number of snippets: {{ snippetCount }}</p>
    </div>

    <!-- Programming Languages Chart -->
    <div v-if="snippetCount > 0" class="p-10">
      <PieChart :chart-data="languageChartData" :options="chartOptions" />
    </div>

    <!-- Contribution History Chart -->
    <div v-if="snippetCount > 0" class="mt-10">
      <h3 class="text-lg text-white mb-3">Commit History</h3>
      <CommitHistoryChart :weekly-contributions="weeklyContributions" />
      <calendar-heatmap :values="dailyCommits" :end-date="Date()" :round="2" dark-mode :max="10" :tooltip="false"/>
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
import { CalendarHeatmap } from 'vue3-calendar-heatmap'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "UserProfile",
  components: {
    PieChart,
    CommitHistoryChart,
    CalendarHeatmap,
  },
  data() {
    return {
      username: '',
      first_name: '',
      last_name: '',
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
            labels: {
                padding: 30,
                boxWidth: 50,
                font: {
                  size: 22,
                },
                color: "white",
            },
          },
        },
      },
      weeklyContributions: {},
      showSuccess: false,
      successMessage: '',
      showError: false,
      errorMessage: '',
      dailyCommits: [],
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
      // Fetch additional profile data
      const user_id = localStorage.getItem('user_id');
      const user_token = localStorage.getItem('user-token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${user_token}`;
      axios.get(`${Config.BACKEND_URL}/api/v1/user/${user_id}`)
        .then((response) => {
          this.first_name = response.data.data.first_name;
          this.last_name = response.data.data.last_name;
        })
        .catch((error) => {
          console.error('There was an error fetching the user profile:', error);
        });
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
          this.prepareHeatmap(snippets);
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

    updateProfile() {
      const user_token = localStorage.getItem('user-token');
      const user_id = localStorage.getItem('user_id');
      axios.defaults.headers.common['Authorization'] = `Bearer ${user_token}`;

      axios.put(`${Config.BACKEND_URL}/api/v1/user/${user_id}`, {
        first_name: this.first_name,
        last_name: this.last_name,
      })
        .then(() => {
          this.showSuccessMessage('Profile updated successfully.');
        })
        .catch((error) => {
          this.showErrorMessage('There was an error updating the profile.');
          console.error('There was an error updating the profile:', error);
        });
    },

    showSuccessMessage(message) {
      this.successMessage = message;
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    },

    showErrorMessage(message) {
      this.errorMessage = message;
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    },

    dismissSuccess() {
      this.showSuccess = false;
    },

    dismissError() {
      this.showError = false;
    },
    
    prepareHeatmap(snippets){
      const daily_commits = {};
      snippets.forEach((snippet) => {
        const date = new Date(snippet.CreatedAt);
        const dateString = date.toISOString().split('T')[0];
        if (daily_commits[dateString] == undefined) {
          daily_commits[dateString] = 1;
        } else {
          daily_commits[dateString] += 1;
        }
      });
      const commits_array = [];
      for (const [key, value] of Object.entries(daily_commits)) {
        commits_array.push({date: key, count: value});
      }
      this.dailyCommits = commits_array;
    }
  },
};
</script>


<style lang="scss">

	.vch__container {
		.vch__legend {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.vch__external-legend-wrapper {
			margin: 0 8px;
		}
	}

	svg.vch__wrapper {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		line-height: 10px;
		width: 100%;

		.vch__months__labels__wrapper text.vch__month__label {
			font-size: 10px;
		}

		.vch__days__labels__wrapper text.vch__day__label,
		.vch__legend__wrapper text {
			font-size: 9px;
		}

		text.vch__month__label,
		text.vch__day__label,
		.vch__legend__wrapper text {
			fill: #E0E0E0;
		}

		rect.vch__day__square:hover {
			stroke: #E0E0E0;
			stroke-width: 2px;
			paint-order: stroke;
		}

		rect.vch__day__square:focus {
			outline: none;
		}

		&.dark-mode {
			text.vch__month__label,
			text.vch__day__label,
			.vch__legend__wrapper text {
				fill: #E0E0E0;
			}
		}
	}

</style>
