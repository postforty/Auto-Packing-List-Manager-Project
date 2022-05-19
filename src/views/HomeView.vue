<template>
  <div>
    <h1>Packing List 자동 생성</h1>
    <div>
      <label for="">로트번호 입력</label>
      <input v-model="lotNo" type="text" name="" id="" />
    </div>
    <label for="">고객사 선택</label>
    <select v-model="selectedCustomer">
      <option
        :key="customer.code"
        v-for="customer in customers"
        :value="customer.company"
      >
        {{ customer.company }}
      </option>
    </select>
    <div>
      <button data-bs-toggle="modal" data-bs-target="#staticBackdropCustomers">
        고객사 관리
      </button>
    </div>
    <div>
      <button
        v-show="selectedCustomer !== '=== 선택 ==='"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Packing List 생성
      </button>
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
    <!-- 고객사 관리 모달 -->
    <div>
      <slot-modal modalId="staticBackdropCustomers">
        <template v-slot:title>고객사 관리</template>
        <template v-slot:body>
          <div>
            <div>
              <label for="">고객사 추가</label>
              <div>
                <label for="">사업자 번호</label>
                <input
                  v-model="newCustomer.code"
                  type="text"
                  name=""
                  ref="newCustomerModal"
                />
              </div>
              <div>
                <label for="">고객사 명</label>
                <input
                  v-model="newCustomer.company"
                  type="text"
                  name=""
                  ref="newCustomerModal"
                />
              </div>
              <button class="btn btn-primary" @click="addCustomer">추가</button>
            </div>
          </div>
          <div>
            <div>
              <input
                type="search"
                v-model.trim="searchName"
                @keyup.enter="getCustomers"
                placeholder="고객사 명"
              />
              <button class="btn btn-primary" @click="getCustomers">
                조회
              </button>
            </div>
            <div v-if="searchName === ''">
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
            </div>
            <div v-else>
              <div :key="customer.code" v-for="customer in searchCustomers">
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
            </div>
            <button class="btn btn-primary" @click="doDelete">삭제</button>
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            닫기
          </button>
        </template>
      </slot-modal>
    </div>
    <!-- Packing List 모달 -->
    <div>
      <slot-modal modalId="staticBackdrop">
        <template v-slot:title>Packing List</template>
        <template v-slot:body>
          <div>
            <label for="">날짜</label>
            <input type="date" v-model="nowDate" />
          </div>
          <div>
            <label for="">로트 번호</label>
            <input type="text" v-model="lotNo" />
          </div>
          <div>
            <label for="">고객사</label>
            <input type="text" v-model="selectedCustomer" />
          </div>
          <div>
            <label for="">강종</label>
            <input type="text" v-model="packingList[0].FIELD1" />
          </div>
          <div>
            <label for="">강도</label>
            <input type="text" v-model="packingList[0].FIELD4" />
          </div>
          <div>
            <label for="">선경</label>
            <input type="text" v-model="packingList[0].FIELD3" />
          </div>
          <div>
            <label for="">총 수량</label>
            <input type="text" v-model="packingList[0].countTotal" />
          </div>
          <div>
            <label for="">총 중량</label>
            <input type="text" v-model="packingList[0].sumTotal" />
          </div>
          <div v-show="BoolDoDeleteShow === true">
            <label for="">고객사 삭제</label>
            <div :key="customer.code" v-for="customer in searchCustomers">
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
          <button class="btn btn-primary" @click="doExcel">엑셀다운로드</button>
        </template>
      </slot-modal>
    </div>
    <div>
      <!-- <simple-grid :headers="headers" :items="filteredLotNo" /> -->
      <grid-pagination
        :headers="headers"
        :items="filteredLotNo"
        @click-buttons="handleClickButtons"
      />
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import GridPagination from '@/components/layouts/GridPagination.vue'
// import SimpleGrid from '@/components/fragments/SimpleGrid.vue'
import SlotModal from '@/components/fragments/SlotModal.vue'
import XLSX from 'xlsx'
export default {
  // components: { SlotModal, SimpleGrid, GridPagination },
  components: { SlotModal, GridPagination },
  data() {
    return {
      lotNo: '',
      customers: [
        { code: '001-00-00000', company: 'A사', isChecked: false },
        { code: '002-00-00000', company: 'B사', isChecked: false },
        { code: '003-00-00000', company: 'C사', isChecked: false }
      ],
      selectedCustomer: '=== 선택 ===',
      newCustomer: { code: '', company: '', isChecked: false },
      pureCustomers: [],
      checkedCustomers: [],
      resultXlsxToJson: [],
      filteredLotNo: [],
      packingList: [
        {
          selectedDate: '',
          lotNo: '',
          customer: '',
          FIELD1: '',
          FIELD4: '',
          FIELD3: '',
          countTotal: 0,
          sumTotal: 0
        }
      ],
      headers: [
        { title: '로트번호', key: 'FIELD2' },
        { title: '강종', key: 'FIELD1' },
        { title: '강도', key: 'FIELD4' },
        { title: '선경', key: 'FIELD3' },
        { title: '중량', key: 'GROSS_WEIGHT' }
      ],
      BoolAddCustomerShow: false,
      BoolDoDeleteShow: false,
      searchName: '',
      searchCustomers: [],
      nowDate: '',
      headersPackingList: [
        { title: '날짜', key: 'selectedDate' },
        { title: '로트 번호', key: 'lotNo' },
        { title: '고객사', key: 'customer' },
        { title: '강종', key: 'FIELD1' },
        { title: '강도', key: 'FIELD4' },
        { title: '선경', key: 'FIELD3' },
        { title: '총 수량', key: 'countTotal' },
        { title: '총 중량', key: 'sumTotal' }
      ]
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
  mounted() {
    this.nowDate = new Date().toISOString().substring(0, 10)
  },
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
      this.BoolAddCustomerShow = false
      this.newCustomer = { code: '', company: '', isChecked: false }
    },
    doDelete() {
      let tempCustomers = []
      this.customers.forEach((customer) => {
        if (!customer.isChecked) {
          tempCustomers.push(customer)
        }
      })
      this.customers = tempCustomers
      tempCustomers = []
      this.searchName = ''
    },
    lotNoFilter() {
      const tempFilteredLotNo = []
      for (let tempResult of this.resultXlsxToJson) {
        tempFilteredLotNo.push(
          tempResult.filter((rst) => rst.FIELD2 === this.lotNo)
        )
      }
      this.filteredLotNo = tempFilteredLotNo
      this.packingComputed()
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
    },
    getCustomers() {
      let tempCustomers = []
      this.customers.forEach((customer) => {
        if (customer.company === this.searchName) {
          tempCustomers.push(customer)
        }
      })
      this.searchCustomers = tempCustomers
      tempCustomers = []
    },
    packingComputed() {
      let tempSumTotalValue = 0
      let count = 0
      for (let resultArray of this.filteredLotNo) {
        for (let reultObject of resultArray) {
          tempSumTotalValue += Number(reultObject.GROSS_WEIGHT)
          count++
        }
      }
      this.packingList[0].selectedDate = this.nowDate
      this.packingList[0].lotNo = this.lotNo
      this.packingList[0].customer = this.selectedCustomer
      this.packingList[0].FIELD1 = this.filteredLotNo[0][0].FIELD1
      this.packingList[0].FIELD4 = this.filteredLotNo[0][0].FIELD4
      this.packingList[0].FIELD3 = this.filteredLotNo[0][0].FIELD3
      this.packingList[0].sumTotal = tempSumTotalValue.toFixed(1)
      this.packingList[0].countTotal = count
    },
    doExcel() {
      // console.log(this.packingList[0])
      this.$ExcelFromTable(
        this.headersPackingList,
        this.packingList,
        'packingList',
        {}
      )
    },
    handleClickButtons(method, id) {
      if (method === 'showEditModal') {
        this.modalDetailPayload.id = id
        this.showEditModal()
      } else if (method === 'showEList') {
        this.showEList(id)
      } else if (method === 'sendMessage') {
        this.sendMessage(id)
      }
    }
  }
}
</script>
