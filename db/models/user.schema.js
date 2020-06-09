const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.methods.comparePasswordSync = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, parseInt(process.env.BCRYPT_SALT));
  next();
})

module.exports = userSchema;
