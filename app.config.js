import 'dotenv/config'; // Asumiendo que este import está en un archivo .ts o .js, no en un archivo .json
import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication'

export default {
  "expo": {
    "name": "kyrios-agenda-empleo",
    "slug": "agenda-de-empleo",
    "version": "1.0.0",
    "owner": "kyriosagendaempleo",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "c0095b21-e685-40fa-a4f0-45a39851e16e"
      }
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/c0095b21-e685-40fa-a4f0-45a39851e16e"
    },
    "assets": {
      "kyrios": "../assets/kyrios.jpg"
    }
  }
}
