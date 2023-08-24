#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "\n=== Testing Server ===\n"

# Test the root endpoint
echo "1. Testing root endpoint:"
RESPONSE=$(curl -s http://localhost:3000/)
if [[ "$RESPONSE" == "Joey Sucks!" ]]; then
  echo "${GREEN}PASSED${NC}\n"
else
  echo "${RED}FAILED${NC} - Expected 'Joey Sucks!' but got '$RESPONSE'\n"
fi

# Test sending a message
echo "2. Testing sending a message:"
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"sender": "Vlad", "recipient": "Joe", "message": "My main man Joe!"}' http://localhost:3000/send)
SUCCESS=$(echo $RESPONSE | perl -n -e'/"success":\s*(true|false)/ && print $1')
if [[ "$SUCCESS" == "true" ]]; then
  echo "${GREEN}PASSED${NC}\n"
else
  echo "${RED}FAILED${NC} - Expected success but got '$RESPONSE'\n"
fi

# Test retrieving messages
echo "3. Testing retrieving messages:"
RESPONSE=$(curl -s "http://localhost:3000/messages?recipient=Joe")
SENDER=$(echo $RESPONSE | perl -n -e'/"sender":\s*"([^"]+)"/ && print $1')
if [[ "$SENDER" == "Vlad" ]]; then
  echo "${GREEN}PASSED${NC}\n"
else
  echo "${RED}FAILED${NC} - Expected sender 'Vlad' but got '$RESPONSE'\n"
fi

echo "=== Testing Completed ===\n"
