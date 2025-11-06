module.exports.home = function(req, res, next) {
    let messageObj = {
        message: "Used Products API v1 Running"
    }
    res.json(messageObj);
}