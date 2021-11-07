const jwt = require('jsonwebtoken');

const exportToken = (token) => {
    const exportedId = jwt.verify(token , process.env.JWT_SECRET, (err ,decoded) => {
        if (err) return null;
        else return decoded.id;
    })
    return exportedId;
} 
module.exports = exportToken