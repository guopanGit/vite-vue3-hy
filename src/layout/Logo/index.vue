<template>
  <div class="logo-container">
    <img v-if="!isCollapse" class="icon" src="@/assets/images/favicon.ico" alt="">
    <h1 v-if="!isCollapse">{{ systemTitle }}</h1>
  </div>
</template>

<script>
import {defineComponent, computed} from 'vue'
import {useStore} from 'vuex'
import {systemTitle} from '@/config'

export default defineComponent({
  setup() {
    const store = useStore()
    const isCollapse = computed(() => store.state.app.isCollapse)
    return {
      isCollapse,
      systemTitle
    }
  }
})
</script>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  background-color: var(--system-logo-background);

  .icon {
    width: 180px;
    height: 180px;
  }

  h1 {
    font-size: 30px;
    white-space: nowrap;
    color: var(--system-logo-color);
  }
}
</style>