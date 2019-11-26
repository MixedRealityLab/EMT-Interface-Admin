import React, {Component} from "react"
import styled from "styled-components"

import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import VisGenChart from './visGenChart'

export default class VisIndiv extends Component{
    constructor(props){
        super(props)
        
        this.state={
            selectedAns: []
        }

    }

    componentDidMount(){
        this.setState(this.props.colState)
    }

    getParAns(id){
        let temp = []
        let par = this.state.collectionAnswers.colPar[id]
        this.state.collectionAnswers.colAns.map(
            (item, i) => {
                if(item.parID === par){
                    temp.push(item)
                }
            }
        )
        this.setState({selectedAns: temp})
    }

    render(){
        return(
            <Body>
                <Accordion>
                    <Card bg="outline-secondary" text="white" >
                        <Accordion.Toggle as={Button} variant="outline-secondary" eventKey="p">
                        <h5>Participant List</h5>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="p">
                            <Card.Body>
                                <ParticipantSelect>
                                    <ToggleButtonGroup
                                        name="participant"
                                        style={{maxWidth: "100%", flexWrap:"wrap"}}
                                        value={this.state.selected}
                                        onChange={(e)=>{ 
                                            this.setState({selected: e})
                                            this.getParAns(e)
                                            }} >
                                        {   
                                            this.state.hasOwnProperty("id")
                                            ?
                                            this.state.collectionAnswers.colPar.map( (item,i) =>{
                                                return <ToggleButton 
                                                    key={i} 
                                                    variant="danger" 
                                                    style={{maxWidth: 60}}
                                                    value={i}
                                                    >
                                                    {item}
                                                </ToggleButton>
                                            } )
                                            :
                                            null
                                        }
                                    </ToggleButtonGroup>
                                </ParticipantSelect>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

                {
                    this.state.hasOwnProperty("selected")
                    ?
                        this.state.selectedAns[0].hasOwnProperty("parID")
                        ?
                        !this.state.collection.Exhibits[0].hasOwnProperty("visType")
                        ?
                        <VisGenChart data={this.state.selectedAns} />
                        :
                        null
                        :
                        null
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
const ParticipantSelect = styled.div`
    margin: 3rem auto;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`