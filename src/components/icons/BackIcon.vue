<script setup>
defineProps({
  width: {
    type: String,
    default: "13"
  },
  height: {
    type: String,
    default: "22"
  }
});

</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 14 22" fill="none" >
      <path d="M13.0578 0.426312C12.4702 -0.142104 11.5229 -0.142104 10.9354 0.426312L0.850743 10.1822C0.383086 10.6346 0.383086 11.3654 0.850743 11.8178L10.9354 21.5737C11.5229 22.1421 12.4702 22.1421 13.0578 21.5737C13.6454 21.0053 13.6454 20.0888 13.0578 19.5204L4.25625 11.0058L13.0698 2.47957C13.6454 1.91115 13.6454 0.994727 13.0578 0.426312Z" fill="white"/>
    </svg>

</template>

<style scoped>

</style>