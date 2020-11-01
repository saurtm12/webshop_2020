const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // TODO: 9.4 Implement this
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    set: hashPassword
  },
  role: {
    type: String,
    trim: true,
    default: "customer",
    lowercase: true,
    enum: ['admin', 'customer']
  }
});

 function hashPassword(password) {
  if(password.length < 10) return;
  const saltRounds = 10;
  const hashed = bcrypt.hashSync(password, saltRounds);
  return hashed;
}

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = function (password) {
  // TODO: 9.4 Implement this
  return bcrypt.compare(password, this.password);
};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;
