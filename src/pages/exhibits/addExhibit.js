import React, {Component} from "react"
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Table from 'react-bootstrap/Table'
import { navigate } from "@reach/router";
import styled from "styled-components"
import Axios from 'axios'

import Cache from '../../components/cache'
import {addr} from '../config'

export default class addExhib extends Component{
    constructor(props){
        super(props)
        this.state ={
            exhID: "",
            exhName: "",
            exhIMG: "",
            exhDesc: "",
            exhMods: []
        }
        this.save     = this.save.bind(this)
        this.clear    = this.clear.bind(this)
        this.addToCol = this.addToCol.bind(this)
        this.validate = this.validate.bind(this)
    }

    clear(){
        this.setState({
            exhID: "",
            exhName: "",
            exhIMG: "",
            exhDesc: "",
            exhMods: []
        })
    }

    save(){
        if((this.state.exhName.trim()).length > 0){
            let req = {
                "exhID":    this.state.exhID, 
                "exhName":  this.state.exhName, 
                "exhIMG":   this.state.exhIMG,
                "exhDesc":  this.state.exhDesc , 
                "exhMods":  JSON.stringify(this.state.exhMods)
            }

            Axios.post(addr +"/DBCalls/Exhibits/", Object(req))
            .then(  res => console.log(res) )
            .catch( err => console.log(err) )
        }
    }

    validate(){
        let result = false
        if(this.state.exhID !== ""){
            if(this.state.exhName !== ""){
                if(this.state.exhIMG !== ""){
                    if(this.state.exhDesc !== ""){
                        result = true
                    }
                }
            }
        }
        return result
    }

    addToCol(){
        let tCol = Cache.state.collection

        if(this.state.hasOwnProperty("exhID")){
            let tExh = this.state

            tCol.colExh.push(JSON.stringify(tExh))
            this.clear()
            Cache.cache("COL", tCol)
            Cache.clear("EX")
        }
    }

    componentDidMount(){
        if(Cache.state.exhibit.hasOwnProperty("exhID")){
            let tExh = Cache.state.exhibit
            this.setState(tExh)
        }
        else this.setState({exhID: Cache.newId("EX")}) 
    }

    componentWillUnmount(){
        if(this.state.exhID !== "") Cache.cache("EX", this.state)
    }

    render(){
        return(
            <Body>
                <h1>Add Exhibit</h1>
                <Button onClick={ () => navigate('/exhibits/exhibitList/') } >Back</Button>
                <Button onClick={ () => navigate('/collections/mainLobby/') } >Back to Collection</Button>
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="ex-name">Exhibit Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl 
                        placeholder="Exhibit Name"
                        defaultValue={this.state.exhName}
                        aria-label="Large" 
                        aria-describedby="ex-name" 
                        onChange={ e => this.setState({exhName: e.target.value}) }
                    />
                </InputGroup>
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="ex-img">Image URL</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Exhibit Image"
                        defaultValue={this.state.exhIMG}
                        aria-label="Large" 
                        aria-describedby="ex-img"
                        onChange={ e => this.setState({exhIMG: e.target.value}) }
                    />
                </InputGroup>
                <div>
                    <h3>Image Preview</h3>
                    <Image src={this.state.exhIMG} style={{maxWidth : '90%', maxHeight: '75%'}} />
                </div>
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="ex-desc">Description</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Exhibit Description"
                        as="textarea"
                        value={this.state.exhDesc}
                        aria-label="Large"
                        aria-describedby="ex-desc"
                        onChange={ e => this.setState({exhDesc: e.target.value}) }
                    />
                </InputGroup>
                <Body>
                    <h3>Initial Modules</h3>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Module Name</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            Cache.state.exhibit.hasOwnProperty("exhMods")
                            ?
                            Cache.state.exhibit.exhMods.length !== 0 
                                ? Cache.state.exhibit.exhMods.map(
                                    (item,i) => {
                                        let temp = JSON.parse(item)
                                        return( 
                                            <tr key={i} onClick = {()=>{ 
                                                let page = '/exhibits/addExhibit/'
                                                navigate('/modules/modules/', { state:{page, temp} } )
                                             }}>
                                                <td>{temp.modName}</td>
                                                <td>{temp.modType}</td>
                                            </tr>
                                        )
                                    }
                                )
                                : null
                            : null
                        }
                        </tbody>
                    </Table>
                    <Button onClick={ () => {
                        let page = '/exhibits/addExhibit/'
                        navigate('/modules/moduleList/', { state:{page} } )
                    } } >Add Modules</Button>
                    
                </Body>
                    <Button 
                            size="lg"
                            onClick={ () => {
                                if(this.validate()){
                                    this.addToCol()
                                    this.save()
                                    navigate('/collections/mainLobby/')
                                }
                                else{
                                    console.log("Validation Failed")
                                    //Add feedback popup to user
                                }
                            } 
                    } >Add Exhibit</Button>
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