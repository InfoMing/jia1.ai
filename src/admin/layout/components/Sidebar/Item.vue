<script>
import { h } from 'vue'
import SvgIcon from '@/admin/components/SvgIcon/index.vue'

export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  render() {
    const vnodes = []

    if (this.icon) {
      if (this.icon.includes('el-icon')) {
        vnodes.push(h('i', { class: [this.icon, 'sub-el-icon'] }))
      } else {
        vnodes.push(h(SvgIcon, { 'icon-class': this.icon }))
      }
    }

    if (this.title) {
      vnodes.push(h('span', { slot: 'title' }, this.title))
    }
    return vnodes
  },
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}

.el-menu-item svg,
.el-submenu svg {
  vertical-align: middle;
  margin-right: 5px !important;
}
</style>
