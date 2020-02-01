<template>
  <div :class="classObj" class="topic">
    <div class="main-container">
      <el-row class="dr-datatable">
        <el-col :span="24">
          <TopBar
            :device="device"
            type="topic"
            :ids="selectlist"
            :pageInfo="topicList.pageInfo"
          ></TopBar>
          <DataTable
            :dataList="topicList.docs"
            :pageInfo="topicList.pageInfo"
            @changeContentSelectList="changeSelect"
          ></DataTable>
          <Pagination :device="device" :pageInfo="topicList.pageInfo" pageType="topic"></Pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import DataTable from "./dataTable.vue";
import TopBar from "../common/TopBar.vue";
import Pagination from "../common/Pagination.vue";
import { mapGetters, mapActions } from "vuex";
import { initEvent } from "@root/publicMethods/events";

export default {
  name: "index",
  data() {
    return {
      selectlist: [],
      sidebarOpened: true,
      device: "desktop"
    };
  },
  components: {
    DataTable,
    TopBar,
    Pagination
  },
  methods: {
    changeSelect(ids) {
      this.selectlist = ids;
    }
  },
  computed: {
    ...mapGetters(["topicList", "addNodeFormState"]),
    classObj() {
      return {
        hideSidebar: !this.sidebarOpened,
        openSidebar: this.sidebarOpened,
        withoutAnimation: "false",
        mobile: this.device === "mobile"
      };
    }
  },
  mounted() {
    initEvent(this);
    this.$store.dispatch("topic/getTopicList");
  }
};
</script>

<style lang="">
</style>