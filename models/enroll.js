const { Sequelize } = require(".");

// models/enroll.js 등록 부분
module.exports = (Sequelize, Sequelize) => {
    class Enroll extends Sequelize.Model{
        static async findByPkAndUpdate(id, params){
            try{
                let enroll = await Enroll.findByPk(id);
                if(enroll){
                    enroll = await Enroll.update(params, {
                        where:{id:id}
                    });
                }
                return enroll;
            }catch(err){
                console.log(err);
            }

        }
    }
}

enroll.init({
    
})