import React, {Component} from 'react'
import './RegionSelect.css'

export default class RegionSelect extends Component {
  render() {
    return (
      <div className="overlay">
        <div className="region-select">
          <div className="heading-wrapper">
            <h2>Region select</h2>
          </div>
          <div className="regions">
            <div className="region-item" onClick={() => this.props.handleRegionSelect('eune')}>
              <p className="region-icon">EUNE</p>
              <p>Europe Nordic & East</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('euw')}>
              <p className="region-icon">EUW</p>
              <p>Europe West</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('jp')}>
              <p className="region-icon">JP</p>
              <p>Japan</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('las')}>
              <p className="region-icon">LAS</p>
              <p>Latin America South</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('lan')}>
              <p className="region-icon">LAN</p>
              <p>Latin America North</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('na')}>
              <p className="region-icon">NA</p>
              <p>North America</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('oce')}>
              <p className="region-icon">OCE</p>
              <p>Oceania</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('ru')}>
              <p className="region-icon">RU</p>
              <p>Russia</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('tr')}>
              <p className="region-icon">TR</p>
              <p>Turkey</p>
            </div>
            <div className="region-item" onClick={() => this.props.handleRegionSelect('br')}>
              <p className="region-icon">BR</p>
              <p>Brazil</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}