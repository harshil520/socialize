const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;