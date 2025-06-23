<script setup>
import InfoIcon from "@/components/icons/InfoIcon.vue";
import { useRoute } from 'vue-router'
import { useAudioStore } from "@/stores/audioStore.ts";
import MoreIcon from "@/components/icons/MoreIcon.vue";
import BackIcon from "@/components/icons/BackIcon.vue";
import {useHeaderStore} from "@/stores/headerStore.js";
import {onMounted} from "vue";

const route = useRoute()

const audioStore = useAudioStore();
const headerStore = useHeaderStore();

onMounted(() => {
  document.querySelector("body").onclick = e => {
    if (headerStore.isMenuOpen && !e.target.closest("div.menu") && !e.target.closest("header")) {
      headerStore.setIsMenuOpen(false);
    }
  }
})

</script>

<template>
  <!-- TODO: move header to another part -->
  <header :class="{ active: route.path === '/view' }">
    <div class="content">
      <h2>soundInspector</h2>
      <div class="btns">
        <RouterLink to="/info" class="btn" v-if="route.path === '/'">
          <InfoIcon />
        </RouterLink>
        <RouterLink to="/" class="btn" v-if="route.path === '/info'">
          <BackIcon />
        </RouterLink>
        
        <template v-if="audioStore.file">
          <span class="btn no-action">
            {{ audioStore.file.name }}
          </span>
          
          <span class="btn mini" @click="headerStore.toggleMenu()">
            <MoreIcon />
          </span>
        </template>
      </div>
    </div>
    <div class="menu" :class="{ open: headerStore.isMenuOpen }">
      <div class="content">
        <component :is="headerStore.menuContent.component" v-bind="headerStore.menuContent.props" />
      </div>
    </div>
  </header>

  <main>
    <RouterView />
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
      font-size: 48px;
    }
    
    & > .btns {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }
  }
  
}

.btn {
  cursor: pointer;
  
  background: var(--primary);
  color: white;
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  min-width: 96px;
  height: 40px;
  border-radius: 20px;
  
  padding-inline: 16px;

  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.6) 0 2px 8px 0;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary-hover);
    scale: 1.1;
  }
  
  &.mini {
    min-width: 40px;
  }
  
  &.no-action {
    cursor: unset;
    box-shadow: none;
    
    &:hover {
      background: var(--primary);
      scale: 1;
    }
  }
}

main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
