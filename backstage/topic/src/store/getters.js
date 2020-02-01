const getters = {
  topicFormState: state => state.topic.formState,
  topicList: state => state.topic.topicList,
  addNodeFormState: state => state.node.formState,
  topicCategoryList: state => state.topicCategory.categoryList,
  nodeList: state => state.node.nodeList,
  // contentTagList: state => state.contentTag.tagList,
}
export default getters