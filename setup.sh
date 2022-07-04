#!/bin/bash
# Only for Ubuntu on WSL2

sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y postgresql
sudo service postgresql start