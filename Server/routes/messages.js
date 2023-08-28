////////////////////////////////////////////////
//                                            //
// File:   messages.js                        //
// Type:   module                             //
// Author: Vladimir Hugec                     //
// Desc:   Defines the routes for single      //
//         messaging                          //
//                                            //
////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

// Single Messaging
router.post('/send', messagesController.sendMessage);
router.get('/retrieve', messagesController.retrieveMessages);

module.exports = router;