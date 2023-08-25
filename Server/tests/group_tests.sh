#!/bin/bash

BASE_URL="http://localhost:3000"

echo "\n*** Testing Group Functionality ***\n"

# Test: Create a new group named "TestGroup" with members Alice, Bob, and Charlie
echo "1. Create a new group named 'TestGroup' with members:"
curl -s -X POST "$BASE_URL/groups/createGroup" -d '{"group_name":"TestGroup", "recipients":["Alice", "Bob", "Charlie"]}' -H "Content-Type: application/json" | jq .
echo "\n---------------------------------------------"

# Test: List groups a user (Alice) is a member of
echo "2. List groups Alice is a member of:"
curl -s -X GET "$BASE_URL/groups/listUserGroups?user_id=Alice" | jq .
echo "\n---------------------------------------------"

# Test: List members of a group (assuming group id 1)
echo "3. List members of group with id 1:"
curl -s -X GET "$BASE_URL/groups/listGroupMembers?group_id=1" | jq .
echo "\n---------------------------------------------"

# Test send message to a group
echo "4. Sending message to a group (Assuming group_id = 1):"
curl -s -X POST $BASE_URL/groups/sendToGroup \
-d '{"sender":"Alice", "group_id":"1", "message":"Hello Group 1!"}' -H "Content-Type: application/json" \
| grep -q '"success":true' && echo "Success!" || echo "Failed!"
echo "\n---------------------------------------------"

# Test retrieve messages for a group
echo "5. Retrieving messages for Group with group_id=1:"
curl -s -X GET "$BASE_URL/groups/getGroupMessages?group_id=1" \
| grep -q 'Hello Group 1!' && echo "Success!" || echo "Failed!"
echo "\n---------------------------------------------"

# Test: Remove a user (Alice) from a group (assuming Alice is in group with id 1)
echo "6. Remove Alice from group with id 1:"
curl -s -X POST "$BASE_URL/groups/removeUserFromGroup" -d '{"user_id":"Alice", "group_id":"1"}' -H "Content-Type: application/json" \
| grep -q '"success":true' && echo "Success!" || echo "Failed!"
echo "\n---------------------------------------------"

# Test: List members of a group (assuming group id 1)
echo "7. List members of group with id 1:"
curl -s -X GET "$BASE_URL/groups/listGroupMembers?group_id=1" | jq .
echo "\n---------------------------------------------"

# Test: Delete a group (assuming group id 1)
echo "8. Delete group with id 1:"
curl -s -X POST "$BASE_URL/groups/deleteGroup" -d '{"group_id":"1"}' -H "Content-Type: application/json" \
| grep -q '"success":true' && echo "Success!" || echo "Failed!"
echo "\n---------------------------------------------"

echo "\nTests completed."
