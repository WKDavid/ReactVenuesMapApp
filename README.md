# Extended version of neighborhood map application.

 Upon start the list of favorite venues in the centered area of the map is being displayed.
 Users can filter the list of venues in the drop down menu. Extended version allows users to search
 for new venues anywhere around the world, wherever the map would be centered, add venues to the favorites list or remove them.

 ## History

 I've written this project as a part of Front End Nanodegree program at [Udacity](https://www.udacity.com/).
 The project is based on **React** and was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
 I've coded and designed the project from the scratch.
 Following APIs are being used in the project: [GoogleMaps](https://www.google.com/maps), [Foursquare](https://foursquare.com/) and [Unsplash](https://unsplash.com/).

 ## Features:

 + Each venue of the favorites list is represented on the map with a _marker_.
 + Upon click on a marker or on the name of a venue, the marker of the clicked venue starts to bounce and additional information with pictures is being displayed in an _infobox_.
 + The favorites list can be filtered using special, dedicated input field.
 + Two dropdown menus: _filter_ and _search_.
 + Users can comfortably switch between _filter_ and _search_ menus anytime.
 + Search menu allows users to search for new venues around the centered area of the map.
 + Possibility to search for new venues worldwide.
 + Each item of a newly searched venues list contains a name, an address and a set of related pictures.
 + Any venue can be added to the favorites list or removed from it, markers on the map will change accordingly.
 + Upon click on any picture, an enlarged version of the clicked picture is being shown within a _modal_.
 + Keyframe animations allow smooth appearance of modals, as well as color glow effects etc.
 + While new venues are being searched, a loading screen is being shown, all errors are being handled gracefully.
 + The application utilizes cache-first service worker of React. Please click [here](https://goo.gl/KwvDNy) to learn more about the service worker and follow [these instructions](https://github.com/facebookincubator/create-react-app/issues/2374) to avoid any complications. 
 + Complete flexibility across all known screen sizes.

 ## Installation and use:

 + Please clone the repository <https://github.com/WKDavid/ReactVenuesMapApp.git> or [download the project](https://github.com/WKDavid/ReactVenuesMapApp/archive/master.zip)
 + In your terminal please change your current working directory to the one, containing the application.
 + Please use the command `npm install` to install all the needed dependencies and `npm start` to view the application in your browser.
