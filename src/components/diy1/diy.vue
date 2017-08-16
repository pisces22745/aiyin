<template>
  <div class="diy-wrapper">
    <div class="diy" id="diy1">
      <div class="diy-view">
        <div class="diy-view-color"></div>
        <img v-for="(item,index) in diyImgList" :src="item.src" :class="item.classname"
             :data-id="item.classname"/>
      </div>
      <div class="diy-modify">
        <!--zc zoom control 缩放控制-->
        <div v-for="(item,index) in diyImgList" :class="['zc',item.classname,{'active': active==index}]"
             :data-id="'layer'+index">
          <div class="zc-handle rotate"></div>
          <div class="zc-handle delete" @click="deleteImgToDiy(item)"></div>
          <div class="zc-handle scale"></div>
        </div>
      </div>
      <div class="diy-model-view"></div>
    </div>
    <div class="toolbar">
      <div class="wrapper">
        <div class="title">图片</div>
        <div class="content">
          <ul>
            <li v-for="item in imgList">
              <div class="img">
                <img :src="item" @click="addImgToDiy(item)"/>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="wrapper">
        <div class="title">颜色</div>
        <div class="content">
          <colorPicker v-model="color"></colorPicker>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import colorPicker from '../colorPicker/colorPicker.vue'

  export default {
    props: {
      imgList: [Array]
    },
    data() {
      return {
        count: 0,
        color: '',
        diyImgList: [],
        active: -1
      }
    },
    watch: {
      color: function (val, oldval) {
        $('.diy-view-color').css('background-color', val)
      }
    },
    methods: {
      beforeDiy: function () {
        let _this = this
        this.moveImg()
        $('body').delegate('.scale', 'mousedown', function (e) {
          e.preventDefault()
          let $zc = $(this).parent()
          let dataId = $zc.attr('data-id')
          let startStatus = {
            left: $zc.position().left,
            top: $zc.position().top,
            width: $zc.width(),
            height: $zc.height(),
            x: e.pageX,
            y: e.pageY
          }
          $('body').on('mousemove', function (e) {
            e.preventDefault()
            _this.scale(dataId, startStatus, e)
          })
        }).delegate('.rotate', 'mousedown', function (e) {
          e.stopPropagation()
          let $zc = $(this).parent()
          let dataId = $zc.attr('data-id')
          $('body').on('mousemove', function (e) {
            e.preventDefault()
            _this.rotate(this, dataId)
          })
        }).on('mouseup', function (e) {
          e.preventDefault()
          $('body').off('mousemove')
        })

        $('.wrapper .title').on('click', function (e) {
          e.preventDefault()
          $(this).siblings('.content').slideToggle(200)
        })
      },
      addImgToDiy: function (src) {
        let _this = this
        this.active++
        this.diyImgList.push({
          src: src,
          classname: 'layer' + this.active
        })
        setTimeout(function () {
          _this.resetImgSize($('.layer' + _this.active))
        }, 10)
      },
      deleteImgToDiy: function (item) {
        this.active--
        let index = this.diyImgList.indexOf(item)
        if (index > -1) {
          this.diyImgList.splice(index, 1)
        }
      },
      activation: function (dataId) {
        $('.zc').removeClass('active')
        $('.zc[data-id=' + dataId + ']').addClass('active')
      },
      moveImg: function () {
        let _this = this
        $('body').delegate('.zc', 'mousedown', function (e) {
          e.preventDefault()
          let dataId = $(this).attr('data-id')
          let startPoint = {
            x: e.pageX,
            y: e.pageY
          }
          let leftStart = parseInt($(this).css('left'))
          let topStart = parseInt($(this).css('top'))
          _this.activation(dataId)
          $(this).on('mousemove', function (e) {
            e.preventDefault()
            if ($(this).hasClass('active')) {
              let currentPoint = {
                x: e.pageX,
                y: e.pageY
              }
              let className = $(this).attr('data-id')
              $('.' + className).css({
                left: leftStart + (currentPoint.x - startPoint.x),
                top: topStart + (currentPoint.y - startPoint.y)
              })
            }
          })
        }).on('mouseup', function (e) {
          e.preventDefault()
          $('.zc').off('mousemove')
        })
      },
      resetImgSize: function ($img) {
        let className = $img.attr('data-id')
        $img.width($img.parent().width())
        $('.zc[data-id=' + className + ']').width($img.width()).height($img.height())
      },
      getMatrix: function (className) {
        let $obj = $('.' + className)
        let matrix = $obj.css('transform') === 'none' ? 0 : ($obj.css('transform').split('(')[1]).split(',')
        return {
          cos: matrix[0],
          sin: matrix[1]
        }
      },
      rotate: function (that, dataId) {
        let div = $(that)
        let centerX = div.width() / 2
        let centerY = div.height() / 2
        let left = div.position().left
        let top = div.position().top
        let pageX = event.pageX
        let pageY = event.pageY
        let dy = pageY - (top + centerY)
        let dx = pageX - (left + centerX)
        let angle = 180 / Math.PI * (Math.atan2(dy, dx) + Math.PI / 4)
        $('.' + dataId).css({
          transform: 'rotate(' + angle + 'deg)'
        })
      },
      scale: function (dataId, startStatus, moveEvent) {
        $('.zc').off('mousemove')
        let distance = {
          x: moveEvent.pageX - startStatus.x,
          y: moveEvent.pageY - startStatus.y
        }
        let $obj = $('.' + dataId)
        $obj.css({
          width: startStatus.width + distance.x,
          height: startStatus.height * (startStatus.width + distance.x) / startStatus.width
        })
      }
    },
    mounted() {
      this.beforeDiy()
    },
    components: {
      colorPicker
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../style/diy_template.css";

  .diy-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
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
        .diy-view-color {
          position: absolute;
          width: 100%;
          height: 100%;
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
          width: 100%;
          height: 100%;
          &.active {
            border: 1px dashed #1e90ff;
            .zc-handle {
              width: 20px;
              height: 20px;
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
            &.move {
              top: -10px;
              left: -10px;
              background: #fff url("./icon2.png") no-repeat center center/100%;
            }
            &.rotate {
              top: -10px;
              right: -10px;
              background: #fff url("./icon4.png") no-repeat center center/100%;
            }
            &.delete {
              bottom: -10px;
              left: -10px;
              background: #fff url("./icon1.png") no-repeat center center/100%;
              cursor: pointer;
            }

            &.scale {
              bottom: -10px;
              right: -10px;
              -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
              background: #fff url("./icon3.png") no-repeat center center/100%;
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
      border: 1px solid #eee;
      -webkit-box-shadow: 0 0 10px #eee;
      box-shadow: 0 0 10px #eee;
      background-color: rgba(255, 255, 255, .8);
      .wrapper {
        margin-bottom: 10px;
        .title {
          text-align: center;
          padding: 6px 0;
          margin-bottom: 10px;
          background-color: #00afee;
          color: #fff;
          cursor: pointer;
        }
        .content {
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
  }


</style>
