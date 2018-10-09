import React, { Component } from 'react'
import MatchAnalysisItem from './MatchAnalysisItem'
import './MatchAnalysis.css'



export default class MatchAnalysis extends Component {
  render() {
    return (
      <div className="champion-stats">
        <MatchAnalysisItem title="Vision score"
                           allParticipants={this.props.allParticipants}
                           selectedChampions={this.props.selectedChampions}
                           calculatedProperties={["visionScore"]}/>
        <MatchAnalysisItem title="Damage dealt to champions"
                           allParticipants={this.props.allParticipants}
                           selectedChampions={this.props.selectedChampions}
                           calculatedProperties={["totalDamageDealtToChampions"]}/>
        <MatchAnalysisItem title="Gold earned"
                           allParticipants={this.props.allParticipants}
                           selectedChampions={this.props.selectedChampions}
                           calculatedProperties={["goldEarned"]}/>
        <MatchAnalysisItem title="Creep score"
                           allParticipants={this.props.allParticipants}
                           selectedChampions={this.props.selectedChampions}
                           calculatedProperties={["neutralMinionsKilled", "totalMinionsKilled"]}/>
      </div>
    )
  }
}