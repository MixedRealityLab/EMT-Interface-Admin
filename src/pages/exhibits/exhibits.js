import React, {Component} from "react"
import Button from "react-bootstrap/Button";
import Image from 'react-bootstrap/Image'
import { navigate } from "@reach/router";
import ListGroup from 'react-bootstrap/ListGroup'
import styled from "styled-components"

import Cache from '../../components/cache'

export default class Exhibits extends Component{

    constructor(props){
        super(props)
        this.state ={
        }

        this.removeMod = this.removeMod.bind(this)
    }

    removeMod(id){
        let mod = []
        let exh = this.state.exhMods
        let update = this.state
        exh.map( (item) => {
            return(mod.push(JSON.parse(item)))
        } )
        
        for(let i = 0; i < mod.length; i++){
            if(mod[i].modID === id){
                mod.splice(i,1)
                i--
            }
            else mod[i] = JSON.stringify(mod[i])
        }
        update.exhMods = mod

        this.setState(update)
        this.forceUpdate()
    }

    componentDidMount(){
        if(Cache.state.exhibit.hasOwnProperty("exhID")){
            let cExh = Cache.state.exhibit
            this.setState(cExh)
        }
        else{
            let exh = []
            let dat = Cache.state.collection.colExh
            let passID = this.props.location.state.id
            dat.map( (item) => exh.push(JSON.parse(item)) )
    
            for(let i = 0; i < exh.length; i++){
                if(exh[i].exhID === passID){
                    this.setState(exh[i])
                    break
                }
            }
        }
    }
    componentWillUnmount(){
        Cache.cache("EX", this.state)
    }

    render(){
        const exhId = this.props.location.state.id
        return(
            this.state.hasOwnProperty("exhID")
            ?
                <div>
                    <Button onClick={ () => navigate('/collections/mainLobby/') } >Back</Button>
                    <OuterBody>
                    <h1>Item is {this.state.exhName} </h1>
                    <Body>
                    <Image src={this.state.exhIMG} style={{maxWidth : '90%', maxHeight: '75%'}} />
                    <ListGroup>
                        {
                            this.state.exhMods.map( (item,i)=>{
                                let mods = JSON.parse(item)
                                let modId = mods.modID
                                return( 
                                <div style={{display: 'flex'}} key={i}>
                                    <ListGroup.Item 
                                    action onClick={ () => { 
                                        let page = '/exhibits/exhibits/'
                                        navigate('/modules/modules/', { state: {page, exhId, modId} }) 
                                        }}>{mods.modName}</ListGroup.Item> 
                                    <Button variant="danger" onClick={()=>this.removeMod(modId)} >Del</Button>
                                </div>)
                            } )
                        }
                        <ListGroup.Item action onClick={ () => {
                            let page = '/exhibits/exhibits/'
                            navigate('/modules/moduleList/', { state:{page} } )
                        } }>Add Module</ListGroup.Item>
                    </ListGroup>
                    </Body>
                    <div><h3>Description</h3></div>
                    <div>{this.state.exhDesc}</div>
                    </OuterBody>
                </div>
            :
            null
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
const OuterBody = styled.div`
    margin: 3rem auto;
    max-width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`