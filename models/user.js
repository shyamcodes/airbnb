const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); //automatically implement kr deta hai username, password, hashing, salting, many methods khud se implement nahi krne hote.

module.exports = mongoose.model('User', userSchema);