<script setup>
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useSearchPartner } from "../stores/searchPartner";
import countries from "../storage/countries.json";
import { ref } from "vue";
import { computed } from "@vue/reactivity";

const searchPartner = useSearchPartner();
const term = ref("");

const suggestedOnes = computed(() => {
  return countries.filter((country) => {
    return (
      country.name.toLowerCase().indexOf(term.value.toLowerCase()) > -1 ||
      country.fullname.toLowerCase().indexOf(term.value.toLowerCase()) > -1 ||
      country.english.toLowerCase().indexOf(term.value.toLowerCase()) > -1
    );
  });
});

const setCountry = (code) => {
  searchPartner.setCountry(code);
  searchPartner.toggleCountrySearch(false)
};
</script>

<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="searchPartner.showCountrySearch"
      class="search-countries fixed flex justify-center inset-0 w-full h-screen bg-black bg-opacity-60"
    >
      <form @submit.prevent class="mt-14 px-2">
        <div class="search-bar flex items-center">
          <div class="bg-white p-2 w-full rounded-t flex items-center">
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-700" />
            <input
              v-model="term"
              class="bg-transparent outline-none ml-3 w-full"
              type="text"
              placeholder="Search country..."
            />
          </div>
        </div>
        <div v-if="term" class="suggestions border-t w-full rounded-b">
          <ul class="countries w-full px-2">
            <li
              v-for="(country, index) in suggestedOnes"
              :key="index"
              class="country min-w-auto"
            >
              <button
                @click="setCountry(country.alpha1)"
                v-if="
                  country.name !== 'name' &&
                  country.name !== 'Абхазия' &&
                  country.name !== 'Южная Осетия'
                "
                class="flex items-center justify-center font-semibold w-full p-2 my-2 bg-gray-100 rounded transition hover:bg-gray-200"
              >
                <img
                  :src="`https://flagcdn.com/w40/${country.alpha1.toLowerCase()}.webp`"
                  :alt="country.name"
                />
                <p>
                  {{ country.name }}
                </p>
              </button>
            </li>
          </ul>
        </div>
        <button
          @click="searchPartner.toggleCountrySearch(false)"
          class="fixed right-6 top-6"
        >
          <XMarkIcon class="w-8 h-8 ml-3 text-white"></XMarkIcon>
        </button>
      </form>
    </div>
  </transition>
</template>

<!--  -->
<style scoped>
.countries {
  overflow-y: scroll;
  min-width: 360px;
  max-height: 500px;
  background: white;
  display: flex;
  flex-direction: column;
}

p {
  overflow: hidden;
  width: 20ic;
}

.countries::-webkit-scrollbar {
  width: 0;
}
</style>
