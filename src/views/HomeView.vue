<template>
  <div>
    <h1>Packing List 자동 출력</h1>
    <div>
      <label for="">로트번호 입력</label>
      <input v-model="lotNo" type="text" name="" id="" />
    </div>
    <div>
      <label for="">고객사 선택</label>
      <select v-model="selectedCustomer" name="" id="">
        <option :key="i" v-for="(customer, i) in customers">
          {{ customer }}
        </option>
      </select>
      <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        신규 고객사 추가
      </button>
    </div>
    <div>
      <button @click="doCreate">Packing List 생성</button>
    </div>
    <!-- 신규 고객사 등록 모달 -->
    <div>
      <slot-modal modalId="staticBackdrop">
        <template v-slot:title>신규 고객사 등록</template>
        <template v-slot:body>
          <p>
            <label for="">고객사 명</label
            ><input
              v-model="newCustomer"
              type="text"
              name=""
              ref="newCustomerModal"
            />
          </p>
        </template>
        <template v-slot:footer>
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            닫기
          </button>
          <button class="btn btn-primary" @click="addCustomer">저장</button>
        </template>
      </slot-modal>
    </div>
  </div>
</template>
<script>
import SlotModal from '@/components/fragments/SlotModal.vue'
export default {
  components: { SlotModal },
  data() {
    return {
      lotNo: '',
      customers: ['A사', 'B사', 'C사'],
      selectedCustomer: '',
      newCustomer: ''
    }
  },
  setup() {},
  created() {
    this.customers.unshift('고객사를 선택하세요')
  },
  mounted() {
    this.selectedCustomer = this.customers[0]
  },
  unmounted() {},
  methods: {
    doCreate() {
      console.log(this.lotNo, this.selectedCustomer)
    },
    addCustomer() {
      this.customers.push(this.newCustomer)
      this.$refs.newCustomerModal.value = ''
    }
  }
}
</script>
