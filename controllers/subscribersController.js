const res = require("express/lib/response");

const db = require("../models/index"),
  Subscriber = db.subscriber,
  getSubscriberParams = (body) => {
    return {
      id: body.id,
      email: body.email,
    };
  };
module.exports = {
  index: async (req, res, next) => {
    try {
      let subscribers = await Subscriber.findAll();
      res.locals.subscribers = subscribers;
      next();
    } catch (error) {
      console("error!");
    }
  },
  indexView: (req, res) => {
    res.render("subscribers/index");
  },
  new: (req, res) => {
    res.render("subscribers/new");
  },
  create: async (req, res, next) => {
    let subscriberParams = getSubscriberParams(req.body);
    try {
      let subscriber = await Subscriber.create(subscriberParams);
      res.locals.redirect = "/subscribers";
      res.locals.subscriber = subscriber;
      next();
    } catch (error) {
      console.log("Error");
      next(error);
    }
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath == undefined) res.redirect(redirectPath);
    else next();
  },
  show: async (req, res, next) => {
    try {
      let subscriberId = req.params.email;
      let subscriber = await Subscriber.findByPk(subscriberId);
      res.locals.subscriber = subscriber;
      next();
    } catch (error) {
      console.log("error");
      next(error);
    }
  },
  showView: async (req, res) => {
    res.render("subscribe/show");
  },
  edit: async (req, res, next) => {
    try {
      let subscriberId = req.params.email;
      let subscriber = await Subscriber.findByPk(subscriberId);
      res.render =
        ("subscribers/edit",
        {
          subscriber: subscriber,
        });
    } catch (error) {
      console.log("error");
      next(error);
    }
  },
  update: async (req, res, next) => {
    let subscriberId = req.params.id,
      subscriberParams = getSubscriberParams(req.body);
    console.log(subscriberParams);
    try {
      let subscriber = await Subscriber.findByPkAndUpdate(
        subscriberId,
        subscriberParams
      );
      res.locals.redirect = "/subscribers/${subscriberId}";
      res.locals.subscriber = subscriber;
      next();
    } catch (error) {
      console.log("Error");
      next(error);
    }
  },
  delete: async (req, res, next) => {
    let subscriberId = req.params.id;
    try {
      let subscriber = await Subscriber.findByPkAndRemove(subscriberId);
      res.locals.redirect = "/subscribers";
      next();
    } catch (error) {
      console.log("Error");
      next(error);
    }
  },
};
