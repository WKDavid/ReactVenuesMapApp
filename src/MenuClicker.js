import React, { Component } from 'react'

class MenuClicker extends Component {

  render() {
    const { onFilterClick, onSearchClick, onKeyPressValidate } = this.props

    return (
      <div className="buttonsContainer">
        <span className="filterButton" tabIndex="1" role="button" onKeyPress={(event) => { if (onKeyPressValidate(event)) {onFilterClick();} }} onClick={() => onFilterClick()}>Filter</span>
        <span className="credits" role="banner" tabIndex="0">Powered by: GoogleMaps, Foursquare, Unsplash</span>
        <span className="searchButton" tabIndex="2" role="button" onKeyPress={(event) => { if (onKeyPressValidate(event)) {onSearchClick();} }} onClick={() => onSearchClick()}>Search</span>
      </div>
    )
  }
}

export default MenuClicker;
