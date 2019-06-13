<template>
  <Card>
    <simple-table :columns="tableMeta.columns"
                  :data="tableMeta.data"
                  :total="tableMeta.total"
                  :rows="tableMeta.rows"
                  :page="tableMeta.page"
                  :loading="tableMeta.loadding"
                  @on-search="onSearch"
                  @on-page-change="onPageChange">
      <Button type="error"
              icon="md-add"
              v-hasPermission="$access.membership.login_logs.clear"
              @click="onCleanAll">清除日志</Button>
      <DatePicker format="yyyy/MM/dd"
                  type="daterange"
                  placeholder="选择日期范围"
                  class="attempts-toolbar"
                  @on-change="onDateChange"
                  style="width: 200px"></DatePicker>
      <Button type="primary"
              shape="circle"
              class="attempts-toolbar"
              @click="onSearch"
              icon="ios-search"></Button>
      <Button type="primary"
              shape="circle"
              icon="md-download"
              class="attempts-toolbar"
              v-hasPermission="$access.membership.login_logs.export"
              @click="onExportExcel"></Button>
    </simple-table>
  </Card>
</template>
<script>
import SimpleTable from '_c/simple-table'
import { getAttachmentFileName } from '@/libs/util'
import { newUuid } from '@/libs/tools'
import fileDownload from 'js-file-download'
import { exportLoginLogs, clearLoginLogs, pageLoginLogs } from '@/api/membership/login-logs'
export default {
  name: 'LoginLogs',
  components: {
    SimpleTable
  },
  data () {
    return {
      tableMeta: {
        columns: [
          { title: '#', key: 'id', width: 80 },
          { title: '登录账号', key: 'account', minWidth: 90 },
          { title: '用户ID', key: 'userId', minWidth: 30 },
          { title: '客户端ip', key: 'clientIp', minWidth: 80 },
          { title: '登录时间', key: 'createdDate', minWidth: 160 },
          { title: '浏览器信息', key: 'browserInfo', minWidth: 500 }
        ],
        data: [],
        current: 1,
        total: 0,
        pageSize: 10,
        loadding: false
      },
      startDate: '',
      endDate: ''
    }
  },
  methods: {
    onDateChange (value, type) {
      value = value || []
      this.startDate = value[0] ? value[0] : ''
      this.endDate = value[1] ? value[1] : ''
    },
    onPageChange (page, keyword) {
      this.loadData(page, keyword)
    },
    onSearch (keyword) {
      if (keyword) {
        this.loadData(1, keyword)
      } else {
        this.loadData()
      }
    },
    onCleanAll () {
      this.$Modal.confirm({
        title: '清除所有日志？',
        content: '<p>确定要清除所有日志吗？</p>',
        onOk: () => {
          clearLoginLogs().then(result => {
            this.$Message.success('清除成功!')
            this.loadData()
          })
        },
        onCancel: () => {
        }
      })
    },
    onExportExcel () {
      let input = {}
      if (this.startDate) {
        input.beginDate = this.startDate
      }
      if (this.endDate) {
        input.endDate = this.endDate
      }
      exportLoginLogs(input).then(({ data, headers }) => {
        const fileName = getAttachmentFileName(headers, newUuid() + '.xls')
        fileDownload(data, fileName)
      })
    },
    loadData (page, keyword) {
      page = page || 1
      let input = {
        currentPage: page
      }
      if (keyword) {
        input.keyword = keyword
      }
      if (this.startDate) {
        input.beginDate = this.startDate
      }
      if (this.endDate) {
        input.endDate = this.endDate
      }
      this.tableMeta.loadding = true
      pageLoginLogs(input).then(({ data }) => {
        this.tableMeta.current = data.currentPage
        this.tableMeta.total = data.totalCount
        this.tableMeta.pageSize = data.pageSize
        this.tableMeta.data = data.items
        this.tableMeta.loadding = false
      })
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
<style>
.attempts-toolbar {
  margin-left: 10px;
}
</style>
