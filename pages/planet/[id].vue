<template>
  <div>
    <div class="back-link">
      <SbNotch position="top"/>
      <NuxtLink to="/">Back</NuxtLink>
      <SbNotch position="bottom"/>
    </div>

    <SbTile aspect-ratio="auto" class="tile--single">
      <img :src="dynamicImage" class="tile__background-image">
<!--      <img :src="`@/assets/images/planets/${planet.name.toLowerCase().replaceAll(' ', '-')}.png`" class="tile__background-image">-->

      <p class="tile__stat tile__stat--header">
        {{ planet.name }}
      </p>

      <p class="tile__stat">
        <span class="tile__stat__label">Population</span>
        <span class="tile__stat__value">{{ planet.population }}</span>
      </p>

      <p class="tile__stat">
        <span class="tile__stat__label">Terrain</span>
        <span class="tile__stat__value">{{ planet.terrain }}</span>
      </p>

      <p class="tile__stat">
        <span class="tile__stat__label">Climate</span>
        <span class="tile__stat__value">{{ planet.climate }}</span>
      </p>
    </SbTile>
  </div>
</template>

<script>
import {useHead, useRoute, useAsyncData} from "nuxt/app";
import {useSwapi} from "../../plugins/swapi.ts";

export default {
  data() {
    return {
      planet: {
        name: ''
      },
    }
  },
  async setup() {
    const route = useRoute();
    const swapi = useSwapi();

    await useAsyncData('foo', () => {
      return new Promise(async resolve => {
        const planet = (await swapi.load()).planets[route.params.id];

        useHead({
          title: `Planet - ${planet.name}`,
          description: `Show details of the planet ${planet.name}.`
        });

        resolve({});
      });
    })
  },
  async mounted() {
    this.planet = (await this.$swapi.get()).planets[this.$route.params.id];
    this.$route.meta.title = `Planet - ${this.planet.name}`;
  },
  computed: {
    dynamicImage() {
      return `./images/planets/${this.planet.name.toLowerCase().replaceAll(' ', '-')}.png`;
    }
  }
}
</script>