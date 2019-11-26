import React, {Component} from "react"
import ExhibitItem from '../../components/exhibitItem'
import styled from "styled-components"
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from "react-bootstrap/Button"
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import ListGroup from 'react-bootstrap/ListGroup'
import { navigate } from "gatsby"
import Axios from 'axios'

import Cache from '../../components/cache'
import {addr} from '../config'

var globalShow = false

export default class Home extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
            colID   : "",
            colName : "",
            colExh  : [],
            colMods : [],
        }
        
        this.save       = this.save.bind(this)
        this.exists     = this.exists.bind(this)
        this.removeMod  = this.removeMod.bind(this)
        this.remove     = this.remove.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
    }

    handleEdit() {
        globalShow = !globalShow
        this.forceUpdate()
    }

    exists(col){
        let tExh = Cache.state.exhibit
        let tempCol = []
        if(tExh.hasOwnProperty("exhID")){
            if(col.colExh.length !== 0){
                for(let i = 0; i < col.colExh.length; i++){
                    tempCol = JSON.parse(col.colExh[i])
                    if(tempCol.exhID === tExh.exhID){
                        col.colExh[i] = JSON.stringify(tExh)
                        break
                    }
                }
            }
            else col.colExh.push(JSON.stringify(tExh))
        }
        return col
    }

    save(){
        if((this.state.colName.trim()).length > 0){
            let req = {
                "colID":    this.state.colID, 
                "colName":  this.state.colName, 
                "colExh":   JSON.stringify(this.state.colExh), 
                "colMods":  JSON.stringify(this.state.colMods)
            }

            Axios.post(addr +"/DBCalls/", Object(req))
            .then(  res => console.log(res) )
            .catch( err => console.log(err) )

            let storage = { 
                "colID": this.state.colID,
                "colPar": JSON.stringify([]),
                "colAns": JSON.stringify([])
            }

            Axios.post(addr +"/DBStorage/Collection/", Object(storage))
            .then(  res => console.log(res) )
            .catch( err => console.log(err) )
        }
    }

    componentDidMount(){
        if(Cache.state.collection.hasOwnProperty("colID")){
            let tCol = this.exists(Cache.state.collection)
            this.setState(tCol)
            Cache.clear("EX")
        }
        else { this.setState({colID: Cache.newId("COL")}) }
    }

    componentWillUnmount(){
        if(this.state.colID !== ""){
            Cache.cache("COL",this.state)
        }
    }

    remove(id){
        let exh = []
        let coll = Cache.state.collection.colExh
        let update = Cache.state.collection
        coll.map( (item) => exh.push(JSON.parse(item)) )
        for(let i = 0; i < exh.length; i++){
            if(exh[i].exhID === id){
                exh.splice(i,1)
                i--
            }
            else exh[i] = JSON.stringify(exh[i])
        }
        update.colExh = exh

        this.setState(update)
        this.forceUpdate()
    }

    removeMod(id){
        let mod = []
        let coll = this.state.colMods
        let update = this.state

        coll.map( (item) => { return(mod.push(JSON.parse(item))) })
        
        for(let i = 0; i < mod.length; i++){
            if(mod[i].modID === id){
                mod.splice(i,1)
                i--
            }
            else mod[i] = JSON.stringify(mod[i])
        }
        update.colMods = mod

        this.setState(update)
        this.forceUpdate()
    }

    render(){
        console.log(Cache.state)
        return(
            <>
            <Jumbotron fluid style={{margin: '15px'}} >
            <InputGroup size="lg">
                <FormControl 
                    style={{fontSize:'32px', fontWeight:'bold'}}
                    defaultValue={this.state.colName}
                    placeholder="Collection Name"
                    aria-label="Large" 
                    aria-describedby="col-name" 
                    onChange={ e => this.setState({colName: e.target.value}) }
                />
            </InputGroup>

            <div style={{display:'flex',flexDirection:'row', width: '100%'}}>
                <div style={{display:'flex',flexDirection:'column', maxWidth:'33%', minWidth: '33%'}}>
                    <Button size="lg"  onClick={() => navigate('/exhibits/exhibitList/')}>Add Exhibit</Button>
                    <Button size="lg"  onClick={() => this.save() } >Save Collection</Button>
                    <Button size="lg"  onClick={() => navigate('/collections/collections/')} >Load Collection</Button>
                </div>
                <div style={{display:'flex',flexDirection:'column', maxWidth:'33%', minWidth: '33%'}}>
                    <h3>Exhibit Count</h3>
                    <h5>{this.state.colExh.length}</h5>
                </div>
                <div style={{display:'flex',flexDirection:'column', maxWidth:'33%', minWidth: '33%'}}>
                    <h3>Collection Wide Modules</h3>
                    <ListGroup>
                        {
                            this.state.colMods.map( (item,i)=>{
                                let mods = JSON.parse(item)
                                let COL = true
                                let modId = mods.modID
                                return( <div style={{display: 'flex'}} key={i}>
                                    <ListGroup.Item
                                        action onClick={ () => {
                                                let page = '/collections/mainLobby/'
                                                navigate('/modules/modules/', { state: {page, COL, modId} })
                                            }}>{mods.modName}</ListGroup.Item>
                                    <Button variant="danger" onClick={()=>this.removeMod(modId)} >Del</Button>
                                </div> )
                            } )
                        }
                        <ListGroup.Item action onClick={ () => {
                            let page = '/collections/mainLobby/'
                            let COL = true
                            navigate('/modules/moduleList/', { state:{page, COL} } )
                        } }>Add Module</ListGroup.Item>
                    </ListGroup>
                </div>
            </div>

            </Jumbotron>

            <Body>
                { this.state.colExh.map( (item, i) => { 
                    let tempExh = JSON.parse(item)
                    return( 
                        <ExhibitItem key={i} id={tempExh.exhID} item={tempExh} remove={this.remove}/> ) }
                    ) 
                }
            </Body>
            </>
        )
    }
}

const Body = styled.div`
    margin: 3rem auto;
    max-width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`