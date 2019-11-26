import React, {Component} from "react"
import styled from "styled-components"

import VisGenChart from "./visGenChart"

export default class VisExh extends Component{
    constructor(props){
        super(props)
        
        this.state={
        }
    }

    componentDidMount(){
        this.setState(this.props.colState)
    }

    
    render(){
        console.log(this.state)
        return(
            <Charts>
                { 
                    this.state.hasOwnProperty("collection") ? 
                    this.state.collection.Exhibits.map(
                        (item, i) => {
                            console.log(item.exhID)
                            let exhData = []
                            for(let i=0; i < this.state.collectionAnswers.colAns.length; i++){
                                if(this.state.collectionAnswers.colAns[i].exhID === item.exhID)
                                    exhData.push(this.state.collectionAnswers.colAns[i])
                            }
                            return <ChartObj key={i} >
                                {item.exhName}
                                <VisGenChart data={exhData} />
                            </ChartObj>
                        }
                    )
                    :
                    null
                }
            </Charts>
        )
    }
}

const Charts = styled.div`
    margin: 3rem auto;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`
const ChartObj = styled.div`
    width: 500px;
    height: 500px;
    margin: 4rem auto;
`