<template>
  <div class="page page--md">
    <SbHeader />
    <slot />
  </div>
</template>

<script>
import SbHeader from "../components/SbHeader";

export default {
  components: {SbHeader},
}
</script>