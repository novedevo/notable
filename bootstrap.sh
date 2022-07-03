#!/bin/bash

sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y postgresql
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE notable;"
sudo -u postgres psql -f bootstrap.sql -d notable
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
