const baseURL = "http://localhost:3000";
const token = localStorage.getItem("token");

let globalProfile = {};
const headers = {
  "Content-Type": "application/json; charset=UTF-8",
  authorization: `Bearer ${token}`,
};

const clientIo = io(baseURL, { auth: { authorization: token } });

// Default images
let avatar = "./avatar/Avatar-No-Background.png";
let meImage = "./avatar/Avatar-No-Background.png";
let friendImage = "./avatar/Avatar-No-Background.png";

// ====================== Socket Event Handlers ======================
clientIo.on("server_error", (err) => console.log("custom_error:", err.message));

clientIo.on("connected", ({ user }) => {
  console.log("Connected user:", user);
  globalProfile = user;
});

clientIo.on("message-send", (message) => {
  renderMessage(message);
});

clientIo.on("chat-history", ({ chat, targetUserId }) => {
  showData(targetUserId, chat, false);
});

clientIo.on("group-chat-history", ({ chat, targetGroupId }) => {
  showData(targetGroupId, chat, true);
});

clientIo.on("userOnline", ({ userId }) => {
  const statusEl = document.getElementById(`c_${userId}`);
  if (statusEl) statusEl.innerHTML = "🟢";
});

clientIo.on("userOffline", ({ userId }) => {
  const statusEl = document.getElementById(`c_${userId}`);
  if (statusEl) statusEl.innerHTML = "⚪";
});

clientIo.on("allOnlineUsers", ({ onlineUserIds }) => {
  onlineUserIds.forEach((id) => {
    const statusEl = document.getElementById(`c_${id}`);
    if (statusEl) statusEl.innerHTML = "🟢";
  });
});

// ====================== Message Rendering ======================
function renderMessage(message) {
  const div = document.createElement("div");
  div.className =
    message.senderId.toString() === globalProfile._id
      ? "me text-end p-2"
      : "myFriend p-2";
  div.dir = message.senderId.toString() === globalProfile._id ? "rtl" : "ltr";

  const imagePath =
    message.senderId.toString() === globalProfile._id ? meImage : friendImage;
  div.innerHTML = `<img class="chatImage" src="${imagePath}" alt=""><span class="mx-2">${message.text}</span>`;
  document.getElementById("messageList").appendChild(div);

  $(".noResult").hide();
  const audio = document.getElementById("notifyTone");
  audio.currentTime = 0;
  audio.play().catch((err) => console.log("Audio play blocked:", err));
}

function renderMyMessage(text) {
  appendMessage(text, meImage, "me", "rtl");
}

function renderFriendMessage(text) {
  appendMessage(text, friendImage, "myFriend", "ltr");
}

function appendMessage(text, img, className, dir) {
  const div = document.createElement("div");
  div.className = `${className} p-2`;
  div.dir = dir;
  div.innerHTML = `<img class="chatImage" src="${img}" alt=""><span class="mx-2">${text}</span>`;
  document.getElementById("messageList").appendChild(div);
}

function SayHi() {
  const div = document.createElement("div");
  div.className = "noResult text-center p-2";
  div.dir = "ltr";
  div.innerHTML = `<span class="mx-2">Say Hi to start the conversation.</span>`;
  document.getElementById("messageList").appendChild(div);
}

// ====================== Send Message ======================
function sendMessage(sendTo, type) {
  const text = $("#messageBody").val().trim();
  if (!text) return;

  const data =
    type === "ovo"
      ? { text, targetUserId: sendTo }
      : { text, targetGroupId: sendTo };
  const event = type === "ovo" ? "send-private-message" : "send-group-message";

  clientIo.emit(event, data);
  $("#messageBody").val("");
}

// ====================== Show Data ======================
function showData(sendTo, chat, isGroup = false) {
  document.getElementById("sendMessage").onclick = () =>
    sendMessage(sendTo, isGroup ? "ovm" : "ovo");

  const msgList = document.getElementById("messageList");
  msgList.innerHTML = "";

  if (chat?.length) {
    $(".noResult").hide();
    chat.forEach((msg) => {
      msg.senderId.toString() === globalProfile._id
        ? renderMyMessage(msg.text)
        : renderFriendMessage(msg.text);
    });
  } else SayHi();

  if (!isGroup) $(`#c_${sendTo}`).hide();
  else $(`#g_${sendTo}`).hide();
}

// ====================== Show Friends & Groups ======================
function showUsersData(users = []) {
  const container = document.getElementById("chatUsers");
  container.innerHTML = users
    .map((friend) => {
      const imagePath = avatar;
      return `<div onclick="displayChatUser('${friend._id}')" class="chatUser my-2">
            <img class="chatImage" src="${imagePath}" alt="">
            <span class="ps-2">${friend.username}</span>
            <span id="c_${friend._id}" class="ps-2 closeSpan">⚪</span>
        </div>`;
    })
    .join("");
}

function showGroupList(groups = []) {
  const container = document.getElementById("chatGroups");
  container.innerHTML = groups
    .map((group) => {
      return `<div onclick="displayGroupChat('${group._id}')" class="chatUser my-2">
            <img class="chatImage" src="${avatar}" alt="">
            <span class="ps-2">${group.name}</span>
            <span id="g_${group._id}" class="ps-2 closeSpan"></span>
        </div>`;
    })
    .join("");
}

// ====================== Display Chat ======================
let currentChatUserId = null;

function displayChatUser(userId) {
  currentChatUserId = userId;
  clientIo.emit("get-chat-history", userId);
}

function displayGroupChat(groupId) {
  clientIo.emit("get-group-chat", groupId);
}

// ====================== Fetch Data ======================
// function getUserData() {
//   axios
//     .get(`${baseURL}/api/profile/friend-requests?status=accepted`, { headers })
//     .then((response) => {
//       const { context, user } = response.data?.data || {};
//       if (user) globalProfile = user;

//       const profileImgEl = document.getElementById("profileImage");
//       const usernameEl = document.getElementById("userName");
//       if (profileImgEl) profileImgEl.src = user?.profilePicture || avatar;
//       if (usernameEl) usernameEl.innerHTML = globalProfile?.username || "User";

//       if (context) {
//         showUsersData(context.friends || []);
//         showGroupList(context.groups || []);
//       }
//     })
//     .catch((error) => console.log("❌ Error in getUserData:", error));
// }
function getUserData() {
  // جلب الأصدقاء
  axios
    .get(`${baseURL}/api/profile/friend-requests?status=accepted`, { headers })
    .then((response) => {
      const { context, user } = response.data?.data || {};
      if (user) globalProfile = user;

      const profileImgEl = document.getElementById("profileImage");
      const usernameEl = document.getElementById("userName");
      if (profileImgEl) profileImgEl.src = user?.profilePicture || avatar;
      if (usernameEl) usernameEl.innerHTML = globalProfile?.username || "User";

      // عرض الأصدقاء
      if (context) showUsersData(context.friends || []);

      // جلب الجروبات من المسار الجديد
      axios
        .get(`${baseURL}/api/profile/group-list`, { headers })
        .then((res) => {
          const groups = res.data?.data?.context?.groups || [];
          showGroupList(groups);
        })
        .catch((err) => console.log("❌ Error fetching groups:", err));
    })
    .catch((error) => console.log("❌ Error in getUserData:", error));
}
clientIo.on("notification", (data) => {
  console.log("Notification received:", data);
});

// ====================== Initialize ======================
getUserData();
