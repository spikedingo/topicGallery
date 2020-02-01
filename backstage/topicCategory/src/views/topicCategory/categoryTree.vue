<template>
  <el-tree
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    :render-content="renderContent"
  ></el-tree>
</template>

<script>
import {
  deleteTopicCategory,
  getOneTopicCategory
} from "@/api/topicCategory";

import _ from "lodash";
export default {
  props: {
    treeData: Array
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },

  methods: {
    append(store, data) {
      let formData = {};
      formData.parentId = data._id;
      formData.parentObj = data;
      this.$store.dispatch("topicCategory/showTopicCategoryForm", {
        edit: false,
        type: "children",
        formData: formData
      });
    },

    edit(store, data) {
      let rowData = data;
      getOneTopicCategory({ id: rowData._id })
        .then(result => {
          if (result.status === 200) {
            let categoryInfo = result.data;
            if (!_.isEmpty(categoryInfo)) {
              this.$store.dispatch("topicCategory/showTopicCategoryForm", {
                edit: true,
                type: "children",
                formData: _.assign({}, categoryInfo, {
                  contentTemp: !_.isEmpty(categoryInfo.contentTemp)
                    ? categoryInfo.contentTemp._id
                    : ""
                })
              });
            }
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
    },

    remove(store, data) {
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
          return deleteTopicCategory({
            ids: data._id
          });
        })
        .then(result => {
          if (result.status === 200) {
            this.$store.dispatch("topicCategory/getTopicCategoryList");
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
    },

    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span style="float: right; margin-right: 20px">
            <el-button type="text" on-click={() => this.append(store, data)}>
              <svg-icon icon-class="icon_add" />
            </el-button>
            <el-button type="text" on-click={() => this.edit(store, data)}>
              <svg-icon icon-class="edit" />
            </el-button>
            <el-button type="text" on-click={() => this.remove(store, data)}>
              <svg-icon icon-class="icon_delete" />
            </el-button>
          </span>
        </span>
      );
    }
  }
};
</script>