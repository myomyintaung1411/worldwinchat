<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
img {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
#app {
  overflow-x: hidden !important;
  // /* min-width: 1275px !important; */
  /* height: 100vh; */
  height: 100%;
  width: 100%;

   // background-blend-mode:lighten

  // min-width: 1275px !important;
}

// body{
//    background-image: url("./assets/tt.jpg");
//       background-size: cover;
//       background-repeat: no-repeat;
//       height: 100vh;
// }
::-webkit-scrollbar {
  width: 10px;
  cursor: pointer;
  display: none;
  // display: none;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
  display: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #e4e1dd;
  border-radius: 10px;
  display: none;
}

/* Handle on hover */
// ::-webkit-scrollbar-thumb:hover {
//   background: #b30000;
// }
</style>

  <style>
body.modal-open {
  overflow: hidden !important;
  /* box-shadow: 0px 0px 20px 20px rgb(56, 11, 11); */
  /* background-color: orange !important; */
}
</style>
