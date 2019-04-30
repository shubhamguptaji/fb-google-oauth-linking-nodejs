const router = require("express").Router();

router.use("/", require("./routes/User"));

module.exports = router;
