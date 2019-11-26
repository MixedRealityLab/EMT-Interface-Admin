import React, {Component} from "react"
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import styled from "styled-components"
import { navigate  } from "gatsby"
import Axios from 'axios'

import VisIndiv from '../../components/visIndiv'
import VisCol from '../../components/visCol'
import VisExh from '../../components/visExh'
import {addr} from '../config'

export default class VisHome extends Component{
    constructor(props){
        super(props)
        
        this.state={
            id: "",
            collection: {},
            collectionAnswers: {},
            key: "indiv",
        }
    }

    componentDidMount(){
        Axios.get(addr +"/DBCalls/" + this.props.location.state.id)
        .then( res => {
                let temp = res.data[0]

                let exh = []
                let mod = []

                JSON.parse(temp.colExh).forEach(
                    item => {
                        return exh.push(JSON.parse(item))
                    }
                )
                JSON.parse(temp.colMods).forEach(
                    item => {
                        return mod.push(JSON.parse(item))
                    }
                )

                let details = {
                    ID: temp.colID, 
                    Name: temp.colName, 
                    Exhibits: exh, 
                    Mods: mod
                }
                return details
            })
        .then(data => this.setState({collection: data}))
        .catch(err => console.log(err))
        Axios.get(addr +"/DBStorage/Collection/" + this.props.location.state.id)
        .then( res => {
                let col = {
                    colID:  res.data[0].colID,
                    colPar: JSON.parse(res.data[0].colPar),
                    colAns: JSON.parse(res.data[0].colAns)
                }
                return col
            })
        .then(data => this.setState({collectionAnswers: data}))
        .catch(err => console.log(err))
    }

    render(){
        return(
            <Body>
                <Button size="lg" onClick={ () => { navigate('/collections/collections/') } } >Back</Button>
                <Tabs 
                    id="visTabs"
                    activeKey={this.state.key}
                    onSelect={key => this.setState({ key })}
                >
                    <Tab eventKey="indiv" title="Individual">
                        {this.state.key === "indiv" ?
                            this.state.collectionAnswers.hasOwnProperty("colID")
                            ?
                            this.state.collection.hasOwnProperty("ID")
                            ?
                            <VisIndiv colState={this.state} />
                            :
                            null
                            :
                            null
                        : null}
                    </Tab>
                    <Tab eventKey="exhib" title="Exhibit">
                        {this.state.key === "exhib" ?
                            this.state.collectionAnswers.hasOwnProperty("colID")
                            ?
                            this.state.collection.hasOwnProperty("ID")
                            ?
                            <VisExh colState={this.state} />
                            :
                            null
                            :
                            null
                            
                        : null}
                        
                    </Tab>
                    <Tab eventKey="colle" title="Collection">
                        {this.state.key === "colle" ?
                            this.state.collectionAnswers.hasOwnProperty("colID")
                            ?
                            this.state.collection.hasOwnProperty("ID")
                            ?
                            <VisCol colState={this.state} />
                            :
                            null
                            :
                            null
                            
                        : null}
                        
                    </Tab>
                </Tabs>
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
/*
<Button variant="danger" onClick={()=> MuseisMidPoint.storeAns()} >Click me</Button>

                <Button variant="danger" onClick={()=> {
                    let req = {"token": "bd55a54b65c3801de63d662bb01f04b7"}

                    Axios.post(addr +"/DBStorage/Storage/", req)
                            .then(  res => console.log(res))
                            .catch( err => console.log(err))
                }} >Tag on</Button>

                <Button variant="danger" onClick={()=> {
                    let req = {"token": "removed"}

                    Axios.post(addr +"/DBStorage/Storage/", Object(req))
                        .then(  res => console.log(res))
                        .catch( err => console.log(err))
                }} >Tag off</Button>

*/