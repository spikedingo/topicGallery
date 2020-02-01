<template>
  <div :class="classObj" class="dr-topicForm">
    <div class="main-container">
      <div v-if="addNodeFormState.visible">
        <AddNode 
          :formState="addNodeFormState" 
          :rank="formState.formData.rank" 
          :categories="formState.formData.categories"
          :targetId="targetNodeId"
          @onAddedNode="onAddedNode"
          @onCancel="hideAddNode"
        />
      </div>

      <el-form
        :model="formState.formData"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="device == 'mobile' ? 'top' : 'right'"
      >
        <el-form-item :label="$t('topics.enable')" prop="state">
          <el-select size="small" v-model="formState.formData.state" placeholder="选择节点状态">
            <el-option
              v-for="item in topicState"
              :key="'kw_'+item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属章节" prop="categories">
          <el-cascader
            size="small"
            style="width: 500px;"
            expandTrigger="hover"
            :options="topicCategoryList.docs"
            v-model="formState.formData.categories"
            @change="handleChangeCategory"
            :props="categoryProps"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="题目标题" prop="title">
          <el-input size="small" v-model="formState.formData.title"></el-input>
        </el-form-item>

        <el-form-item label="知识点重要性" prop="rank">
          <el-radio-group v-model="formState.formData.rank">
            <el-radio :label="1">重要性一般</el-radio>
            <el-radio :label="2">重要性中等</el-radio>
            <el-radio :label="3">十分重要</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="关联节点" prop="nodes">
          <el-select
            v-model="selectedNodeIdTemp"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键字搜索节点"
            :remote-method="remoteNodeMethod"
            :loading="loading"
            @change="nodeSelected"
          >
            <el-option
              v-for="item in selectNodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>

          <el-button style="margin-left: 20px;" size="small" type="primary" plain @click="showAddNode" round>
            <svg-icon icon-class="icon_add" />
          </el-button>

          <ul class="node-list">
            <li :key="node.title" v-for="node in currentNodeList">
              {{node.title}}
              <span style="float: right;">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  round
                  @click="showEditNode(node)"
                >
                  <svg-icon icon-class="edit" />
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  round
                  @click="deleteNodeFromTopic(node)"
                >
                  <svg-icon icon-class="icon_delete" />
                </el-button>
              </span>
            </li>
          </ul>
        </el-form-item>

        <el-form-item label="题目关键字" prop="keywords">
          <el-select
            :disabled="true"
            style="width: 500px;"
            size="small"
            :value="keywords"
            multiple
            filterable
            allow-create
            placeholder="输入关键字"
          >
            <el-option
              v-for="item in keywords"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="题目描述" prop="discription">
          <el-input size="small" type="text" v-model="formState.formData.discription"></el-input>
        </el-form-item>

        <el-form-item class="dr-submitTopic">
          <el-button
            size="medium"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{formState.edit ? $t('main.form_btnText_update') : $t('main.form_btnText_save')}}</el-button>
          <el-button size="medium" @click="backToList">{{$t('main.back')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import AddNode from "./addNode.vue";
import { initEvent } from "@root/publicMethods/events";
import {
  getOneTopic,
  addTopic,
  updateTopic
} from "@/api/topic";
import {
  nodeList
} from "@/api/node";

import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    groups: Array
  },
  data() {
    return {
      sidebarOpened: true,
      device: "desktop",
      topicState: [
        { value: "2", label: "启用" },
        { value: "3", label: "停用" }
      ],
      targetNodeId: '',
      selectedNodeIdTemp: [],
      selectNodeList: [],
      loading: false,
      userLoading: false,
      currentNodeList: [],
      content: "",
      categoryProps: {
        value: "_id",
        label: "name",
        children: "children"
      },
      currentType: "1",
      rules: {
        categories: [
          {
            required: true,
            message: this.$t("validate.selectNull", {
              label: this.$t("topics.categories")
            }),
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("topics.title")
            }),
            trigger: "blur"
          },
          {
            min: 2,
            max: 50,
            message: this.$t("validate.rangelength", { min: 2, max: 50 }),
            trigger: "blur"
          }
        ],
        tags: [
          {
            required: false,
            message: this.$t("validate.inputNull", {
              label: this.$t("topics.tags")
            }),
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (_.isEmpty(value)) {
                callback(
                  new Error(
                    this.$t("validate.selectNull", {
                      label: this.$t("topics.tags")
                    })
                  )
                );
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        comments: [
          {
            required: false,
            message: this.$t("validate.inputNull", {
              label: this.$t("topics.comments")
            }),
            trigger: "blur"
          },
          {
            min: 5,
            message: this.$t("validate.rangelength", { min: 5, max: 100000 }),
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    AddNode
  },
  methods: {
    // 搜索节点方法
    remoteNodeMethod(query) {
      if (query !== "") {
        this.nodeLoading = true;
        let _this = this;
        this.queryNodeByParams({ searchkey: query });
      } else {
        this.selectNodeList = [];
      }
    },
    // 执行搜索节点动作
    queryNodeByParams(params = {}) {
      let _this = this;
      nodeList(params)
        .then(result => {
          let nodeList = result.data.docs;
          if (nodeList) {
            _this.selectNodeList = nodeList.map(item => {
              return {
                value: item._id,
                label: item.title,
                ...item
              };
            });
            _this.userLoading = false;
          } else {
            _this.selectNodeList = [];
          }
        })
        .catch(err => {
          console.log(err);
          _this.selectNodeList = [];
        });
    },
    // 选择节点后的处理
    nodeSelected(nodeId) {
      const node = this.selectNodeList.filter(x => x.id == nodeId)[0]

      if (node) {
        this.selectedNodeIdTemp = []
        this.onAddedNode(node)
      }
    },
    // 将选择的节点储存到对应字段，并显示在页面上
    onAddedNode(node) {
      console.log(node, 'current adding node')
      if (!this.currentNodeList.filter(x => x._id == node._id).length) {
        this.currentNodeList = [...this.currentNodeList, node]
      } else {
        this.$message({
          message:"该节点已存在",
          type: "warning"
        });
        this.currentNodeList = this.currentNodeList.map(x => {
          if (x._id === node._id) {
            return node
          } else {
            return x
          }
        })
      }
    },
    // 取消选择对应节点
    deleteNodeFromTopic(node) {
      console.log(node, 'node of topic for delete')
      this.currentNodeList = this.currentNodeList.filter(x => {
        return x._id !== node._id;
      })
    },

    /* 操作添加节点弹窗部分 */
    // 打开添加节点弹窗
    showAddNode() {
      if (this.formState.formData.rank && this.formState.formData.categories) {
        this.$store.dispatch("node/showAddNodeForm");
      } else {
        this.$message({
          message:"请先选择重要性及所属章节",
          type: "warning"
        });
      }
    },
    // 打开编辑节点弹窗
    showEditNode(node) {
      console.log(node._id, 'step 1 check id')
      this.targetNodeId = node._id;
      this.$store.dispatch("node/showAddNodeForm");
    },
    // 隐藏节点弹窗
    hideAddNode() {
      this.targetNodeId = '',
      this.$store.dispatch("node/hideAddNodeForm");
    },

    getLocalTopics() {
      let localTopic = localStorage.getItem("addTopic") || "";
      if (localTopic) {
        return JSON.parse(localTopic);
      } else {
        return {};
      }
    },
    handleChangeCategory(value) {
      console.log(value);
    },

    backToList() {
      this.$router.push(this.$root.adminBasePath + "/topic");
    },
    // 提交创建题目表单
    submitForm(formName, type = "") {
      console.log(this.formState.formData)
      this.$refs[formName].validate(valid => {
        if (!this.formState.formData.discription) {
          this.formState.formData.discription = this.formState.formData.title
        }

        if (valid) {
          let params = Object.assign({}, this.formState.formData);
          params.nodes = this.currentNodeList.map(x => x._id)
          params.keywords = this.keywords; 

          console.log(params, 'check params')
          // 更新
          if (this.formState.edit) {
            updateTopic(params).then(result => {
              if (result.status === 200) {
                this.$router.push(this.$root.adminBasePath + "/topic");
                this.$message({
                  message: this.$t("main.updateSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            });
          } else {
            // 新增
            addTopic(params).then(result => {
              if (result.status === 200) {
                this.$router.push(this.$root.adminBasePath + "/topic");
                this.$message({
                  message: this.$t("main.addSuccess"),
                  type: "success"
                });
              } else {
                this.$message.error(result.message);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {
    ...mapGetters(["nodeList", "topicCategoryList", "addNodeFormState"]),
    formState() {
      return this.$store.getters.topicFormState;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebarOpened,
        openSidebar: this.sidebarOpened,
        withoutAnimation: "false",
        mobile: this.device === "mobile"
      };
    },
    coloredContent() {
      let currentContent = this.formState.formData.content
      let currentKeywords = this.formState.formData.keywords

      if (currentKeywords.length) {
        let coloredContent = currentKeywords.reduce((s, x, i)=>{
          console.log(s, x, 'check keyword')
          return s.split(x).join(`<span>${x}</span>`)
        }, currentContent)

        let puzzleContent = currentKeywords.reduce((s, x, i)=>{
          return s.split(x).join(`{ ${i+1} }`)
        }, currentContent)

        this.formState.formData.puzzleContent = puzzleContent
        return `<div class="color-div">${coloredContent}</div>`
      } else {
        this.formState.formData.puzzleContent = currentContent
        return `<div class="color-div">${currentContent || '暂无预览'}</div>`
        // return this.formState.formData.content
      }
      // return this.formState.formData.content
    },
    keywords() {
      if (this.currentNodeList.length) {
        return Array.from(new Set(this.currentNodeList.reduce((s,x,i) => {
          return [...s, ...x.keywords]
        }, [])))
      }
    }
  },
  mounted() {
    initEvent(this);
    // 针对手动页面刷新
    let _this = this;
    if (this.$route.params.id) {
      getOneTopic({ id: this.$route.params.id }).then(result => {
        if (result.status === 200) {
          if (result.data) {
            let topicObj = result.data,
            categoryIdArr = []
              // tagsArr = [];

            if (topicObj.categories) {
              topicObj.categories.map((item, index) => {
                item && categoryIdArr.push(item._id);
              });
              topicObj.categories = categoryIdArr;
            }

            if (topicObj.nodeResults.length) {
              topicObj.nodes = topicObj.nodeResults.map(x => x._id)
              // this.selectNodeList = topicObj.nodeResults.map(x => {
              //   return {
              //     value: x._id,
              //     label: x.title,
              //     ...x                  
              //   }
              // })
              this.currentNodeList = topicObj.nodeResults
            }

            this.$store.dispatch("topic/showTopicForm", {
              edit: true,
              formData: topicObj
            });
          } else {
            this.$message({
              message: this.$t("validate.error_params"),
              type: "warning",
              onClose: () => {
                this.$router.push(this.$root.adminBasePath + "/topic");
              }
            });
          }
        } else {
          this.$message.error(result.message);
        }
      });
    } else {
      let localTopic = this.getLocalTopics();
      if (!_.isEmpty(localTopic)) {
        this.$confirm(
          this.$t("main.askForReInputTopic"),
          this.$t("main.scr_modal_title"),
          {
            confirmButtonText: this.$t("main.confirmBtnText"),
            cancelButtonText: this.$t("main.cancelBtnText"),
            type: "warning"
          }
        )
          .then(() => {
            // let currentComments = localTopic.comments || "";
            // _this.$refs.ueditor.setTopic(currentComments);
            // 清除缓存
            localStorage.removeItem(this.$route.path.split("/")[1]);
            this.$store.dispatch("topic/showTopicForm", {
              edit: false,
              formData: localTopic
            });
          })
          .catch(() => {
            localStorage.removeItem(this.$route.path.split("/")[1]);
            this.$message({
              type: "info",
              message: this.$t("main.scr_modal_del_error_info")
            });
          });
      } else {
      }
    }

    this.queryNodeByParams()
    this.$store.dispatch("topicCategory/getTopicCategoryList");
  }
};
</script>


<style lang="scss">
.edui-default .edui-toolbar {
  line-height: 20px !important;
}
.dr-topicForm {
  padding: 20px;
  .post-rate {
    .el-rate {
      margin-top: 10px;
    }
  }
  .dr-submitTopic {
    position: fixed;
    z-index: 9999999;
    padding: 10px 30px;
    text-align: right;
    right: 0;
    bottom: 0;
    background: none;
    margin-bottom: 0;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 150px;
    line-height: 150px !important;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 158px;
    display: block;
  }

  .upSimg {
    position: relative;
    .refresh-btn {
      position: absolute;
      left: 220px;
      top: 0;
      i {
        // color: #dcdfe6;
        font-weight: 400;
      }
    }
  }

  .node-list {
    li {
      list-style: none;
    }
    li:hover {
      color: #409eff;
      cursor: pointer;
    }
    li+li {
      border-top: 1px solid rgb(189, 189, 189);
    }
  }

  .color-div {
    padding: 10px;
    background: #e5e5e5;
    border-radius: 5px;
    font-size: 18px;
  }
  .color-div span {
    color: hotpink;
  }
  .puzzle-div {
    padding: 10px;
    background: #f1f1f1;
    border-radius: 5px;
    font-size: 18px;
    color: cornflowerblue;
  }
}
</style>
