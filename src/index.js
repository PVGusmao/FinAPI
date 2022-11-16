const { response } = require('express');
const express = require('express');
const { v4: uuidV4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

// Middleware

function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) return res.status(400).json({ message: 'Customer not found.'});

  req.customer = customer;

  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, curr) => {
    if (curr.type = 'credit') {
      return acc + curr.amount;
    } else {
      return acc - curr.amount;
    }
  }, 0)

  return balance;
}

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

app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  return res.json(customer.statement);
})

app.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperations = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperations);

  return res.status(201).send('Deposit successfully added!');
})

app.post('/withdraw', verifyIfExistsAccountCPF, (req, res) => {
  const { amount } = req.body;

  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds!'});
  }

  const statementOperations = {
    amount,
    created_at: new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperations);

  return res.status(201).send('Saque feito com sucesso.')
})

app.listen(3333);
