#!/bin/bash

# Base URL
MESSAGE_URL="http://localhost:3000"

# ACCOUNTS MUST BE CREATED FIRST

# 1. Test send message to user
echo "\n1. Sending message to user:"
curl -s -X POST $MESSAGE_URL/messages/send \
-d '{"sender_id":1, "recipient_id":2, "message":"Hello Bob!"}' -H "Content-Type: application/json" \
| grep -q '"success":true' && echo "Success!" || echo "Failed!"

# 2. Test retrieve messages for user
echo "\n2. Retrieving messages for Bob:"
curl -s -X GET "$MESSAGE_URL/messages/retrieve?recipient_id=2" \
| grep -q 'Hello Bob!' && echo "Success!" || echo "Failed!"

echo "\nTests completed."
