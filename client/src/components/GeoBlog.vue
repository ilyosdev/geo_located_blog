<template>
  <div class="geo-blog">
    <AppMenu />
    <div class="panes">
      <BlogMap />
    </div>
  </div>
</template>

<script>
    import AppMenu from './AppMenu.vue';
    import BlogMap from './BlogMap';

    export default {
      name: "GeoBlog",
      components: {
        AppMenu,
        BlogMap
      },
    }
</script>

<style scoped>

</style>
