<script setup>
import {onMounted} from "vue"
import { useGoogleLogin } from '../composables/useGoogleLogin';

const {getUserData} = useGoogleLogin()

onMounted(async () => {
    await getUserData()
})
</script>

<template>
    <div>{{ $route.hash }}</div>
</template>