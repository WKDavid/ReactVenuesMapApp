import React, { Component } from 'react'
import SideMenu from './SideMenu'
import MenuClicker from './MenuClicker'
import PictureModal from './PictureModal'
import GMap from './GMap'
import noPic from './images/noPic.jpg'
import markerIcon from './images/MapMarkerIcon.ico'
import { Marker } from "react-google-maps"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox"

class App extends Component {

  state = {
    gMap: [],
    currentLatLng: { lat: 34.03187591835326, lng: -118.63999734609376 },
    filterMenuVisibility: true,
    searchMenuVisibility: false,
    pictureModalState: { modalVisibility: false, currentURL: '' },
    markersToShow: [],
    placesWithData: [],
    fetchByIdError: false,
    mapFailure: false,
    authFailure: false,
    idsOfPlaces: ["4bcb6356937ca5930c7aa992", "4c040b64187ec928b87fb67b", "4bb9affd3db7b713e670229a", "4bafcf76f964a520a3223ce3", "4d742285e278f04de0d553b8"]
  }

  filterVisibilityToggle = () => {
    this.setState({ searchMenuVisibility: false })
    this.setState(pState => ({
      filterMenuVisibility: !pState.filterMenuVisibility
    }))
  }

  searchVisibilityToggle = () => {
    this.setState({ filterMenuVisibility: false })
    this.setState(pState => ({
      searchMenuVisibility: !pState.searchMenuVisibility
    }))
  }

  changeInfoBoxVisible = (place) => {
    if (place.markerAnimation === 2) {
      place.markerAnimation = 1
    } else {
      place.markerAnimation = 2
    }
    place.infoBoxVisibility = !place.infoBoxVisibility
    let updatedVisibility = this.state.placesWithData.map(aPlace => {if (aPlace.id !== place.id) {aPlace.infoBoxVisibility = false; aPlace.markerAnimation = 2; return aPlace;} else {return aPlace;}})
    this.setState({ placesWithData: updatedVisibility })
    this.updateMarkers()
  }

  infoVisibleAdd = () => {
    let placesWithVisibility = this.state.placesWithData.map(place => {
                               if (place.infoBoxVisibility === true || place.infoBoxVisibility === false) {
                                      return place
                               } else {
                                      place.infoBoxVisibility = false
                                      place.filterVisibility = true
                                      place.markerAnimation = 2
                                      return place
                               }
      })
      this.setState({ placesWithData: placesWithVisibility })
      this.updateMarkers()
  }

  placesFillInfo = (placesData) => {
    let idsArray = this.state.placesWithData.map(place => {return place.id})
    if (idsArray.includes(placesData.response.venue.id) === false) {
      this.state.placesWithData.push(placesData.response.venue)
    }
    if (this.state.idsOfPlaces.length <= this.state.placesWithData.length) {
      return this.infoVisibleAdd()
    }
  }

  removeVenue = (venueToRemove) => {
    venueToRemove.filterVisibility = false
    venueToRemove.infoBoxVisibility = false
    this.updateMarkers()
    let updatedPlaces =  this.state.placesWithData.filter((venue) => {
                            return venue.id !== venueToRemove.id
                         })
    this.setState({ placesWithData: updatedPlaces })
  }

  placePictures = (place) => {
  let placePhotos
  if (place.photos && place.photos.groups !== undefined) {
        let photoResponseSearch = place.photos.groups.filter(aGroup => { return aGroup.items.length > 0 }).map(aFilteredGroup => { return aFilteredGroup.items })
        placePhotos =  photoResponseSearch[0].map(pictureURL => {
        return <img key={pictureURL.id} className="infoBoxPicture" src={`${pictureURL.prefix}original${pictureURL.suffix}`} alt={`${place.name}`} tabIndex="0"
                    onClick={() => {this.openPictureModal(pictureURL)}} onKeyPress={(event) => { if (this.keyPressValidate(event)) {this.openPictureModal(pictureURL);} }}/>
      })
  } else {
    placePhotos = <img className="infoBoxPicture" src={noPic} alt={`${place.name}`}/>
  }
    return placePhotos
  }

  openPictureModal = (pictureURL) => {
      this.setState({ pictureModalState: { modalVisibility: true, currentURL: `${pictureURL.prefix}original${pictureURL.suffix}` } })
  }

  openSearchPictureModal = (pictureURL) => {
      this.setState({ pictureModalState: { modalVisibility: true, currentURL: `${pictureURL}` } })
  }

  closePictureModal = () => {
      this.setState({ pictureModalState: { modalVisibility: false, currentURL: '' } })
  }

  fetchVenueById = (id) => {
    fetch(`https://api.foursquare.com/v2/venues/${id}?client_id=F0RCSRF4H1KQJKSBYXIZRZWV2PIFXPSRTEEJYCPMJMBNXAFZ&client_secret=KT2KXQ2D3OBWX4PW1ZT0XEEZ4L1UNJ3DTWA3XUAIXYRDTZY1&v=20120731`, {
            }).then(response => {
                  return response.json()
            }).then(this.placesFillInfo)
              .catch(error => {
                if (this.state.fetchByIdError === false) {
                  alert(`Could not get the information of the venue from foursquare. Please, try again later.`)
                  this.setState({ fetchByIdError: true })
                }
            })
  }

  componentDidMount() {
    this.startVenues()
  }

  componentDidUpdate() {
    var logTrace = console.log
    console.log = (logMsg) => {
       logTrace(logMsg)
    }
    console.error = (logMsg) => {
      let toDetect = "InvalidKeyMapError"
        if (logMsg.includes(toDetect) && this.state.mapFailure === false) {
          this.setState({ authFailure: true })
        }
      logTrace(`Error: ${logMsg}`)
    }
  }

  startVenues = () => {
    if (this.state.fetchByIdError === true) {
      this.setState({ fetchByIdError: false })
    }
    this.state.idsOfPlaces.map(singleId => {
      return this.fetchVenueById(singleId)
    })
  }

  componentDidCatch(error, info) {
    alert(`Map could not be loaded.`)
    this.setState({ mapFailure: true })
  }

  tryMap = () => {
    this.setState({ mapFailure: false })
  }

  reloadPage = () => {
    window.location.reload()
  }

  keyPressValidate = (event) => {
    if (event.key === "Enter" || event.key === " ") {
        return true
    } else {
      return false
    }
  }

  updateMarkers = () => {
    let markers = this.state.placesWithData.map(place => {
         return <Marker key={place.id} visible={place.filterVisibility} position={{ lat: place.location.lat, lng: place.location.lng }}
                        animation={place.markerAnimation} icon={markerIcon} onClick={() => {this.changeInfoBoxVisible(place)}}>
                  {place.infoBoxVisibility === true &&  <InfoBox options={{ enableEventPropagation: true, closeBoxURL: `` }}>
                      <div className="infoBoxContainer">
                        <div className="infoBoxInside">
                          {this.placePictures(place)}
                          <p>{place.name}</p>
                          <p>{place.location.formattedAddress.join(" ")}</p>
                        </div>
                      </div>
                    </InfoBox> }
                </Marker> })
    this.setState({ markersToShow: markers })
  }

  render() {
    const { pictureModalState, filterMenuVisibility, searchMenuVisibility, placesWithData, currentLatLng, markersToShow, gMap, fetchByIdError, mapFailure, authFailure } = this.state

    return (
      <div>
          {pictureModalState.modalVisibility === true &&
            <PictureModal onKeyPressValidate={ (event) => { return this.keyPressValidate(event) }} onClosePictureModal={this.closePictureModal} onPictureModalState={pictureModalState}/>
          }
          <div>
            <SideMenu filterTopVisibility={filterMenuVisibility} searchTopVisibility={searchMenuVisibility} onKeyPressValidate={ (event) => { return this.keyPressValidate(event) }}
                      placesToFilter={placesWithData} onUpdateMarkers={ () => { this.updateMarkers() }} onCurrentLatLng={currentLatLng} onFetchByIdError={fetchByIdError}
                      onFetchById={ (id) => { this.fetchVenueById(id) }} onRemoveVenue={ (venue) => { this.removeVenue(venue) }} onStartVenues={ () => { this.startVenues() }}
                      onOpenPictureModal={ (picUrl) => { this.openSearchPictureModal(picUrl) }} onChangeInfoBoxVisible={ (place) => { this.changeInfoBoxVisible(place) }}/>
          </div>
          <div>
            <MenuClicker onFilterClick={ () => { this.filterVisibilityToggle() }} onSearchClick={ () => { this.searchVisibilityToggle() }}
                         onKeyPressValidate={ (event) => { return this.keyPressValidate(event) }}/>
          </div>
          <div>
            {authFailure === true && <div className="errorClicker" tabIndex="0" role="button" onClick={this.reloadPage}
                                          onKeyPress={(event) => { if (this.keyPressValidate(event)) {this.reloadPage();} }}>Authentication error, click here to reload the page</div>}
            {mapFailure === true && <div className="errorClicker" tabIndex="0" role="button" onClick={this.tryMap}
                                         onKeyPress={(event) => { if (this.keyPressValidate(event)) {this.tryMap();} }}>Try starting map again</div> }
            {mapFailure === false && authFailure === false &&
            <GMap showMarkers={markersToShow} googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAMN5oBK7NBz7m6itwXmQFbdeYaWLdBASU&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div className="mapContainer" />} containerElement={<div className="mapContainer" role="application" />}
            mapElement={<div className="mapContainer" />} onMap={gMap} onGetMap={ (map) => { gMap.push(map); if (gMap.length > 1) { gMap.shift(); }}}
            onLatLngUpdate={ (cLat, cLng) => { this.setState({ currentLatLng: { lat: cLat, lng: cLng } }) }}/>
            }
          </div>
      </div>
    )
  }
}

export default App;
