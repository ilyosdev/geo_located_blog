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
      selectedPostDetails: null,
    }
  },
  getters: {
    draft: state => state.draft,
    posts: state => state.posts,
    selectedPost: state => state.posts.find(p => p._id === state.selectedPostId),
    // The draft has more priority than the selected post
    currentPost: (state, getters) => state.draft || getters.selectedPost,
    selectedPostDetails: state => state.selectedPostDetails,
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
    },
    selectedPostDetails (state, value) {
      state.selectedPostDetails = value;
    },
    addComment (state, { post, comment }) {
      post.comments.push(comment);
    },
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
      commit('selectedPostDetails', null);
      commit('selectedPostId', id);
      const details = await $fetch(`posts/${id}`);
      commit('selectedPostDetails', details);
    },
    unselectPost ({ commit }) {
      commit('selectedPostId', null)
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

        console.log('posts')
        const posts = await $fetch(query);


        // We abort if we started another query
        if (requestId === fetchPostsUid) {
          commit('posts', { posts, mapBounds });
        }
      }
    },
    async sendComment({ commit, rootGetters }, { post, comment }) {
      const user = rootGetters.user;
      commit('addComment', {
        post,
        comment: {
          ...comment,
          date: new Date(),
          user_id: user._id,
          author: user,
        },
      });

      await $fetch(`posts/${post._id}/comment`, {
        method: 'POST',
        body: JSON.stringify(comment),
      });
    },
    logout: {
      handler ({ commit }) {
        commit('posts', {
          posts: [],
          mapBounds: null,
        })
      },
      root: true,
    },
    'logged-in': {
      handler ({ dispatch, state }) {
        if (state.mapBounds) {
          dispatch('fetchPosts', {
            mapBounds: state.mapBounds,
            force: true,
          });
        }
        if (state.selectedPostId) {
          dispatch('selectPost', state.selectedPostId);
        }
      },
      root: true,
    },
  }
}
