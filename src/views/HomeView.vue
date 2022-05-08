<template>
  <div>
    <h1>Packing List 자동 출력</h1>
    <div>
      <label for="">로트번호</label>
      <input v-model="lotNo" type="text" name="" id="" />
    </div>
    <div>
      <label for="">고객선택</label>
      <select v-model="selectedCustomer" name="" id="">
        <option :key="i" v-for="(customer, i) in customers">
          {{ customer }}
        </option>
      </select>
      <button
        class="btn btn-primary me-1"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        신규 고객 등록
      </button>
    </div>
    <div>
      <button @click="doCreate">Packing List 생성</button>
    </div>
    <div>
      <slot-modal modalId="staticBackdrop">
        <template v-slot:title>신규 고객 등록</template>
        <template v-slot:body>
          <p>
            <label for="">고객사명</label
            ><input v-model="newCustomer" type="text" name="" id="" />
          </p>
        </template>
        <template v-slot:footer>
          <button @click="addCustomer">저장</button>
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
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    doCreate() {
      console.log(this.lotNo, this.selectedCustomer)
    },
    addCustomer() {
      this.customers.push(this.newCustomer)
    }
  }
}
</script>
