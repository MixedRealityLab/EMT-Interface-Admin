import React, {Component} from "react"
import { VictoryChart, VictoryAxis, VictoryScatter, VictoryPie, VictoryLabel, VictoryTooltip } from 'victory';

/*
var Sentiment = require('sentiment');

const unique = (value, index, self) =>{
    return self.indexOf(value) === index
}
*/

export default class VisGenChart extends Component{
    constructor(props){
        super(props)
        
        this.state={
            data:       [],
            dataFull:   [],
        }

        this.display = [
            { label: "Alert",       y: 22.5 },
            { label: "Excited",     y: 22.5 },
            { label: "Elated",      y: 22.5 },
            { label: "Happy",       y: 22.5 },
            { label: "Content",     y: 22.5 },
            { label: "Serene",      y: 22.5 },
            { label: "Relaxed",     y: 22.5 },
            { label: "Calm",        y: 22.5 },
            { label: "Bored",       y: 30 },
            { label: "Depressed",   y: 30 },
            { label: "Sad",         y: 30 },
            { label: "Upset",       y: 22.5 },
            { label: "Stressed",    y: 22.5 },
            { label: "Nervous",     y: 22.5 },
            { label: "Tense",       y: 22.5 }
            ]

    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.createData(this.props.data)
        }
    }

    componentDidMount(){
        this.setState({dataFull: this.props.data})
        this.createData(this.props.data)
    }

    createData(data){
        let temp =      []
        let exists =    []
        let key =       ""
        let found =     {}
        for(let i = 0; i < data.length; i++){
            key = "" + data[i].ans[2].ans[0] + data[i].ans[1].ans[0]
            if(exists.includes(key)){
                found = temp[exists.indexOf(key)]
                //Key found, update point
                found.items += 1
                if(!found.par.includes(data[i].parID))        found.par.push(data[i].parID)
                if(!found.exhibit.includes(data[i].exhID))    found.exhibit.push(data[i].exhID)
                found.free.push(data[i].ans[0].ans[0])
                found.fill = "red"

                found.opacity = found.opacity + found.items / data.length

            }
            else{
                //No key found, insert new point and update exist list
                exists.push(key)
                temp.push(
                    {
                        //Key
                        key: "" + data[i].ans[2].ans[0] + data[i].ans[1].ans[0],
                        //Amount of items at point
                        items: 1,
                        //Participant ID
                        par: [data[i].parID],
                        //Free text answer
                        free: [data[i].ans[0].ans[0]],
                        //Exhibit
                        exhibit: [data[i].exhID],
                        //Arousal Value
                        x: data[i].ans[2].ans[0],
                        //Valence Value
                        y: data[i].ans[1].ans[0],
                        fill:       "black",
                        //#c43a31
                        opacity:    0.25
                    }
                )
            }

            
        }
        this.setState({data: temp})
    }

    render(){
        return(
            <VictoryChart 
                    height={this.props.group ? 800 : 500} 
                    width={this.props.group ? 800 : 500}
                    domain={{x: [-7, 7], y: [-7, 7]}}> 
                    <VictoryPie
                        style={ { data:{ fill:"transparent" } } }
                        labels={ (d) => d.label }
                        labelComponent={ <VictoryLabel angle={45} /> }
                        data={ this.display } />
                    <VictoryAxis crossAxis
                        style={{ticks: { padding: this.props.group ? -280 : -140 }, tickLabels:{angle: 90, fill: "#c43a31"} }}                    
                        offsetY={ this.props.group ? 400 : 250 }
                        tickValues={ ["Active"] } />
                    <VictoryAxis dependentAxis crossAxis                                            
                        offsetX={ this.props.group ? 400 : 250 }
                        style={{ticks: { padding: this.props.group ? -280 : -160}, tickLabels:{angle: 0, fill: "#c43a31"} }}   
                        tickValues={ ["Pleasant"] }
                    />
                    <VictoryScatter
                        data={ this.state.data.length > 0 ? this.state.data : [] } 
                        
                        style={{ 
                            data: { 
                                fill: (datum) => datum.fill, 
                                opacity: (datum) => datum.opacity 
                                }}}
                        
                        labels={
                            (datum) => `Participant Count: 
                                            ${datum.items}
                                            ------------------------
                                            Exhibits Covered: 
                                            ${datum.exhibit}
                                            ------------------------
                                            Words Used:
                                            ${datum.free}
                                            `
                            }
                        labelComponent={
                            <VictoryTooltip
                                constrainToVisibleArea
                                flyoutWidth={540}
                            />
                            }
                        
                        size={this.props.group ? 12 : 8}
                        
                    />
                </VictoryChart>
        )
    }
}