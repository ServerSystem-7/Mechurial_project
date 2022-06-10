"use strict";

const { registerTBL } = require("../models/index");

const db = require("../models/index"),
    Register = db.registerTBL;

function getRegisterParams(body) {
    return {
        pageUrl: body.url,
        key1: body.key1,
        key2: body.key2,
        key3: body.key3,
        notifyLogic: body.condition,
        siteName: body.siteName,
        dueDate: "2022-06-15",  // temporary
        userId: "minjin11"  // temporary
    };
};

module.exports = {
    manage: async (req, res, next) => {  // 
        try{
            let registrations = await Register.findAll();
            res.locals.registrations = registrations;
            next();
        }catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },
    manageView: (req, res) => {  //
        res.render("registerManagement");
    },
    new: (req, res) => {  // 
        res.render("registerNew");
    },
    create: async(req, res, next) =>{
        let registerParams = getRegisterParams(req.body);
        try{
            let register = await Register.create(registerParams);  // TODO: create Page first?
            res.locals.redirect = "/registerManagement";
            res.locals.register = register;
            next();
        }catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
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
            let registerId = req.params.id; // 수정
            let register = await Register.findByPk(registerId);
            res.locals.register;
            next()
        } catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },
    showView: async(req,res) =>{
        let registerId = req.params.id;
        let register = await Register.findByPk(registerId)
        res.render("registerNew", {register: register});
    },
    edit: async (req, res, next) =>{
        try{
            let registerId = req.params.registerId;
            let register = await Register.findByPk(registerId);
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
            res.locals.redirect = `/registerEdit/${registerId}`;
            res.locals.register = register;
            next();
        }catch(error){
            console.log(`Error updating register by ID: ${error.message}`);
            next(error);
        };
    },
    delete: async(req, res, next) => {
        let registerId = req.params.registerId;
        try{
            let register = await Register.findByPkAndRemove(registerId);
            res.locals.redirect = "/registerManagement"; // 확인
            res.locals.register = register;
            next();
        }catch(error){
            console.log(`Error deleting register by ID: ${error.message}`);
            next(error);
        };
    }
};