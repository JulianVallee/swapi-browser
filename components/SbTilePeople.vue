<template>
  <div v-if="loaded">
    <img :src="dynamicTileImage" class="tile__background-image">

    <p class="tile__stat tile__stat--header">
      {{ tileData.name }}
    </p>

    <p class="tile__stat">
      <span class="tile__stat__label">Hair</span>
      <span class="tile__stat__value">{{ tileData.hair_color }}</span>
    </p>

    <p class="tile__stat">
      <span class="tile__stat__label">Eyes</span>
      <span class="tile__stat__value">{{ tileData.eye_color }}</span>
    </p>

    <p class="tile__stat">
      <span class="tile__stat__label">Gender</span>
      <span class="tile__stat__value">{{ tileData.gender }}</span>
    </p>

    <p class="tile__stat">
      <span class="tile__stat__label">Planet</span>
      <span class="tile__stat__value">
          <NuxtLink :to="`/planet/${homeWorldId}`">{{ planets[homeWorldId]?.name }}</NuxtLink> 🔗
        </span>

    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {extractIdFromResourceUri} from '@/modules/swapi-utils';
import {Planet} from "~/types/swapi";

export default defineComponent({
  props: {
    tileData: {
      type: Object
    }
  },
  data() {
    return {
      loaded: false,
      planets: [] as Planet[]
    }
  },
  async mounted() {
    this.planets = (await this.$swapi.get()).planets;
    this.loaded = true;
  },
  computed: {
    homeWorldId() {
      return this.loaded ? extractIdFromResourceUri(this.tileData.homeworld) : '';
    },
    dynamicTileImage() {
      return `./images/people/${this.tileData.name.replaceAll(' ', '-')}.png`;
    }
  }
});
</script>