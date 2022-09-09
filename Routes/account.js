const express = require("express")
const accountRoutes = express.Router();
const fs = require('fs');

const dataPath = './Details/useraccount.json'

// util functions 

const saveAccountData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync(dataPath, stringifyData)
}

const getAccountData = () => {
  const jsonData = fs.readFileSync(dataPath)
  return JSON.parse(jsonData)
}


//test
accountRoutes.get('/test', (req,res)=>{
    res.send('Hello World!')
})

// reading the data
accountRoutes.get('/account', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    res.send(JSON.parse(data));
  });
});


accountRoutes.post('/account/addaccount', (req, res) => {

  var existAccounts = getAccountData()
  const newAccountId = Math.floor(100000 + Math.random() * 900000)

  existAccounts[newAccountId] = req.body

  console.log(existAccounts);

  saveAccountData(existAccounts);
  res.send({ success: true, msg: 'account data added successfully' })
})

// Read - get all accounts from the json file
accountRoutes.get('/account/list', (req, res) => {
  const accounts = getAccountData()
  res.send(accounts)
})

accountRoutes.get('/account/:id1', (req, res) => {
  const id1 = req.params.id1;
  fs.readFile(dataPath, 'utf8', (err, data) => {
    let arr1 = [];
    let arr2 = [];
    var d = JSON.parse(data);
    var q = d['query'][id1];
    for (x in q['queries']) {
      if (q['queries'][x]["flag"] == 1) {
        arr1.push(q['queries'][x]);
      }
      else {
        arr2.push(q['queries'][x]);
      }
    }
    res.json([arr1, arr2]);
  }
  )
})

accountRoutes.put('/account/:role/:id1/:id2', async (req, res) => {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  fs.readFile(dataPath, 'utf8', (err, data) => {
    // convert json data to js object
    if (err) throw err;
    var d = JSON.parse(data);
    if (req.params.role === 'admin') {
      d['query'][id1]['queries'][id2]["status"]["admin"] = req.body.flag;
    } else if (req.params.role === 'sdo') {
      d['query'][id1]['queries'][id2]["status"]["sdo"] = req.body.flag;
    } else if (req.params.role === 'engineer') {
      d['query'][id1]['queries'][id2]["status"]["engineer"] = req.body.flag;
    } else if (req.params.role === 'supervisor') {
      d['query'][id1]['queries'][id2]["status"]["supervisor"] = req.body.flag;
    }
    if (d['query'][id1]['queries'][id2]["status"]["admin"] == 1 && d['query'][id1]['queries'][id2]["status"]["sdo"] == 1 && d['query'][id1]['queries'][id2]["status"]["engineer"] == 1 &&
      d['query'][id1]['queries'][id2]["status"]["supervisor"] == 1) {
      d['query'][id1]['queries'][id2]["flag"] = "1";
    } else {
      d['query'][id1]['queries'][id2]["flag"] = "0";
    }
    saveAccountData(d);
    res.send(d);
  }
  )
});

module.exports = accountRoutes
