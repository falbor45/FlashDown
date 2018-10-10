import React, { Component } from 'react'
import './MatchDetails.css'
import MatchAnalysis from './MatchAnalysis'
import MatchOverview from './MatchOverview'

export default class MatchDetails extends Component {
  render() {
    return (
      <div className="match-details">
        <MatchAnalysis allParticipants={this.props.allParticipants}/>
        <MatchOverview allParticipants={this.props.allParticipants}/>
      </div>
    )
  }
}