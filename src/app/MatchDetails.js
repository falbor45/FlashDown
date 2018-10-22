import React, { Component } from 'react'
import './MatchDetails.css'
import MatchAnalysis from './MatchAnalysis'
import MatchOverview from './MatchOverview'
import { CSSTransition } from 'react-transition-group'

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
        <CSSTransition in={this.state.displayedComponent === 'matchOverview'} timeout={250} classNames="match-details-selection-fade" unmountOnExit>
          <MatchOverview match={this.props.match} allParticipants={this.props.allParticipants}/>
        </CSSTransition>
        <CSSTransition in={this.state.displayedComponent === 'matchAnalysis'} timeout={250} classNames="match-details-selection-fade" unmountOnExit>
          <MatchAnalysis allParticipants={this.props.allParticipants}/>
        </CSSTransition>
      </div>
    )
  }
}