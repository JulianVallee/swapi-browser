<template>
  <div :class="componentClasses" :style="componentStyles">
    <SbNotch position="top"/>

    <div class="tile__container">
      <slot>
        Placeholder
      </slot>
    </div>

    <SbNotch position="bottom"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Planet} from "~/types/swapi";

export default defineComponent({
  props: {
    tileData: {
      type: Object,
      default: {}
    },
    enableHoverScale: {
      type: Boolean,
      default: false
    },
    aspectRatio: {
      type: String,
      default: '1 / 1'
    }
  },
  data() {
    return {
      planets: [] as Planet[]
    }
  },
  async mounted() {
    this.planets = (await this.$swapi.get()).planets;
  },
  computed: {
    componentClasses() {
      return [
        'tile',
        {
          'enable-scale': this.enableHoverScale
        }
      ]
    },
    componentStyles() {
      return {
        'aspect-ratio': this.aspectRatio
      }
    }
  }
});
</script>

<style lang="scss">
@use './assets/css/mixins';
@use './assets/css/settings';

$tileBorderColor: #333;
$tileBorderColorHover: settings.$color-yellow;
$tileNotchColor: settings.$color-yellow;
$tileTransitionDuration: 0.1s;

.tile {
  $root: &;

  position: relative;
  aspect-ratio: 1 / 1;
  color: settings.$color-white;

  filter: drop-shadow(0 0 16px #000);

  @include mixins.notchColor($tileNotchColor);

  transition: all $tileTransitionDuration;

  &--active {
    @include mixins.glow(1.5);
    @include mixins.notchWidth(100%);
  }

  &--active, &:hover {
    // Always push the hovered tile to the top
    // to prevent sibling shadows bleeding in
    z-index: 1;

    // Remove border radius at the end of the full-width notch
    #{$root}__container {
      border-radius: 0;
      background: linear-gradient(225deg, rgba(0,0,0,0.5) 0%, rgba(26,26,26,1) 100%);
    }

    // Support disabling hover scaling via component prop
    &.enable-scale {
      transform: scale(1.05);
    }
  }

  &__container {
    position: relative;
    height: 100%;
    background: settings.$tile-background-color;
    background: linear-gradient(225deg, settings.$tile-background-color 0%, settings.$tile-background-color 100%);
    border-style: solid;
    border-width: 1px;
    border-color: settings.$color-yellow settings.$color-yellow transparent settings.$color-yellow;
    border-bottom-right-radius: settings.$border-radius;
    overflow: hidden;

    transition: all $tileTransitionDuration;

    #{$root}:hover &, #{$root}--active & {
      border: solid 1px $tileBorderColorHover;
    }
  }

  &__background-image {
    position: absolute;
    bottom: 0;
    right: -25%;
    max-width: 75%;
    max-height: 75%;
    z-index: 0;
    filter: drop-shadow(0 0 0 transparent) grayscale(100%);
    transition: all $tileTransitionDuration;

    #{$root}:hover &, #{$root}--active & {
      filter: drop-shadow(0 0 16px settings.$color-yellow-light);
    }
  }

  &__stat {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-direction: column;
    padding: 0 2rem;

    transition: all 0.1s;

    &__label {
      color: settings.$color-yellow;
      font-weight: bold;
      font-style: italic;
      text-shadow: 0 0 4px #000, 0 0 16px #000;
    }

    &__label, &__value {
      line-height: 1rem;
      text-shadow: 0 0 4px #000, 0 0 16px #000;

      @include mixins.media(settings.$mq-xl) {
        line-height: 1.25rem;
      }
    }

    &--header {
      margin-bottom: 1rem;
      padding: 1rem;
      border: none;
      background: settings.$color-yellow;
      font-family: settings.$font-starjedi;
      text-transform: lowercase;
      font-size: 1rem;
      color: #000;
      letter-spacing: 1px;
    }
  }

  &--single {
    #{$root}__container {
      padding-bottom: 2rem;
    }

    #{$root}__stat--header {
      margin-bottom: 2rem;
    }
  }
}
</style>