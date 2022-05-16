<template>
  <div>
    <h1>Packing List 자동 출력</h1>
    <div>
      <label for="">로트번호 입력</label>
      <input v-model="lotNo" type="text" name="" id="" />
    </div>
    <div>
      <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Packing List 생성
      </button>
      <!-- <button data-bs-toggle="modal" data-bs-target="#delCustomerModal">
        삭제
      </button> -->
    </div>
    <div>
      <button @click="$refs.file.click()">엑셀업로드</button>
      <button @click="lotNoFilter">조회</button>
      <input
        type="file"
        style="display: none"
        ref="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="readFile"
      />
    </div>
    <!-- Packing List 모달 -->
    <div>
      <slot-modal modalId="staticBackdrop">
        <template v-slot:title>Pack List</template>
        <template v-slot:body>
          <div>
            <label for="">고객사 선택</label>
            <select v-model="selectedCustomer">
              <option
                :key="customer.code"
                v-for="customer in customers"
                :value="customer.code"
              >
                {{ customer.company }}
              </option>
            </select>
            <button class="btn btn-primary" @click="addCustomerShow">
              추가
            </button>
            <button class="btn btn-danger" @click="doDeleteShow">삭제</button>
          </div>
          <div>
            <div v-show="BoolAddCustomerShow === true">
              <label for="">고객사 추가</label
              ><input
                v-model="newCustomer.code"
                type="text"
                name=""
                ref="newCustomerModal"
              />
              <input
                v-model="newCustomer.company"
                type="text"
                name=""
                ref="newCustomerModal"
              />
              <button class="btn btn-primary" @click="addCustomer">저장</button>
            </div>
          </div>

          <div v-show="BoolDoDeleteShow === true">
            <label for="">고객사 삭제</label>
            <div :key="customer.code" v-for="customer in customers">
              <div v-if="customer.code !== 'none'">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  :value="customer"
                  @change="customer.isChecked = !customer.isChecked"
                />
                {{ customer.company }}
              </div>
            </div>
            <button class="btn btn-primary" @click="doDelete">삭제</button>
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            닫기
          </button>
          <button class="btn btn-primary" @click="addCustomer">저장</button>
        </template>
      </slot-modal>
    </div>
    <div>
      <simple-grid :headers="headers" :items="filteredLotNo" />
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import SimpleGrid from '@/components/fragments/SimpleGrid.vue'
import SlotModal from '@/components/fragments/SlotModal.vue'
import XLSX from 'xlsx'
export default {
  components: { SlotModal, SimpleGrid },
  data() {
    return {
      lotNo: '',
      customers: [
        { code: '001-00-00000', company: 'A사', isChecked: false },
        { code: '002-00-00000', company: 'B사', isChecked: false },
        { code: '003-00-00000', company: 'C사', isChecked: false }
      ],
      // customers: [],
      selectedCustomer: 'none',
      newCustomer: { code: '', company: '', isChecked: false },
      pureCustomers: [],
      checkedCustomers: [],
      resultXlsxToJson: [],
      filteredLotNo: [],
      headers: [
        { title: '로트번호', key: 'FIELD2' },
        { title: '강종', key: 'FIELD1' },
        { title: '강도', key: 'FIELD4' },
        { title: '선경', key: 'FIELD3' },
        { title: '중량', key: 'GROSS_WEIGHT' }
      ],
      BoolAddCustomerShow: false,
      BoolDoDeleteShow: false
    }
  },
  setup() {},
  created() {
    this.pureCustomers = this.customers.slice()
    this.customers.unshift({
      code: 'none',
      company: '=== 선택 ===',
      isChecked: false
    })
  },
  mounted() {},
  unmounted() {},
  methods: {
    // xlsx to json
    readFile(e) {
      let files = e.target.files
      let reader = new FileReader()
      const temp = []
      reader.onload = function (e) {
        let data = e.target.result
        let workBook = XLSX.read(data, { type: 'binary' })
        workBook.SheetNames.forEach(function (sheetName) {
          let xlsxToJson = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName])
          temp.push(xlsxToJson)
        })
      }
      reader.readAsBinaryString(files[0])
      this.resultXlsxToJson = temp
      // console.log(this.resultXlsxToJson)
    },
    addCustomer() {
      console.log(this.newCustomer)
      this.customers.push(this.newCustomer)
      this.$refs.newCustomerModal.value = ''
      this.BoolAddCustomerShow = false
      this.newCustomer = { code: '', company: '', isChecked: false }
    },
    doDelete() {
      const tempCustomers = []
      this.customers.forEach((customer) => {
        if (!customer.isChecked) {
          tempCustomers.push(customer)
        }
      })
      this.customers = tempCustomers
      tempCustomers = []
    },
    lotNoFilter() {
      this.filteredLotNo = []
      for (let tempResult of this.resultXlsxToJson) {
        this.filteredLotNo.push(
          tempResult.filter((rst) => rst.FIELD2 === this.lotNo)
        )
      }
      console.log(this.filteredLotNo)
      this.lotNo = ''
    },
    addCustomerShow() {
      if (this.BoolAddCustomerShow === false) {
        this.BoolAddCustomerShow = true
      } else this.BoolAddCustomerShow = false
    },
    doDeleteShow() {
      if (this.BoolDoDeleteShow === false) {
        this.BoolDoDeleteShow = true
      } else this.BoolDoDeleteShow = false
    }
  }
}
</script>
