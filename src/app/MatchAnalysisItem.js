import React, { Component } from 'react'
import './MatchAnalysisItem.css'

export default class MatchAnalysisItem extends Component {
  constructor(props) {
    super(props);

  }

  calculateSelected = (participants, selectedParticipantId, calculatedProperties) => {
    let searchedValueArray = participants.map(e => {
      let result = 0;
      calculatedProperties.forEach((x, index) => {
        result += e.stats[calculatedProperties[index]];
      });
      return result;
    });

    let maxValue = Math.max.apply(Math, searchedValueArray);


    let selectedParticipant = participants
      .filter(e => e.participantId === selectedParticipantId)
      .reduce((previousValue, currentValue) => {
        let nextValue = 0;
        calculatedProperties.forEach((e, index) => {
          nextValue += currentValue.stats[calculatedProperties[index]]
        });
        return previousValue + nextValue
      }, 0);

    return selectedParticipant / maxValue;
  };

  calculateProperties = (participant, calculatedProperties) => {
    let result = 0;
    calculatedProperties.forEach((e, index) => {
      result += participant.stats[calculatedProperties[index]];
    });

    return result;
  };


  render() {
    return (
      <div className="champion-stats-item">
        <p>{this.props.title}</p>
        <div>
          {
            this.props.allParticipants
              .filter(e => this.props.selectedChampions.includes(e.participantId) && e.teamId === 100)
              .map(e =>
                <div>
                  <img src={e.champion.iconURL}/>
                  <div className="progress-bar">
                    <div style={{ width: `${Math.ceil(this.calculateSelected(this.props.allParticipants.filter(e => this.props.selectedChampions.includes(e.participantId)), e.participantId, this.props.calculatedProperties) * 100)}%`}}></div>
                    <p>{this.calculateProperties(e, this.props.calculatedProperties)}</p>
                  </div>
                </div>
              )
          }
        </div>
        <div>
          {
            this.props.allParticipants
              .filter(e => this.props.selectedChampions.includes(e.participantId) && e.teamId === 200)
              .map(e =>
                <div>
                  <div className="progress-bar right">
                    <div style={{ width: `${100 - Math.ceil(this.calculateSelected(this.props.allParticipants.filter(e => this.props.selectedChampions.includes(e.participantId)), e.participantId, this.props.calculatedProperties) * 100)}%`}}></div>
                    <p>{this.calculateProperties(e, this.props.calculatedProperties)}</p>
                  </div>
                  <img src={e.champion.iconURL}/>
                </div>
              )
          }
        </div>
      </div>
    )
  }
}