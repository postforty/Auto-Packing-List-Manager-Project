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
          <div class="modal-body p-5 pt-0">
            <label for="" class="col-form-label fw-bold mb-0"
              >고객사 추가</label
            >
            <div class="form-floating mb-3">
              <input
                v-model="newCustomer.code"
                type="text"
                name=""
                ref="newCustomerModal"
                id="businessNumber"
                placeholder="000-00-00000"
                class="form-control rounded-3"
              />
              <label for="businessNumber">사업자 번호를 입력하세요!</label>
            </div>
            <div class="form-floating mb-3">
              <input
                v-model="newCustomer.company"
                type="text"
                name=""
                ref="newCustomerModal"
                id="companyName"
                placeholder="고객사 명"
                class="form-control rounded-3"
              />
              <label for="companyName">고객사 명을 입력하세요!</label>
            </div>
            <button
              class="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
              @click="addCustomer"
            >
              저장
            </button>
            <hr class="my-4" />
            <label for="" class="col-form-label fw-bold mb-0"
              >고객사 삭제</label
            >
            <div class="form-floating mb-3">
              <input
                type="search"
                v-model.trim="searchName"
                @keyup.enter="getCustomers"
                id="getCompanyName"
                placeholder="고객사 명"
                class="form-control rounded-3"
              />
              <label for="getCompanyName">조회할 고객사 명을 입력하세요!</label>
            </div>
            <button
              class="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
              @click="getCustomers"
            >
              조회
            </button>
            <div
              v-if="searchName === ''"
              class="list-group list-group-checkable d-grid gap-2 border-0 w-auto"
            >
              <div :key="customer.code" v-for="customer in customers">
                <div v-if="customer.code !== 'none'">
                  <input
                    type="checkbox"
                    class="list-group-item-check pe-none"
                    name=""
                    :id="customer.code"
                    :value="customer"
                    @change="customer.isChecked = !customer.isChecked"
                  /><label
                    class="list-group-item rounded-3 py-3"
                    style="text-align: center"
                    :for="customer.code"
                  >
                    {{ customer.company }}
                  </label>
                </div>
              </div>
            </div>
            <div
              v-else
              class="list-group list-group-checkable d-grid gap-2 border-0 w-auto"
            >
              <div :key="customer.code" v-for="customer in searchCustomers">
                <div v-if="customer.code !== 'none'">
                  <input
                    type="checkbox"
                    class="list-group-item-check pe-none"
                    name=""
                    :id="customer.code"
                    :value="customer"
                    @change="customer.isChecked = !customer.isChecked"
                  />
                  <label
                    class="list-group-item rounded-3 py-3"
                    :for="customer.code"
                  >
                    {{ customer.company }}
                  </label>
                </div>
              </div>
            </div>
            <button
              class="w-100 btn btn-lg rounded-3 btn-danger mt-2"
              @click="doDelete"
            >
              삭제
            </button>
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
          <div class="modal-body p-3 pt-0">
            <div>
              <label for="" class="col-form-label">날짜:</label>
              <input type="date" class="form-control mb-2" v-model="nowDate" />
            </div>
            <div>
              <label for="" class="col-form-label">로트 번호:</label>
              <input type="text" class="form-control mb-2" v-model="lotNo" />
            </div>
            <div>
              <label for="" class="col-form-label">고객사:</label>
              <input
                type="text"
                class="form-control mb-2"
                v-model="selectedCustomer"
              />
            </div>
            <div>
              <label for="" class="col-form-label">강종:</label>
              <input
                type="text"
                class="form-control mb-2"
                v-model="packingList[0].FIELD1"
              />
            </div>
            <div>
              <label for="" class="col-form-label">강도:</label>
              <input
                type="text"
                class="form-control mb-2"
                v-model="packingList[0].FIELD4"
              />
            </div>
            <div>
              <label for="" class="col-form-label">선경:</label>
              <input
                type="text"
                class="form-control mb-2"
                v-model="packingList[0].FIELD3"
              />
            </div>
            <div>
              <label for="" class="col-form-label">총 수량(EA):</label>
              <input
                type="text"
                class="form-control mb-2"
                v-model="packingList[0].countTotal"
              />
            </div>
            <div>
              <label for="" class="col-form-label">총 중량(kg):</label>
              <input
                type="text"
                class="form-control mb-2"
                v-model="packingList[0].sumTotal"
              />
            </div>
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
<style>
/* 고객사 삭제 checkbox style */
.list-group {
  max-width: 460px;
  margin: 4rem auto;
}

.form-check-input:checked + .form-checked-content {
  opacity: 0.5;
}

.form-check-input-placeholder {
  border-style: dashed;
}
[contenteditable]:focus {
  outline: 0;
}

.list-group-checkable .list-group-item {
  cursor: pointer;
}
.list-group-item-check {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
.list-group-item-check:hover + .list-group-item {
  background-color: var(--bs-light);
}
.list-group-item-check:checked + .list-group-item {
  color: #fff;
  background-color: var(--bs-blue);
}
.list-group-item-check[disabled] + .list-group-item,
.list-group-item-check:disabled + .list-group-item {
  pointer-events: none;
  filter: none;
  opacity: 0.5;
}

.list-group-radio .list-group-item {
  cursor: pointer;
  border-radius: 0.5rem;
}
.list-group-radio .form-check-input {
  z-index: 2;
  margin-top: -0.5em;
}
.list-group-radio .list-group-item:hover,
.list-group-radio .list-group-item:focus {
  background-color: var(--bs-light);
}

.list-group-radio .form-check-input:checked + .list-group-item {
  background-color: var(--bs-body);
  border-color: var(--bs-blue);
  box-shadow: 0 0 0 2px var(--bs-blue);
}
.list-group-radio .form-check-input[disabled] + .list-group-item,
.list-group-radio .form-check-input:disabled + .list-group-item {
  pointer-events: none;
  filter: none;
  opacity: 0.5;
}
</style>
