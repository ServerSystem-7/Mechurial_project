// 구현해야 함..
"use strict";
const db = require("../models/index"),
    Enroll = db.enroll;

// const { request } = require("express");

function getEnrollParams(body) {
    return {     // 수정해야함
        url: body.url,
        key1: body.key1,
        key2: body.key2,
        key3: body.key3,
        // notifyLogic: body.notifyLogic,
        notifyLogic: "or",
        siteName: body.siteName,
        dueDate: body.dueDate,
        dueDate: "2022-06-15",
        dueTime: '23:00:00'
    };
};

// exports.showEnroll = (req, res) => {
//     res.render("enroll");
// };

// exports.manageEnroll = (req, res) => {
//     res.render("enrollManagement");
// };
// exports.saveEnroll = async(req, res)=>{
//     try{
//         db.sequelize.sync({alter:true})
//         await Enroll.create({
//             url: req.body.url,
//             key1: req.body.key1,
//             key2: req.body.key2,
//             key3: req.body.key1,
//             notifyLogic: req.body.condition,
//             siteName: req.body.siteName,
//             dueDate: req.body.deadline,
//             dueTime: '23:00:00'
//         });
//         console.log(`url: ${req.body.url} key1: ${req.body.key1} key2: ${req.body.key2} key3: ${req.body.key3} condition: ${req.body.condition} name: ${req.body.siteName} deadline: ${req.body.deadline}`);
//         res.render("enrollManagement");
//     }catch(err){
//         res.status(500).send({
//             message: err.message
//         });
//     }
// };

module.exports = {
    manage: async (req, res, next) =>{
        try{
            let enrollments = await Enroll.findAll();
            res.locals.enrollments = enrollments;
            next();
        }catch(error){
            console.log(`Error fetching enroll: ${error.message}`);
            next(error);
        };
    },
    manageView: (req, res) => {
        res.render("enrollManagement"); // 이게 맞나
    },
    new: (req, res) => {
        res.render("enroll"); // 이게 맞나
    },
    create: async(req, res, next) =>{
        let enrollParams = getEnrollParams(req.body);
        try{
            let enroll = await Enroll.create(enrollParams);
            res.locals.redirect = "/enrollManagement";
            res.locals.enroll = enroll;
            next();
        }catch(error){
            console.log(`Error fetching enroll: ${error.message}`);
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
            let enrollId = req.params.id; // 수정
            let enroll = await Enroll.findByPk(enrollId);
            res.locals.enroll;
            next()
        } catch(error){
            console.log(`Error fetching enroll: ${error.message}`);
            next(error);
        };
    },
    showView: async(req,res) =>{
        let enrollId = req.params.id;
        let enroll = await Enroll.findByPk(enrollId)
        res.render("enroll", {enroll: enroll}); // 수정 
    },
    edit: async (req, res, next) =>{
        try{
            let enrollId = req.params.regNumber; // 수정
            let enroll = await Enroll.findByPk(enrollId);
            res.render("enroll",{
                enroll: enroll
            });
        } catch(error){
            console.log(`Error fetching enroll: ${error.message}`);
            next(error);
        };
    },
    update: async(req, res, next) => {
        let enrollId = req.params.id,
        enrollParams = getEnrollParams(req.body);
        console.log(enrollParams);
        try{
            let enroll = await Enroll.findByPkAndUpdate(enrollId, enrollParams);
            res.locals.redirect = `/enrollEdit/${enrollId}`;
            res.locals.enroll = enroll;
            next();
        }catch(error){
            console.log(`Error updating enroll by ID: ${error.message}`);
            next(error);
        };
    },
    delete: async(req, res, next) => {
        let enrollId = req.params.regNumber;
        try{
            let enroll = await Enroll.findByPkAndRemove(enrollId);
            res.locals.redirect = "/enrollManagement"; // 확인
            res.locals.enroll = enroll;
            next();
        }catch(error){
            console.log(`Error deleting enroll by ID: ${error.message}`);
            next(error);
        };
    }
};