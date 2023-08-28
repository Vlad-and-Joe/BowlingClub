////////////////////////////////////////////////
//                                            //
// File:   groups.js                          //
// Type:   module                             //
// Author: Vladimir Hugec                     //
// Desc:   Defines the routes for group       //
//         messaging and maintanence          //
//                                            //
////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController.js');

router.post('/sendGroupMessage', groupsController.sendMessageToGroup);
router.get('/getGroupMessages', groupsController.getMessagesForGroup);
router.post('/createGroup', groupsController.createGroup);
router.get('/listUserGroups', groupsController.listUserGroups);
router.post('/removeUserFromGroup', groupsController.removeUserFromGroup);
router.post('/deleteGroup', groupsController.deleteGroup);
router.get('/listGroupMembers', groupsController.listGroupMembers);

module.exports = router;