<template>
  <div>
    <div class="layui-row chat-body">
      <!-- testing -->

      <!--  -->
      <!-- here style bind for overflow -->
      <div
        id="chatlist"
        v-bind:class="{ closechatbox: showModal == true }"
        class="chatbox"
      >
        <ul class="conversation">
          <!-- customer send chat text -->
          <template v-for="item in records">
            <li
              class="chatmsg"
              style="height: auto"
              v-if="item.from_id != myMsg && item.msgType == 0"
              :key="item.msg_id"
            >
              <div class="showtime">{{ item.time }}</div>
              <div style="position: absolute; right: 2px">
                <img
                  class="my-circle"
                  :src="chtImg.customer"
                  width="40px"
                  height="40px"
                  draggable="false"
                />
              </div>
              <div class="outer-right">
                <!-- <div class="read-msg">{{ customerName }}</div> -->
                <div class="customer">
                  <div class="pre" v-html="replaceFace(item.message)"></div>
                </div>
              </div>
            </li>
            <!-- customer send msg for image -->
            <li
              class="chatmsg"
              style="height: auto"
              v-if="item.from_id != myMsg && item.msgType == 1"
              :key="item.msg_id"
            >
              <div class="showtime">{{ item.time }}</div>
              <div style="position: absolute; right: 2px">
                <img
                  class="my-circle"
                  :src="chtImg.customer"
                  width="40px"
                  height="40px"
                />
              </div>
              <div class="outer-right" v-show="downloadImage(item.message)">
                <!-- <div class="read-msg">{{ customerName }}</div> -->
                <div
                  class="customer"
                  @click="imgClick(downloadImage(item.message))"
                >
                  <img
                    :src="downloadImage(item.message)"
                    alt
                    style="max-width: 100%; width: 150px; height: 80px"
                  />
                </div>
              </div>
            </li>
            <!--  service chat text-->
            <li
              class="chatmsg"
              style="height: auto"
              v-if="item.from_id == myMsg && item.msgType == 0"
              :key="item.msg_id"
            >
              <div class="showtime">{{ item.time }}</div>
              <div style="position: absolute; left: 3px">
                <img
                  class="my-circle se_pic"
                  :src="chtImg.service"
                  width="40px"
                  height="40px"
                  draggable="false"
                />
              </div>
              <div class="outer-left">
                <div class="service">
                  <div class="pre" v-html="replaceFace(item.message)"></div>
                </div>
              </div>
            </li>

            <!-- service chat image -->

            <li
              class="chatmsg"
              style="height: auto"
              v-if="item.from_id == myMsg && item.msgType == 1"
              :key="item.msg_id"
            >
              <div class="showtime">{{ item.time }}</div>
              <div style="position: absolute; left: 3px">
                <img
                  class="my-circle se_pic"
                  :src="chtImg.service"
                  width="40px"
                  height="40px"
                  draggable="false"
                />
              </div>
              <div class="outer-left" v-show="downloadImage(item.message)">
                <div
                  class="service"
                  @click="imgClick(downloadImage(item.message))"
                >
                  <img
                    :src="downloadImage(item.message)"
                    alt
                    style="max-width: 100%; width: 150px; height: 80px"
                    draggable="false"
                  />
                </div>
              </div>
            </li>

            <!-- service chat file -->

            <!-- <li
              class="chatmsg"
              style="height: auto"
              v-if="item.from_id == myMsg && item.msgType == 2"
              :key="item.msg_id"
            >
              <div class="showtime">{{ item.time }}</div>
              <div style="position: absolute; left: 3px">
                <img
                  class="my-circle se_pic"
                  src="../assets/chatimg/service.png"
                  width="40px"
                  height="40px"
                  draggable="false"
                />
              </div>
              <div class="outer-left" v-show="downloadImage(item.message)">
                <div class="service">
                  <p
                    style="
                      display: inline-block;
                      text-align: center;
                      min-width: 70px;
                      text-decoration: none;
                      color: white;
                      cursor: pointer;
                    "
                    @click="downFile(item.message)"
                  >
                    <i class="layui-icon" style="font-size: 60px">????</i><br />{{
                      item.message
                    }}
                  </p>
                </div>
              </div>
            </li>-->
          </template>
        </ul>
      </div>
      <!-- modal -->
      <transition name="pop" appear>
        <div
          style
          class="modal"
          v-if="showModal == true"
          ref="draggableContainer"
          id="draggable-container"
          @mousedown="dragMouseDown"
        >
          <div class="close" @click="close">
            <div class="inner">&times;</div>
          </div>

          <img
            :src="imgData"
            alt
            draggable="false"
            @dblclick="SaveImage(imgData)"
          />
        </div>
      </transition>
      <!-- end modal -->
    </div>
    <!-- footer -->
    <div class="layui-row chat-footer">
      <div class="text-holder">
        <textarea
          id="text_in"
          class="edit-ipt textarea"
          contenteditable="true"
          hidefocus="true"
          tabindex="0"
          @focus="focusEvent()"
          @keyup.enter.exact="SendMsg"
          v-model.trim="chatmsg"
          @paste.prevent="PasteData"
        ></textarea>
        <!-- <Editable
          hidefocus="true"
          v-model="chatmsg"
          @focusEvent="focusEvent"
          @SendMsg="SendMsg"
        >
        </Editable>-->
      </div>
      <div class="send-bar">
        <div class="tool-box">
          <a id="face_icon" href="javascript:" @click="ToggleEmoji()">
            <img :src="chtImg.smile" alt draggable="false" />
          </a>
          <!-- img -->
          <a id="images">
            <form   id="picture" enctype="multipart/form-data">
              <div class="layui-box input-but size"  >
                <img :src="chtImg.image" alt draggable="false"  />
                <input
                  type="file"
                  name="upload"
                  class="fileinput"
                  @change="put"
                />
              </div>
            </form>
          </a>
          <!-- <span style="color:red;cursor:pointer;" @click="takeScreenShot()" class="img-box">??????</span> -->
          <!-- <a id="face_icon" href="javascript:" @click="takeScreenShot()">
            <img :src="chtImg.smile" alt draggable="false" />
          </a> -->
        </div>
        <!-- send btn -->
        <div class="send-btn-div">
          <input
            v-if="!chatmsg.trim()"
            type="button"
            value="Send"
            class="send-input"
            id="sendBtn"
            disabled
            @click="SendMsg"
          />
          <input
            v-else
            type="button"
            value="Send"
            class="send-input-active"
            id="sendBtn"
            @click="SendMsg"
          />

          <!-- testing for fromId1 -->
        </div>
      </div>
      <!-- emoji div -->
      <transition name="pop" appear>
        <div class="emojidiv" v-if="showEmoji == true">
          <div class="layui-layer-content">
            <div class="layui-whisper-face">
              <ul class="layui-clear whisper-face-list">
                <li v-for="(item, index) in getEXP()" :key="index">
                  <!-- <img
                    :src="'https://tysq666.cn/emotion/' + item.file"
                    :data="item.code"
                    @click="emojiSelect(item.code)"
                    :title="item.title"
                    draggable="false"
                  /> -->
                  <img
                    :src="'https://hm5556.xyz/emotion/' + item.file"
                    :data="item.code"
                    @click="emojiSelect(item.code)"
                    :title="item.title"
                    draggable="false"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import { ImagePreview } from "vant";
import {Upload} from '../api/user'
// import html2canvas from "html2canvas";
// import ScreenShort from "js-web-screen-shot";
// import AES from "../api/aes";
export default {
  data() {
    return {
      chtImg: {
        // customer: "https://tysq666.cn/images/avatar.png",
        // service: "https://tysq666.cn/images/service-avatar.png",
        // file: "https://tysq666.cn/chatimg/file.png",
        // image: "https://tysq666.cn/chatimg/image.png",
        // smile: "https://tysq666.cn/chatimg/smile.png",

        customer: `https://hm5556.xyz/images/avatar.png`,
        service: `https://hm5556.xyz/images/service-avatar.png`,
        file: `https://hm5556.xyz/chatimg/file.png`,
        image: `https://hm5556.xyz/chatimg/image.png`,
        smile: `https://hm5556.xyz/chatimg/smile.png`,
      },
      name: "",
      mine: true,

      myMsg: this.$Global.isMe,
      uploadPhotoUrl:
        // "http://" + window.g.ip + ":" + window.g.imgPort + "/upload",
        window.g.ip + "/upload",
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
      // showModal: false,
      // showEmoji: false,
      chatmsg: "",
      imgData: null,
      EXPS: this.$Global.EXPS,
      //for image testing
      records: [],
      uploadImage: "",
      //testing method of ss
      htmlUrl: "",
    };
  },
  methods: {
    takeScreenShot() {
      // new ScreenShort();
      // window.location.href="about:blank";
      // window.close();
      //  window.opener=null;
      //  window.open('','_self');
      //  window.close();
      var opened = window.open("about:blank", "_self");
      opened.opener = null;
      opened.close();
      // window.open("http://hn232.com", "newwindow", "height=500, width=600, top=200, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no")
    },
    SaveImage(img) {
      // console.log("image is ", img);

      const cut = img.substring(img.lastIndexOf("=") + 1);
      // console.log("cut is ***************", cut);
      this.axios
        .get(img, { responseType: "blob" })
        .then((res) => {
          // console.log(res);
          var fileUrl = window.URL.createObjectURL(new Blob([res.data]));
          var fileLink = document.createElement("a");
          fileLink.href = fileUrl;
          fileLink.setAttribute("download", cut);
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //copy and paste image and text
    PasteData(event, callback) {
      if (event.clipboardData.getData("text")) {
        this.chatmsg = event.clipboardData.getData("text");
      } else {
        this.pasteImage(event, callback);
      }
    },
    //paste image
    pasteImage(pasteEvent, callback) {
      if (pasteEvent.clipboardData == false) {
        if (typeof callback == "function") {
          console.log("Undefined ");
          callback(undefined);
        }
      }

      var items = pasteEvent.clipboardData.items;

      if (items == undefined) {
        if (typeof callback == "function") {
          callback(undefined);
          console.log("Undefined 2");
        }
      }
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") == -1) continue;
        var blob = items[i].getAsFile();
        // console.log("blob is *************", blob);
        this.sendPasteImage(blob);
      }
    },
    //send paste image
    sendPasteImage(file) {
      if (!file) {
        e.preventDefault();
        this.$message.warning("No file chosen");
        e.target.value = "";

        // return;
      }
      var FileExt = file.name.replace(/.+\./, "");
      if (
        ["jpg", "png", "jpeg", "svg", "gif"].indexOf(FileExt.toLowerCase()) ===
        -1
      ) {
        this.$message.warning("Please upload attachments with suffixes jpg, png, jpeg, svg, gif!");
        e.target.value = "";
        // return false;
      }

      if (file.size > 1024 * 1024) {
        e.preventDefault();
        this.$message.warning("File too big (> 1MB)");
        e.target.value = "";
        // return;
      }
      var resulturl = URL.createObjectURL(file);
      // console.log("resulturl", resulturl);
      // console.log("file name is", file.name);
      let fd = new FormData();
      fd.append("file", file, file.name);
      // this.axios
      //   .post(this.uploadPhotoUrl, fd)
      Upload(fd)
        .then((res) => {
          this.$store.commit("Loading_Spinner", true);
          console.log("res of imageeeeeeeeeeeeee", res);
          if (res.data.code == "0") {
            this.$store.commit("Loading_Spinner", false);
            this.uploadImage = res.data.data.name;
            // this.$store.commit("play", true);

            // if (!this.$Global.customerInfo.customerId) return;
            let mySend = {
              from_id: this.$store.state.customerInfo.userId,
              to_id: this.$store.state.customerInfo.customerId,
              message: this.uploadImage,
              time: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
              msgType: 1,
              isMe: "1",
            };
            // console.log("data is *************",mySend);
            let sendData = {
              router: "sendChat",
              JsonData: {
                msg: this.uploadImage, //????????????,????????????????????????????????????
                msgType: 1, //????????????: 0 ??????  1 ??????   ,??????????????????,??????????????????,?????????
                from_id: this.$store.state.customerInfo.userId,
                to_id: this.$store.state.customerInfo.customerId,
                customer_id: this.$store.state.customerInfo.customerId,
                time: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
              },
            };
            this.$pomelo.sendCB(sendData,(res)=>{
              if(res.data.result == 'ok'){
                this.$Global.chatRecord.push(mySend);
                this.$store.commit(
                  "setOneToOneChatRecord",
                  this.$Global.chatRecord
                );
              }else{
                return this.$message.error('network error')
              }
            });
            // this.$store.commit("play", true);
            // this.$Global.chatRecord.push(mySend);
            // this.$store.commit(
            //   "setOneToOneChatRecord",
            //   this.$Global.chatRecord
            // );
            this.autoFocusMsg();
            e.target.value = "";
            return this.$message.success("Image uploaded successfully");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    ToggleEmoji() {
      this.$store.commit("ToggleEmoji");
    },
    dragMouseDown: function (event) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    },
    elementDrag: function (event) {
      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      // set the element's new position:
      this.$refs.draggableContainer.style.top =
        this.$refs.draggableContainer.offsetTop -
        this.positions.movementY +
        "px";
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        "px";
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    },

    imgClick(img) {
      // this.$store.state.showModal = true;
      // this.imgData = img;
      ImagePreview({
        images: [`${img}`],
        closeable: true,
        showIndex: false,
      });
    },
    close() {
      this.$store.state.showModal = false;
    },
    //textarea focus ??????
    focusEvent() {
      this.$store.state.showEmoji = false;
    },
    getEXP: function () {
      return this.EXPS;
    },
    SendMsg() {
      // console.log("global is *****************************", this.$Global.chatRecord);
      // console.log("btn");
      let blank =
        this.chatmsg.split(" ").every((n) => {
          return /^(&nbsp;)+$/.test(n); // ???????????????&nbsp;?????????
        }) || this.chatmsg.trim().length === 0; // ?????????????????????

      if (blank) {
        // this.tips = '??????????????????';
        return;
      }

      if (
        this.chatmsg == "" ||
        this.chatmsg == null ||
        this.chatmsg == undefined ||
        this.chatmsg.trim().length == 0
      )
        return;
      let mySend = {
        from_id: this.$store.state.customerInfo.userId,
        to_id: this.$store.state.customerInfo.customerId,
        message: this.chatmsg,
        time: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
        msgType: 0,
      };
      // this.autoFocusMsg();
      this.$store.state.showEmoji = false;
      if (!this.$store.state.customerInfo.customerId) return;
      let sendData = {
        router: "sendChat",
        JsonData: {
          msg: this.chatmsg, //????????????,????????????????????????????????????
          msgType: 0, //????????????: 0 ??????  1 ??????   ,??????????????????,??????????????????,?????????
          from_id: this.$store.state.customerInfo.userId,
          to_id: this.$store.state.customerInfo.customerId,
          customer_id: this.$store.state.customerInfo.customerId,
          time: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
        },
      };
      //this.$pomelo.sendCB(sendData);
      this.$pomelo.sendCB(sendData, (res) => {
        if (res.data.result == 'ok') {
          this.$Global.chatRecord.push(mySend);
          this.$store.commit(
            "setOneToOneChatRecord",
            this.$Global.chatRecord
          );
        } else {
          return this.$message.error('network error')
        }
      });
      // this.$store.commit("play", true);
      // this.$Global.chatRecord.push(mySend);
      // this.$store.commit("setOneToOneChatRecord", this.$Global.chatRecord);
      this.chatmsg = "";
      this.autoFocusMsg(); // clear data in input
    },
    // ?????????message????????????
    autoFocusMsg() {
      this.$nextTick(() => {
        let msg = document.getElementById("chatlist"); // ????????????
        if (msg == "" || msg == null) return;
        msg.scrollTop = msg.scrollHeight; // ????????????
      });
    },
    replaceFace(con) {
      var exps = this.EXPS;

      for (var i = 0; i < exps.length; i++) {
        // con = con.replace(new RegExp(exps[i].code,'g'), '<img src="static/emotion/' + exps[i].file +'"  alt="" />');
        if (con) {
          con = con.replace(
            exps[i].reg,
            `<img src="../emotion/${exps[i].file}"  alt="" style="vertical-align: middle;" />` // ??????????????????????????? ??? ???emotion/???
          );
        }
      }
      return con;
    },
    emojiSelect(code) {
      this.chatmsg += code;
      this.$store.state.showEmoji = false;
    },

    downloadImage(imgName) {
     // let srcImg = "https://tysq666.cn/" + imgName;
      let srcImg = "https://hm5556.xyz/" + imgName;
      return srcImg;
    },

    //upload image
    put(e) {
       console.log("image is *************", e.target.files);
      const file = e.target.files[0];
      // console.log(file);
      if (!file) {
        e.preventDefault();
        this.$message.warning("No file chosen");
        e.target.value = "";
        // return;
      }
      var FileExt = file.name.replace(/.+\./, "");
      if (
        ["jpg", "png", "jpeg", "svg", "gif"].indexOf(FileExt.toLowerCase()) ===
        -1
      ) {
        this.$message.warning(
          "Please upload attachments with suffixes of jpg, png, jpeg, svg, gif!"
        );
        e.target.value = "";
        // return false;
      }

      if (file.size > 1024 * 1024 * 2) {
        e.preventDefault();
        this.$message.warning("File too big (> 2MB)");
        e.target.value = "";
        // return;
      }

     // var resulturl = URL.createObjectURL(file);
      // console.log("resulturl", resulturl);
      // console.log("file name is", file.name);
      let fd = new FormData();
      fd.append("file", file, file.name);
      // this.axios
      //   .post(this.uploadPhotoUrl, fd)
       Upload(fd)
        .then((res) => {
          // console.log("res of imageeeeeeeeeeeeee", res);
          if (res.data.code == "0") {
            this.uploadImage = res.data.data.name;
            // this.$store.commit("play", true);

            // if (!this.$Global.customerInfo.customerId) return;
            let mySend = {
              from_id: this.$store.state.customerInfo.userId,
              to_id: this.$store.state.customerInfo.customerId,
              message: this.uploadImage,
              time: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
              msgType: 1,
              isMe: "1",
            };
            // console.log("data is *************",mySend);
            let sendData = {
              router: "sendChat",
              JsonData: {
                msg: this.uploadImage, //????????????,????????????????????????????????????
                msgType: 1, //????????????: 0 ??????  1 ??????   ,??????????????????,??????????????????,?????????
                from_id: this.$store.state.customerInfo.userId,
                to_id: this.$store.state.customerInfo.customerId,
                customer_id: this.$store.state.customerInfo.customerId,
                time: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
              },
            };
            this.$pomelo.sendCB(sendData,(res)=>{
              if (res.data.result == 'ok') {
                this.$Global.chatRecord.push(mySend);
                this.$store.commit(
                  "setOneToOneChatRecord",
                  this.$Global.chatRecord
                );
              }else{
                return this.$message.error('network error')
              }
            });
            // this.$store.commit("play", true);
            // this.$Global.chatRecord.push(mySend);
            // this.$store.commit(
            //   "setOneToOneChatRecord",
            //   this.$Global.chatRecord
            // );
            this.autoFocusMsg();
            e.target.value = "";
            return this.$message.success("Image uploaded successfully");
          }
        })
        .catch((e) => {
          console.log(e);
        });

      // clear data in input
    },
  },
  created() {
    // this.getChatMessage();
    this.autoFocusMsg();

    // setTimeout(() => {
    //     window.location.reload();
    // }, 3000);
  },
  computed: {
    watchDataChange() {
      // this.records = [];
      this.records = this.$store.state.OneToOneChatRecord;
      this.autoFocusMsg();
    },
    ...mapState({
      showModal: (state) => state.showModal,
      // records: (state) => state.OneToOneChatRecord,
      showEmoji: (state) => state.showEmoji,
      customerName: (state) => state.customerInfo.name,
    }),
  },
  watch: {
    watchDataChange() {},
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/chatsection.scss";
</style>