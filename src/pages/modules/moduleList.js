import React, { Component } from "react"
import Button from "react-bootstrap/Button"
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { navigate } from "gatsby"
import Axios from 'axios'
import styled from "styled-components"
import Modal from 'react-bootstrap/Modal'

import Cache from '../../components/cache'
import {addr} from '../config'

export default class Modules extends Component{

    constructor(props){
        super(props)
        
        this.state={
            selected: -1,
            modules: [],
            show: false,
            filter: {
                name: "",
                type: [ "Text", "Scale", "Choice", "Extra", "Clear" ],
                selType: ""
            }
        }
        this.addModule      = this.addModule.bind(this)
        this.handleShow     = this.handleShow.bind(this)
        this.handleClose    = this.handleClose.bind(this)
    }

    handleClose() {
        this.setState({ show: false, selected: -1 });
    }
    
    handleShow(i) {
        this.setState({ show: true, selected: i });
    }

    addModule(id){

        if(this.props.location.state.hasOwnProperty("COL")){
            let tCol = Cache.state.collection
            let tColMod = tCol.colMods.length > 0 ? tCol.colMods : []
            tColMod.push(JSON.stringify(this.state.modules[id]))
            tCol.colMods = tColMod
            Cache.cache("COL",tCol)
        }
        else{
            let tExh = Cache.state.exhibit
            let tExhMod = tExh.exhMods.length > 0 ? tExh.exhMods : []
            tExhMod.push(JSON.stringify(this.state.modules[id]))
            tExh.exhMods = tExhMod
            Cache.cache("EX", tExh)
        }
        this.setState({modules: []})
    }

    componentDidMount(){
        Axios.get(addr +"/DBCalls/Modules/")
        .then( res => {
                let cMod = []
                if(Cache.state.collection.colMods.length > 0)
                    res.data.forEach(item =>{ if(!Cache.state.collection.colMods.includes(JSON.stringify(item))) cMod.push(item) })

                else res.data.forEach( (item)=>cMod.push(item) )
                return cMod
            })
        .then(
            colMod => {
                let exhMod = []
                if(Cache.state.exhibit.hasOwnProperty("exhID")){
                    if(Cache.state.exhibit.exhMods.length > 0) exhMod = Cache.state.exhibit.exhMods
                    
                    colMod.forEach(item=>{ item.modQuestions= JSON.parse(item.modQuestions) })
                }
                
                let mod = []
                if      (exhMod.length === 0)   mod = colMod
                else if (colMod.length === 0)   mod = exhMod
                else    colMod.forEach(item =>{ if(!exhMod.includes(JSON.stringify(item))) mod.push(item) })

                return mod
            }
        )
        .then( data => this.setState({modules: data}) )
        .catch(err => console.log(err))
    }

    render(){
        return(
            <Body>
                <h1>Modules</h1>
                <Button onClick={ () => navigate(this.props.location.state.page)                            } >Back             </Button>
                <Button onClick={ () => navigate('/modules/addModule/', {state: this.props.location.state}) } >Create New Module</Button>       

                <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Module</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Would you like to add this Module to the current exhibit?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}> Close </Button>
                    <Button variant="primary" onClick={()=>{
                        this.addModule(this.state.selected)
                        this.handleClose()
                            navigate(this.props.location.state.page)
                    }}> Add to Exhibit </Button>
                </Modal.Footer>
                </Modal>

                <Table style={{display: 'flex', maxWidth: '75%', justifyContent: 'center'}} >
                    <tbody>
                        <tr>
                            <td>
                                <h3>Filter Options</h3>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <InputGroup>
                                            <FormControl 
                                                style={{fontSize:'16px'}}
                                                defaultValue={this.state.filter.name}
                                                placeholder="Enter name of module" 
                                                aria-describedby="filter-name" 
                                                onChange={ e => {
                                                    let temp = this.state.filter
                                                    temp.name = e.target.value
                                                    this.setState({filter: temp}) 
                                                } }
                                            />
                                        </InputGroup>
                                    </ListGroup.Item>
                                    {
                                        this.state.filter.type.map((item, i) => {
                                            return(
                                                <ListGroup.Item 
                                                    key={i} 
                                                    action
                                                    active={this.state.filter.selType.includes(item) ? true : false}
                                                    onClick={ () =>{
                                                        let temp = this.state.filter
                                                        temp.selType = item.includes("Clear") ? "" : item
                                                        this.setState({filter: temp})
                                                    } }
                                                > {item} </ListGroup.Item>
                                            )
                                        })
                                    }
                                </ListGroup>
                            </td>
                            <td colSpan="2">
                                <ListGroup>
                                    {
                                        this.state.modules.map(
                                            (item, i) => { 
                                                if(item.modType.includes(this.state.filter.selType)){
                                                    if(item.modName.includes(this.state.filter.name)){
                                                        return(
                                                            <ListGroup.Item 
                                                                key={i} 
                                                                action 
                                                                onClick={()=>this.handleShow(i)}
                                                            > Module: {item.modName} </ListGroup.Item>
                                                            ) 
                                                    }
                                                    else return null
                                                } 
                                                else return null
                                                }
                                                
                                            )
                                    }
                                </ListGroup>
                            </td>
                        </tr>
                    </tbody>
                </Table>
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