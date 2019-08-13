#!/bin/bash
#URLS="http://localhost:8888"
#DISPLAY=:0.0

#disable screen blanking
#xset s noblank
#xset s off
#xset -dpms

#set screen timeout to 10 minutes
xset s 600

#hide mouse pointer
DISPLAY=:0.0 unclutter -idle 0.01 -root &

#hide warning bars that chromium may display
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk http://localhost:8888 

#refresh
#DISPLAY=:0.0 xdotool key ctrl+r
