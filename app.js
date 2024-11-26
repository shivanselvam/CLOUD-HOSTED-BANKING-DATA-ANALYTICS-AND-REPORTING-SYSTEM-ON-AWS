const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('morgan');

const db = mysql.createConnection({
  host: 'your-rds-instance-url',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name',
});

db.connect((err) => {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

app.use(express.json());

app.post('/report', (req, res) => {
  const { accountNumber, reportType } = req.body;
  let query;
  if (reportType === 'transaction') {
    query = `SELECT * FROM transactions WHERE account_number = '${accountNumber}'`;
  } else if (reportType === 'balance') {
    query = `SELECT balance FROM accounts WHERE account_number = '${accountNumber}'`;
  }
  db.query(query, (err, results) => {
    if (err) {
      console.error('error running query:', err);
      res.status(500).send({ message: 'Error generating report' });
    } else {
      res.send({ data: results });
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
app.use((req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
});

app.post('/report', (req, res) => {
  const { accountNumber, reportType } = req.body;
  const encryptedAccountNumber = crypto.createHash('sha256').update(accountNumber).digest('hex');
});
app.use(logger('dev'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});



