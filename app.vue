<template>
  <div class="container">
    <div id="background" />
    <div class="easter-egg-death-star"></div>

    <transition name="fade">
      <SbLoading v-if="!isLoaded"/>
    </transition>

    <transition name="fade">
      <NuxtLayout name="default" v-if="isLoaded" >
        <NuxtPage />
      </NuxtLayout>
    </transition>

  </div>
</template>

<script setup>
import {useHead, useRoute} from "nuxt/app";

const route = useRoute()

useHead({
  titleTemplate: `%s - Swapi Browser`,
  title: route.meta.title,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [
    { name: 'description', content: route.meta.description }
  ]
});
</script>

<script>
import {store} from "./store";

export default {
  async mounted() {
    await this.$swapi.load();
  },
  computed: {
    isLoaded() {
      return store.loaded;
    }
  }
}
</script>

<style lang="scss">
@import './assets/css/base';
</style>
