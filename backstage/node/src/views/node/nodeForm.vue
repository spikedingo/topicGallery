<template>
  <div :class="classObj" class="dr-nodeForm">
    <div class="main-container">
      <el-form
        :model="formState.formData"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="device == 'mobile' ? 'top' : 'right'"
      >
        <el-form-item :label="$t('nodes.enable')" prop="state">
          <el-select size="small" v-model="formState.formData.state" placeholder="选择节点状态">
            <el-option
              v-for="item in nodeState"
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

        <el-form-item label="节点标题" prop="title">
          <el-input size="small" v-model="formState.formData.title"></el-input>
        </el-form-item>

        <el-form-item label="节点正文" prop="content">
          <el-input size="small" type="textarea" v-model="formState.formData.content"></el-input>
        </el-form-item>

        <el-form-item label="正文预览">
          <div v-html="coloredContent"></div>
        </el-form-item>

        <el-form-item label="题目预览">
          <div class="puzzle-div" v-html="formState.formData.puzzleContent || '暂无预览'"></div>
        </el-form-item>

        <el-form-item label="题目关键字" prop="keywords">
          <!-- <el-input size="small" v-model="formState.formData.keywords"></el-input> -->
          <el-select
            size="small"
            v-model="formState.formData.keywords"
            multiple
            filterable
            allow-create
            @change="handleKeywordChange"
            placeholder="输入关键字"
          >
            <el-option
              v-for="item in formState.formData.keywords"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="知识点重要性" prop="rank">
          <el-radio-group v-model="formState.formData.rank">
            <el-radio :label="1">重要性一般</el-radio>
            <el-radio :label="2">重要性中等</el-radio>
            <el-radio :label="3">十分重要</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="标签" prop="tags">
          <el-select
            size="small"
            v-model="formState.formData.tags"
            multiple
            filterable
            allow-create
            :placeholder="$t('validate.selectNull', {label: this.$t('nodes.tags')})"
          >
            <el-option
              v-for="item in contentTagList.docs"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item class="upSimg" :label="$t('nodes.sImg')" prop="sImg">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/files"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :data="{action:'uploadimage'}"
          >
            <img v-if="formState.formData.sImg" :src="formState.formData.sImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button size="mini" @click="getRandomNodeImg()" class="refresh-btn" plain round>
            <svg-icon icon-class="reload" />
          </el-button>
        </el-form-item> -->
        <el-form-item :label="$t('nodes.discription')" prop="discription">
          <el-input size="small" type="text" v-model="formState.formData.discription"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('nodes.comments')" prop="comments">
          <vue-ueditor-wrap
            class="editorForm"
            @ready="editorReady"
            v-model="formState.formData.comments"
            :config="editorConfig"
          ></vue-ueditor-wrap>
        </el-form-item> -->

        <el-form-item class="dr-submitNode">
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

<style lang="scss">
.edui-default .edui-toolbar {
  line-height: 20px !important;
}
.dr-nodeForm {
  padding: 20px;
  .post-rate {
    .el-rate {
      margin-top: 10px;
    }
  }
  .dr-submitNode {
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
}
</style>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";
import { initEvent } from "@root/publicMethods/events";
import {
  getOneNode,
  addNode,
  updateNode,
  getRandomNodeImg,
  regUserList
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
      nodeState: [
        { value: "2", label: "启用" },
        { value: "3", label: "停用" }
      ],
      selectUserList: [],
      loading: false,
      userLoading: false,
      content: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      },
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
              label: this.$t("nodes.categories")
            }),
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            message: this.$t("validate.inputNull", {
              label: this.$t("nodes.title")
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
              label: this.$t("nodes.tags")
            }),
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (_.isEmpty(value)) {
                callback(
                  new Error(
                    this.$t("validate.selectNull", {
                      label: this.$t("nodes.tags")
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
              label: this.$t("nodes.comments")
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
    VueUeditorWrap
  },
  methods: {
    // changeTargetUser(value) {
    //   let targetUserInfo = _.filter(this.selectUserList, item => {
    //     return item.value == value;
    //   });
    //   if (!_.isEmpty(targetUserInfo)) {
    //     localStorage.setItem(
    //       "nodeAuthor",
    //       JSON.stringify(targetUserInfo[0])
    //     );
    //   }
    // },
    // queryUserListByParams(params = {}) {
    //   let _this = this;
    //   regUserList(params)
    //     .then(result => {
    //       let specialList = result.data.docs;
    //       if (specialList) {
    //         _this.selectUserList = specialList.map(item => {
    //           return {
    //             value: item._id,
    //             label: item.userName
    //           };
    //         });
    //         _this.userLoading = false;
    //       } else {
    //         _this.selectUserList = [];
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       _this.selectUserList = [];
    //     });
    // },
    // getRandomNodeImg(params = {}) {
    //   let _this = this;
    //   getRandomNodeImg(params)
    //     .then(result => {
    //       if (result.status == 200 && result && result.data) {
    //         let randomImg = result.data[0];
    //         let initFormData = Object.assign({}, this.formState.formData, {
    //           sImg: randomImg
    //         });
    //         // 保留原有指定作者
    //         let oldUauthor = localStorage.getItem("nodeAuthor");
    //         if (oldUauthor) {
    //           let targetUser = JSON.parse(oldUauthor);
    //           this.queryUserListByParams({
    //             searchkey: targetUser.label
    //           });
    //           Object.assign(initFormData, { targetUser: targetUser.value });
    //         }
    //         this.$store.dispatch("node/showNodeForm", {
    //           formData: initFormData
    //         });
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // checkFlashPost(currentType) {
    //   this.$store.dispatch("node/showNodeForm", {
    //     edit: this.formState.edit,
    //     formData: Object.assign({}, this.formState.formData, {
    //       type: currentType ? "2" : "1"
    //     })
    //   });
    // },
    // inputEditor(value) {
    //   this.$store.dispatch("node/showNodeForm", {
    //     edit: this.formState.edit,
    //     formData: Object.assign({}, this.formState.formData, {
    //       markDownComments: value
    //     })
    //   });
    // },
    // changeEditor(value) {
    //   console.log(value);
    // },
    getLocalNodes() {
      let localNode = localStorage.getItem("addNode") || "";
      if (localNode) {
        return JSON.parse(localNode);
      } else {
        return {};
      }
    },

    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === "image/jpeg";
    //   const isPNG = file.type === "image/png";
    //   const isGIF = file.type === "image/gif";
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isJPG && !isPNG && !isGIF) {
    //     this.$message.error(this.$t("validate.limitUploadImgType"));
    //   }
    //   if (!isLt2M) {
    //     this.$message.error(
    //       this.$t("validate.limitUploadImgSize", { size: 2 })
    //     );
    //   }
    //   return (isJPG || isPNG || isGIF) && isLt2M;
    // },
    handleChangeCategory(value) {
      console.log(value);
    },
    handleSort() {
      return (a,b) => {
        var value1 = a.index;
        var value2 = b.index;
        return value1 - value2
      }
    },
    handleKeywordChange(keywords) {
      console.log(keywords, 'keywords of changing')
      if (!this.formState.formData.content) {
        this.$message({
          message:"请先输入节点正文",
          type: "warning"
        });
        // this.$message.warn('请先输入节点正文')
        this.formState.formData.keywords = []
        return false
      }

      let currentContent = this.formState.formData.content

      const numedKeywords = keywords.map((x, i) => {
        if (currentContent.indexOf(x) == -1) {
          this.$message({
            message:"题目正文内无该关键字",
            type: "warning"
          });
          return {keyword: x, index: 0}
        } else {
          console.log(currentContent.indexOf(x), 'check index')
          return {
            keyword: x, 
            index: currentContent.indexOf(x) + 1
          }
        }
      })
      const filteredKeywords = numedKeywords.filter(x => x.index > 0)

      console.log(filteredKeywords, 'filteredKeywords')
      if (filteredKeywords.length === 0) {
        this.formState.formData.keywords = []
        return false
      }

      const sortedKeywords = filteredKeywords.sort(this.handleSort())
      console.log(sortedKeywords, 'sortedKeywords')

      const finalKeywords = sortedKeywords.map(x => x.keyword)

      this.formState.formData.keywords = finalKeywords
    },

    backToList() {
      this.$router.push(this.$root.adminBasePath + "/node");
    },
    submitForm(formName, type = "") {
      console.log(this.formState.formData)

      this.$refs[formName].validate(valid => {
        if (!this.formState.formData.discription) {
          this.formState.formData.discription = this.formState.formData.title
        }

        if (valid) {
          let params = Object.assign({}, this.formState.formData);
          // 更新
          if (this.formState.edit) {
            updateNode(params).then(result => {
              if (result.status === 200) {
                this.$router.push(this.$root.adminBasePath + "/node");
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
            addNode(params).then(result => {
              if (result.status === 200) {
                // this.$router.push(this.$root.adminBasePath + "/node");
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
    ...mapGetters(["topicCategoryList"]),
    formState() {
      return this.$store.getters.nodeFormState;
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
    }
  },
  mounted() {
    initEvent(this);
    // 针对手动页面刷新
    let _this = this;
    if (this.$route.params.id) {
      getOneNode({ id: this.$route.params.id }).then(result => {
        if (result.status === 200) {
          if (result.data) {
            let nodeObj = result.data,
            categoryIdArr = []
              // tagsArr = [];

            if (nodeObj.categories) {
              nodeObj.categories.map((item, index) => {
                item && categoryIdArr.push(item._id);
              });
              nodeObj.categories = categoryIdArr;
            }

            // if (nodeObj.keywords) {
            //   nodeObj.keywords = nodeObj.keywords.join();
            // }

            this.$store.dispatch("node/showNodeForm", {
              edit: true,
              formData: nodeObj
            });
          } else {
            this.$message({
              message: this.$t("validate.error_params"),
              type: "warning",
              onClose: () => {
                this.$router.push(this.$root.adminBasePath + "/node");
              }
            });
          }
        } else {
          this.$message.error(result.message);
        }
      });
    } else {
      let localNode = this.getLocalNodes();
      if (!_.isEmpty(localNode)) {
        this.$confirm(
          this.$t("main.askForReInputNode"),
          this.$t("main.scr_modal_title"),
          {
            confirmButtonText: this.$t("main.confirmBtnText"),
            cancelButtonText: this.$t("main.cancelBtnText"),
            type: "warning"
          }
        )
          .then(() => {
            // let currentComments = localNode.comments || "";
            // _this.$refs.ueditor.setNode(currentComments);
            // 清除缓存
            localStorage.removeItem(this.$route.path.split("/")[1]);
            this.$store.dispatch("node/showNodeForm", {
              edit: false,
              formData: localNode
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
        // this.getRandomNodeImg();
      }
    }
    this.$store.dispatch("topicCategory/getTopicCategoryList");
    // this.$store.dispatch("contentTag/getContentTagList", {
    //   pageSize: 200
    // });
  }
};
</script>

<style>
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
</style>
