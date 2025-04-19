<script setup lang="ts">
import { useColorMode } from "@vueuse/core";

const mode = useColorMode();
</script>

<template>
  <UButton
    size="md"
    color="neutral"
    variant="ghost"
    :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
    @click="mode = mode === 'dark' ? 'light' : 'dark'"
  >
    <span class="hidden md:inline">
      {{ mode === "dark" ? "Light" : "Dark" }}
    </span>
  </UButton>
</template>
