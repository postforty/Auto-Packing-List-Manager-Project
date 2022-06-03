import axios from 'axios'

export default {
  created() {},
  mounted() {
    // console.log('mixin에서 출력')
  },
  unmounted() {},
  methods: {
    // printA() {
    //   console.log('A')
    // }
    async $get(url) {
      return (
        await axios.get(url).catch((e) => {
          console.log(e)
        })
      ).data
    }
    // async $post(url, data) {
    //   return await axios.post(url, data).catch((e) => {
    //     console.log(e)
    //   })
    // }
  }
}
