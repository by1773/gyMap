<template>
  <div class="simple-table-main">
    <div class="toolbar">
      <slot></slot>
      <Input search
             :placeholder="searchPlaceholder"
             v-model="keyword"
             enter-button
             v-if="showSearcher"
             class="search-input"
             @on-keydown="onSearch"
             @on-search="onSearch" />
      <div style="clear: both;"></div>
    </div>
    <Table :data="data"
           :columns="columns"
           :stripe="stripe"
           :border="border"
           :show-header="showHeader"
           :width="width"
           :height="height"
           :loading="loading"
           :disabled-hover="disabledHover"
           :highlight-row="highlightRow"
           :row-class-name="rowClassName"
           :size="size"
           :no-data-text="noDataText"
           :no-filtered-data-text="noFilteredDataText"></Table>
    <Page :current="current"
          :total="total"
          :page-size="pageSize"
          :page-size-opts="pageSizeOpts"
          :placement="placement"
          :simple="simple"
          :show-total="showTotal"
          :show-elevator="showElevator"
          :show-sizer="showSizer"
          :class-came="pagerClassCame"
          :styles="pagerStyles"
          :transfer="pagerTransfer"
          :prev-text="prevText"
          :next-text="nextText"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
          style="margin:18px 0;" />
  </div>
</template>
<script>
export default {
  name: 'SimpleTable',
  props: {
    // 显示的结构化数据
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 表格列的配置描述
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否显示间隔斑马纹
    stripe: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 是否显示纵向边框
    border: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default () {
        return true
      }
    },
    // 表格宽度，单位 px
    width: {
      type: Number,
      default () {
        return 0
      }
    },
    // 表格高度，单位 px，设置后，如果表格内容大于此值，会固定表头
    height: {
      type: Number,
      default () {
        return 0
      }
    },
    // 表格是否加载中
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 禁用鼠标悬停时的高亮
    disabledHover: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 是否支持高亮选中的行，即单选
    highlightRow: {
      type: Boolean,
      default () {
        return false
      }
    },
    /**
     * 是否支持高亮选中的行，即单选
     * 行的 className 的回调方法，传入参数：
     * row：当前行数据
     * index：当前行的索引
     */
    rowClassName: {
      type: Function,
      default () {
        return (row, index) => { }
      }
    },
    // 表格尺寸，可选值为 large、small、default 或者不填
    size: {
      type: String,
      default () {
        return 'small'
      }
    },
    // 数据为空时显示的提示内容
    noDataText: {
      type: String,
      default () {
        return '暂无数据'
      }
    },
    // 筛选数据为空时显示的提示内容
    noFilteredDataText: {
      type: String,
      default () {
        return '暂无筛选结果'
      }
    },
    // page 参数

    // 当前页码，支持 .sync 修饰符
    current: {
      type: Number,
      default () {
        return 1
      }
    },
    // 数据总数
    total: {
      type: Number,
      default () {
        return 0
      }
    },
    // 每页条数
    pageSize: {
      type: Number,
      default () {
        return 10
      }
    },
    // 每页条数切换的配置
    pageSizeOpts: {
      type: Array,
      default () {
        return [10, 20, 30, 40]
      }
    },
    // 条数切换弹窗的展开方向，可选值为 bottom 和 top
    placement: {
      type: String,
      default () {
        return 'bottom'
      }
    },
    // 简洁版
    simple: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 显示总数
    showTotal: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 显示电梯，可以快速切换到某一页
    showElevator: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 显示分页，用来改变page-size
    showSizer: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 自定义 class 名称
    pagerClassCame: {
      type: String,
      default () {
        return ''
      }
    },
    // 自定义 style 样式
    pagerStyles: {
      type: Object,
      default () {
        return {}
      }
    },
    // 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果
    pagerTransfer: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 替代图标显示的上一页文字
    prevText: {
      type: String,
      default () {
        return ''
      }
    },
    // 替代图标显示的下一页文字
    nextText: {
      type: String,
      default () {
        return ''
      }
    },
    // 是否显示搜索框
    showSearcher: {
      type: Boolean,
      default () {
        return false
      }
    },
    // 搜索替换词
    searchPlaceholder: {
      type: String,
      default () {
        return '输入关键字回车搜索...'
      }
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    onSearch (evn) {
      if (evn === this.keyword) {
        this.$emit('on-search', this.keyword)
        return
      }
      if (evn && evn.key === 'Enter') {
        this.$emit('on-search', this.keyword)
      }
    },
    onPageChange (current) {
      this.$emit('on-page-change', current, this.pageSize, this.keyword)
    },
    onPageSizeChange (pageSize) {
      this.$emit('on-page-change', this.current, pageSize, this.keyword)
    }
  }
}
</script>
<style>
.simple-table-main {
  margin-top: 10px;
}
.simple-table-main .table-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
.simple-table-main .search-input {
  width: 300px;
  float: right;
  margin: 0px 0px 10px;
}
.simple-table-main .toolbar {
  margin: 0px 0px 18px;
}
</style>
