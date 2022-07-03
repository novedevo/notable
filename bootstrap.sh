#!/bin/bash

sudo -u postgres psql -c "CREATE DATABASE notable;"
sudo -u postgres psql -f bootstrap.sql -d notable
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"