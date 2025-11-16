"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationHandler = void 0;
const notificationHandler = (type, data) => {
    let title = "";
    let content = "";
    switch (type) {
        case "like_post":
            title = "إعجاب جديد بالمنشور 💖";
            content = `${data.userId} أعجب بمنشورك`;
            break;
        case "like_comment":
            title = "إعجاب بتعليقك 👍";
            content = `${data.username} أعجب بتعليقك على المنشور "${data.postTitle}"`;
            break;
        case "comment_post":
            title = "تعليق جديد 💬";
            content = `${data.username} علّق على منشورك: "${data.commentSnippet}"`;
            break;
        case "reply_comment":
            title = "رد على تعليقك 🔁";
            content = `${data.username} رد على تعليقك: "${data.reply}"`;
            break;
        case "friend_request":
            title = "طلب صداقة جديد 👥";
            content = `${data.username} أرسل لك طلب صداقة`;
            break;
        case "friend_rersponse":
            title = "تم قبول طلب الصداقة";
            content = `${data.username}  تم قبول طلب الصداقة الذى تم ارساله الى `;
            break;
        default:
            title = "إشعار جديد";
            content = "لديك إشعار جديد في حسابك";
            break;
    }
    return { title, content };
};
exports.notificationHandler = notificationHandler;
