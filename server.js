const express = require('express')
const app = express()

app.listen(8000, () => {
  console.log(`Example app listening at http://localhost:8000`)
})

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
  });