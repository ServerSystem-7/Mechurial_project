exports.homePage = (req, res) => {
  res.render("mainpage"); // 메인페이지
};

exports.showEnrollment = (req, res) => {
  res.render("enroll"); //등록페이지
};

exports.showSignUp = (req, res) => {
  res.render("signUp_main"); //회원가입 페이지
};
exports.showEnrollManage = (req, res) => {
  res.render("enrollManage"); //등록 관리 페이지
};
exports.showserviceInfo = (req, res) => {
  res.render("serviceInfo"); // 서비스 이용안내
};
exports.showLogin = (req, res) => {
  res.render("logIn_main");
};

exports.showMypage = (req, res) => {
  res.render("mypage_main");
};

// module.exports = {
//   homepage: (req, res) => {
//     res.render("main"); // 메인페이지
//   },
//   Enrollment: (req, res) => {
//     res.render("enrollment", {
//       offeredCourse: courses,
//     });
//   },
//   signUp: (req, res) => {
//     res.render("signUp_main");
//   },
//   enrollManage: (req, res) => {
//     res.render("enrollManage");
//   },
//   serviceInfo: (req, res) => {
//     res.render("serviceInfo"); // 서비스 이용안내
//   },
//   login: (req, res) => {
//     res.render("logIn_main");
//   },

//   myPage: (req, res) => {
//     res.render("mypage_main");
//   },
// };

// //   Enrollment: (req, res) => {
// //     res.render("enrollment", {
// //       offeredCourse: courses,
// //     });
// //   }, //등록페이지

// //   signUp: (req, res) => {
// //     res.render("signUp_main");
// //   }, //회원가입 페이지

// //   enrollManage: (req, res) => {
// //     res.render("enrollManage");
// //   }, //등록 관리 페이지

// //   serviceInfo: (req, res) => {
// //     res.render("serviceInfo"); // 서비스 이용안내
// //   },

// //   login: (req, res) => {
// //     res.render("logIn_main");
// //   },

// //   myPage: (req, res) => {
// //     res.render("mypage_main");
// //   },
// // };

// // const process = {
// //   login: (req, res) => {
// //     console.log(req);
// //   },
// // };
