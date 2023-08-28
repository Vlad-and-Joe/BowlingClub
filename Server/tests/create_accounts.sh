#!/bin/bash

echo "=== Testing Account Creation ==="

# Create 3 accounts

# Create Account 1
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Alice",
  "email": "alice123@gmail.com",
  "password": "password123"
}' http://localhost:3000/accounts/create)
account1_id=$(echo $response | jq '.id')
echo "Created account for Alice with ID: $account1_id"

# Create Account 2
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Bob",
  "email": "bob123@gmail.com",
  "password": "password123"
}' http://localhost:3000/accounts/create)
account2_id=$(echo $response | jq '.id')
echo "Created account for Bob with ID: $account2_id"

# Create Account 3
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Charlie",
  "email": "charlie123@gmail.com",
  "password": "password123"
}' http://localhost:3000/accounts/create)
account3_id=$(echo $response | jq '.id')
echo "Created account for Charlie with ID: $account3_id"

# Attempt to Create Account 4 which is a duplicate of 3
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Charlie",
  "email": "charlie123@gmail.com",
  "password": "password123"
}' http://localhost:3000/accounts/create)
# This should result in a 400 error in request.log