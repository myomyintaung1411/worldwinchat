/* eslint-disable */


import pomelo from "./PomeloClient.js";
import global from "./global";
import ws from "./ws2";
import AES from '../api/aes'
import store from '../store/index'
var nHeartBeat = 0;
var s_timer;
var isConn = true
var interval = null
var p_server = new Pomelo();
var p_server2 = new Pomelo();

// function conn(cb) {
//   var loginInfo = JSON.parse(localStorage.getItem("login_info"));
//   var msg = { uid: loginInfo.login_id };
//   var msg2 = { userId: loginInfo.login_id, token: loginInfo.login_token, type: 1 }; //type: 1为登录聊天服务器
//   p_server.init(
//     { host: window.g.ip, port: window.g.pomelo_ws_port, log: true },
//     function() {
//       p_server.request("gate.gateHandler.queryEntry", msg, function(res) {
//         p_server.disconnect();
//         if (res.code == 200) {
//           p_server2.init(
//             { host: res.host, port: res.port, log: true },
//             function(res) {
//               p_server2.request("connector.entryHandler.entry", msg2, function(
//                 res
//               ) {
//                 // console.log("connector:",res);
//                 if (res.code == 200) startTimer();
//                 cb(null, res);
//               });
//             }
//           );
//         } else {
//           cb(null, res);
//         }
//       });
//     }
//   );
// }
function conn(cb) {
  // console.log(window.g.ip, window.g.pomelo_ws_port);
  // console.log(global.customerInfo.userId, global.customerInfo.token);
  // let loginInfo = JSON.parse(localStorage.getItem('LG_INFO'))
  // console.log('login info ...00000000000000', loginInfo)
  var msg = { uid: store.state.customerInfo.userId }
  var msg2 = { userId: store.state.customerInfo.userId, level: 2, token: store.state.customerInfo.token, systemId: null || '', groupId: null || '', customerId: store.state.customerInfo.customerId || '' }
  p_server.init(
    { host: 'hm5556.xyz', port: '/conn2/', log: true },
    // { host: 'asdqwe.co', port: '/conn1/', log: true },
    //{ host: window.g.wsip, log: true },
    function () {
      p_server.request('gate.gateHandler.queryEntry', msg, res => {
        p_server.disconnect()
        // console.log(res, 'first', msg, msg2)
        if (res.code == 200) {

        //  let pt = res.port == '9010' ? '/conn3/' : res.port == '9011' ? '/conn4/' : '/conn5/'
          p_server2.init(
            { host: 'hm5556.xyz', port: '/conn3/', log: true },
            // { host: 'asdqwe.co', port: '/conn3/', log: true },
            function (res) {
              p_server2.request('connector.entryHandler.entry', msg2, res => {
                console.log('Connector res ', res)
                if (res.code == 200) {
                  isConn = false
                  if (this.interval != null) {
                    clearInterval(this.interval)
                    this.interval = null
                  }
                  startTimer()
                  cb(null, res)
                  // console.log('cbbbbbbbbbbbbbb', cb)
                }
              })
            }
          )
        }
      })
    }
  )
}

// p_server2.on("close", function (e) {
//   // 连接关闭
//   // console.log("--------pomelo onClose------------");
//   var interval = setInterval(() => {
//     conn(function (err, res) {
//       if (res.code == 200) clearInterval(interval);
//     });
//   }, 5000);
// });

p_server2.on('close', function (e) {
  console.log('close ', new Date())
  isConn = true
  if (this.interval != null) {
    clearInterval(this.interval)
    this.interval = null
  }
  // 连接关闭
  if (isConn) {
    // isConn = false
    console.log('enter close ................', isConn)
    this.interval = setInterval(() => {
      console.log('enter interval loop ...', isConn)
      if (isConn) {
        console.log('enter reconnect ...', isConn)
        // isConn = false
        conn(function (err, res) {
          if (res.code == 200) {
            clearInterval(interval)
            interval = null
            // isConn = true
            console.log('isConn ', isConn)
          }
        });
      }
      // isConn = true
    }, 5000)
  }
})


p_server2.on("onMsg", function (e) {
  // 被踢开
  // console.log("----onMsg------:", e);
  ws.doData(e); //监听，有新消息事件
});

p_server2.on("onKick", function (e) {
  // 被踢开
  // console.log("--------pomelo onKick------------");
  // alert("亲,有相同帐号登录,你被踢出来了!");
  kick();
});

function kick() {
  nHeartBeat = 0;
  p_server2.disconnect();
  clearInterval(s_timer);
  let opened = window.open('about:blank', '_self');
  opened.opener = null;
  opened.close();
  // window.close()
  //  clearInterval(this.interval)
  // window.location.reload();
}

var n = 0;
function send(msg) {
  n = n + 1;
  // console.log("--------------->send: ", n, msg);
  let en = global.en;
  let msgSend = AES.encrypt(JSON.stringify(msg), en);
  var route = "chat.chatHandler.onMsg"; //"agent.agentHandler.getMsg";
  p_server2.request(route, msgSend, function (res) {
    console.log("------------->accept: ", n, res);
    ws.doData(res);
  });
}

function sendCB(msg, cb) {
  n = n + 1
  let en = global.en;
  let msgSend = AES.encrypt(JSON.stringify(msg), en);
  var route = "chat.chatHandler.onMsg"; //"agent.agentHandler.getMsg";
  p_server2.request(route, msgSend, function (res) {
    // console.log('res ', res)
    cb(JSON.parse(AES.decrypt(res, en)))
  })
}

function startTimer() {
  s_timer = setInterval(() => {
    chkHeartBeat(p_server2);
  }, 5000);
}

function chkHeartBeat(server) {
  console.log("chat heart beat ******************", nHeartBeat);
  if (nHeartBeat > 30) {
    //console.log("自检测跳线了");
    window.location.reload();
    alert("Due to poor network signal, you need to log in again");
    server.disconnect();
    clearInterval(s_timer);

  }
  nHeartBeat += 5;
  var msg = { uid: global.optioner.Id }; //记得改
  var route = "chat.chatHandler.chkHardBean";
  server.request(route, msg, function (data) {
    if (data.code == "07") nHeartBeat = 0;
  });
}
export default {
  conn,
  send,
  kick,
  sendCB
};
