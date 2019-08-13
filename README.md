# piDash

piDash is a dedicated Raspberry Pi dashboard panel using a 7" touch screen that is mounted in our driver station panel to show vial statistics for our robot, leaving our screen space on the driver station open for camera displays.

This is based on the good work of pynetworktables2js, and FRCDashboard from team 1418.

It is poorly documented, but hopefully I will get it better for other teams to derive their own projects.

Of interest:
- Custom 480x800 splash screens
- PyNetworkTables2JS Server
- Portrait mode 7" Raspberry Pi official display (touchscreen)
- Custom GPIO button listener for a button which refreshes (press), reboots (5 seconds press), or shuts down (10 seconds press) on GPIO pin 10
- Kiosk listener service that starts chromium-browser in kiosk mode with no warning dialogs or error messages (if improperly shutdown) directly to http://localhost:8888
- All code for dashboard stored in gitHub repo for easy updating via SSH
