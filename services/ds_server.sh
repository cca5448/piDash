#!/bin/bash
TEAM=5448

#start the server
cd /home/pi/piDash/dashboard
python3 -m pynetworktables2js --team ${TEAM} 
