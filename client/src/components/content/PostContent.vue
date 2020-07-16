<script>
    import { createNamespacedHelpers } from 'vuex';
    import NoContent from "./NoContent";
    import CreatePost from "./CreatePost";
    import LocationInfo from "./LocationInfo";

    // posts module
    const {
      mapGetters: postsGetters,
      mapActions: postsActions,
    } = createNamespacedHelpers('posts');

    export default {
        name: "PostContent",
        computed: {
          ...postsGetters([
            'draft',
            'currentPost'
          ]),

          cssClass () {
            return [
              'blog-content',
              {
                'has-content': this.currentPost
              }
            ]
          }
        },
        render(h) {
          let Content;

          if (!this.currentPost) {
            Content = NoContent;
          } else if (this.draft) {
            Content = CreatePost;
          } else {
            Content = PostContent;
          }

          return (
            <div className={this.cssClass}>
              <LocalInfo />
              <Content />
            </div>
          )
        }
    }
</script>

<style scoped>

</style>
