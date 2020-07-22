<template>
  <div class="blog-map">
    <googlemaps-map
      ref="map"
      :center="center"
      :zoom="zoom"
      :options="mapOptions"
      @update:center="setCenter"
      @update:zoom="setZoom"
      @click="onMapClick"
      @idle="onIdle"
    >
      <googlemaps-user-position
        @update:position="setUserPosition"
      />
      <googlemaps-marker
        v-if="draft"
        :clickable="false"
        :label="{
        color: 'white',
        fontFamily: 'Material Icons',
        text: 'add_circle',
        }"
        :opacity=".75"
        :position="draft.position"
        :z-index="6"
      />
    </googlemaps-map>
  </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';

    // Vuex mappers
    // maps module
    const {
      mapGetters: mapsGetters,
      mapActions: mapsActions,
    } = createNamespacedHelpers('maps');
    // posts module
    const {
      mapGetters: postsGetters,
      mapActions: postsActions,
    } = createNamespacedHelpers('posts');

    export default {
      name: "BlogMap",
      data() {
        return {}
      },
      computed: {
        ...mapsGetters([
          'center',
          'zoom'
        ]),
        ...postsGetters([
          'draft',
        ]),
        mapOptions() {
          return {
            fullscreenControl: false,
          }
        },
      },
      methods: {
        ...mapsActions([
          'setCenter',
          'setZoom',
          'setBounds',
          'setUserPosition'
        ]),
        ...postsActions([
          'setDraftLocation',
        ]),
        onMapClick(event) {
          this.setDraftLocation({
            position: event.latLng,
            placeId: event.placeId,
          });
        },
        onIdle () {
          this.setBounds(this.$refs.map.getBounds())
        },
      }
    }
</script>

<style scoped>

</style>
