#!/bin/bash

sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y postgresql
sudo -u postgres psql -f bootstrap.sql
