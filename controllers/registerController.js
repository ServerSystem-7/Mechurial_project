"use strict";

const db = require("../models/index"),
    Register = db.registerTBL,
    Page = db.pageTBL;

function getRegisterParams(body) {
    return {
        pageUrl: body.url,
        key1: body.key1,
        key2: body.key2,
        key3: body.key3,
        notifyLogic: body.condition,
        siteName: body.siteName,
        dueDate: body.dueDate, 
        userId: "minjin11"  // temporary
    };
};


module.exports = {
    manage: async (req, res, next) => {  
        try{
            let registrations = await Register.findAll();
            res.locals.registrations = registrations;
            next();
        }catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },
    manageView: (req, res) => {
        is_logined = req.session.is_logined;
        userid =  req.session.userId;
        res.render("registerManagement");
    },
    new: (req, res) => {
        is_logined = req.session.is_logined;
        userid =  req.session.userId; 
        if(is_logined){
            res.render("registerNew");
        }
        else{
            res.render("logIn_main");
        }
    },
    create: async(req, res, next) =>{
        try{
            let registerParams = getRegisterParams(req.body);
            const url = registerParams["pageUrl"];
            let result= await Page.findOne({
            where:{url}
            })
            is_logined = req.session.is_logined;
            userid =  req.session.userId;
            if(result==undefined){
                console.log('pageTBL에 해당 url 존재X');
                let page = await Page.create({url: registerParams["pageUrl"]});
                let register = await Register.create(registerParams);
                res.locals.page = page; 
                res.locals.register = register;
                res.locals.redirect = "/registerManagement";
                next();
            }else {
                console.log('pageTBL에 해당 url 존재O');
                let register = await Register.create(registerParams);
                res.locals.register = register;
                res.locals.redirect = "/registerManagement";
                next();
            }
        } catch(err){
            console.error(err);
            next(err);
        }
    },
    redirectView: (reg, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined){
            res.redirect(redirectPath);
        }
        else {
            next();
        }
    },
    show: async(req, res, next) => {
        try{
            if(req.session.is_logined){
                let userId = req.session.userId;
                is_logined = req.session.is_logined;
                userid =  req.session.userId;
                Register.findAll({
                where: {userId : userId}
            }).then((registrations) => {
                    res.render("registerManagement",{registrations});
                })
            }
            else{
                is_logined = req.session.is_logined;
                userid =  req.session.userId;
                res.render("logIn_main");
            }

        } catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },
    showView: async(req,res) =>{
        // let registerId = req.params.id;
        // let register = await Register.findByPk(registerId)
        is_logined = req.session.is_logined;
        userid =  req.session.userId;
        res.render("registerNew", {register: register});
    },
    edit: async (req, res, next) =>{
        try{
            let registerId = req.params.registerId;
            let register = await Register.findByPk(registerId);
            is_logined = req.session.is_logined;
            userid =  req.session.userId;
            res.render("registerNew",{
                register: register
            });
        } catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },
    update: async(req, res, next) => {
        let registerId = req.params.id,
        registerParams = getRegisterParams(req.body);
        console.log(registerParams);
        try{
            let register = await Register.findByPkAndUpdate(registerId, registerParams);
            // res.locals.redirect = `/registerEdit/${registerId}`;
            res.locals.register = register;
            is_logined = req.session.is_logined;
            userid =  req.session.userId;
            res.locals.redirect = "/registerManagement";
            next();
        }catch(error){
            console.log(`Error updating register by ID: ${error.message}`);
            next(error);
        };
    },
    delete: async(req, res, next) => {
        try{
            let registerParams = getRegisterParams(req.body);
            let registerId = req.params.registerId;
            const url = registerParams["pageUrl"];

            let register = await Register.findByPkAndRemove(registerId);
            res.locals.register = register;

            let result= await Register.findOne({
            where:{pageUrl:url}
            })

            if(result==undefined){
                console.log('url 혼자 사용 중');
                let page = await Page.findByPkAndRemove(registerParams["pageUrl"]);
                res.locals.page = page;
                is_logined = req.session.is_logined;
                userid =  req.session.userId;
                res.locals.redirect = "/registerManagement";
                next();
            }else {
                console.log('url 중복 사용 중');
                is_logined = req.session.is_logined;
                userid =  req.session.userId;
                res.locals.redirect = "/registerManagement";
                next();
            }
        }catch(error){
            console.log(`Error deleting register by ID: ${error.message}`);
            next(error);
        };
    }
};