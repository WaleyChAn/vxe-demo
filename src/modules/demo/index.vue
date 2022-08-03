<template>
  <div class="of-table-complex">
    <div class="layout-flex column">
      <div class="layout-flex-s">
        <div class="table-header">头部</div>
      </div>
      <div class="layout-flex-l">
        <div class="layout-flex row">
          <div class="layout-flex-s">
            <div class="layout-flex column table-menu">
              <div class="layout-flex-s table-menu-title">母本目录</div>
              <div class="layout-flex-l table-menu-content">
                <ul>
                  <li v-for="(item, index) in 20"
                      :key="index"
                      :class="{'active': menuActive === index}"
                      @click="onSwitch(index)">一级目录</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="layout-flex-l">
            <div class="layout-flex column">
              <div class="layout-flex-s">
                <div class="table-search clearfix">
                  <button class="search-btn right"
                          @click="onClear">重置</button>
                  <button class="search-btn right"
                          @click="onSearch">搜索</button>
                  <input class="search-input right"
                         v-model="tableFilters.search" />
                </div>
              </div>
              <div class="layout-flex-l">
                <div class="table-box"
                     ref="tableBox">
                  <vxe-table show-overflow
                             border
                             :height="tableHeight"
                             ref="xTable"
                             :loading="loading"
                             :tree-config="treeConfig"
                             :row-config="rowConfig"
                             :scroll-y="scrollY">
                    <vxe-column type="seq"
                                title="WBS"
                                width="80"></vxe-column>
                    <vxe-column field="name"
                                title="名称"
                                tree-node
                                type="html"></vxe-column>
                    <vxe-column field="id"
                                title="ID"></vxe-column>
                    <vxe-column field="parentId"
                                title="父节点ID"></vxe-column>
                  </vxe-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBigTree, getBigTree2 } from '@/api/bigTree'
import XEUtils from 'xe-utils'

export default {
  name: 'Demo',
  data () {
    return {
      menuActive: 0,
      filterName1: '',
      treeConfig: {
        transform: true,
        expandAll: true
      },
      rowConfig: {
        isCurrent: true,
        isHover: true
      },
      scrollY: {
        gt: 100
      },
      loading: false,
      tableHeight: 500,
      tableFilters: {
        search: ''
      }
    }
  },
  mounted () {
    // 动态定义，阻断 vue 对大数据双向绑定，提升加载速度
    this.tableData = []
    // 设定表格高度
    this.mixinTableHeight()
    this.fetchData()
  },
  methods: {
    mixinTableHeight () {
      setTimeout(() => {
        this.setTableHeight()
        window.addEventListener('resize', () => {
          this.setTableHeight()
        })
      }, 50)
    },
    setTableHeight () {
      const _this = this
      const _tableBox = _this.$refs.tableBox
      if (_tableBox) {
        const boxPadding = 0
        const boxHeight = _tableBox.clientHeight
        _this.tableHeight = boxHeight - boxPadding
        _this.$forceUpdate()
      }
    },
    onSearch () {
      const { search } = this.tableFilters
      const _xTable = this.$refs.xTable
      const filterName = XEUtils.toValueString(search).trim().toLowerCase()
      if (filterName) {
        this.loading = true
        const filterRE = new RegExp(filterName, 'gi')
        const searchProps = ['name']
        const options = { children: 'children' }
        const rest = XEUtils.searchTree(this.tableData, item => {
          return searchProps.some(key => {
            return XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1
          })
        }, options)

        XEUtils.eachTree(rest, item => {
          searchProps.forEach(key => {
            item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match => {
              return `<span class="keyword-lighten">${match}</span>`
            })
          })
        }, options)

        _xTable.reloadData(rest)
        this.$nextTick(() => {
          _xTable.setAllTreeExpand(true)
          this.loading = false
        })
      }
    },
    onClear () {
      this.loadList(this.tableData)
    },
    onSwitch (index) {
      if (this.menuActive !== index) {
        this.menuActive = index
        if (index % 2 === 0) {
          this.fetchData()
        } else {
          this.fetchData2()
        }
      }
    },
    async fetchData () {
      this.loading = true
      const res = await getBigTree()
      if (res && res.data) {
        await this.loadList(res.data)
        this.loading = false
      }
    },
    async fetchData2 () {
      this.loading = true
      const res = await getBigTree2()
      if (res && res.data) {
        await this.loadList(res.data)
        this.loading = false
      }
    },
    async loadList (list) {
      const _xTable = this.$refs.xTable
      const loadList = list || []
      this.loading = true
      if (loadList && _xTable) {
        this.tableData = loadList
        await _xTable.reloadData(this.tableData)
        this.loading = false
      }
    }
  }
}
</script>

<style>
@import "./ui.css";
</style>
