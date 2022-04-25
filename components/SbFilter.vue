<template>
  <div class="sb-filter" v-click-outside="onClickOutside">
    <SbNotch position="top"/>

    <input :value="modelValue"
           :type="type"
           :placeholder="placeholder"
           v-on:input="onInput"
           v-on:focusin="onFocusIn"
           autocomplete="off" />

    <div class="sb-filter__suggestions" v-if="hasFocus">

      <button
         :class="['sb-filter__suggestion', {'sb-filter__suggestion--selected': suggestion.value === modelValue}]"
         v-for="suggestion in suggestions"
         v-on:click="onClickSuggestion(suggestion.value)">
        {{suggestion.displayValue}}
      </button>
    </div>

    <SbNotch position="bottom"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: 'Placeholder'
    },
    suggestions: {
      type: Array as PropType<{ value: string, displayValue: string }[]>,
      default: null
    }
  },
  data() {
    return {
      hasFocus: false
    }
  },
  methods: {
    onInput(e) {
      e.stopPropagation();
      this.$emit('update:modelValue', e.target.value);
    },
    onClickSuggestion(suggestion: string) {
      this.$emit('update:modelValue', suggestion);
      this.hasFocus = false;
    },
    onFocusIn() {
      this.hasFocus = true;
    },
    onClickOutside(e: MouseEvent) {
      this.hasFocus = false;
    },
  }
});
</script>

<style lang="scss">
@use './assets/css/mixins';
@import './assets/css/settings';

.sb-filter {
  width: 200px;
  position: relative;
  filter: drop-shadow(0 0 16px #000);
  z-index: 2;

  @include mixins.notchHeight(3px);
  @include mixins.notchColor($color-yellow);

  &:hover {
    @include mixins.notchColor($color-yellow);

    input {
      border-color: $color-yellow;
    }
  }

  input {
    width: 100%;
    border: solid 1px transparent;
    font-size: 1rem;
    transition: border 0.1s;

    &:focus {
      border-color: $color-yellow;
    }

    &::placeholder {
      color: $color-white;  /* Chrome, Firefox, Opera, Safari 10.1+ */
      opacity: 1; /* Firefox */
    }
  }

  // Dropdown icon
  &:after {
    content: "▼";
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    color: $color-white;
  }

  &__suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: $tile-background-color;
    color: $color-white;
  }

  &__suggestion {
    width: 100%;
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    font-size: 0.8rem;
    color: #fff;
    text-align: left;
    cursor: pointer;
    outline: none;

    transition: background-color 0.1s;

    &--selected {
      color: $color-yellow-2;
    }

    &:hover, &:focus {
      color: $color-yellow;
    }
  }
}
</style>