import React, { Component } from 'react'
import './MatchDetails.css'
import { removeArrayElement } from './Helpers';
import MatchAnalysis from './MatchAnalysis'

export default class MatchDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedChampions: [1]
    };
  }

  toggleChampionSelect = participantId => {
    if (this.state.selectedChampions.includes(participantId)) {
      this.setState({
        selectedChampions: removeArrayElement(this.state.selectedChampions, participantId)
      });
      return null;
    }
    let newArray = this.state.selectedChampions;
    newArray.push(participantId);
    this.setState({
      selectedChampions: newArray
    });
    return null;
  };



  render() {
    return (
      <div className="match-details">
        <div className="champion-select">
          {
            this.props.allParticipants.map(e =>
            <div onClick={() => this.toggleChampionSelect(e.participantId)}>
              <img className={`${this.state.selectedChampions.includes(e.participantId) ? 'selected' : ''}`} src={e.champion.iconURL}/>
            </div>
            )
          }
        </div>
        <MatchAnalysis selectedChampions={this.state.selectedChampions}
                       allParticipants={this.props.allParticipants}/>
      </div>
    )
  }
}