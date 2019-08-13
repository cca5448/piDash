#!/bin/bash

if [ ! $(whoami) = "root" ]; then
  echo "Must run this script using sudo"
  exit 1
fi

#TODO git download the piDash files, maybe this is done already since we have this script
#git clone https://github.com/cca5448/piDash /home/pi/piDash

#disable the "click here to start applications" from xwindows
sed -i 's/^point-rpi/#point-rpi/' /etc/xdg/lxsession/LXDE-pi/autostart

#install the services
if [ ! -f /lib/systemd/system/ds_server.service ] then; cp /home/pi/piDash/services/systemd/ds_server.service /lib/systemd/system; fi
if [ ! -f /lib/systemd/system/ds_button.service ] then; cp /home/pi/piDash/services/systemd/ds_button.service /lib/systemd/system; fi
if [ ! -f /lib/systemd/system/ds_kiosk.service ] then; cp /home/pi/piDash/services/systemd/ds_kiosk.service /lib/systemd/system; fi

#enable the services
systemctl enable ds_server.service
systemctl enable ds_button.service
systemctl enable ds_kiosk.service

#install dependencies
apt-get -y install xdotool unclutter sed vim-nox

#install pynetworktables2js
pip3 install pynetworktables2js

#remove the original splash image and put in our own
mv /usr/share/plymouth/themes/pix/splash.png /usr/share/plymouth/themes/pix/splash.png.orig
cp /home/pi/piDash/pi_white_480x800.png /usr/share/plymouth/themes/pix/splash.png

#disable the splash sprite
sed -i 's/^message_sprite =/#message_sprite =/' /usr/share/plymouth/themes/pix/pix.script
sed -i 's/^message_sprite\.SetPosition/#message_sprite\.SetPosition/' /usr/share/plymouth/themes/pix/pix.script
sed -i 's/^\tmy_image =/#\tmy_image =/' /usr/share/plymouth/themes/pix/pix.script
sed -i 's/^\tmessage_sprite\.SetImage/#\tmessage_sprite\.SetImage/' /usr/share/plymouth/themes/pix/pix.script

#disable boot raspberry pips
sed -i 's/plymouth\.ignore-serial-consoles$/plymouth\.ignore-serial-consoles logo\.nologo vt\.global_cursor_default=0/' /boot/cmdline.txt

#move boot output to tty3 for cleaner boot
sed -i 's/console=tty1/console=tty3/' /boot/cmdline.txt

#add boot params
cat >> /boot/config.txt << 'EOF'
#turn off the rainbow screen
disable_splash=1

#rotate display for portrait mode
lcd_rotate=1
EOF

#link the desktop background image to desktop_bg.png
ln -s /home/pi/piDash/pi_black_480x800.png /home/pi/piDash/desktop_bg.png

#setup desktop preferences
cat > /home/pi/.config/pcmanfm/LXDE-pi/desktop-items-0.conf << 'EOF'
[*]
wallpaper_mode=crop
wallpaper_common=1
wallpaper=/home/pi/piDash/desktop_bg.png
desktop_bg=#000000000000
desktop_fg=#e8e8e8e8e8e8
desktop_shadow=#000000000000
desktop_font=PibotoLt 12
show_wm_menu=0
sort=mtime;ascending;
show_documents=0
show_trash=0
show_mounts=0
EOF

#TODO modify the taskbar 
#sed -i 's///' /home/pi/.config/lxpanel/LXDE-pi/panels/panel

