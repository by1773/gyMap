<template>
  <div>
    <Button @click="exportData"
            type="primary"
            style="margin: 0 10px 10px 0;">导出日志记录</Button>
    <b>注：这里只会显示成功保存到服务端的错误日志，而且页面错误日志不会在浏览器持久化存储，刷新页面即会丢失</b>
    <Table ref="table"
           :columns="columns"
           size="small"
           :data="errorList"></Table>
    <Modal v-model="showView"
           width="1200"
           title="错误信息查看">
      <Tabs value="home">
        <TabPane label="基本信息"
                 name="home">
          <h1>HTTP</h1>
          <Row>
            <Col span="3"><span>请求地址：</span></Col>
            <Col span="21"><span v-text="currentRow.url"></span></Col>
          </Row>
          <Row>
            <Col span="3"><span>状态：</span></Col>
            <Col span="21"><span v-text="currentRow.status"></span></Col>
          </Row>
          <h1>响应内容</h1>
          <Row>
            <Col span="3"><span>是否Ajax请求：</span></Col>
            <Col span="21"><span v-text="currentRow.isAjax?'是':'否'"></span></Col>
          </Row>
          <Row>
            <Col span="3"><span>目标地址：</span></Col>
            <Col span="21"><span v-text="currentRow.targetUrl"></span></Col>
          </Row>
          <Row>
            <Col span="3"><span>是否成功：</span></Col>
            <Col span="21"><span v-text="currentRow.success?'是':'否'"></span></Col>
          </Row>
          <Row>
            <Col span="3"><span>自定义代码：</span></Col>
            <Col span="21"><span v-text="currentRow.code">22</span></Col>
          </Row>
          <Row>
            <Col span="3"><span>未授权的请求：</span></Col>
            <Col span="21"><span v-text="currentRow.unAuthorizedRequest?'是':'否'"></span></Col>
          </Row>
          <Row>
            <Col span="3"><span>错误信息：</span></Col>
            <Col span="21"><span v-text="currentRow.message"></span></Col>
          </Row>
          <h1>验证</h1>
          <div v-if="currentRow.validationErrors">
            <Row v-for="item in currentRow.validationErrors"
                 :key="item.member">
              <Col span="3"
                   style="text-align: right;">
              <span style="margin-right: 18px;">
                {{item.member}}:
              </span>
              </Col>
              <Col span="21">
              <p v-for="message in item.messages"
                 :key="message">{{message}}</p>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="堆栈信息"
                 name="details">
          <div style="max-height:500px;overflow: auto;">
            <pre v-text="currentRow.details"></pre>
          </div>
        </TabPane>
      </Tabs>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'
export default {
  name: 'error_logger_page',
  data () {
    return {
      currentRow: {},
      showView: false,
      columns: [
        {
          type: 'index',
          title: '序号',
          minWidth: 40
        },
        {
          key: 'type',
          title: '类型',
          minWidth: 30,
          render: (h, { row }) => {
            return (
              <div>
                <icon size={16} type={row.type === 'ajax' ? 'md-link' : 'md-code-working'}></icon>
              </div>
            )
          }
        },
        {
          key: 'status',
          title: '状态',
          minWidth: 30,
          render: (h, { row }) => {
            return (
              <span>{row.status === 0 ? '-' : row.status}</span>
            )
          }
        },
        {
          key: 'message',
          title: '错误信息',
          minWidth: 120
        },
        {
          key: 'time',
          title: '时间',
          minWidth: 80,
          render: (h, { row }) => {
            return (
              <span>{dayjs(row.time).format('YYYY-MM-DD HH:mm:ss')}</span>
            )
          },
          sortable: true,
          sortType: 'desc'
        },
        {
          key: 'url',
          title: 'URL',
          minWidth: 180
        },
        {
          title: '操作',
          key: 'action',
          width: 120,
          align: 'center',
          fixed: 'right',
          render: (h, { row }) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'md-eye'
                },
                on: {
                  click: () => {
                    this.currentRow = row
                    this.showView = true
                  }
                }
              }, '查看')
            ])
          }
        }
      ]
    }
  },
  computed: {
    errorList () {
      return this.$store.state.app.errorList
    }
  },
  methods: {
    ...mapMutations([
      'setHasReadErrorLoggerStatus'
    ]),
    exportData () {
      this.$refs.table.exportCsv({
        filename: '错误日志.csv'
      })
    }
  },
  activated () {
    this.setHasReadErrorLoggerStatus()
  },
  mounted () {
    this.setHasReadErrorLoggerStatus()
  }
}
</script>

<style>
.ivu-row {
  height: 30px;
  line-height: 30px;
}
h1 {
  margin: 10px 0 10px 0;
}
</style>
