const express = require("express")
const fs = require("fs")
const app = express()
const cors = require("cors")
const port = 3000

app.use(cors())

//app.use(express.static('public'));

app.get("/items", (req, res) => {
    try {
        const data = fs.readFileSync("items.json", "utf8")
        res.setHeader("Content-Type", "application/json; charset=UTF-8")
        res.send(JSON.parse(data))
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.listen(port, function () {
    console.log("Listening on port 3000...")
})
