"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.freezeAccount = exports.createAndSendOTP_password = exports.createAndSendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nanoid_1 = require("nanoid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const redis_1 = require("./redis");
const middlwares_1 = require("../../middlwares");
const createOTP = (0, nanoid_1.customAlphabet)(`0123456789zxcvbnmalksjdhfgqwretruop`, 6);
function sendEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, html }) {
        try {
            const transporter = nodemailer_1.default.createTransport({
                service: `gmail`,
                auth: {
                    pass: process.env.APP_PASSWORD,
                    user: process.env.APP_GMAIL,
                },
                secure: true,
            });
            const Info = yield transporter.sendMail({
                to: to,
                from: process.env.APP_GMAIL,
                subject: subject,
                html: html,
            });
            middlwares_1.logger.info(Info.response);
        }
        catch (err) {
            middlwares_1.logger.error(err);
        }
    });
}
;
const createAndSendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const OTP = createOTP();
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">مرحبا بك!</h2>
            <p>شكراً لتسجيلك. الكود الخاص بك لتأكيد الحساب هو:</p>
            <h2 style="color: #191a1bff; text-align: center;">${OTP}</h2>
            <p>من فضلك أدخل هذا الكود في التطبيق لتفعيل حسابك.</p>
            <hr />
            <p style="font-size: 12px; color: #888;">إذا لم تطلب هذا الكود، تجاهل هذه الرسالة.</p>
          </div>
        </div>
      `;
    const hashOTP = yield bcrypt_1.default.hash(OTP, parseInt(process.env.SALT));
    yield redis_1.redis.set(`otp_${email}`, hashOTP, "EX", 2 * 60);
    sendEmail({
        to: email,
        subject: "reset password",
        html: html,
    });
});
exports.createAndSendOTP = createAndSendOTP;
const createAndSendOTP_password = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const OTP = createOTP();
    const resetHtml = `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #333;">طلب إعادة تعيين كلمة المرور</h2>
    <p style="font-size: 16px; color: #555;">لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك. من فضلك استخدم رمز التحقق (OTP) أدناه لإتمام العملية:</p>
    <div style="margin: 20px 0; padding: 20px; background-color: #f1f5ff; border-radius: 8px; text-align: center;">
      <h1 style="font-size: 36px; letter-spacing: 4px; color: #007BFF;">${OTP}</h1>
    </div>
    <p style="font-size: 14px; color: #777;">الرمز صالح لفترة محدودة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.</p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p> 
  </div>
</div>`;
    const hashOTP = yield bcrypt_1.default.hash(OTP, parseInt(process.env.SALT));
    yield redis_1.redis.set(`otp_reset:${email}`, hashOTP, "EX", 2 * 60);
    sendEmail({
        to: email,
        subject: "reset password",
        html: resetHtml,
    });
});
exports.createAndSendOTP_password = createAndSendOTP_password;
const freezeAccount = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const bannedHtml = `
<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #d9534f;">تم تجميد حسابك</h2>
    <p style="font-size: 16px; color: #555;">
      نود إعلامك بأنه قد تم <strong style="color:#d9534f;">تجميد حسابك</strong>  بسبب مخالفة سياسات الاستخدام.
    </p>
    <p style="font-size: 16px; color: #555;">
      إذا كنت تعتقد أن هذا الإجراء تم عن طريق الخطأ، يرجى التواصل مع فريق الدعم للمراجعة والمساعدة.
    </p>
    <div style="margin: 20px 0; padding: 20px; background-color: #fff3cd; border-radius: 8px; text-align: center; border: 1px solid #ffeeba;">
      <h3 style="color: #856404; margin: 0;">📩 تواصل معنا عبر البريد:</h3>
      <p style="font-size: 18px; color: #333; margin: 5px 0 0 0;">
        <a href="mailto:support@notes.com" style="color: #007BFF; text-decoration: none;">support@notes.com</a>
      </p>
    </div>
    <p style="font-size: 14px; color: #777;">
      نشكرك على تفهمك. فريق <strong>Notes</strong>.
    </p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">© 2025 Notes. جميع الحقوق محفوظة.</p>
  </div>
</div>
`;
    sendEmail({
        to: email,
        subject: "reset password",
        html: bannedHtml,
    });
});
exports.freezeAccount = freezeAccount;
