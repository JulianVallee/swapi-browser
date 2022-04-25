<template>
  <header class="sb-header">
    <div class="sb-header__content">
<!--      <pre style="background: #fff;">{{$route}}</pre>-->
      <h2 class="sb-header__content__head">
        <slot>
            <span :key="title">
              {{title}}
            </span>
        </slot>
      </h2>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  computed: {
    title(): string {
      // Title when using Options API
      // return this.$route.meta.title;

      // Title when using Options API
      // @ts-ignore
      return this.$route.meta.title;
    }
  }
}
</script>

<style lang="scss">
@use './assets/css/mixins';
@import './assets/css/settings';

.sb-header {
  //@include mixins.notchColor($color-yellow);

  &__content {
    padding: $padding;
    //background: $tile-background-color;
    border-bottom-right-radius: $border-radius;
    color: $color-white;
    text-align: center;

    text-shadow:
        0 0 1px #000,
        0 0 8px #000,
        0 0 16px #000;

    &__head {
      margin: 0;
      text-transform: lowercase; // Starjedi hollow font generally prints uppercase characters as the open variant,
      color: $color-yellow;
    }
  }
}
</style>