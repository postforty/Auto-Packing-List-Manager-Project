<template>
  <!-- BEGIN pagination -->
  <nav aria-label="Page navigation example">
    <div class="d-flex justify-content-center">
      <ul class="pagination">
        <li
          class="page-item"
          :class="{ disabled: currentPage - maxPagination < 1 }"
        >
          <button class="page-link" @click="addPaging(-1)">
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        <li
          class="page-item"
          :class="{ active: currentPage == pageli.page }"
          v-for="pageli in calPageList"
          :key="pageli.page"
        >
          <button class="page-link" @click="changePage(pageli.page)">
            {{ pageli.page }}
          </button>
        </li>
        <li
          class="page-item"
          :class="{ disabled: start + maxPagination > pageList.length }"
        >
          <button class="page-link" @click="addPaging(1)">
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="d-flex align-items-right justify-content-right">
      <span class="fs-6 me-1" style="width: 80px">표시개수 : </span>
      <select
        class="form-select form-select-sm"
        v-model="resultPerPage"
        id="floatingSelect"
        @change="initPaging"
        style="max-width: 80px"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option :value="itemCount">전체</option>
      </select>
    </div>
  </nav>
  <!-- END pagination -->
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
    itemCount: {
      type: Number, // 불러온 데이터 개수
      default: 0
    }
  },
  data() {
    return {
      resultPerPage: 10, // 한페이지에 보여질 result 개수
      pageLength: 0,
      pageList: [],
      start: 0, // 페이지네이션 start
      end: 0, // 페이지네이션 end
      currentPage: 1,
      maxPagination: 5 // 최대 페이지네이션
    }
  },
  watch: {
    items() {
      this.initPaging()
    }
  },
  setup() {},
  created() {
    this.initPaging() // 페이지네이션 초기화
  },
  computed: {
    calPageList: function () {
      // console.log('pageList: ', this.pageList)
      // console.log('itemCount: ', this.itemCount)
      return this.pageList.slice(this.start - 1, this.end)
    }
  },
  mounted() {},
  unmounted() {},
  methods: {
    // 페이지네이션 초기화
    initPaging() {
      this.pageLength = Math.ceil(this.itemCount / this.resultPerPage)

      this.pageList = []
      for (let i = 1; i <= this.pageLength; i++) {
        this.pageList.push({ page: i })
      }

      this.start = 1
      this.end = this.pageLength
      if (this.pageLength > 5) {
        this.end = 5
      }
      // console.log(
      //   `resultPerPage:${this.resultPerPage} pageLength:${this.pageLength} itemCount:${this.itemCount} start:${this.start} end:${this.end} `
      // )
      this.changePage(1)
    },
    addPaging(num) {
      if (num > 0) {
        this.start += this.maxPagination
        this.end += this.maxPagination
        if (this.end > this.pageList.length) {
          this.end = this.pageList.length
        }
      } else {
        this.start -= this.maxPagination
        this.end = this.start + this.maxPagination - 1
      }
      this.changePage(this.start)
    },
    changePage(num) {
      this.currentPage = num
      const start = this.resultPerPage * (this.currentPage - 1)
      const end = this.resultPerPage * this.currentPage

      this.$emit('changePage', start, end)
    }
  }
}
</script>
