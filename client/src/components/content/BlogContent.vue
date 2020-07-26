<script>
    import { createNamespacedHelpers } from 'vuex';
    const {
      mapGetters: postsGetters,
      mapActions: postsActions,
    } = createNamespacedHelpers('posts');

    import NoContent from "./NoContent";
    import CreatePost from "./CreatePost";
    import LocationInfo from "./LocationInfo";
    import PostContent from "./PostContent";

    export default {
        name: "BlogContent",
        computed: {
          ...postsGetters([
            'draft',
            'currentPost',
          ]),
          cssClass () {
            return [
              'blog-content',
              {
                'has-content': this.currentPost,
              },
            ]
          },
        },
        render (h) {
          let Content
          if (!this.currentPost) {
            Content = NoContent;
          } else if (this.draft) {
            Content = CreatePost;
          } else {
            Content = PostContent;
          }
          return <div class={this.cssClass}>
            <LocationInfo />
            <Content />
          </div>
        },
    }
</script>

<style scoped>

</style>
