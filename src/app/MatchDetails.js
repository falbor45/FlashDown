import React, { Component } from 'react'
import './MatchDetails.css'
import MatchAnalysis from './MatchAnalysis'
import MatchOverview from './MatchOverview'
import { CSSTransition } from 'react-transition-group'

export default class MatchDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayedComponent: 'matchOverview',
      componentTransitionTime: 700
    }
  }

  changeComponent = component => {
    this.setState({
      displayedComponent: null
    });
    setTimeout(() => {
      this.setState({
        displayedComponent: component
      })
    }, this.state.componentTransitionTime)
  };

  render() {
    return (
      <div className="match-details">
        <div className="match-details-selection">
          <button className={this.state.displayedComponent === 'matchOverview' ? 'active' : ''}
                  onClick={() => this.changeComponent('matchOverview')}>Overview</button>
          <button className={this.state.displayedComponent === 'matchAnalysis' ? 'active' : ''}
                  onClick={() => this.changeComponent('matchAnalysis')}>Analysis</button>
        </div>
        <CSSTransition in={this.state.displayedComponent === 'matchOverview'} timeout={this.state.componentTransitionTime} classNames="match-details-selection-fade" unmountOnExit>
          <MatchOverview match={this.props.match} allParticipants={this.props.allParticipants}/>
        </CSSTransition>
        <CSSTransition in={this.state.displayedComponent === 'matchAnalysis'} timeout={this.state.componentTransitionTime} classNames="match-details-selection-fade" unmountOnExit>
          <MatchAnalysis allParticipants={this.props.allParticipants}/>
        </CSSTransition>
      </div>
    )
  }
}