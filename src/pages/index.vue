<template>
  <div>
    <diy :imgList="imgList"></diy>
  </div>
</template>
<script>
  import diy from '@/components/diy1/diy'

  export default {
    data() {
      return {
        imgList: ['http://imgsrc.baidu.com/imgad/pic/item/267f9e2f07082838b5168c32b299a9014c08f1f9.jpg',
          'http://img06.tooopen.com/images/20160712/tooopen_sy_170083325566.jpg',
          'http://img06.tooopen.com/images/20160712/tooopen_sy_170083325566.jpg',
          'http://img06.tooopen.com/images/20160712/tooopen_sy_170083325566.jpg',
          'http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg']
      }
    },
    components: {
      diy
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div {
    width: 100%;
    height: 100vh;
  }
</style>
