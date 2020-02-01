const getters = {
  nodeFormState: state => state.node.formState,
  nodeList: state => state.node.nodeList,
  directUserFormState: state => state.node.directUser.formState,
  topicCategoryList: state => state.topicCategory.categoryList,
  // contentTagList: state => state.contentTag.tagList,
}
export default getters