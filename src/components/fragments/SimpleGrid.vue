<template>
  <div>
    <table class="table table-bordered" v-if="items.length > 0">
      <thead>
        <tr>
          <th :key="th.key" v-for="th in headers">{{ th.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="i" v-for="(item, i) in items[0]">
          <td :key="th.key" v-for="th in headers">
            <input type="text" v-model="item[th.key]" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    items: {
      type: Array,
      default: function () {
        return []
      }
    },
    headers: {
      type: Array,
      default: function () {
        return []
      }
    }
    // sliceStart: {
    //   type: Number,
    //   default: 0
    // },
    // sliceEnd: {
    //   type: Number,
    //   default: 100
    // }
  },
  data() {
    return {}
  },
  setup() {},
  created() {},
  //   computed: {
  //     formattedItems: function () {
  //       console.log('grid: ', this.items.length)
  //       return this.items.slice(this.sliceStart, this.sliceEnd)
  //       //.slice(this.sliceStart, this.sliceEnd)
  //     }
  //   },
  mounted() {},
  unmounted() {},
  methods: {
    // changePage(start, end) {
    //   console.log('changePage', start, end)
    //   this.sliceStart = start
    //   this.sliceEnd = end
    // },
    // handleMethod(method, id) {
    //   // console.log(`handleMethod: ${method} id: ${id}`)
    //   this.$emit('clickButtons', method, id)
    // }
  }
}
</script>
