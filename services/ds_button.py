#!/usr/bin/python3
import RPi.GPIO as gpio
import sys, signal, time, os

# Definitions for program
PIN=10 #this is the pin for the button

def signal_handler(signal, frame):
    print("\nProgram exiting gracefully")
    gpio.cleanup()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

gpio.setwarnings(False)
gpio.setmode(gpio.BOARD)
gpio.setup(PIN, gpio.IN, pull_up_down=gpio.PUD_DOWN)


while True:
    try:
        gpio.wait_for_edge(PIN, gpio.RISING)
        print("--> Button Pressed <--")
        start = time.time()
        time.sleep(0.2)

        while gpio.input(PIN) == gpio.HIGH:
            time.sleep(0.02)

        length = time.time() - start
        print("Length of press=" + str(round(length,2)))

        if length > 10:
            print("Long Press, Shutdown System")
            os.system("sudo shutdown -h now")
        elif length > 5:
            print("Medium Press, Restart System")
            os.system("sudo reboot")
        else:
            print("Short Press, Refresh Screen")
            os.system("DISPLAY=:0.0 xdotool key ctrl+r")
    except (KeyboardInterrupt, SystemExit):
        print("\nProgram exiting.")
        gpio.cleanup()
        break
    
            
