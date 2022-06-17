<template>
    <div class="skeleton page">
        <div class="skeleton-nav"></div>
        <div class="skeleton-swiper"></div>
        <ul class="skeleton-tabs">
            <li v-for="i in 8" class="skeleton-tabs-item"><span></span></li>
        </ul>
        <div class="skeleton-banner"></div>
        <div v-for="i in 6" class="skeleton-productions"></div>
        <div class="bigbig"></div>
    </div>
</template>

<script>
export default {
    name: 'skeleton'
}

</script>