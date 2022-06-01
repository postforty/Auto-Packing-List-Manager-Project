<template>
  <div>
    <button @click="$refs.mdbFile.click()" class="btn btn-outline-secondary">
      MDB 경로 찾기
    </button>
    <input
      type="file"
      style="display: none"
      ref="mdbFile"
      accept=".mdb"
      @change="setMdbPath"
    />
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      sampleData: ''
    }
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    setMdbPath() {
      console.log(this.$refs.mdbFile.value)
    }
  }
}
</script>
