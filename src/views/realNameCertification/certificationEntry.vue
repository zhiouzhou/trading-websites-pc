<template>
  <div>
    <app-header/>
    <router-view/>
    <app-footer/>
  </div>
</template>

<script>
  import AppHeader from './../AppHeader.vue'
  import AppFooter from './../AppFooter.vue'

  export default {
    name: "certificationEntry",
    components: {
      AppHeader,
      AppFooter
    }
  }
</script>

<style scoped>

</style>
