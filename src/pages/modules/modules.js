import React, {Component} from "react"
import ModuleItem from '../../components/moduleItem'
import Button from "react-bootstrap/Button"
import Axios from 'axios'
import styled from "styled-components"
import { navigate } from "gatsby"

import Cache from '../../components/cache'
import {addr} from '../config'

export default class Modules extends Component{

    constructor(props){
        super(props)

        this.state ={
            mod: {},
            exh: ""
        }
    }

    componentDidMount(){
        Axios.get(addr +"/DBCalls/Modules/" + this.props.location.state.modId)
        .then( res => {
                let mod = res.data[0]
                mod.modQuestions = JSON.parse(mod.modQuestions)
                return mod
            })
        .then( data => this.setState({mod: data}) )
        .catch(err => console.log(err))

        if(!this.props.location.state.hasOwnProperty("COL")) this.setState({exh: Cache.state.exhibit.exhName})
        
    }

    render(){
        const id = this.props.location.state.exhId
        return(
            <Body>
                <Button size="lg" onClick={ () => { navigate(this.props.location.state.page, {state: {id}}) } } >Back</Button>
                { !this.props.location.state.hasOwnProperty("COL") ? <h1>Exhibit: {this.state.exh}</h1> : null }
                <h1>Module: {this.state.mod.modName} </h1>
                <h3>Type: {this.state.mod.modType} </h3>
                <Questions>
                    {
                        this.state.mod.hasOwnProperty("modQuestions") ?
                        this.state.mod.modQuestions.map(
                            (item, i) =>{
                                return(
                                    <div key={i} >
                                        <ModuleItem item={item} id={i} modType={this.state.mod.modType} />
                                    </div>
                                )
                            }
                        )
                        : null
                    }
                </Questions>
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
const Questions = styled.div`
    margin: 3rem auto;
    max-width: 75%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`