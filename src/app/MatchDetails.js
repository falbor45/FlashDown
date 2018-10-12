import React, { Component } from 'react'
import './MatchDetails.css'
import MatchAnalysis from './MatchAnalysis'
import MatchOverview from './MatchOverview'

export default class MatchDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayedComponent: 'matchOverview'
    }
  }
  render() {
    return (
      <div className="match-details">
        <div className="match-details-selection">
          <button className={this.state.displayedComponent === 'matchOverview' ? 'active' : ''}
                  onClick={() => this.setState({ displayedComponent: 'matchOverview'})}>Overview</button>
          <button className={this.state.displayedComponent === 'matchAnalysis' ? 'active' : ''}
                  onClick={() => this.setState({ displayedComponent: 'matchAnalysis'})}>Analysis</button>
        </div>
        {
          this.state.displayedComponent === 'matchOverview' ?
            <MatchOverview match={this.props.match} allParticipants={this.props.allParticipants}/> :
            this.state.displayedComponent === 'matchAnalysis' ?
              <MatchAnalysis allParticipants={this.props.allParticipants}/> :
              null
        }
      </div>
    )
  }
}