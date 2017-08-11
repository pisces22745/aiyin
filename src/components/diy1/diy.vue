<template>
  <div class="diy-wrapper">
    <div class="diy" id="diy1">
      <div class="diy-view">
        <div class="diy-view-color"></div>
        <img v-for="(item,index) in diyImgList" v-move :src="item.src" :class="item.classname"
             :data-id="item.classname"/>
      </div>
      <div class="diy-modify">
        <!--zc zoom control 缩放控制-->
        <div v-for="(item,index) in diyImgList" :class="['zc',item.classname,{'active': active==index}]"
             :data-id="'layer'+index" v-move>
          <div class="zc-handle rotate"></div>
          <div class="zc-handle delete"></div>
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
      drag: function (e) {
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
      resetImgSize: function ($img) {
        let className = $img.attr('data-id')
        $img.width($img.parent().width())
        $('.zc[data-id=' + className + ']').width($img.width()).height($img.height())
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
          let leftStart = $(this).position().left
          let topStart = $(this).position().top
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
                left: (currentPoint.x - startPoint.x) + leftStart,
                top: (currentPoint.y - startPoint.y) + topStart
              })
            }
          })
        }).on('mouseup', function (e) {
          e.preventDefault()
          $('.zc').off('mousemove')
        })
      },
      moveImg1: function () {
        let _this = this
        $('body').delegate('.zc', 'mousedown', function (e) {
          e.preventDefault()
          let dataId = $(this).attr('data-id')
//          let startPoint = {
//            x: e.pageX,
//            y: e.pageY
//          }
          _this.activation(dataId)
          $(this).on('mousemove', function (e) {
            e.preventDefault()
            if ($(this).hasClass('active')) {
              let $className = $('.' + $(this).attr('data-id'))
              console.log($className)
              let w = $className.width()
              let h = $className.height()
              let b = Math.atan(h / w)
              let a = _this.getAngle(this)
              let left = w / 2 - Math.sin(Math.PI / 2 - a - b) * Math.sqrt((w / 2) * (w / 2) + h * h)
              let top = Math.cos(Math.PI / 2 - a - b) * Math.sqrt((w / 2) * (w / 2) + h * h)
              $className.css({
                left: left,
                top: top
              })
            }
          })
        }).on('mouseup', function (e) {
          e.preventDefault()
          $('.zc').off('mousemove')
        })
      },
      activation: function (dataId) {
        $('.zc').removeClass('active')
        $('.zc[data-id=' + dataId + ']').addClass('active')
      },
      getAngle: function (that) {
        let div = $(that)
        let centerX = div.width() / 2
        let centerY = div.height() / 2
        let left = div.position().left
        let top = div.position().top
        let pageX = event.pageX
        let pageY = event.pageY
        let dy = pageY - (top + centerY)
        let dx = pageX - (left + centerX)
        return 180 / Math.PI * (Math.atan2(dy, dx) + Math.PI / 4)
      },
      rotate: function (that, dataId) {
        let angle = this.getAngle(that)
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
//      let _this = this
//      this.moveImg()
//      $('body').delegate('.toolbar img', 'click', function (e) { // 添加图片到编辑区
//        e.preventDefault()
//        let src = $(this).attr('src')
//        _this.addImgToDiy(src)
//      }).delegate('.scale', 'mousedown', function (e) {
//        e.preventDefault()
//        let $zc = $(this).parent()
//        let dataId = $zc.attr('data-id')
//        let startStatus = {
//          left: $zc.position().left,
//          top: $zc.position().top,
//          width: $zc.width(),
//          height: $zc.height(),
//          x: e.pageX,
//          y: e.pageY
//        }
//        $('body').on('mousemove', function (e) {
//          e.preventDefault()
//          _this.scale(dataId, startStatus, e)
//        })
//      }).delegate('.rotate', 'mousedown', function (e) {
//        e.stopPropagation()
//        let $zc = $(this).parent()
//        let dataId = $zc.attr('data-id')
//        $('body').on('mousemove', function (e) {
//          e.preventDefault()
//          _this.rotate(this, dataId)
//        })
//      }).delegate('.delete', 'click', function (e) {
//        e.preventDefault()
//        let $zc = $(this).parent()
//        let dataId = $zc.attr('data-id')
//        $('.' + dataId).remove()
//      }).on('mouseup', function (e) {
//        e.preventDefault()
//        $('body').off('mousemove')
//      })
//
//      $('.wrapper .title').on('click', function (e) {
//        e.preventDefault()
//        $(this).siblings('.content').slideToggle(200)
//      })
    },
    directives: {
      'move': {
        bind: function (el, binding, vnode) {
          let _this = this
          $(el).on('mousedown', function (e) {
            e.preventDefault()
            let dataId = $(this).attr('data-id')
            let startPoint = {
              x: e.pageX,
              y: e.pageY
            }
            let leftStart = $(this).position().left
            let topStart = $(this).position().top
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
                  left: (currentPoint.x - startPoint.x) + leftStart,
                  top: (currentPoint.y - startPoint.y) + topStart
                })
              }
            })
          }).on('mouseup', function (e) {
            e.preventDefault()
            $('.zc').off('mousemove')
          })
        },
        inserted: function () {
          console.log(333)
        },
        update: function (value, oldValue) {
          console.log('move2')
        }
      }
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
              /*cursor: nw-resize;*/
            }
            &.rotate {
              top: -10px;
              right: -10px;
              background: #fff url("./icon4.png") no-repeat center center/100%;
              /*cursor: ne-resize;*/
            }
            &.delete {
              bottom: -10px;
              left: -10px;
              background: #fff url("./icon1.png") no-repeat center center/100%;
              /*cursor: sw-resize;*/
            }

            &.scale {
              bottom: -10px;
              right: -10px;
              -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
              background: #fff url("./icon3.png") no-repeat center center/100%;
              /*cursor: se-resize;*/
            }
            /*&.rotate {*/
            /*top: -30px;*/
            /*left: 50%;*/
            /*!*cursor: all-scroll;*!*/
            /*cursor: crosshair;*/
            /*&:after {*/
            /*content: '';*/
            /*position: absolute;*/
            /*top: 0;*/
            /*left: 2px;*/
            /*background-color: #1e90ff;*/
            /*}*/
            /*}*/
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
