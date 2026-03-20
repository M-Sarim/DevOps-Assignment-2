<script setup lang="ts">
import { ref, watch } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";
defineProps<{ person: string }>();

const subscribed = ref(false);
const typedInput = ref("");
const submitting = ref(false);
const isInvalidEmail = ref(false);
const responseText = ref("");

async function subscribe() {
  if (typedInput.value === "" || isInvalidEmail.value) return;
  submitting.value = true;
  await fetch('/api/new', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: typedInput.value }),
  })
    .then((response) => response.json())
    .then(({ message }) => {
      responseText.value = message
    });
  subscribed.value = true;
  submitting.value = false;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

watch(typedInput, async function () {
  if (typedInput.value === "") {
    return (isInvalidEmail.value = false);
  }
  if (!validateEmail(typedInput.value)) {
    isInvalidEmail.value = true;
  } else {
    isInvalidEmail.value = false;
  }
});
</script>

<template>
  <!-- // await nextTick(); -->
  <ConfettiExplosion v-if="subscribed" />
  <div class="w-full p-5 md:p-6 space-y-5 bg-white shadow-md rounded-xl md:max-w-[600px]">
    <div class="pb-2 space-y-3">
      <h1 class="text-2xl font-black sm:text-2.5xl">
        Subscribe to {{ person }}&apos;s Newsletter! 🚀
      </h1>
      <p class="text-gray-600">
        Receive notifications of high-quality articles about DevOps and other
        relevant topics delivered straight to your inbox. You will receive a
        monthly email from me, ensuring a spam-free experience.
      </p>
    </div>
    <div v-if="subscribed" class="alert bg-green-100 border-green-500 text-green-700 px-4 py-3 rounded relative"
      role="alert">
      <span class="block sm:inline">{{ responseText }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17L4 12" />
        </svg>
      </span>
    </div>
    <form @submit.prevent="() => { }">
      <div class="flex items-center space-x-2">
        <input :disabled="submitting || subscribed" v-model="typedInput" type="email"
          class="w-full bg-gray-100 rounded-md px-5 py-3 focus:outline-none focus:ring-2 focus:ring-inset focus:border-blue-500 invalid:border-pink-500 invalid:text-pink-600 disabled:text-gray-400 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
          placeholder="Enter your email" />
        <button :disabled="submitting || subscribed || isInvalidEmail" type="submit" @click="subscribe"
          class="font-bold text-gray-100 bg-gray-800 p-3 rounded-full transition-all hover:bg-gray-900 hover:scale-105 disabled:opacity-80">
          <svg v-if="!submitting" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <svg v-if="submitting" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </button>
      </div>
      <p v-if="isInvalidEmail" class="text-sm text-red-600 m-0 p-0">
        "{{ typedInput }}" is not a valid email.
      </p>
    </form>
    <RouterLink class="block text-sm underline hover:text-sky-500" to="/subscribers">View Subscribers</RouterLink>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Newsletter'
}
</script>
