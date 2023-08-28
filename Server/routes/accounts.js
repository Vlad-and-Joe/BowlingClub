////////////////////////////////////////////////
//                                            //
// File:   accounts.js                        //
// Type:   module                             //
// Author: Vladimir Hugec                     //
// Desc:   Defines the routes for group       //
//         messaging and maintanence          //
//                                            //
////////////////////////////////////////////////

const express = require('express');
const router = express.Router();

const accountsController = require('../controllers/accountsController');

router.post('/create', accountsController.createAccount);
router.post('/update', accountsController.updateAccount);
router.post('/delete', accountsController.deleteAccount);

module.exports = router;