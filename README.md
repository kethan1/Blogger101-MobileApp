# Blogger101-MobileApp
Blogger101 Mobile App  
Complementory Website: https://blogger-101.herokuapp.com  
Complementory Github: https://github.com/kethan1/blogger101-website  
Link to Expo (scrolling works with touchpad on local emulator, but only touchscreen and pens allow you to scroll on the home screen on Expo Snack): https://snack.expo.io/@ketzoomer/blogger101-mobile-app-snack

Note: Does not work with React Native Web

### This is the mobile app for Blogger101!
Built using: [React Native](https://reactnative.dev/), [Expo](https://expo.dev/), and other community made packages


### Startup Guide

#### Changes to Code

If you want to run this with a local copy of the Blogger101 website (needed for api), checkout this repo: https://github.com/kethan1/blogger101-website. Download the repo and unzip the folder. Follow the instructions in the readme and get a local instance of the website up and running. Then, download and go through the code for this repo (mobile app), and replace `https://blogger101.com/` with your local website url (`http://127.0.0.1:5000/` if you didn't change the code). 

#### Setup

Make sure you have npm installed. Then, download this repo and unzip the code (which you already did if you chose to do the last step). You can skip the steps if you already have Expo v40. 

Then run the below commands (add `--force` to the end of the command if you already have expo and expo-cli installed, and are upgrading them):

```
npm install expo
npm install expo-cli
```

Then cd to the folder you want the project in.
After than, run these commands:

```
expo init [folder name here]
```

Then, copy over these folders and files: `assets`, `src`, `LICENSE`, and `README.md`.

Then, replace these files with the ones from this repo: `App.js`, `.gitignore`.

After that run `yarn install`. This will install all the dependencies. 

If you want to run it on Android, use an Android emulator. I recommend the one part of Android Studio. Here: https://developer.android.com/studio. It comes with a pretty good emulator. Start up the emulator (https://developer.android.com/studio/run/emulator). Then, run `expo start` in the project folder. The app is up and running!
