<template>
  <div class="loading-page">
    <div class="loader">
      <span class="spinner spinner1"></span>
      <span class="spinner spinner2"></span>
      <span class="spinner spinner3"></span>
      <span class="loader-text">loading...</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './assets/css/settings';
@use './assets/css/mixins';

.loading-page {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  font-size: 5rem;
  text-align: center;
  color: settings.$color-yellow;
  z-index: 9999;
}

$spinner-color: settings.$color-yellow;

.loader {
  position: fixed;
  z-index: 301;
  height: 100%;
  width: 100%;
  overflow: hidden;
  text-align: center;
}

.spinner {
  position: absolute;
  top: 37.5%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 303;
  border-radius: 100%;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
}

.spinner1 {
  width: 10vw;
  height: 10vw;
  border: 1vw solid $spinner-color;
  animation: spin 1s linear infinite;
}

.spinner2 {
  width: 7vw;
  height: 7vw;
  border: 1vw solid $spinner-color;
  animation: negative-spin 2s linear infinite;
}

.spinner3 {
  width: 4vw;
  height: 4vw;
  border: 1vw solid $spinner-color;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes negative-spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

.loader-text {
  position: relative;
  top: 62.5%;
  color: $spinner-color;
  font-family: settings.$font-starjedi;
}
</style>
