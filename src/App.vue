<template>
  <OpeningLoader />
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </Transition>
  </RouterView>
</template>

<script setup>
import OpeningLoader from '@/components/OpeningLoader.vue'
</script>

<style>
/* Any App-level global styles if needed */
</style>
