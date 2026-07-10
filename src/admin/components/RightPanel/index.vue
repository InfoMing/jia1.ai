<template>
  <div ref="rightPanel" :class="{show:show}" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div class="handle-button" :style="{'top':buttonTop+'px','background-color':theme}" @click="show=!show">
        <i :class="show?'el-icon-close':'el-icon-setting'" />
      </div>
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '@/store'

export default {
  name: 'RightPanel',
  props: {
    buttonTop: {
      default: 250,
      type: Number,
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    theme() {
      return useSettingsStore().theme;
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.$emit('open')
      } else {
        this.$emit('close')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.show {
  transition: all .3s ease;

  .rightPanel-background {
    z-index: 9999;
    display: block;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity .3s;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 300px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000;
  transition: all .3s ease;
  transform: translate(100%);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, .05);
  background: #fff;
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;

  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
