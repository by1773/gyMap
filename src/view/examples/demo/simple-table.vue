<template>
  <Card style="heigth:400px">
    <simple-table :columns="colums"
                  :data="data"
                  :total="total"
                  :rows="rows"
                  :page="page"
                  :stripe="true"
                  :loading="loadding"
                  :showSearcher="true"
                  :searchPlaceholder="searchPlaceholder"
                  :showSizer="true"
                  @on-search="onSearch"
                  @on-page-change="onPageChange">
    </simple-table>
  </Card>
</template>
<script>
import SimpleTable from '_c/simple-table'
export default {
  components: {
    SimpleTable
  },
  data () {
    return {
      searchPlaceholder: '输入名字搜索',
      data: [
        { id: 1, username: 'admin1', statusName: '正常', sex: '男', nickName: '管理员' },
        { id: 2, username: 'admin2', statusName: '正常', sex: '男', nickName: '管理员' },
        { id: 3, username: 'admin3', statusName: '正常', sex: '男', nickName: '管理员' },
        { id: 4, username: 'admin4', statusName: '正常', sex: '男', nickName: '管理员' },
        { id: 5, username: 'admin5', statusName: '正常', sex: '男', nickName: '管理员' },
        { id: 6, username: 'admin6', statusName: '正常', sex: '男', nickName: '管理员' },
        { id: 7, username: 'admin7', statusName: '正常', sex: '男', nickName: '管理员' },
        { id: 8, username: 'admin8', statusName: '正常', sex: '男', nickName: '管理员' },
        { id: 9, username: 'admin9', statusName: '正常', sex: '男', nickName: '管理员' }
      ],
      total: 100,
      rows: 10,
      page: 1,
      loadding: true,
      colums: [
        { title: '#', key: 'id', sortable: true },
        { title: '用户名称', key: 'username' },
        { title: '状态', key: 'statusName' },
        { title: '性别', key: 'sex' },
        { title: '昵称', key: 'nickName' }
      ]
    }
  },
  methods: {
    onSearch (keyword) {
      this.$Message.info('搜索关键字为：' + keyword)
    },
    onPageChange (current, pageSize, keyword) {
      this.$Message.info('搜索关键字为：' + keyword + ' | 分页码：' + current + ' | 分页大小：' + pageSize)
    }
  },
  mounted () {
    setTimeout(() => {
      this.loadding = false
    }, 2000)
  }
}
</script>
