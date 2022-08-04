const notFound = (req, res) => {
    res.status(404).json({error : "unkonown endpoint"})
}


module.exports = notFound