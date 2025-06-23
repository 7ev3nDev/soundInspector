<script setup>
</script>

<template>
  <div class="container">
    <div class="content">
      <h2>audioInspector</h2>
      <p>A web application steganography tool for analyzing all kinds of audio files and their metadata.</p>
      <mspace />
      <mspace />
      <p>You simply need to drag and drop your audio file or click the input to get info about it.</p>
      <b>We support any audio file supported by ffmpeg.</b>
      <mspace />
      <b>All data is stored on your browser!</b>
    </div>
  </div>
</template>

<style scoped>
mspace {
  width: 100%;
  height: 20px;
  display: block;
}

div.container {
  height: 260px;
}
</style>