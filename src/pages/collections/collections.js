import React, { Component } from "react"
import Button from "react-bootstrap/Button"
import ListGroup from 'react-bootstrap/ListGroup'
import Alert from 'react-bootstrap/Alert'
import { navigate } from "gatsby"
import styled from "styled-components"
import Axios from 'axios'

import Cache from '../../components/cache'
import {addr} from '../config'

export default class Collections extends Component{

    constructor(props){
        super(props)
        
        this.state={
            alert: -1,
            collections: [],
            show: false,
        }
        this.openCollection = this.openCollection.bind(this)
        this.handleShow     = this.handleShow.bind(this)
        this.handleHide     = this.handleHide.bind(this)
    }

    componentDidMount(){
        Axios.get(addr +"/DBCalls/")
        .then( res => {
                let col = []
                res.data.forEach(item =>{ col.push(item) })
                return col
            })
        .then( data => this.setState({collections: data}) )
        .catch(err => console.log(err))
        
    }

    handleHide(){
        this.setState({ show: false, alert: -1 })
    }
    
    handleShow(i){
        this.setState({ show: true, alert: i })
    }

    openCollection(){
        let temp = {
            colID:      this.state.collections[this.state.alert].colID,
            colName:    this.state.collections[this.state.alert].colName,
            colExh:     JSON.parse(this.state.collections[this.state.alert].colExh),
            colMods:    JSON.parse(this.state.collections[this.state.alert].colMods)
        }
        Cache.cache("COL",temp)
        navigate("/collections/mainLobby/")
    }

    render(){
        return(
            <Body>
                <Alert show={this.state.show} variant="warning" onClose={this.handleHide}>
                <Alert.Heading>Warning</Alert.Heading>
                <p>
                   Are you sure you want to open Collection: {
                       this.state.show
                       ? this.state.collections[this.state.alert].colName
                       : null}?
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => this.openCollection()} variant="Primary">
                    Yes
                    </Button>
                    <Button onClick={this.handleHide} variant="Primary">
                    No
                    </Button>
                </div>
                </Alert>

                <h1>Collections</h1>
                
                <ListGroup>
                    {
                        this.state.collections.map(
                            (item, i) => { 
                                let id = item.colID
                                return(
                                        <div key={i}>
                                            <ListGroup.Item 
                                                action onClick={ () => this.handleShow(i) }>
                                                Collection: {item.colName} 
                                            </ListGroup.Item>
                                            <Button onClick={ () => { navigate("/visualisations/visualisationHome/", {state: {id}}) } } >View collected data</Button>
                                        </div>
                                        
                                    
                                    
                                    ) 
                                } 
                            )
                        }
                </ListGroup>
                
                <Buttons>
                    <Button onClick={()=> { Cache.clear("ALL"); this.forceUpdate(); navigate('/collections/mainLobby/') }} >Create New Collection</Button>
                    
                </Buttons>
            </Body>
        )
    }
}
const Buttons = styled.div`
    margin: 3rem auto;
    max-width: 75%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`
const Body = styled.div`
    margin: 3rem auto;
    max-width: 75%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`