const { next } = require("cheerio/lib/api/traversing");
const db = require("../models/index");

let checkPw = false;
module.exports = {
  enterMypage: async(req, res) => {  
    if(req.session.is_logined){
      if(checkPw){
        try{
            const user = await db.userTBL.findOne({
                where: {id: req.session.userId}
            });

            checkPw=false;
            res.render("mypage_main",{
                user:user
            });
    }catch(err){
        console.log(err);
    }
  }
  else{
      const str=
      `<html>
        <script>
            alert('비밀번호를 입력해주세요.');
            location.href='/mypage/check';
        </script>
    </html>`
    res.send(str);
}   
    }
    else{
      is_logined = req.session.is_logined;
      userid =  req.session.userId;
      res.render("logIn_main");
    }
},
    showMypage : async (req,res) =>{
        if(checkPw){
            try{
                const user = await db.userTBL.findOne({
                    where: {id: req.session.userId}
                });

                checkPw=false;
                res.render("mypage_main",{
                    user:user
                });
        }catch(err){
            console.log(err);
        }
    }
    else{
        const str=
        `<html>
            <script>
                alert('비밀번호를 입력해주세요.');
                location.href='/mypage/check';
            </script>
        </html>`
        res.send(str);
    }   
    },

    showCheckPw: (req,res) =>{
        res.render("mypage_checkPw");
      },

    checkPw: async (req,res, next) => {
        console.log("로그인된 아이디는 "+req.session.userId);
        try{
          const inputPw = req.body.password;
          console.log(inputPw);
  
          const user = await db.userTBL.findOne({
            where: {id: req.session.userId}
          })
  
          if(user){
              let passwordMatch = await user.passwordComparison(inputPw, user.password);
              console.log(passwordMatch);
  
              if(passwordMatch){
                checkPw=true;
                res.send({
                  result:"ok"
                });
              } else{
              res.send({
                result:"fail"
              });
            } }
        }catch(err){ console.error(err);
            next(err);
            res.end();
        }   
    },

    


  };