<template>
  <div style="overflow-x: auto">
    <table class="table table-bordered" v-if="items.length > 0">
      <thead>
        <tr>
          <th></th>
          <th :key="th.key" v-for="th in headers">{{ th.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="i" v-for="(item, i) in formattedItems">
          <td>{{ i + 1 + sliceStart }}</td>
          <td :key="th.key" v-for="th in headers">
            <input type="text" v-model="item[th.key]" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
/* eslint-disable */
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
    },
    sliceStart: {
      type: Number,
      default: 0
    },
    sliceEnd: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {}
  },
  setup() {},
  created() {},
  computed: {
    formattedItems: function () {
      console.log('grid: ', this.items[0].length)
      return this.items[0].slice(this.sliceStart, this.sliceEnd)
    }
  },
  mounted() {},
  unmounted() {},
  methods: {
    changePage(start, end) {
      console.log('changePage', start, end)
      this.sliceStart = start
      this.sliceEnd = end
    },
    handleMethod(method, id) {
      this.$emit('clickButtons', method, id)
    }
  }
}
</script>
