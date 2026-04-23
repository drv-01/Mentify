const bcrypt = require("bcrypt");

const saltRounds = 12;

const hashPassword = async (password) =>{
    return await bcrypt.hash(password, saltRounds)
}

const verifyPassword = async (password, hashedPassword) =>{
    if (!password || !hashedPassword) return false;
    return await bcrypt.compare(password, hashedPassword)
}


module.exports = {hashPassword, verifyPassword};