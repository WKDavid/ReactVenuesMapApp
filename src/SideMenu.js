import React, { Component } from 'react'
import noPic from './images/noPic.jpg'
import loading from './images/loading.gif'

class SideMenu extends Component {

  state = {
    queryFilter: '',
    querySearch: '',
    picturesToShow: [],
    tempPicBuffer: [],
    searchResultsReady: false,
    unsplashError: false,
    loadingStatus: false,
    defaultSearchMessage: true,
    searchResults: []
  }

  updateFilterQuery = (query) => {
    if (query.length > 0 && query.startsWith(' ') === false) {
      this.setState({ queryFilter: query })
      for (let placeObject of this.props.placesToFilter) {
        if (placeObject.name.toUpperCase().indexOf(query.toUpperCase()) > -1) {
          placeObject.filterVisibility = true
          this.props.onUpdateMarkers()
        } else {
          placeObject.filterVisibility = false
          placeObject.infoBoxVisibility = false
          this.props.onUpdateMarkers()
        }
      }
    } else {
      this.setState({ queryFilter: '' })
      this.resetFilterVisibility()
      this.props.onUpdateMarkers()
    }
  }

  resetFilterVisibility = () => {
    for (let placeObject of this.props.placesToFilter) {
      placeObject.filterVisibility = true
    }
  }

  listOfPlacesToDisplay = () => {
    let theList =  this.props.placesToFilter.map(place => {
                        if (place.filterVisibility === true) {
                            return <li className="singleVenueContainer" tabIndex="5" key={place.id} >
                                    <span className="filterVenueName" tabIndex="6" onClick={ () => this.props.onChangeInfoBoxVisible(place)}>{place.name}</span>
                                    {place.tips.groups[0].items.length > 0 &&  <span className="venueText">, tips for visitors:</span>}
                                    {place.tips.groups[0].items.map(item => { return <p className="venueText" key={item.id}>{item.text}</p> })}
                                    <span onClick={() => this.props.onRemoveVenue(place)} tabIndex="7" role="button" className="addButton">Remove venue</span></li>
                        } else {
                            return null
                        }
                    })
    return theList
  }

  updateSearchQuery = (queryS) => {
    this.setState({ querySearch: queryS })
  }

  keyEnterValidate = (event) => {
    if (event.key === "Enter") {
        this.getSearchInfo()
    }
  }

  getSearchInfo = () => {
    if (this.state.searchResultsReady === true) {
      this.setState({ searchResultsReady: false })
    }
    if (this.state.unsplashError === true) {
      this.setState({ unsplashError: false })
    }
    if (this.state.defaultSearchMessage === true) {
      this.setState({ defaultSearchMessage: false })
    }
    if (this.state.loadingStatus === false) {
      this.setState({ loadingStatus: true })
    }
    let searchErrorHandler = (er) => {
      alert(`Could not get search results from foursquare, please give it another try later.`)
      this.searchResponseHandler(er)
    }
    this.setState({ picturesToShow: [] })
    fetch(`https://api.foursquare.com/v2/venues/explore?client_id=F0RCSRF4H1KQJKSBYXIZRZWV2PIFXPSRTEEJYCPMJMBNXAFZ&client_secret=KT2KXQ2D3OBWX4PW1ZT0XEEZ4L1UNJ3DTWA3XUAIXYRDTZY1&v=20120731&ll=
          ${this.props.onCurrentLatLng.lat},${this.props.onCurrentLatLng.lng}&query=${this.state.querySearch}`, {
              }).then(response => {
                    return response.json()
                }).then(this.searchResponseHandler)
                .catch(error => {
                    searchErrorHandler(error)
                })
  }

  getSearchPictures = (picsQuery, callingId) => {
    let callId = callingId
    let infohandler = (picturesData) => {
      this.imageResponseHandler(picturesData, callId)
    }
    let errorHandler = (er) => {
      if (this.state.unsplashError === false) {
        this.setState({ unsplashError: true })
        alert(`Could not get all pictures from unsplash. Search results will be displayed without them. Amount of free calls limited, this is not a production version.`)
      }
      this.imageResponseHandler(er, callId)
    }
    fetch(`https://api.unsplash.com/search/photos?page=1&query=${picsQuery}`, {
        headers: {
        Authorization: 'Client-ID 74d029306b7e03aa9d5f618f928282d049d27dd649fd27ad920f75556ab20e72'
        }
      }).then(response => {
            return response.json()
        }).then(infohandler)
        .catch(error => {
            errorHandler(error)
        })
  }

  imageResponseHandler = (picturesData, callingId) => {
    let picturesToRender = {}
    if (picturesData.results !== undefined && picturesData.results.length > 0) {
      picturesToRender.aPicture = picturesData.results.map(picInfo => {
          return <img key={picInfo.id} className="searchPicThumb" src={`${picInfo.urls.regular}`} alt={`${picInfo.description}`} onClick={() => {this.props.onOpenPictureModal(picInfo.urls.regular)}}/>
        })
      picturesToRender.callingId = callingId
    } else {
      picturesToRender.aPicture = [<img key={callingId} className="searchPicThumb" src={noPic} alt={`not available`}/>]
      picturesToRender.callingId = callingId
    }
    this.state.tempPicBuffer.push(picturesToRender)
    if (this.state.tempPicBuffer.length > 0 && this.state.tempPicBuffer.length === this.state.searchResults.length) {
      this.setState({ picturesToShow: this.state.tempPicBuffer })
      this.setState({ tempPicBuffer: [] })
    }
  }

  componentDidUpdate() {
    if (this.state.searchResultsReady === false && this.state.picturesToShow.length > 0 && this.state.picturesToShow.length === this.state.searchResults.length) {
      if (this.state.loadingStatus === true) {
        this.setState({ loadingStatus: false })
      }
      this.setState({ searchResultsReady: true })
    }
  }

  getSearchImagesById = (venueId) => {
    let toFilt = this.state.picturesToShow.map(sE => { let phArray; if (sE.callingId === venueId) { phArray = sE.aPicture; } else { return null; } return phArray; }).filter(aN => { return aN !== null })
    return toFilt[0]
  }

  searchResponseHandler = (searchData) => {
    if (searchData.response !== undefined && searchData.response.groups[0].items.length > 0) {
      let placesIds = this.props.placesToFilter.map(place => { return place.id })
      let resultsToFilter = searchData.response.groups[0].items.filter(anItem => { return placesIds.includes(anItem.venue.id) === false } )
      let resultsToShow = resultsToFilter.map(aReslt => { aReslt.resVisibility = true; return aReslt; })
      this.setState({ searchResults: resultsToShow })
      this.state.searchResults.map(aResult => { return this.getSearchPictures(aResult.venue.name, aResult.venue.id) })
    } else {
      this.setState({ searchResults: [] })
    }
  }

  searchResultsUpdate = (resultItem) => {
    resultItem.resVisibility = false
    let resultsToUpdate = this.state.searchResults.filter(aResult => { return this.props.placesToFilter.map(place => { return place.id }).includes(aResult.venue.id) === false })
    this.setState({ searchResults: resultsToUpdate })
    if (this.state.defaultSearchMessage === false && resultsToUpdate.length === 1) {
      this.setState({ defaultSearchMessage: true })
    }
  }

  render() {
    const { filterTopVisibility, searchTopVisibility, onFetchById } = this.props
    const { queryFilter, querySearch, searchResults, searchResultsReady, loadingStatus, defaultSearchMessage } = this.state

    return (
      <div>
        {filterTopVisibility === true && (
          <div className="sideMenu">
            <input className="filterBar" tabIndex="3" type="text" name="filter" placeholder="Filter my venues" value={queryFilter} onChange={(event) => this.updateFilterQuery(event.target.value)}/>
            <ul className="resultsContainer">
              {this.listOfPlacesToDisplay()}
            </ul>
          </div>
        )}
        {searchTopVisibility === true && (
          <div className="sideMenu">
            <input className="searchBar" tabIndex="3" type="text" name="search" placeholder="Search for new venues" value={querySearch}
                   onChange={(event) => this.updateSearchQuery(event.target.value)} onKeyPress={this.keyEnterValidate}/>
            <div className="searchSubmitButton" tabIndex="4" onClick={this.getSearchInfo}>Search</div>
            <ul className="resultsContainer">
               {loadingStatus === true && <img className="loadingImage" src={loading} alt={`loading`}/>}
               {defaultSearchMessage === true && <span className="searchMessage">Search for venues in the focused area of the map</span> }
               {searchResultsReady === true && searchResults.map(resultItem => {
                 if (resultItem.resVisibility === true) {
                   return  <li className="singleVenueContainer" tabIndex="5" key={resultItem.venue.id}>
                                <span className="searchVenueName">{resultItem.venue.name}</span>
                                <p className="venueText">{resultItem.venue.location.formattedAddress.join(" ")}</p>
                                <div className="searchPhotoContainer">{this.getSearchImagesById(resultItem.venue.id).map(aPh => { return aPh; })}</div>
                                <span onClick={() => { onFetchById(resultItem.venue.id); this.searchResultsUpdate(resultItem) }} tabIndex="6" role="button" className="addButton">Add to my venues</span>
                           </li>
                 } else {
                   return null
                 }
                })}
            </ul>
          </div>
        )}
      </div>
    )
  }
}

export default SideMenu;
