#!/bin/bash

echo "=== Testing Sending and Recieving Group Texts ==="

# Create a group by Alice, including Bob and Charlie
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "creator_id": 1,
  "group_name": "Friends",
  "recipient_ids": [2, 3]
}' http://localhost:3000/groups/createGroup)
group_id=$(echo $response | jq '.groupId')
echo "Created group 'Friends' with ID: $group_id"

# Alice sends a message to the group
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "sender_id": 1,
  "group_id": '$group_id',
  "message": "Hello Friends!"
}' http://localhost:3000/groups/sendGroupMessage)
echo "Sent message to group 'Friends': 'Hello Friends!'"

# Retrieve the message sent to the group
response=$(curl -s -X GET http://localhost:3000/groups/getGroupMessages?group_id=$group_id)
echo "Messages in group 'Friends':"
echo $response | jq

echo "=== Testing Complete ==="
