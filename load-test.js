// // import http from "k6/http";
// // import { check, sleep } from "k6";

// // export let options = {
// //   vus: 20, // 20 Virtual Users
// //   iterations: 20, // كل واحد يعمل signup + login مرة واحدة
// // };

// // export default function () {
// //   // توليد رقم عشوائي للإيميل
// //   const randomNum = Math.floor(Math.random() * 100000);
// //   const email = `mohamedawad${randomNum}@gmail.com`;
// //   const username = `moAwad${randomNum}`;

// //   // بيانات الـ Signup
// //   const signupPayload = JSON.stringify({
// //     username: username,
// //     password: "Mo.awad4444",
// //     email: email,
// //     age: 25,
// //     phone: "01016624425",
// //     gender: "male",
// //     DOB: "2005-01-01",
// //   });

// //   const headers = {
// //     "Content-Type": "application/json",
// //   };

// //   // طلب الـ Signup
// //   let signupRes = http.post(
// //     "http://host.docker.internal:5000/api/auth/signup",
// //     signupPayload,
// //     { headers }
// //   );

// //   check(signupRes, {
// //     "signup status is 201 or 200": (r) => r.status === 201 || r.status === 200,
// //   });

// //   sleep(1);

//   // محاولة Login بدون تأكيد البريد => نتوقع 400
//   const loginPayload = JSON.stringify({
//     email: email,
//     password: "Mo.awad4444",
//   });

//   let loginRes = http.post(
//     "http://host.docker.internal:5000/api/auth/login",
//     loginPayload,
//     { headers }
//   );

//   check(loginRes, {
//     "login returns 400 due to unconfirmed email": (r) => r.status === 400,
//   });

//   sleep(1);
// }
import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 5, 
  iterations: 50, 
};

export function setup() {
  const loginPayload = JSON.stringify({
    email: "mohamedahmedawad180@gmail.com",
    password: "Mo.awad4444",
  });

  const headers = { "Content-Type": "application/json" };

  const res = http.post(
    "http://host.docker.internal:5000/api/auth/login",
    loginPayload,
    { headers }
  );

  check(res, {
    "login success (200)": (r) => r.status === 200,
  });

  const accessToken = res.json().accessToken;

  return { accessToken };
}

export default function (data) {
  
  const postPayload = JSON.stringify({
    content: `This is a load test post ${__ITER}`,
  });

  const postHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.accessToken}`,
  };

  const postRes = http.post(
    "http://host.docker.internal:5000/api/posts/create",
    postPayload,
    { headers: postHeaders }
  );

  check(postRes, {
    "post created (201/200)": (r) => r.status === 201 || r.status === 200,
  });

  const postId = postRes.json().data.context.createdPost._id;

  for (let i = 1; i <= 80; i++) {
    const commentPayload = JSON.stringify({
      content: `This is comment ${i} for post ${postId}`,
    });

    const commentRes = http.post(
      `http://host.docker.internal:5000/api/posts/${postId}/comments/create`,
      commentPayload,
      { headers: postHeaders }
    );

    check(commentRes, {
      "comment created (201/200)": (r) => r.status === 201 || r.status === 200,
    });

    sleep(0.01); 
  }

  sleep(1);
}
