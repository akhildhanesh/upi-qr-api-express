const qr = require('qr-image')
const express = require('express')
const { rm, mkdir } = require('fs/promises')
const app = express()
require('dotenv').config()
const crypto = require('crypto')
const cors = require('cors')
app.use(cors())

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api/f36d205b485cae7df3a9', (req, res) => {
    // console.log(req.body)
    let { vpa, name, amount, remarks } = req.body
    if (vpa === '') return res.status(500).json({ error: `vpa cannot be empty` })
    if (name === '') return res.status(500).json({ error: `name cannot be empty` })
    if (amount === '') return res.status(500).json({ error: `amount cannot be empty` })
    if (amount > 100000) return res.status(500).json({ error: `maximum amount exceeded` })
    if ( amount < 1) return res.status(500).json({ error: `please enter a valid amount` })
    if (remarks.length > 50) return res.status(500).json({ error: `character limit for remarks is 50` })
    const url = `upi://pay?pa=${vpa}&pn=${name}&am=${amount}&tn=${remarks}`
    const qr_code = qr.imageSync(url)
    res.setHeader('Content-Type', 'image/png')
    return res.send(qr_code)
})

app.get('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' })
})

app.listen(PORT, () => console.log(`listening http://192.168.0.217:${PORT}`))


process.on('SIGINT', signal => {
    console.log(`Process ${process.pid} has been interrupted`)
    rm('./public/qr_code', { recursive: true, force: true })
        .then(() => {
            mkdir('./public/qr_code')
            process.exit(0)
        })
})
//
