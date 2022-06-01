exports.getSubscriptionPage = (req, res) => {
  res.render("contact");
};

exports.saveSubscriber = async (req, res) => {
  try {
    await this.saveSubscriber.create({
      id: req.body.id,
      email: req.body.email,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
