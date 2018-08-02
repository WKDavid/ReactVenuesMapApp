import React, { Component } from 'react'
import SideMenu from './SideMenu'
import MenuClicker from './MenuClicker'
import GMap from './GMap'
import noPic from './images/noPic.jpg'
import markerIcon from './images/MapMarkerIcon.ico'
import { Marker } from "react-google-maps"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox"

class App extends Component {

  state = {
    gMap: [],
    currentLatLng: { lat: 34.0466697, lng: -118.2801951 },
    filterMenuVisibility: true,
    searchMenuVisibility: false,
    pictureModal: { modalVisibility: false, currentURL: '' },
    markersToShow: [],
    placesWithData: [],
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
    if (idsArray.includes(placesData.response.venue.id)) {
      alert("This venue is already in your list")
    } else {
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
  if (place.photos && place.photos.groups[0] !== undefined) {
        placePhotos =  place.photos.groups[0].items.map(pictureURL => {
        return <img key={pictureURL.id} className="infoBoxPicture" src={`${pictureURL.prefix}original${pictureURL.suffix}`} alt={`${place.name}`} onClick={() => {this.openPictureModal(pictureURL)}}/>
      })
  } else {
    placePhotos = <img className="infoBoxPicture" src={noPic} alt={`${place.name}`}/>
  }
    return placePhotos
  }

  openPictureModal = (pictureURL) => {
      this.setState({ pictureModal: { modalVisibility: true, currentURL: `${pictureURL.prefix}original${pictureURL.suffix}` } })
  }

  openSearchPictureModal = (pictureURL) => {
      this.setState({ pictureModal: { modalVisibility: true, currentURL: `${pictureURL}` } })
  }

  closePictureModal = () => {
      this.setState({ pictureModal: { modalVisibility: false, currentURL: '' } })
  }

  fetchVenueById = (id) => {
    fetch(`https://api.foursquare.com/v2/venues/${id}?client_id=F0RCSRF4H1KQJKSBYXIZRZWV2PIFXPSRTEEJYCPMJMBNXAFZ&client_secret=KT2KXQ2D3OBWX4PW1ZT0XEEZ4L1UNJ3DTWA3XUAIXYRDTZY1&v=20120731`, {
            }).then(response => {
                  return response.json()
            }).then(this.placesFillInfo)
              .catch(error => {
                  alert(`Could not get the information of the venue from foursquare. Please, check your internet connection and try again.`)
            })
  }

  componentWillMount() {
    this.state.idsOfPlaces.map(singleId => {
      return this.fetchVenueById(singleId)
    })
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
    const { pictureModal, filterMenuVisibility, searchMenuVisibility, placesWithData, currentLatLng, markersToShow, gMap } = this.state

    return (
      <div>
          {this.state.pictureModal.modalVisibility === true && (
            <div className="modalContainer">
              <span className="closeModalButton" onClick={() => {this.closePictureModal()}}>&times;</span>
              <img className="modalPicture" src={pictureModal.currentURL} alt={"place zoomed"} />
            </div>
          )}
          <div>
            <SideMenu filterTopVisibility={filterMenuVisibility} searchTopVisibility={searchMenuVisibility}
                      placesToFilter={placesWithData} onUpdateMarkers={ () => { this.updateMarkers() }} onCurrentLatLng={currentLatLng}
                      onFetchById={ (id) => { this.fetchVenueById(id) }} onRemoveVenue={ (venue) => { this.removeVenue(venue) }}
                      onOpenPictureModal={ (picUrl) => { this.openSearchPictureModal(picUrl) }} onChangeInfoBoxVisible={ (place) => { this.changeInfoBoxVisible(place) }}/>
          </div>
          <div>
            <MenuClicker onFilterClick={ () => { this.filterVisibilityToggle() }} onSearchClick={ () => { this.searchVisibilityToggle() }}/>
          </div>
          <div>
            <GMap showMarkers={markersToShow} googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAMN5oBK7NBz7m6itwXmQFbdeYaWLdBASU&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div className="mapContainer" />} containerElement={<div className="mapContainer" role="application" />}
            mapElement={<div className="mapContainer" />} onMap={gMap} onGetMap={ (map) => { gMap.push(map); if (gMap.length > 1) { gMap.shift(); }}}
            onLatLngUpdate={ (cLat, cLng) => { this.setState({ currentLatLng: { lat: cLat, lng: cLng } }) }}/>
          </div>
      </div>
    )
  }
}

export default App;
