movieapp-mobile

open developer menu on android
> adb shell input keyevent KEYCODE_MENU

# how to debug android in VSCode
0. install react-native-tools for VSCode
1. build and watch
> npm run build -- --watch
2. start react packager
> npm run start
3. run android
> npm run android
4. close chrome debugging tab
5. make sure that debugging is enabled (Ctrl+M in emulrator) 
5. attach debugger to packager in VS Code