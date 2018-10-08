import React, { Component } from 'react'
import './MatchDetails.css'
import { removeArrayElement } from './Helpers';

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
        <div className="champion-stats">
          <div className="champion-stats-item">
            <p>Vision Score</p>
            <div>
              {
                this.props.allParticipants
                  .filter(e => this.state.selectedChampions.includes(e.participantId) && e.teamId === 100)
                  .map(e =>
                    <div>
                      <img src={e.champion.iconURL}/>
                      <div className="progress-bar">
                        <div style={{ width: `${Math.ceil(this.calculateSelected(this.props.allParticipants.filter(e => this.state.selectedChampions.includes(e.participantId)), e.participantId, ["visionScore"]) * 100)}%`}}></div>
                        <p>{e.stats.visionScore}</p>
                      </div>
                    </div>
                  )
              }
            </div>
            <div>
              {
                this.props.allParticipants
                  .filter(e => this.state.selectedChampions.includes(e.participantId) && e.teamId === 200)
                  .map(e =>
                    <div>
                      <div className="progress-bar right">
                        <div style={{ width: `${100 - Math.ceil(this.calculateSelected(this.props.allParticipants.filter(e => this.state.selectedChampions.includes(e.participantId)), e.participantId, ["visionScore"]) * 100)}%`}}></div>
                        <p>{e.stats.visionScore}</p>
                      </div>
                      <img src={e.champion.iconURL}/>
                    </div>
                  )
              }
            </div>
          </div>
          <div className="champion-stats-item">
            <p>Damage dealt to champions</p>
            <div>
              {
                this.props.allParticipants
                  .filter(e => this.state.selectedChampions.includes(e.participantId) && e.teamId === 100)
                  .map(e =>
                    <div>
                      <img src={e.champion.iconURL}/>
                      <div className="progress-bar">
                        <div style={{ width: `${Math.ceil(this.calculateSelected(this.props.allParticipants.filter(e => this.state.selectedChampions.includes(e.participantId)), e.participantId, ["totalDamageDealtToChampions"]) * 100)}%`}}></div>
                        <p>{e.stats.totalDamageDealtToChampions}</p>
                      </div>
                    </div>
                  )
              }
            </div>
            <div>
              {
                this.props.allParticipants
                  .filter(e => this.state.selectedChampions.includes(e.participantId) && e.teamId === 200)
                  .map(e =>
                    <div>
                      <div className="progress-bar right">
                        <div style={{ width: `${100 - Math.ceil(this.calculateSelected(this.props.allParticipants.filter(e => this.state.selectedChampions.includes(e.participantId)), e.participantId, ["totalDamageDealtToChampions"]) * 100)}%`}}></div>
                        <p>{e.stats.totalDamageDealtToChampions}</p>
                      </div>
                      <img src={e.champion.iconURL}/>
                    </div>
                  )
              }
            </div>
          </div>
          <div className="champion-stats-item">
            <p>Gold earned</p>
            <div>
              {
                this.props.allParticipants
                  .filter(e => this.state.selectedChampions.includes(e.participantId) && e.teamId === 100)
                  .map(e =>
                    <div>
                      <img src={e.champion.iconURL}/>
                      <div className="progress-bar">
                        <div style={{ width: `${Math.ceil(this.calculateSelected(this.props.allParticipants.filter(e => this.state.selectedChampions.includes(e.participantId)), e.participantId, ["goldEarned"]) * 100)}%`}}></div>
                        <p>{e.stats.goldEarned}</p>
                      </div>
                    </div>
                  )
              }
            </div>
            <div>
              {
                this.props.allParticipants
                  .filter(e => this.state.selectedChampions.includes(e.participantId) && e.teamId === 200)
                  .map(e =>
                    <div>
                      <div className="progress-bar right">
                        <div style={{ width: `${100 - Math.ceil(this.calculateSelected(this.props.allParticipants.filter(e => this.state.selectedChampions.includes(e.participantId)), e.participantId, ["goldEarned"]) * 100)}%`}}></div>
                        <p>{e.stats.goldEarned}</p>
                      </div>
                      <img src={e.champion.iconURL}/>
                    </div>
                  )
              }
            </div>
          </div>
          <div className="champion-stats-item">
            <p>Creep score</p>
            <div>
              {
                this.props.allParticipants
                  .filter(e => this.state.selectedChampions.includes(e.participantId) && e.teamId === 100)
                  .map(e =>
                    <div>
                      <img src={e.champion.iconURL}/>
                      <div className="progress-bar">
                        <div style={{ width: `${Math.ceil((this.calculateSelected(this.props.allParticipants.filter(e => this.state.selectedChampions.includes(e.participantId)), e.participantId, ["neutralMinionsKilled", "totalMinionsKilled"])) * 100)}%`}}></div>
                        <p>{e.stats.neutralMinionsKilled + e.stats.totalMinionsKilled}</p>
                      </div>
                    </div>
                  )
              }
            </div>
            <div>
              {
                this.props.allParticipants
                  .filter(e => this.state.selectedChampions.includes(e.participantId) && e.teamId === 200)
                  .map(e =>
                    <div>
                      <div className="progress-bar right">
                        <div style={{ width: `${100 - (Math.ceil((this.calculateSelected(this.props.allParticipants.filter(e => this.state.selectedChampions.includes(e.participantId)), e.participantId, ["neutralMinionsKilled", "totalMinionsKilled"])) * 100))}%`}}></div>
                        <p>{e.stats.neutralMinionsKilled + e.stats.totalMinionsKilled}</p>
                      </div>
                      <img src={e.champion.iconURL}/>
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}