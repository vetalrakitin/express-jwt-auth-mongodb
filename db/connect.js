const db = require("./index");

function connect(url) {
    return db.mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connect;
