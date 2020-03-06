<template>
  <div class="m-header">
    <div class="icon"></div>
    <!-- <div class="text">请登录</div> -->
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="stylus" type="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 32px
      margin-right: 9px
      bg-image('logo')
      background-size: 30px 32px
    .text
      font-size: 12px
</style>
