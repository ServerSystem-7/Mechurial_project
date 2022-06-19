exports.homePage = (req, res) => {
  is_logined = req.session.is_logined;
  userid =  req.session.userId;
  res.render("mainpage"); // 메인페이지
};

exports.showSignUp = (req, res) => {
  is_logined = req.session.is_logined;
  userid =  req.session.userId;
  res.render("signUp_main"); //회원가입 페이지
};

exports.showEnrollManage = (req, res) => {
  is_logined = req.session.is_logined;
  userid =  req.session.userId;
  res.render("enrollManage"); //등록 관리 페이지
};

exports.showserviceInfo = (req, res) => {
  is_logined = req.session.is_logined;
  userid =  req.session.userId;
  res.render("serviceInfo"); // 서비스 이용안내
};

exports.showLogin = (req, res) => {
  is_logined = req.session.is_logined;
  userid =  req.session.userId;
  res.render("logIn_main");
};

exports.showMypage = (req, res) => {
  is_logined = req.session.is_logined;
  userid =  req.session.userId;
  res.render("mypage_main");
};
