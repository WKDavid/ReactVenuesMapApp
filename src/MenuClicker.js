import React, { Component } from 'react'

class MenuClicker extends Component {

  render() {
    const { onFilterClick, onSearchClick } = this.props

    return (
      <div className="buttonsContainer">
        <span className="filterButton" tabIndex="1" role="button" onClick={() => onFilterClick()}>Filter</span>
        <span className="credits" tabIndex="8" role="banner" >Powered by: GoogleMaps, Foursquare, Unsplash</span>
        <span className="searchButton" tabIndex="2" role="button" onClick={() => onSearchClick()}>Search</span>
      </div>
    )
  }
}

export default MenuClicker;
