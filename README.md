# Step and Heading system using sensors on smartphones. 👋
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-000.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)

This project will be made using react native, expo, along with a lot of other packages and technologies which will help us get this step and heading app up and running with high accuracy.

<br>

## ➕ Features

Currently the project has the following features:
  * Calibrate the step length estimation variables
  * Calculate the step, as well as the position in 2-dimensional.
  * Display the trajectory of the user
  
### Advantages
  * Easy to implement
  * The measurements are quite accurate.
  * Can be combined with other systems.
  * Work with any orientation of smartphone
  * This system returns results nearly in real-time.
  
 ### Disadvantages
  * Cannot handle the case where the user changes the orientation of theirsmartphone when walking.
  * It is possible to trick the algorithm of step detection by standing still andaccelerating the accelerometer.

<br>

## 💻 Install

First you need to install Nodejs and npm, this is different depending on the OS you are running so it is easier to check the node [page](https://nodejs.org/en/download/)

Install [expo](https://expo.io/learn), if it fails run you might need to run this with sudo
```sh
npm install expo-cli --global
```

Install the needed packages while in the root folder of the project
```sh
npm install
```

<br>

## 📱 Usage

To Start expo all you have to do is run this line
```sh
expo start
```
and then use your smartphones' camera to scan the QR code in your web browser.

<br>

## Demo
  * Trajectory ![Imgur](https://imgur.com/MGA7X9M.png)
  * [Scenario 1](https://www.youtube.com/watch?v=ztBl-u4rIAU)
  * [Scenario 2](https://www.youtube.com/watch?v=bVDyg69e8mI)
 


