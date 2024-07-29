const generateFileURL = (filename) => {
    return `http://localhost:3000/uploads/${filename}`;
}

module.exports = { generateFileURL };