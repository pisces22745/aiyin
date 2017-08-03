<template>
  <div class="diy-wrapper">
    <div class="diy" id="diy1">
      <div class="diy-view">
        <div class="diy-view-white"></div>
      </div>
      <div class="diy-modify">
        <!--zc zoom control 缩放控制-->
      </div>
      <div class="diy-model-view"></div>
    </div>
    <div class="toolbar">
      <div class="wrapper">
        <div class="title">图片</div>
        <ul>
          <li v-for="item in imgList">
            <div class="img">
              <img :src="item"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        imgList: ['http://imgsrc.baidu.com/imgad/pic/item/267f9e2f07082838b5168c32b299a9014c08f1f9.jpg',
          'http://img06.tooopen.com/images/20160712/tooopen_sy_170083325566.jpg',
          'http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg']
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../../style/diy_template.css";

  .diy-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: dodgerblue;
    .diy {
      position: relative;
      width: 500px;
      height: 500px;
      top: 50%;
      left: 50%;
      margin: -250px auto auto -250px;
      overflow: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .diy-view,
      .diy-modify {
        position: absolute;
      }
      .diy-view {
        z-index: 1;
        overflow: hidden;
        .diy-view-white {
          position: absolute;
          width: 100%;
          height: 100%;
          /*background-color: #fff;*/
        }
        img {
          position: absolute;
        }
      }
      .diy-modify {
        z-index: 3;
        background-color: transparent;
        border-color: rgba(200, 200, 200, 0.3);
        .zc {
          position: absolute;
          cursor: move;
          &.active {
            border: 1px dashed #1e90ff;
            .zc-handle {
              width: 6px;
              height: 6px;
              border: 2px solid rgba(255, 255, 255, .6);
              &.rotate:after {
                width: 1px;
                height: 28px;
              }
            }
          }
          .zc-handle {
            position: absolute;
            border-radius: 50%;
            background-color: #1e90ff;
            &.tl {
              top: -5px;
              left: -5px;
              cursor: nw-resize;
            }
            &.tr {
              top: -5px;
              right: -5px;
              cursor: ne-resize;
            }

            &.bl {
              bottom: -5px;
              left: -5px;
              cursor: sw-resize;
            }

            &.br {
              bottom: -5px;
              right: -5px;
              cursor: se-resize;
            }
            &.rotate {
              top: -30px;
              left: 50%;
              /*cursor: all-scroll;*/
              cursor: crosshair;
              &:after {
                content: '';
                position: absolute;
                top: 0;
                left: 2px;
                background-color: #1e90ff;
              }
            }
          }
        }
      }
      .diy-model-view {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        margin-left: -250px;
        margin-top: -250px;
        width: 500px;
        height: 500px;
      }
    }
    .toolbar {
      position: fixed;
      top: 15px;
      left: 15px;
      bottom: 15px;
      width: 100px;
      padding: 10px;
      background-color: rgba(255, 255, 255, .8);
      /*overflow: scroll;*/
      .wrapper {
        .title {
          text-align: center;
          padding: 10px 0;
        }
        ul {
          li {
            img {
              display: block;
              max-width: 100%;
              max-height: 100%;
              margin-bottom: 10px;
              cursor: pointer;
            }
          }
        }

      }
    }
  }


</style>
