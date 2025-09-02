<script setup>
import InfoIcon from "@/components/icons/InfoIcon.vue";
import {useRoute} from 'vue-router'
import {useHeaderStore} from "@/stores/headerStore.js";
import {onMounted} from "vue";

const route = useRoute()

const headerStore = useHeaderStore();

onMounted(() => {
  document.querySelector("body").onclick = e => {
    if (headerStore.isMenuOpen && !e.target.closest("div.menu") && !e.target.closest("header") && !document.body.classList.contains("driver-active")) {
      headerStore.setIsMenuOpen(false);
    }
  }
})

</script>

<template>
  <header :class="{ active: route.path === '/view' }">
    <div class="content">
      <h2>soundInspector</h2>
      <div class="btns">
        <component :is="headerStore.buttonsContent.component" v-bind="headerStore.buttonsContent.props"/>

        <RouterLink to="/info" class="btn" v-if="route.path === '/'">
          <InfoIcon/>
        </RouterLink>
      </div>
    </div>
    <div class="menu" :class="{ open: headerStore.isMenuOpen }" id="floating-menu">
      <div class="content">
        <component :is="headerStore.menuContent.component" v-bind="headerStore.menuContent.props"/>
      </div>
    </div>
  </header>

  <main>
    <RouterView/>
  </main>
</template>

<style>
header > div.menu {
  position: absolute;
  display: none;

  right: 0;
  top: calc(100% + 5px);

  box-shadow: rgba(0, 0, 0, 0.8) 0 2px 16px 0;

  width: 100%;
  max-width: 260px;

  background: var(--primary);
  color: white;

  box-sizing: border-box;
  border-radius: 32px;
  padding: 11px 24px;

  z-index: 10001;
  pointer-events: all!important;

  &.open {
    display: block;
  }

  & > div.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 10px;
    padding-block: 2px;

    height: 100%;
    width: 100%;

    background: var(--secondary);
    color: var(--secondary-text);

    border-radius: 22px;

    & > a {
      width: 100%;
      border-radius: 22px;

      padding-inline: 16px;

      box-sizing: border-box;
      box-shadow: rgba(0, 0, 0, 0.4) 0 2px 6px 0;
      transition: all 0.2s;

      height: 40px;

      cursor: pointer;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      &.no-action {
        cursor: default;
      }

      &:hover {
        background: var(--secondary-hover);
        scale: 1.1;
      }
    }
  }
}
</style>

<style scoped>
header {
  width: 96%;
  height: 100px;
  max-width: 800px;
  box-sizing: border-box;
  position: relative;

  padding: 11px 30px;

  background: var(--primary);
  color: white;

  border-radius: 32px;

  font-family: Jaro, sans-serif;

  box-shadow: rgba(0, 0, 0, 0.4) 0 2px 8px 0;

  &.active {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  & > div.content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 100%;

    background: var(--secondary);
    color: var(--secondary-text);

    border-radius: 22px;
    padding-inline: 30px;

    & > h2 {
      font-size: 46px;
    }

    & > .btns {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }
  }

}


main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media screen and (max-width: 600px) {
  div.content > h2 {
    font-size: 26px !important;
  }
}
</style>
