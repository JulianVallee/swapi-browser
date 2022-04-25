<template>
  <SbTiles />
</template>

<script setup>
import {useHead, useRoute} from "nuxt/app";

const head = {
  title: 'Peoples',
  description: 'Show and filter people from the StarWars universe by their movie.'
};

useRoute().meta.title = head.title;

useHead(head);
</script>