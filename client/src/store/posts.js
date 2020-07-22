import { $fetch } from "../plugins/fetch";

let fetchPostsUid = 0;

export default {
  namespaced: true,
  state () {
    return {
      draft: null,
      mapBounds: null,
      posts: [],
      selectedPostId: null,
    }
  },
  getters: {
    draft: state => state.draft,
    posts: state => state.posts,
    selectedPost: state => state.posts.find(p => p._id === state.selectedPostId),
    // The draft has more priority than the selected post
    currentPost: (state, getters) => state.draft || getters.selectedPost
  },
  mutations: {
    addPost (state, value) {
      state.posts.push(value);
    },
    draft (state, value) {
      state.draft = value;
    },
    posts (state, { posts, mapBounds }) {
      state.posts = posts;
      state.mapBounds = mapBounds;
    },
    selectedPostId (state, value) {
      state.selectedPostId = value;
    },
    updateDraft (state, value) {
      Object.assign(state.draft, value);
    }
  },
  actions: {
    clearDraft({ commit }) {
      commit('draft', null);
    },
    createDraft({ commit }) {
      // Default values
      commit('draft', {
        title: '',
        content: '',
        position: null,
        placeId: null,
      })
    },
    setDraftLocation({ dispatch, getters }, { position, placeId }) {
      if (!getters.draft) {
        dispatch('createDraft');
      }
      console.log(getters.draft)
      dispatch('updateDraft', {
        position,
        placeId
      });
    },
    async createPost({ commit, dispatch }, draft) {
      const data = {
        ...draft,
        position: draft.position.toJSON()
      };

      const result = await $fetch('posts/new', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      dispatch('clearDraft');

      // Update the posts list
      commit('addPost', result);
      dispatch('selectPost', result._id);
    },
    async selectPost ({ commit }, id) {
      commit('selectedPostId', id);
    },
    updateDraft({ dispatch, commit, getters }, draft) {
      commit('updateDraft', draft);
    },
    async fetchPosts ({ commit, state }, { mapBounds, force }) {
      let oldBounds = state.mapBounds;

      if (force || !oldBounds || !oldBounds.equals(mapBounds)) {
        const requestId = ++fetchPostsUid;

        // Request
        const ne = mapBounds.getNorthEast();
        const sw = mapBounds.getSouthWest();
        const query = `posts?
          ne=${encodeURIComponent(ne.toUrlValue())}
          &sw=${encodeURIComponent(sw.toUrlValue())}`;

        const posts = await $fetch(query);

        // We abort if we started another query
        if (requestId === fetchPostsUid) {
          commit('posts', { posts, mapBounds });
        }
      }
    }
  }
}
