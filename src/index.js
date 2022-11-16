const express = require('express');
const { v4: uuidV4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

app.post('/account', (req, res) => {
  const { name, cpf } = req.body;

  const customerAlreadyExists = customers.some((customers) => (
    customers.cpf === cpf
  ))

  if (customerAlreadyExists) {
    return res.status(400).json({ message: 'Customer already exists.'})
  }

  customers.push({
    name,
    cpf,
    id: uuidV4(),
    statement: [],
  })

  return res.status(201).send('Criado com sucesso!');
})

app.listen(3333);