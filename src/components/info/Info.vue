<script setup>

import { onMounted, onUnmounted, shallowRef } from "vue";
import InfoButtons from "@/components/info/InfoButtons.vue";
import { useHeaderStore } from "@/stores/headerStore.js";
import { useTourStore } from "@/stores/tourStore.js";

const viewButtons = shallowRef(InfoButtons);
const headerStore = useHeaderStore();
const tourStore = useTourStore();

onMounted(() => {
  headerStore.setButtonsContent({
    component: viewButtons,
    props: {}
  })
});

onUnmounted(() => {
  headerStore.clear()
})

</script>

<template>
  <div class="container">
    <div class="content">
      <h2>soundInspector</h2>
      <p>A web application steganography tool for analyzing all kinds of audio files and their metadata.</p>
      <mspace/>
      <mspace/>
      <p>You simply need to drag and drop your audio file or click the input to get info about it.</p>
      <b>We support any audio file supported by ffmpeg.</b>
      <mspace/>
      <b>All data is stored on your browser!</b>
    </div>
  </div>

  <div class="container mini">
    <a @click="tourStore.startTour([
        {
          popover: {
            title: 'Welcome to soundInspector!',
            description: 'This tour will guide you through the main features of the application.'
          },
        },
        {
          popover: {
            onPopoverRender: () => {
              $router.push('/');
            }
          }
        }
    ])" class="btn">Want a tour?</a>
  </div>
</template>

<style scoped>
mspace {
  width: 100%;
  height: 20px;
  display: block;
}

p {
  word-break: break-word !important;
}

div.container {
  height: 260px;

  margin-bottom: 10px;
  display: flex;
  flex-direction: column;

  &.mini {
    max-width: fit-content;
    padding-inline: 16px;
    border-radius: 24px;

    height: unset;
    margin-top: -82px;
    position: relative;
    top: 82px;

    & > .btn {
      background: var(--secondary);
      color: var(--secondary-text);
      font-weight: bold;
    }
  }
}

b {
  text-align: center;
}

@media screen and (max-width: 600px) {
  div.container {
    height: 370px !important;

    & > .content {
      max-height: unset;
    }
  }
}
</style>