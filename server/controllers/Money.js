const models = require('../models');

const { Account } = models;

const premiumPage = (req, res) => res.render('money');

// Updates user status of premium
const premiumBought = async (req, res) => {
  const username = { username: req.query._id };

  try {
    const updatePrem = await Account.findOneAndUpdate(
      { username },
      { $set: { premium: true } },
      { new: true },
    ).lean().exec();

    if (!updatePrem) {
      return res.status(400).json({ error: 'Something went wrong. ' });
    }
    return res.status(200).json({ error: 'Successfully bought premium!' });
  } catch (err) {
    return res.status(400).json({ error: 'something went wrong' });
  }
};

module.exports = {
  premiumPage,
  premiumBought,
};
