<template>
  <div>
    <el-table
      align="center"
      v-loading="loading"
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleTopicSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- <el-table-column prop="isTop" :label="$t('topics.rec')" width="55" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon
            :style="yellow"
            v-show="scope.row.isTop === 1"
            @click="topTopic(scope.$index, dataList)"
            icon-class="icon_star_fill"
          />
          <svg-icon
            :style="gray"
            v-show="scope.row.isTop != 1"
            @click="topTopic(scope.$index, dataList)"
            icon-class="icon_star"
          />
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="roofPlacement"
        :label="$t('topics.roofPlacement')"
        width="55"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <svg-icon
            :style="green"
            v-show="scope.row.isTop === 1 && scope.row.roofPlacement == 1"
            @click="roofTopic(scope.$index, dataList)"
            icon-class="icon_ping"
          />
          <svg-icon
            :style="gray"
            v-show="scope.row.isTop === 1 && scope.row.roofPlacement != 1"
            @click="roofTopic(scope.$index, dataList)"
            icon-class="icon_ding"
          />
        </template>
      </el-table-column> -->
      <el-table-column prop="title" :label="$t('topics.title')" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.state =='2'">
            <a :href="'/details/'+scope.row._id+'.html'" target="_blank">{{scope.row.title}}</a>
          </div>
          <div v-else>{{scope.row.title}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="categories"
        :label="$t('topics.categories')"
        show-overflow-tooltip
        width="250"
      >
        <template slot-scope="scope">
          <span>{{(scope.row.categories&&scope.row.categories[0])?scope.row.categories[0].name:''}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="author.name" :label="$t('topics.author')" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{scope.row.uAuthor?scope.row.uAuthor.userName:(scope.row.author?scope.row.author.userName:'')}}</template>
      </el-table-column> -->


      <!-- <el-table-column prop="tags" :label="$t('topics.tags')" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-for="tag in scope.row.tags" :key="tag._id">{{tag.name+','}}</span>
        </template>
      </el-table-column> -->

      <el-table-column prop="clickNum" :label="$t('topics.clickNum')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="execTimes" label="测试数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="correctRate" label="通过率" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.correctRate.length ? `${(scope.row.correctRate.filter(x => x).length / scope.row.correctRate.length) * 100}/%` : '未练习' }}</template>
      </el-table-column>
      <el-table-column prop="updateDate" :label="$t('topics.updateDate')" width="180">
        <template slot-scope="scope">{{scope.row.updateDate}}</template>
      </el-table-column>
      <el-table-column prop="state" :label="$t('topics.enable')" show-overflow-tooltip>
        <template slot-scope="scope">
          <svg-icon v-show="scope.row.state=='2'" :style="green" icon-class="check-circle-fill" />
          <svg-icon v-show="scope.row.state!='2'" :style="red" icon-class="minus-circle-fill" />
        </template>
      </el-table-column>

      <el-table-column :label="$t('main.dataTableOptions')" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            round
            @click="editTopicInfo(scope.$index, dataList)"
          >
            <svg-icon icon-class="edit" />
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            round
            @click="deleteTopic(scope.$index, dataList)"
          >
            <svg-icon icon-class="icon_delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss">
.fa-star,
.fa-thumbs-up {
  cursor: pointer;
}

.fa-star-o,
.fa-thumbs-o-up {
  cursor: pointer;
}
</style>
<script>
import { deleteTopic, roofTopic, updateTopicToTop } from "@/api/topic";
import _ from "lodash";
export default {
  props: {
    dataList: Array,
    pageInfo: Object
  },
  data() {
    return {
      loading: false,
      multipleSelection: [],
      yellow: {
        color: "#F7BA2A"
      },
      gray: {
        color: "#CCC"
      },
      green: { color: "#13CE66" },
      red: { color: "#FF4949" }
    };
  },

  methods: {
    handleTopicSelectionChange(val) {
      if (val && val.length > 0) {
        let ids = val.map((item, index) => {
          return item._id;
        });
        this.multipleSelection = ids;
        this.$emit("changeTopicSelectList", ids);
      }
    },
    editTopicInfo(index, rows) {
      let rowData = rows[index];
      this.$router.push(
        this.$root.adminBasePath + "/topic/editTopic/" + rowData._id
      );
    },
    topTopic(index, rows) {
      let topicData = rows[index];
      let targetParams = {
        _id: topicData._id,
        isTop: topicData.isTop == 1 ? 0 : 1
      };
      updateTopicToTop(targetParams).then(result => {
        if (result.status === 200) {
          this.$store.dispatch("topic/getTopicList", this.pageInfo);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    roofTopic(index, rows) {
      let topicData = rows[index];
      // 推荐的才允许置顶
      if (topicData.isTop != 1) {
        return false;
      }
      let targetParams = {
        _id: topicData._id,
        roofPlacement: topicData.roofPlacement == "1" ? "0" : "1"
      };
      roofTopic(targetParams).then(result => {
        if (result.status === 200) {
          this.$store.dispatch("topic/getTopicList", this.pageInfo);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    deleteTopic(index, rows) {
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
          return deleteTopic({
            ids: rows[index]._id
          });
        })
        .then(result => {
          if (result.status === 200) {
            Object.assign(this.pageInfo);
            this.$store.dispatch("topic/getTopicList", this.pageInfo);
            this.$message({
              message: this.$t("main.scr_modal_del_succes_info"),
              type: "success"
            });
          } else {
            this.$message.error(result.message);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("main.scr_modal_del_error_info")
          });
        });
    }
  },
  computed: {}
};
</script>
