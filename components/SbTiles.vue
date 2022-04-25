<template>
  <div class="tiles" ref="tiles">
    <SbFilter placeholder="Filtered by film" :suggestions="suggestions" v-model="filterValue"/>

    <div class="items" v-if="filteredPeoples.length">
      <transition-group name="fade">
        <SbTile v-for="(tile, key) in tilesPaginated"
                :ref="`tile[${(key + (pagination.page * pagination.itemsPerPage))}]`"
                :tile-data="tile"
                :enable-hover-scale="true"
                :class="{'tile--active': activeTile === (key + (pagination.page * pagination.itemsPerPage)) }"
                v-on:click="onClickTile(key + (pagination.page * pagination.itemsPerPage))"
                :key="tile.name">
          <SbTilePeople :tile-data="tile"/>
        </SbTile>
      </transition-group>
    </div>

    <transition name="fade">
      <SbTile aspect-ratio="auto" v-if="!filteredPeoples.length" class="message">
        <img src="@/public/images/people/yoda.webp" alt="Yoda" />

        <blockquote>
            <span v-for="line in emptyMessages[0]">
              {{ line }}<br>
            </span>
        </blockquote>
      </SbTile>
    </transition>

    <div class="controls">
      <button class="control control--left" v-if="hasPrevPage" v-on:click="onClickPrevPage">&lt;</button>
      <button class="control control--right" v-if="hasNextPage" v-on:click="onClickNextPage">&gt;</button>
    </div>

    <p class="legend">
      Page {{ pagination.page + 1 }} / {{ availablePages }}
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

const mediaQueryFactory = function() {
  const mqLg = getComputedStyle(document.body).getPropertyValue('--mq-lg');
  const mqXl = getComputedStyle(document.body).getPropertyValue('--mq-xl');

  return window.matchMedia(`(min-width: ${mqLg}) and (max-width: ${mqXl})`);
}

export default defineComponent({
  data() {
    return {
      emptyMessages: [
        ['Empty your search is.', 'Change it you must.']
      ],

      pagination: {
        page: 0,
        itemsPerPage: 8
      },

      films: [],
      peoples: [],

      activeTile: 0,
      filterValue: '',

      // We can
      mediaQuery: mediaQueryFactory()
    }
  },

  async mounted() {
    // Nuxt plugins are not accessible inside computed properties,
    // so we temporarily store them as component data
    const {films, peoples} = await this.$swapi.get();

    this.films = films;
    this.peoples = peoples;

    // Handle setting items per page depending on column count
    this.mediaQuery.addEventListener("change", this.onMediaQueryChange);
    this.pagination.itemsPerPage = this.mediaQuery.matches ? 9 : 8;

    // Handle keyboard shortcuts
    document.addEventListener('keydown', this.onKeyDownArrows);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeyDownArrows);

    this.mediaQuery.removeEventListener("change", this.onMediaQueryChange);
  },

  watch: {
    films() {
      this.pagination.page = 0;
    }
  },

  computed: {
    tilesPaginated() {
      const start = this.pagination.page * this.pagination.itemsPerPage;
      return this.filteredPeoples.slice(start, start + this.pagination.itemsPerPage);
    },
    availablePages() {
      return Math.ceil(this.filteredPeoples.length / this.pagination.itemsPerPage);
    },
    currentPage() {
      return this.pagination.page;
    },
    hasPrevPage() {
      return this.pagination.page > 0;
    },
    hasNextPage() {
      return (this.pagination.page + 1) < this.availablePages;
    },
    filteredPeoples() {
      return this.peoples.length ? this.$swapi.filterPeopleByFilm(this.filterValue) : [];
    },
    suggestions() {
      return this.films.length ? this.$swapi.getSuggestions(this.filterValue) : [];
    }
  },

  methods: {
    gotoStart() {
      this.pagination.page = 0;
      this.activeTile = 0;
    },
    gotoEnd() {
      this.pagination.page = this.availablePages - 1;
      this.activeTile = this.pagination.page * this.pagination.itemsPerPage;
    },
    gotoPrev(visibleTileIndexLow: number, visibleTileIndexHigh: number) {
      // Focus first visible tile if active tile is none is active,
      // or if it's not within visible bounds
      if(this.activeTile === null || !this.isTileVisible(this.activeTile, visibleTileIndexLow, visibleTileIndexHigh)) {
        this.activeTile = visibleTileIndexHigh - 1;

      } else if(this.activeTile > 0) {
        this.activeTile--;

        // Handle page traversal on lower page bound
        if((this.activeTile + 1) % this.pagination.itemsPerPage === 0) {
          this.pagination.page--;
        }
      }

      setTimeout(() => {
        this.scrollTileIntoView(this.activeTile);
      }, 0);
    },
    gotoNext(visibleTileIndexLow: number, visibleTileIndexHigh: number) {
      // Focus first visible tile if active tile is none is active,
      // or if it's not within visible bounds
      if(this.activeTile === null || !this.isTileVisible(this.activeTile, visibleTileIndexLow, visibleTileIndexHigh)) {
        this.activeTile = visibleTileIndexLow;

      } else if(this.activeTile < this.peoples.length - 1) {
        this.activeTile++;

        // Handle page traversal on upper page bound
        if(this.activeTile % this.pagination.itemsPerPage === 0) {
          this.pagination.page++;
          setTimeout(() => {
            this.scrollTileIntoView(this.activeTile);
          }, 350);

        } else {
          this.scrollTileIntoView(this.activeTile);

        }
      }
    },
    scrollTileIntoView(tileIndex: number) {
      const tileRefName = `tile[${tileIndex}]`;

      // Satisfy typescript
      const ref: [any] = this.$refs[tileRefName] as [any];

      if(tileRefName in this.$refs && ref.length) {
        ref[0].$el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
      }
    },
    isTileVisible(tileIndex: number, visibleTileIndexLow: number, visibleTileIndexHigh: number) {
      return tileIndex >= visibleTileIndexLow || tileIndex < visibleTileIndexHigh
    },
    onClickPrevPage() {
      this.pagination.page--;
    },
    onClickNextPage() {
      this.pagination.page++;
    },
    onClickTile(tileIndex: number) {
      // @ts-ignore
      this.activeTile = this.activeTile == tileIndex ? null : tileIndex;
    },
    onKeyDownArrows(e: KeyboardEvent) {
      if(document.activeElement === document.body && (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
        e.preventDefault();

        const visibleTileIndexLow = this.currentPage * this.pagination.itemsPerPage;
        const visibleTileIndexHigh = visibleTileIndexLow + this.pagination.itemsPerPage;

        switch(e.code) {
          case 'ArrowDown':
            if(this.hasNextPage) {
              this.pagination.page++;
              this.activeTile = visibleTileIndexHigh;

            } else {
              this.gotoStart();
            }

            break;

          case 'ArrowUp':
            if(this.hasPrevPage) {
              this.pagination.page--;
              this.activeTile = visibleTileIndexLow - this.pagination.itemsPerPage;

            } else {
              this.gotoEnd();
            }
            break;

          case 'ArrowLeft':
            this.gotoPrev(visibleTileIndexLow, visibleTileIndexHigh);
            break;

          case 'ArrowRight':
            this.gotoNext(visibleTileIndexLow, visibleTileIndexHigh);
            break;
        }
      }
    },
    onMediaQueryChange(e: MediaQueryListEvent) {
      this.pagination.itemsPerPage = e.matches ? 9 : 8;
    }
  }
});
</script>

<style lang="scss">
@use './assets/css/mixins';
@use './assets/css/settings';

.tiles {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 2rem;

  @include mixins.media(settings.$mq-lg) {
    align-items: start;
  }

  .items {
    display: inline-grid;
    grid-gap: 4rem;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(1, 1fr);
    width: 100%;

    transition: all 1s;

    @include mixins.media(settings.$mq-md) {
      grid-template-rows: 1fr 1fr;
      grid-template-columns: repeat(2, 1fr);
    }

    @include mixins.media(settings.$mq-lg) {
      grid-template-rows: 1fr 1fr;
      grid-template-columns: repeat(3, 1fr);
    }

    @include mixins.media(settings.$mq-xl) {
      grid-template-rows: 1fr 1fr;
      grid-template-columns: repeat(4, 1fr);
    }

  }

  .controls {
    display: flex;
  }

  .control {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    aspect-ratio: 1 / 1;
    padding: 0.5rem;
    border: solid 1px settings.$color-yellow-light;
    border-radius: settings.$border-radius;
    background: transparent;
    color: settings.$color-yellow-light;
    cursor: pointer;
    user-select: none;
    z-index: 1;

    transition: all 0.1s;

    @include mixins.media(settings.$mq-lg) {
      position: absolute;
      top: 50%;
      left: auto;

      &--left {
        transform: translateX(-50%);
      }

      &--right {
        transform: translateX(50%);
      }
    }

    &:hover {
      @include mixins.glow(2);
    }

    &--left {
      left: -2rem;
      transform: translate(-100%, -50%);
    }

    &--right {
      right: -2rem;
      transform: translate(100%, -50%);
    }
  }

  .tile.message {
    .tile__container {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      font-family: settings.$font-starjedi;
      padding: 5vw 15vw;
      width: 100%;
    }

    img {
      width: 50%;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
    }
  }

  .legend {
    color: settings.$color-white
  }
}
</style>