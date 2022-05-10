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
        추가
      </button>
      <button data-bs-toggle="modal" data-bs-target="#delCustomerModal">
        삭제
      </button>
    </div>
    <div>
      <button class="btn btn-danger me-1" @click="$refs.file.click()">
        엑셀업로드
      </button>
      <input
        type="file"
        style="display: none"
        ref="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="readFile"
      />
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
    <!-- 고객사 삭제 모달 -->
    <div>
      <slot-modal modalId="delCustomerModal">
        <template v-slot:title>고객사 삭제</template>
        <template v-slot:body>
          <div :key="customer" v-for="customer in pureCustomers">
            <input
              type="checkbox"
              name=""
              id=""
              :value="customer"
              v-model="deleteCustomers"
            />
            {{ customer }}
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            닫기
          </button>
          <button class="btn btn-primary" @click="doDelete">삭제</button>
        </template>
      </slot-modal>
    </div>
  </div>
</template>
<script>
import SlotModal from '@/components/fragments/SlotModal.vue'
import XLSX from 'xlsx'
export default {
  components: { SlotModal },
  data() {
    return {
      lotNo: '',
      customers: ['A사', 'B사', 'C사'],
      // customers: [],
      selectedCustomer: '',
      newCustomer: '',
      pureCustomers: [],
      deleteCustomers: [],
      result: []
    }
  },
  watch: {
    customers: function () {
      this.pureCustomers = this.customers.slice()
      this.pureCustomers.shift()
    }
  },
  setup() {},
  created() {
    this.pureCustomers = this.customers.slice()
    this.customers.unshift('고객사를 선택하세요')
  },
  mounted() {
    this.selectedCustomer = this.customers[0]
  },
  unmounted() {},
  methods: {
    /* eslint-disable */
    readFile(event) {
      // get File object from input tag
      const file = event.target.files[0]
      const fileName = file.name // declare FileReader, temp result
      const reader = new FileReader()
      let tmpResult = {} // if you use "this", don't use "function(e) {...}"
      reader.onload = (e) => {
        let data = e.target.result
        data = new Uint8Array(data) // get excel file
        let excelFile = XLSX.read(data, { type: 'array' }) // get prased object
        excelFile.SheetNames.forEach(function (sheetName) {
          const roa = XLSX.utils.sheet_to_json(excelFile.Sheets[sheetName], {
            header: 1
          })
          if (roa.length) tmpResult[sheetName] = roa
        })
        this.result = tmpResult['Weighing Data']
        console.log(this.result)
      }
      reader.readAsArrayBuffer(file)
    },
    addCustomer() {
      this.customers.push(this.newCustomer)
      this.$refs.newCustomerModal.value = ''
    },
    doDelete() {
      let tempCustomers = []
      for (const customer of this.deleteCustomers) {
        tempCustomers.push(this.customers.filter((c) => c !== customer))
      }
      this.customers = tempCustomers[0].slice()
      tempCustomers = []
      this.deleteCustomers = []
    }
  }
}
</script>
