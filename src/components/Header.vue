<template>
  <div class="layui-row chat-header" style="background: #1e9fff">
    <div class="layui-col-xs2 chat-header-avatar">
      <img :src="chatImg.service" class="agent-avatar" draggable="false" />
    </div>
    <!--  -->
    <div class="layui-col-xs9 chat-header-title" v-if="customerNickName">
      {{ customerNickName }}
    </div>
    <div class="layui-col-xs9 chat-header-title" v-else>客服不在线。。。</div>

    <div class="layui-col-xs1 chat-header-tool" id="operatorVoice">
      <span
        class="iconfont"
        style="font-size: 20px"
        id="openVoice"
        @click.prevent="soundState == true ? pause() : play()"
      >
        <!-- <iframe
          src="audio/source.mp3"
          allow="autoplay"
          style="display: none"
          id="iframeAudio"
        >
        </iframe> -->
        <img
          :src="chatImg.sound"
          alt=""
          class="centerimg"
          v-if="soundState"
          draggable="false"
        />
        <img
          :src="chatImg.nosound"
          alt=""
          class="centerimg"
          v-else
          draggable="false"
        />
      </span>
    


      <!-- <span
        class="iconfont"
        style="font-size: 20px; display: none"
        id="closeVoice"
        ></span
      > -->

    </div>
      <div v-if="!chatWindow" @click="toggleChatWindow" class="closeX" style="color:white;position:absolute;right:10px;line-height: 60px;cursor:pointer">X</div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
   props: {
    showPopup: Boolean,
  },
  data() {
    return {
      chatImg: {
        // service: "https://tysq666.cn/images/service-avatar.png",
        // sound: "https://tysq666.cn/images/sound.png",
        // nosound: "https://tysq666.cn/images/nosound.png",
         service: "https://asdqwe.co/images/service-avatar.png",
         sound: "https://asdqwe.co/images/sound.png",
         nosound: "https://asdqwe.co/images/nosound.png",
      },
      // soundOpen: true,
      // audioUrl: require("../api/default.wav"),
      // img:require('../../public/img/chatimg/')
    };
  },
  computed: {
    ...mapGetters(["soundOpen","chatWindow"]),
    ...mapState({
      soundState: (state) => state.soundOpen,
      customerNickName: (state) => state.customerInfo.customer_nickname,
    }),
  },
  watch: {
    soundOpen: function (state) {
      console.log(state);
    },
  },
  methods: {
    // ToggleSound() {
    //   this.soundOpen = !this.soundOpen;
    //   let audio = new Audio(this.audioUrl);
    //   if (this.soundOpen == true) {
    //     audio.play();
    //   } else {
    //       // audio = new Audio(this.audioUrl);
    //     audio.paused();
    //   }
    // },
        toggleChatWindow() {
       this.$store.commit("toggleChatWindow", false);
      // this.showPopup = !this.showPopup;
    },
    play() {
      // let audio = new Audio(this.audioUrl);
      // this.soundOpen = true;
      // audio.play();
      this.$store.commit("play", true);
    },
    pause() {
      // let audio = new Audio(this.audioUrl);
      // audio.pause();
      // this.soundOpen = false;
      this.$store.commit("pause", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-header {
  height: 60px;
  background: #1e9fff;
  position: sticky;
  top: 0;
}
.layui-row:after,
.layui-row:before {
  content: "";
  display: block;
  clear: both;
}
.chat-header .chat-header-avatar {
  height: 100%;
}
.layui-col-xs2 {
  width: 16.66666667%;
  float: left;
}
.agent-avatar {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  // box-shadow: 0 3px 3px 0 rgb(0 0 0 / 10%);
}

.chat-header-title {
  height: 100%;
  line-height: 60px;
  text-align: left;
  color: #fff;
}

.layui-col-xs9 {
  width: 70%;
  float: left;
  // background-color: red;
}

.chat-header-tool {
  height: 100%;
  line-height: 60px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  // background: red;
  // align-self: center;
}
.layui-col-xs1 {
  // width: 8.33333333%;
  // background: red;
   float: left;
  position: absolute;
  right: 35px;
  // background-color: red;
}
.centerimg {
  // background: white;
  height: 20px;
  margin-top: 20px;
  // align-self: center;
  // text-align: center;
}
.closeX:hover{
 color: red !important;
}
</style>