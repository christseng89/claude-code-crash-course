#!/bin/bash
# Analyze user input and load appropriate context
user_input="$1"

if [[ $user_input == *"database"* || $user_input == *"migration"* ]]; then
  echo "@./context/database-context.md" >> CLAUDE.md
elif [[ $user_input == *"API"* || $user_input == *"endpoint"* ]]; then
  echo "@./context/api-context.md" >> CLAUDE.md
elif [[ $user_input == *"frontend"* || $user_input == *"component"* ]]; then
  echo "@./context/frontend-context.md" >> CLAUDE.md
fi