import Vue from 'vue';
import Vuex from 'vuex';

import { $fetch } from "../plugins/fetch";
import router from '../router';
import maps from './maps';
import posts from './posts';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  modules: {
    maps,
    posts,
  },
  state () {
    return {
      user: null,
    }
  },
  getters: {
    user: state => state.user,
    userPicture: (state, getters) => {
      const user = getters.user;

      if (user) {
        const photos = user.profile.photos;

        if (photos.length !== 0) return photos[0].value;
      }
    },
  },
  mutations: {
    user: (state, user) => {
      state.user = user;
    },
  },
  actions: {
    async init ({ dispatch }) {
      await dispatch('login');
    },
    async login({ commit }) {
      try {
        const user = await $fetch('user');
        commit('user', user);

        if (user) {
          // Redirect to the wanted route if any or else to home
          router.replace(router.currentRoute.params.wantedRoute || { name: 'home' });
        }

      } catch (e) {
        console.error(e);
      }

    },
    logout({ commit }) {
      commit('user', null);

      $fetch('logout');

      // If the route is private
      // We go to the login screen
      if (router.currentRoute.matched.some(r => r.meta.private)) {
        router.replace(
          {
            name: 'login',
            params: {
              wantedRoute: router.currentRoute.fullPath,
            }
          }
        );
      }
    },
  }
});

export default store;
