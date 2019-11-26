import React, {Component} from "react"
import styled from "styled-components"

import VisGenChart from "./visGenChart"

export default class VisCol extends Component{
    constructor(props){
        super(props)
        
        this.state={
            collectionAnswers: null
        }
        
    }

    componentDidMount(){
        this.setState({collectionAnswers: this.props.colState.collectionAnswers})
    }

    render(){
        return(
            <Body>
                {
                    this.state.collectionAnswers !== null
                    ?
                    <VisGenChart group={true} data={this.state.collectionAnswers.colAns} />
                    :
                    null
                }
            </Body>
        )
    }
}
const Body = styled.div`
    margin: 3rem auto;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`