<template>
  <div :class="classes" ></div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    position: {
      type: String,
      default: 'top'
    },
    color: {
      type: String,
      default: 'green'
    },
  },
  computed: {
    classes() {
      return [
          `notch`,
          `notch--${this.position}`
      ]
    }
  }
});
</script>

<style lang="scss">
@import './assets/css/settings';

$notch-color: $tile-background-color;
$notch-height: 0.5rem;
$notch-top-width-left: 50%;
$notch-top-width-right: 20%;
$notch-bottom-width: 70%;
$tileTransitionDuration: 0.3s;

.notch {
  position: relative;
  height: $notch-height;

  &--top {
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    overflow: hidden;

    &:before, &:after {
      content: '';
      position: absolute;
      display: block;

      border-bottom: $notch-height solid $notch-color;

      transition: all $tileTransitionDuration cubic-bezier(0.175, 0.885, 0.320, 1.275);
    }

    &:before {
      left: 0;
      border-right: $notch-height solid transparent;
      width: $notch-top-width-left;
    }

    &:after {
      right: 0;
      border-left: $notch-height solid transparent;
      width: $notch-top-width-right;
    }
  }

  &--bottom {
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    overflow: hidden;

    &:before {
      content: '';
      display: block;
      width: $notch-bottom-width;

      border-top: $notch-height solid $notch-color;
      border-right: $notch-height solid transparent;

      transition: all $tileTransitionDuration cubic-bezier(0.175, 0.885, 0.320, 1.275);
    }
  }
}
</style>