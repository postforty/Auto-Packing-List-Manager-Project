<template>
  <div>
    <div style="position: sticky; top: 0px">
      <span
        style="
          color: grey;
          cursor: pointer;
          position: absolute;
          top: 5px;
          right: 5px;
        "
        data-bs-toggle="modal"
        data-bs-target="#staticBackdropMdbPath"
        ><i class="fa fa-cog fa-spin fa-fw"></i
      ></span>
      <!-- <input
        type="file"
        style="display: none"
        ref="mdbFile"
        accept=".mdb"
        @change="setMdbPath"
      /> -->
    </div>
    <!-- mdb 파일 경로 설정 모달 -->
    <!-- <button
      class="btn btn-outline-secondary"
      data-bs-toggle="modal"
      data-bs-target="#staticBackdropMdbPath"
      style="width: 120pt"
    >
      고객사 관리
    </button> -->
    <div>
      <slot-modal modalId="staticBackdropMdbPath">
        <template v-slot:title>DB 경로 설정</template>
        <template v-slot:body>
          <div class="modal-body p-5 pt-0">
            <label for="" class="col-form-label fw-bold mb-0">현재 경로</label>
            <div class="form-floating mb-3">
              <input
                v-model="mdbPathInput"
                type="text"
                name=""
                ref="newCustomerModal"
                id="mdbPath"
                placeholder=""
                class="form-control rounded-3"
              />
              <label for="mdbPath">경로를 수정하세요.</label>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn btn-primary" @click="setMdbPath">저장</button>
          <button
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="setMdbPathCancel"
          >
            취소
          </button>
        </template>
      </slot-modal>
    </div>
    <div id="top" class="py-5 text-center">
      <a href="http://localhost:8080/">
        <h2><em>Packing List Manager</em></h2>
      </a>
    </div>
    <div class="p-5">
      <div class="form-floating">
        <input
          v-model="lotNo"
          type="text"
          name=""
          ref="newCustomerModal"
          id="lotNo"
          placeholder="로트 번호"
          class="form-control rounded-3"
        />
        <label for="lotNo">로트 번호를 입력하세요!</label>
      </div>
      <div class="input-group form-floating">
        <select
          v-model="selectedCustomer"
          class="form-select form-select"
          aria-label=".form-select example"
          id="selectCompany"
        >
          <option
            :key="customer.code"
            v-for="customer in customers"
            :value="customer.company"
          >
            {{ customer.company }}
          </option>
        </select>
        <label for="selectCompany">고객사를 선택하세요!</label>
        <button
          class="btn btn-outline-secondary"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdropCustomers"
          style="width: 120pt"
        >
          고객사 관리
        </button>
        <button
          style="width: 120pt"
          @click="$refs.file.click()"
          class="btn btn-outline-secondary"
        >
          엑셀 불러오기
        </button>
        <input
          type="file"
          style="display: none"
          ref="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="xlsxMount"
        />
        <button
          style="width: 120pt"
          :disabled="resultXlsxToJson.length === 0"
          @click="xlsxUnmount"
          class="btn btn-outline-secondary"
        >
          엑셀 해제하기
        </button>
      </div>
    </div>
    <div class="p-5 text-center">
      <div class="btn-group col-6 mx-auto">
        <!-- <button @click="$refs.file.click()" class="btn btn-outline-primary">
        엑셀업로드
      </button> -->
        <button
          style="width: 120pt"
          @click="lotNoFilterMdb"
          class="btn btn-outline-primary"
        >
          조회하기
        </button>
        <!-- <input
        type="file"
        style="display: none"
        ref="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="readFile"
      /> -->
        <button
          style="width: 120pt"
          :disabled="packingChk === false"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          class="btn btn-outline-primary"
        >
          <span style="position: relative; top: 25%">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-file-earmark-text mb-4"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
              />
              <path
                d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"
              />
            </svg>
          </span>
          <span style="position: relative; top: 5%">Packing List</span>
        </button>
      </div>
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
              <label for="businessNumber"
                >사업자 번호를 입력하세요! (예: 000-00-00000)</label
              >
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
          <div id="printArea">
            <div class="modal-body p-3 pt-0">
              <div>
                <label for="packingDate" class="col-form-label">날짜:</label>
                <input
                  type="date"
                  id="packingDate"
                  class="form-control mb-2"
                  v-model="nowDate"
                />
              </div>
              <div>
                <label for="productLotNo" class="col-form-label"
                  >로트 번호:</label
                >
                <input
                  type="text"
                  id="productLotNo"
                  class="form-control mb-2"
                  v-model="lotNo"
                />
              </div>
              <div>
                <label for="packingCompanyName" class="col-form-label"
                  >고객사:</label
                >
                <input
                  type="text"
                  id="packingCompanyName"
                  class="form-control mb-2"
                  v-model="selectedCustomer"
                />
              </div>
              <div>
                <label for="productKinds" class="col-form-label">강종:</label>
                <input
                  type="text"
                  id="productKinds"
                  class="form-control mb-2"
                  v-model="packingList[0].FIELD1"
                />
              </div>
              <div>
                <label for="productCharacteristic" class="col-form-label"
                  >강도:</label
                >
                <input
                  type="text"
                  id="productCharacteristic"
                  class="form-control mb-2"
                  v-model="packingList[0].FIELD4"
                />
              </div>
              <div>
                <label for="productThickness" class="col-form-label"
                  >선경:</label
                >
                <input
                  type="text"
                  id="productThickness"
                  class="form-control mb-2"
                  v-model="packingList[0].FIELD3"
                />
              </div>
              <div>
                <label for="totalCount" class="col-form-label"
                  >총 수량(EA):</label
                >
                <input
                  type="text"
                  id="totalCount"
                  class="form-control mb-2"
                  v-model="packingList[0].countTotal"
                />
              </div>
              <div>
                <label for="totalSum" class="col-form-label"
                  >총 중량(kg):</label
                >
                <input
                  type="text"
                  id="totalSum"
                  class="form-control mb-2"
                  v-model="packingList[0].sumTotal"
                />
              </div>
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
          <button
            class="btn btn-primary"
            onclick="printJS({ printable:'printArea', type:'html', header:'Packing List', scanStyles : true })"
          >
            인쇄
          </button>
          <button class="btn btn-success" @click="doExcel">엑셀다운로드</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            닫기
          </button>
        </template>
      </slot-modal>
    </div>
    <div class="p-5">
      <p v-show="fileName !== ''">엑셀 파일명 : {{ fileName }}</p>
      <grid-pagination
        :headers="headers"
        :items="filteredLotNo"
        @click-buttons="handleClickButtons"
      />
    </div>
    <div id="down"></div>
    <div style="position: sticky; bottom: 0px">
      <a
        href="#top"
        style="
          color: grey;
          cursor: pointer;
          position: absolute;
          bottom: 20px;
          right: 5px;
        "
        ><i class="fa fa-angle-up active"></i
      ></a>
      <a
        href="#down"
        style="
          color: grey;
          cursor: pointer;
          position: absolute;
          bottom: 5px;
          right: 5px;
        "
        ><i class="fa fa-angle-down active"></i
      ></a>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import GridPagination from '@/components/layouts/GridPagination.vue'
// import SimpleGrid from '@/components/fragments/SimpleGrid.vue'
import SlotModal from '@/components/fragments/SlotModal.vue'
// import customersData from '@/assets/jsonData/customers.json'
import XLSX from 'xlsx'
import printJS from 'print-js'

export default {
  // components: { SlotModal, SimpleGrid, GridPagination },
  components: { SlotModal, GridPagination },
  data() {
    return {
      lotNo: '',
      // customers: customersData,
      customers: [],
      selectedCustomer: '',
      newCustomer: { code: '', company: '', isChecked: false },
      checkedCustomers: [],
      resultXlsxToJson: [],
      resultMdbToJson: [],
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
        { title: '로트', key: 'FIELD2' },
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
        { title: '로트', key: 'lotNo' },
        { title: '고객사', key: 'customer' },
        { title: '강종', key: 'FIELD1' },
        { title: '강도', key: 'FIELD4' },
        { title: '선경', key: 'FIELD3' },
        { title: '총 수량', key: 'countTotal' },
        { title: '총 중량', key: 'sumTotal' }
      ],
      packingChk: false,
      fileName: '',
      mdbPathInput: '',
      mdbPath: ''
    }
  },
  setup() {},
  async created() {
    await this.getMdbPath()
  },
  mounted() {
    this.nowDate = new Date().toISOString().substring(0, 10)
    this.getCustomersServer()
    this.getMdbServer()
  },
  unmounted() {},
  methods: {
    // xlsx to json
    readFile(e) {
      return new Promise((resolve, reject) => {
        let files = e.target.files
        let reader = new FileReader()
        const temp = []
        reader.readAsBinaryString(files[0])
        reader.onload = function (e) {
          let data = e.target.result
          let workBook = XLSX.read(data, { type: 'binary' })
          workBook.SheetNames.forEach(function (sheetName) {
            let xlsxToJson = XLSX.utils.sheet_to_json(
              workBook.Sheets[sheetName]
            )
            temp.push(xlsxToJson)
          })
          resolve(temp)
        }
      })
    },
    xlsxMount(e) {
      this.readFile(e).then((res) => {
        this.resultXlsxToJson = res
        this.lotNoFilter()
      })
      this.fileName = this.$refs.file.value
      this.fileName = this.fileName.slice(this.fileName.lastIndexOf('\\') + 1)
      this.$refs.file.value = ''
    },
    xlsxUnmount() {
      this.resultXlsxToJson = []
      // console.log('xlsxUnmount: ', this.resultXlsxToJson.length)
      this.getMdbServer()
      this.packingChk = false
      this.fileName = ''
    },
    addCustomer() {
      // console.log(this.newCustomer)
      this.customers.push(this.newCustomer)
      this.BoolAddCustomerShow = false
      this.newCustomer = { code: '', company: '', isChecked: false }
      // this.exportTextFile()
      this.postCustomersServer()
    },
    doDelete() {
      this.$swal({
        title: '정말 삭제하시겠습니까?',
        text: '삭제된 데이터는 복원되지 않습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: '취소',
        confirmButtonText: '삭제'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.customers = this.customers.filter(
            (customer) => !customer.isChecked
          )
          // console.log('doDeleteFilter: ', this.customers)
          // this.exportTextFile()
          this.postCustomersServer()

          // let tempCustomers = []
          // this.customers.forEach((customer) => {
          //   if (!customer.isChecked) {
          //     tempCustomers.push(customer)
          //   }
          // })
          // this.customers = tempCustomers
          // tempCustomers = []

          this.searchName = ''
          this.$swal('고객사가 삭제되었습니다.')
        }
      })
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
        if (customer.company.includes(this.searchName)) {
          tempCustomers.push(customer)
        }
      })
      this.searchCustomers = tempCustomers
      tempCustomers = []
    },
    packingComputed() {
      let tempSumTotalValue = 0
      let count = 0
      for (let reultObject of this.filteredLotNo) {
        tempSumTotalValue += Number(reultObject.GROSS_WEIGHT)
        count++
      }
      this.packingList[0].selectedDate = this.nowDate
      this.packingList[0].lotNo = this.lotNo
      this.packingList[0].customer = this.selectedCustomer
      this.packingList[0].FIELD1 = this.filteredLotNo[0].FIELD1
      this.packingList[0].FIELD4 = this.filteredLotNo[0].FIELD4
      this.packingList[0].FIELD3 = this.filteredLotNo[0].FIELD3
      this.packingList[0].sumTotal = tempSumTotalValue.toFixed(1)
      this.packingList[0].countTotal = count
    },
    doExcel() {
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
    },
    // exportTextFile() {
    //   var FileSaver = require('file-saver')
    //   var blob = new Blob([JSON.stringify(this.customers, null, 2)], {
    //     type: 'text/plain;charset=utf-8'
    //   })
    //   FileSaver.saveAs(blob, 'customers.json')
    // },
    async getCustomersServer() {
      this.customers = await this.$get('/customers')
    },
    async postCustomersServer() {
      await this.$post('/customers', this.customers)
    },
    async getMdbServer() {
      this.resultMdbToJson = await this.$get('/mdb')
      this.filteredLotNo = this.resultMdbToJson
    },
    lotNoFilter() {
      if (this.lotNo === '') {
        // console.log('resultXlsxToJson: ', this.resultXlsxToJson)
        this.filteredLotNo = this.resultXlsxToJson[0]
        this.packingChk = false
      } else {
        const tempFilteredLotNo = []
        for (let tempResult of this.resultXlsxToJson) {
          tempFilteredLotNo.push(
            tempResult.filter((rst) => rst.FIELD2 === this.lotNo)
          )
        }
        this.filteredLotNo = tempFilteredLotNo[0]
        this.packingChk = true
        this.packingComputed()
      }
    },
    lotNoFilterMdb() {
      if (this.lotNo === '' && this.resultXlsxToJson.length === 0) {
        this.getMdbServer()
        this.packingChk = false
      } else if (this.resultXlsxToJson.length > 0) {
        this.lotNoFilter()
      } else {
        this.filteredLotNo = this.resultMdbToJson.filter(
          (rst) => rst.FIELD2 === this.lotNo
        )
        this.packingChk = true
      }
      this.packingComputed()
    },
    async getMdbPath() {
      this.mdbPath = await this.$get('/mdbpath')
      this.mdbPathInput = this.mdbPath
      // console.log(this.mdbPath)
    },
    async setMdbPath() {
      const mdbPath = this.mdbPathInput.replace(/(\\)+/g, '/')
      console.log(mdbPath)
      this.mdbPath = mdbPath
      this.mdbPathInput = mdbPath
      await this.$post('/mdbpath', { mdbPath })
      this.$swal('경로가 수정되었습니다.')
    },
    setMdbPathCancel() {
      this.getMdbPath()
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
  background-color: var(--bs-yellow);
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
