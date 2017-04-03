# Movie theater application

This app was made just to see Ionic 2 in action with real page flows and real data api (and ngrx/store).

## Important!
**App gets data from a real Ukrainian Movie Theater website.** There is no server code in this repository.

## Know issues
 - Seats svg map doesn't support pinch-to-zoom
 - No real payment system integration
 - UI looks kinda ugly on big resolutions (tested only with iPhone 6 and default ionic --serve simulation)
 - A lot of scss duplication (didn't want to spend more time on styling that I've already spent)
 - Could be some issues running on an actual Android device (don't have one, so can't test it property)
 - No unit tests in the project (yeah, was planning on adding some, but...)
 
**Note:** These issues probably not gonna be fixed. It's just a fun-demo project, so don't expect any updates to it. 

## Getting Started

* Clone this repository: `git clone https://github.com/bkorobeinikov/movieapp-ionic.git`.
* Install the Ionic CLI and Cordova (`npm install -g ionic cordova`)
* Run `npm install` from the project root.
* Install [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) Chrome extension 
    > it will fix cross-origin issue when calling real website api from the localhost. App works just fine when run on an actual device.
* Run `ionic serve --lab` in a terminal from the project root.
* Profit

## Preview app without compiling from source code (Ionic View)
* Download Ionic View app from [http://view.ionic.io](http://view.ionic.io)
* Log in into the app
* At the top left corner press an 'eye' icon and enter `216AD03E` app code.

## DEMO
<img src="app-demo.gif" width="375">

## WHY 
### Why not React Native?
At first, I wanted to write this movieapp with React Native. For one week I was researching it, but eventually, I realized that it is very complicated for a POC-like project. And to support multiple platforms it requires much more work.

### Why not NativeScript?
NativeScript I skipped, I think, because it is brand new. But probably, porting this codebase to NativeScript would be very easy, in best case scenario 

### Why Ionic? 
For me, it was a winner in every category. The team is working hard on the framework. They even got some investments. It is an actual business and not an another open-source project which might be abandoned in a year. And the biggest win is that development tools are awesome. 