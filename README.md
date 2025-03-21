GLSpace
=======

**Video demo:**

https://github.com/user-attachments/assets/9ce0e8cf-7682-4e63-9d6e-5e125ebfae77

**Project description:**

Taking 3D websites to multiple screens.

For a quick glance, look at http://adnan-zahid.eu5.org/GLSpace or https://github.com/AdnanZahid/GLSpace/tree/master/Single_Screen

Code heavily borrowed from Gregg Tavares's project Happy Fun Times  (https://github.com/greggman/HappyFunTimes/tree/master/public/examples/syncThreeJS)

and from Muaz Khan's project WebRTC-Experiment
(https://github.com/muaz-khan/WebRTC-Experiment)


This project requires NodeJS to run. Download it from here http://nodejs.org/download

Apart from that, Google Chrome is a must and it is recommended to run it on Microsoft Windows.

If that is not the case, you need to follow step-by-step instructions to run it on other platforms.
(https://github.com/AdnanZahid/GLSpace/blob/master/Docs/Step-by-step%20instructions%20for%20non-windows-users.mdown)

Now, assuming you have NodeJS installed and running (and you have configured environment variables), go to Command Prompt, navigate to the project directory and run

							"node server.js"

It will open a form application (if you are on Windows) with the default Chrome path and the 3 default websites that it will open. You can customize these things if you want. Next, hit the "Launch" button.

This will automatically make some pop-up windows on your screen. They can be opened on different screens or even different machines if they are interconnected (just replace "localhost" by the machine's IP address).

Use "Share 1st screen", "Share 2nd screen" and "Share 3rd screen" buttons to share the Chrome windows. Next, hit "Synchronize screens". If all goes correctly, it should synchronize GLSpace across all three of your screens.

Now use "directional keys" and "WASD" to navigate. This project features every kind of movement and rotation (X, Y and Z-axis movement and rotation).


Navigate your way around GLSpace and enjoy!

If you have any questions, feel free to email me at adnaan.zaahid@gmail.com
