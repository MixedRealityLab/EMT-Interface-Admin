import React, { Component } from "react"
import Button from "react-bootstrap/Button"
import ListGroup from 'react-bootstrap/ListGroup'
import { navigate } from "gatsby"
import Axios from 'axios'
import styled from "styled-components"
import Modal from 'react-bootstrap/Modal'

import Cache from '../../components/cache'
import {addr} from '../config'

export default class Collections extends Component{

    constructor(props){
        super(props)
        
        this.state={
            selected: -1,
            exhibits: [],
            show: false,
        }
        this.addExhibit     = this.addExhibit.bind(this)
        this.handleShow     = this.handleShow.bind(this)
        this.handleClose    = this.handleClose.bind(this)
    }

    handleClose() {
        this.setState({ show: false, selected: -1 });
    }
    
    handleShow(i) {
        this.setState({ show: true, selected: i });
    }

    addExhibit(id){
        let tCol = Cache.state.collection

        if(this.state.exhibits[id].hasOwnProperty("exhID")){
            let tExh = this.state.exhibits[id]

            let tempExh ={
                exhID: tExh.exhID,
                exhName: tExh.exhName,
                exhIMG: tExh.exhIMG,
                exhDesc: tExh.exhDesc,
                exhMods: JSON.parse(tExh.exhMods)
            }

            tCol.colExh.push(JSON.stringify(tempExh))
            Cache.cache("COL", tCol)
        }
    }

    componentDidMount(){
        Axios.get(addr +"/DBCalls/Exhibits/")
        .then( res => {
                let exh = []
                res.data.forEach(item =>{
                    let found = false
                    Cache.state.collection.colExh.forEach( exhItem=>{ if(JSON.parse(exhItem).exhID === item.exhID) found = true })
                    if(!found) exh.push(item) 
                    })
                return exh
            })
        .then(  data => this.setState({exhibits: data}) )
        .catch( err => console.log(err) )
    }

    render(){
        return(
            <Body>
                <h1>Exhibits</h1>
                <Button onClick={ () => navigate('/collections/mainLobby/') } >Back</Button>
                <Button onClick={ () => navigate('/exhibits/addExhibit/') } >Create New Exhibit</Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Exhibit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Would you like to add this Exhibit to the Collection?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={()=>{
                        this.addExhibit(this.state.selected)
                        this.handleClose()
                        navigate('/collections/mainLobby/')
                    }}>
                    Add to Collection
                    </Button>
                </Modal.Footer>
                </Modal>

                <ListGroup>
                    {
                        this.state.exhibits.map(
                            (item, i) => { 
                                return(
                                    <ListGroup.Item 
                                        key={i} action onClick={()=>this.handleShow(i)}>
                                        Exhibit: {item.exhName} 
                                    </ListGroup.Item>
                                    ) 
                                } 
                            )
                    }
                </ListGroup>
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