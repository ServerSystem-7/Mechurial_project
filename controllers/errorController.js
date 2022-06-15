const httpStatus = require("http-status-codes");

exports.pageNotFoundError = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.render("error");
};

exports.internalServerError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`ERROR occurred: ${error.stack}`);
  if(errorCode==500){
    let str = "<script> alert('로그인이 필요한 서비스입니다.\n로그인을 해주세요.') </script>";
    res.send(str);
  }
  else{
    res.status(errorCode);
    res.send(`${errorCode} | Sorry, our application is taking a nap!`);
  }

};