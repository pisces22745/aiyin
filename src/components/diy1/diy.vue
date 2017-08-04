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
  import util from '../../common/util'
  export default {
    props: {
      imgList: [Array]
    },
    data() {
      return {
        count: 0
      }
    },
    methods: {
      addImgToDiy: function (src) {
        $('.zc').removeClass('active')
        let _this = this,
          count = this.count++,
          img = $('<img src="' + src + '" class="layer' + count + '" data-id="layer' + count + '" />'),
          zc = '<div class="zc active layer' + count + '" data-id="layer' + count + '">' +
            '<div class="zc-handle rotate"></div>' +
            '<div class="zc-handle delete"></div>' +
            '<div class="zc-handle scale"></div>' +
            '</div>',
          $zc = $(zc);
        $('.diy-view').append(img)
        $('.diy-modify').append(zc)
        this.resetImgSize($(img))
      },
      resetImgSize: function (img) {
        let className = $(img).attr('data-id')
        $(img).width($(img).parent().width())
        $('.zc[data-id=' + className + ']').width($(img).width()).height($(img).height())
      },
      moveImg: function () {
        let _this = this;
        $('body').delegate('.zc', 'mousedown', function (e) {
          e.preventDefault();
          let data_id = $(this).attr('data-id'),
            startPoint = {
              x: e.pageX,
              y: e.pageY
            },
            leftStart = $(this).position().left,
            topStart = $(this).position().top;
          _this.activation(data_id)
          $(this).on('mousemove', function (e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
              let currentPoint = {
                  x: e.pageX,
                  y: e.pageY
                },
                className = $(this).attr('data-id'),
                leftCurrent = $(this).position().left,
                topCurrent = $(this).position().top
              $('.' + className).css({
                left: (currentPoint.x - startPoint.x) + leftStart,
                top: (currentPoint.y - startPoint.y) + topStart
              })
            }
          });
        }).on('mouseup', function (e) {
          e.preventDefault();
          $('.zc').off('mousemove')
        });
      },
      activation: function (data_id) {
        $('.zc').removeClass('active')
        $('.zc[data-id=' + data_id + ']').addClass('active');
      },
      rotate: function (that, data_id) {
        let div = $(that),
          centerX = div.width() / 2,
          centerY = div.height() / 2,
          left = div.position().left,
          top = div.position().top,
          pageX = event.pageX,
          pageY = event.pageY,
          dy = pageY - (top + centerY),
          dx = pageX - (left + centerX),
          angle = 180 / Math.PI * (Math.atan2(dy, dx) + Math.PI / 4);
        $('.' + data_id).css({
          transform: 'rotate(' + angle + 'deg)'
        })
        console.log(util.getmatrix($('.' + data_id).css('transform')))

      },
      scale: function (data_id, startStatus, moveEvent) {
        $('.zc').off('mousemove')
        let distance = {
            x: moveEvent.pageX - startStatus.x,
            y: moveEvent.pageY - startStatus.y
          },
          $obj = $('.' + data_id)
        $obj.css({
          width: startStatus.width + distance.x,
          height: startStatus.height * (startStatus.width + distance.x) / startStatus.width
        })
      }
    },
    created() {
      let _this = this
      this.moveImg();
      $('body').delegate('.toolbar img', 'click', function (e) { //添加图片到编辑区
        e.preventDefault();
        let src = $(this).attr('src')
        _this.addImgToDiy(src)
      }).delegate('.scale', 'mousedown', function (e) {
        e.preventDefault();
        let $zc = $(this).parent(),
          data_id = $zc.attr('data-id'),
          startStatus = {
            left: $zc.position().left,
            top: $zc.position().top,
            width: $zc.width(),
            height: $zc.height(),
            x: e.pageX,
            y: e.pageY
          }
        $('body').on('mousemove', function (e) {
          e.preventDefault();
          _this.scale(data_id, startStatus, e);
        })
      }).delegate('.rotate', 'mousedown', function (e) {
        e.stopPropagation()
        let $zc = $(this).parent(),
          data_id = $zc.attr('data-id');
        $('body').on('mousemove', function (e) {
          e.preventDefault();
          _this.rotate(this, data_id);
        })
      }).on('mouseup', function (e) {
        e.preventDefault();
        $('body').off('mousemove')
      })
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
      background-color: rgba(255, 255, 255, .8);
      overflow: scroll;
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
