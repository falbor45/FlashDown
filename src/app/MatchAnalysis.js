import React, { Component } from 'react'
import MatchAnalysisItem from './MatchAnalysisItem'
import { removeArrayElement } from './Helpers';
import './MatchAnalysis.css'



export default class MatchAnalysis extends Component {
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
      <div>
        <div className="champion-select">
          {
            this.props.allParticipants.map(e =>
              <div onClick={() => this.toggleChampionSelect(e.participantId)}>
                <img className={`${this.state.selectedChampions.includes(e.participantId) ? 'selected' : ''}`}
                     src={e.champion.iconURL}/>
              </div>
            )
          }
        </div>
        <div className="champion-stats">
          <MatchAnalysisItem title="Vision score"
                             allParticipants={this.props.allParticipants}
                             selectedChampions={this.state.selectedChampions}
                             calculatedProperties={["visionScore"]}/>
          <MatchAnalysisItem title="Damage dealt to champions"
                             allParticipants={this.props.allParticipants}
                             selectedChampions={this.state.selectedChampions}
                             calculatedProperties={["totalDamageDealtToChampions"]}/>
          <MatchAnalysisItem title="Gold earned"
                             allParticipants={this.props.allParticipants}
                             selectedChampions={this.state.selectedChampions}
                             calculatedProperties={["goldEarned"]}/>
          <MatchAnalysisItem title="Creep score"
                             allParticipants={this.props.allParticipants}
                             selectedChampions={this.state.selectedChampions}
                             calculatedProperties={["neutralMinionsKilled", "totalMinionsKilled"]}/>
        </div>
      </div>
    )
  }
}