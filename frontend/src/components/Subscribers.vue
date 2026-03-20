<script setup lang="ts">
import { onMounted, ref } from "vue";

type Email = { email: string }[];

let emailList = ref<Email>([]);
let loading = ref(true);

// const API_URL = import.meta.env.VITE_API_URL

onMounted(() => {
  new Promise(resolve => setTimeout(resolve, 1500))
    .then(() => fetch('/api/list')
      .then((response) => response.json())
      .then((data: Email) => {
        emailList.value = data
        loading.value = false;
      }));
});
</script>

<template>
  <div v-if="loading">
    <span class="relative flex h-16 w-16">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-200 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-16 w-16 bg-slate-200"></span>
    </span>
  </div>
  <div v-if="!loading">
    <h3 class="text-white text-xl">List of Subscribers</h3>
    <ol class="list-decimal">
      <li v-for="(item, index) in emailList" :key="index" class="text-sm text-white">
        {{ item.email }}
      </li>
    </ol>
    <RouterLink class="mt-5 block text-sm underline text-white hover:font-medium" to="/">Go Back</RouterLink>
  </div>
</template>

<script lang="ts">
export default {
  name: "Subscribers",
};
</script>
