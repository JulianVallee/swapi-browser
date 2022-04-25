import {defineNuxtPlugin} from "nuxt/app";

export default defineNuxtPlugin((nuxtApp ) => {
    nuxtApp.vueApp.directive('click-outside', {
        beforeMount: function (el, binding, vnode) {
            el.clickOutsideEvent = function (event: Event) {
                // Check if click was outside of element using this directive
                if (!(el == event.target || el.contains(event.target))) {
                    // Assume directive value to be a callback
                    binding.value(event);
                }
            };

            // When the element with this directive is mounted, we add
            // a global click event listener to compare the target
            document.body.addEventListener('click', el.clickOutsideEvent)
        },
        unmounted: function (el) {
            // When an element with this directive is unmounted, we
            // remove the previously added global click event listener
            document.body.removeEventListener('click', el.clickOutsideEvent)
        },
    });
});