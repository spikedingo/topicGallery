<template>
  <div class="dr-toolbar">
    <el-col :xs="12" :md="6" class="option-button">
      <el-button size="small" type="primary" plain @click="addTopic('topic')" round>
        <svg-icon icon-class="icon_add" />
      </el-button>
      <el-button size="small" type="danger" plain round @click="branchDelete('topic')">
        <svg-icon icon-class="icon_delete" />
      </el-button>
      <!-- <el-tooltip class="item" effect="dark" content="分配文章到用户" placement="top">
        <el-button size="small" type="warning" plain @click="directUser('topic')" round>
          <svg-icon icon-class="direct_user" />
        </el-button>
      </el-tooltip> -->
      <!-- TOPBARLEFT -->
    </el-col>
    <el-col :xs="12" :md="18">
      <div class="dr-toolbar-right">
        <div v-if="device != 'mobile'" style="display:inline-block">
          <!-- <el-select
            class="dr-searchInput"
            v-model="pageInfo.uAuthor"
            size="small"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入用户名"
            @change="changeUserOptions"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in selectUserList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <el-input
            class="dr-searchInput"
            style="width:180px"
            size="small"
            :placeholder="$t('topBar.keywords')"
            v-model="pageInfo.searchkey"
            suffix-icon="el-icon-search"
            @keyup.enter.native="searchResult"
          ></el-input>
        </div>

        <div class="dr-select-box">
          <el-select size="small" @change="changePostOptions" v-model="authPost" placeholder="请选择">
            <el-option
              v-for="item in authPostOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
import { deleteTopic, regUserList } from "@/api/topic";
export default {
  props: {
    device: String,
    pageInfo: Object,
    type: String,
    ids: Array
  },
  data() {
    return {
      loading: false,
      selectUserList: [],
      searchkey: "",
      authPost: "0",
      authPostOptions: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "待审核"
        }
      ]
    };
  },
  methods: {
    addTopic() {
      this.$store.dispatch("topic/showTopicForm");
      this.$router.push(this.$root.adminBasePath + "/topic/addTopic");
    },
    directUser() {
      this.$store.dispatch("topic/showDirectUserForm");
    },
    branchDelete(target) {
      let _this = this;
      if (_.isEmpty(_this.ids)) {
        this.$message({
          type: "info",
          message: this.$t("validate.selectNull", {
            label: this.$t("main.target_Item")
          })
        });
        return false;
      }
      this.$confirm(
        this.$t("main.del_notice"),
        this.$t("main.scr_modal_title"),
        {
          confirmButtonText: this.$t("main.confirmBtnText"),
          cancelButtonText: this.$t("main.cancelBtnText"),
          type: "warning"
        }
      )
        .then(() => {
          let ids = _this.ids.join();
          return deleteTopic({
            ids
          });
        })
        .then(result => {
          if (result.status === 200) {
            this.$store.dispatch("topic/getTopicList");
            this.$message({
              message: `${this.$t("main.scr_modal_del_succes_info")}`,
              type: "success"
            });
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: this.$t("main.scr_modal_del_error_info")
          });
        });
    },
    searchResult(ev) {
      let searchkey = this.pageInfo ? this.pageInfo.searchkey : "";
      this.$store.dispatch("topic/getTopicList", {
        searchkey
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let _this = this;
        this.queryUserListByParams({ searchkey: query, group: "1" });
      } else {
        this.selectUserList = [];
      }
    },
    queryUserListByParams(params = {}) {
      let _this = this;
      regUserList(params)
        .then(result => {
          let specialList = result.data.docs;
          if (specialList) {
            _this.selectUserList = specialList.map(item => {
              return {
                value: item._id,
                label: item.userName
              };
            });
            _this.loading = false;
          } else {
            _this.selectUserList = [];
          }
        })
        .catch(err => {
          console.log(err);
          _this.selectUserList = [];
        });
    },
    changeUserOptions(value) {
      this.$store.dispatch("topic/getTopicList", { userId: value });
    },
    changePostOptions(value) {
      if (value == "0") {
        this.$store.dispatch("topic/getTopicList");
      } else if (value == "1") {
        this.$store.dispatch("topic/getTopicList", { state: "1" });
      }
    }
    // TOPBARLEFTOPTION
  },
  components: {}
};
</script>
<style lang="scss">
</style>
