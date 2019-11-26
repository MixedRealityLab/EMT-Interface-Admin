import React, {Component} from "react"
import Dropdown from 'react-bootstrap/Dropdown'
import Button from "react-bootstrap/Button";
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import styled from "styled-components"
import { navigate } from "gatsby";
import Axios from 'axios'

import Cache from '../../components/cache'
import {addr} from '../config'

var globalError = false;
export default class addMod extends Component{

    constructor(props){
        super(props)

        this.state ={
            modID       : "",
            modName     : "",
            modType     : -1,
            modQuestions: []
        }
        this.showChoice     = this.showChoice.bind(this)
        this.displayExtras  = this.displayExtras.bind(this)
        this.addToState     = this.addToState.bind(this)
        this.questionTitle  = this.questionTitle.bind(this)
        this.modName        = this.modName.bind(this)
        this.save           = this.save.bind(this)
        this.addToExh       = this.addToExh.bind(this)
        this.clear          = this.clear.bind(this)
        this.setup          = this.setup.bind(this)
    }

    componentDidMount(){
        if(Cache.state.module.hasOwnProperty("modID")) 
            this.setState(Cache.state.module)
        else this.setState({modID: Cache.newId("MOD")})
    }

    componentWillUnmount(){ if(this.state.modID !== "") Cache.cache("MOD", this.state) }

    render(){
        return(
            <Body>
                <h1>Add Module</h1>
                <Button size="lg" onClick={ () => { navigate(this.props.location.state.page) } } >Back</Button>
                <Info>
                    <Dropdown>
                    <Dropdown.Toggle>
                        {this.state.modType === -1 ? <>Select Type</> : <> {this.state.modType} Module </> }
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={()=>{ this.setState({modType: "Text"  }) }} >Text  </Dropdown.Item>
                        <Dropdown.Item onClick={()=>{ this.setState({modType: "Scale" }) }} >Scale </Dropdown.Item>
                        <Dropdown.Item onClick={()=>{ this.setState({modType: "Choice"}) }} >Choice</Dropdown.Item>
                        <Dropdown.Item onClick={()=>{ this.setState({modType: "Extra" }) }} >Extra </Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>

                </Info>
                { this.setup() }
                <Info>
                    <Button size="lg"                  onClick={ () => this.addToExh()} >Add  </Button>
                    <Button variant="danger" size="lg" onClick={ () => this.clear()   } >Clear</Button>
                </Info>
            </Body>
        )
    }

    addToExh(){
        if(this.props.location.state.hasOwnProperty("COL")){
            let tCol = Cache.state.collection

            if(this.state.hasOwnProperty("modID")){
                let tMod = {
                    "modID":        this.state.modID, 
                    "modName":      this.state.modName, 
                    "modType":      this.state.modType,
                    "modQuestions": JSON.stringify(this.state.modQuestions)
                }

                tCol.colMods.push(JSON.stringify(tMod))

                this.save()
                this.clear()
                Cache.cache("COL", tCol)
                Cache.clear("MOD")
                navigate(this.props.location.state.page)
            }
        }
        else{
            let tExh = Cache.state.exhibit

            if(this.state.hasOwnProperty("modID")){
                let tMod = this.state
                tExh.exhMods.push(JSON.stringify(tMod))
                this.save()
                this.clear()
                Cache.cache("EX", tExh)
                Cache.clear("MOD")
                navigate(this.props.location.state.page)
            }
        }
    }

    save(){
        if((this.state.modName.trim()).length > 0){
            let questions = this.state.modQuestions
            for(let i = 0; i < questions.length; i++) questions[i].qID = "q" + i

            let req = {
                "modID":        this.state.modID, 
                "modName":      this.state.modName, 
                "modType":      this.state.modType,
                "modQuestions": JSON.stringify(questions)
            }

            Axios.post(addr +"/DBCalls/Modules/", Object(req))
            .then(  res => console.log(res) )
            .catch( err => console.log(err) )
        }
    }

    clear(){
        this.setState({
            modID:          "",
            modName:        "",
            modType:        -1,
            modQuestions:   []
        })
    }

    setup(){
        switch (this.state.modType){
            case -1: return null
            default: return ( <div> {this.modName()} {this.addQuestion()} </div> )
        }
    }

    modName(){
        return(
            <InputGroup size="lg">
                <InputGroup.Prepend>
                <InputGroup.Text id="mod-name">Module Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl 
                    defaultValue={this.state.modName}
                    aria-label="Large" 
                    aria-describedby="mod-name" 
                    onChange={ e => this.setState({modName: e.target.value}) }
                />
            </InputGroup>
        )
    }

    addQuestion(){
        switch (this.state.modType){
            case "Text": return (<div>
                    {this.state.modQuestions.map( (item,i) =>{
                        return( <Body key={i}>
                                {this.questionTitle(i)}
                                <Dropdown>
                                <Dropdown.Toggle> {this.display(i)} </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{ 
                                        let temp = this.state.modQuestions
                                        temp[i].qType = "SLFT"
                                        this.setState({modQuestions: temp})
                                    }} >Single Line Free Text</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{ 
                                        let temp = this.state.modQuestions
                                        temp[i].qType = "MLFT"
                                        this.setState({modQuestions: temp})
                                    }} >Multi Line Free Text</Dropdown.Item>
                                </Dropdown.Menu>
                                </Dropdown>
                                </Body> )
                    })} {this.addToState()} </div>)
            case "Scale": return (<div>
                    {this.state.modQuestions.map( (item,i) =>{
                        return(<Body key={i}>
                                {this.questionTitle(i)}
                                <Dropdown>
                                <Dropdown.Toggle> {this.display(i)} </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{ 
                                        let temp = this.state.modQuestions
                                        temp[i].qType = "SCABIN"
                                        this.setState({modQuestions: temp})
                                    }} >Binary Question</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{ 
                                        let temp = this.state.modQuestions
                                        temp[i].qType = "SCALIK"
                                        this.setState({modQuestions: temp})
                                    }} >Likert Scale Question</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{ 
                                        let temp = this.state.modQuestions
                                        temp[i].qType = "SCACUS"
                                        this.setState({modQuestions: temp})
                                    }} >Custom Scale Question</Dropdown.Item>
                                </Dropdown.Menu>
                                </Dropdown>
                                {this.displayExtras(i)}
                                </Body>)
                    })} {this.addToState()} </div>)
            case "Choice": return (<div>
                    {this.state.modQuestions.map( (item,i) =>{
                        return(<Body key={i}>
                                {this.questionTitle(i)}
                                <Dropdown>
                                <Dropdown.Toggle> {this.display(i)} </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{ 
                                        let temp = this.state.modQuestions
                                        temp[i].qType = "CHOSIN"
                                        this.setState({modQuestions: temp})
                                    }} >Single Choice Question</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{ 
                                        let temp = this.state.modQuestions
                                        temp[i].qType = "CHOMUL"
                                        this.setState({modQuestions: temp})
                                    }} >Multiple Choice Question</Dropdown.Item>
                                </Dropdown.Menu>
                                </Dropdown>
                                {this.displayExtras(i)}
                                </Body>)
                    })} {this.addToState()} </div>)
            case "Extra": return (<div>
                    {this.state.modQuestions.map( (item,i) =>{
                        return(
                            <Body key={i}>
                            {this.questionTitle(i)}
                            </Body>
                        )
                    })} {this.addToState()} </div> )
            default: return null
        }
    }

    questionTitle(i){
        return(
            <InputGroup >
                <InputGroup.Prepend>
                    <InputGroup.Text id="mod-ques">Question</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    value={this.state.modQuestions[i].qTitle}
                    as="textarea"
                    aria-describedby="mod-ques" 
                    onChange={ e => {
                                let temp = this.state.modQuestions
                                temp[i].qTitle = e.target.value
                                this.setState({modQuestions: temp})
                            } }/>
                <InputGroup.Append>
                    <Button variant="danger" onClick={()=>this.removeQuestion(i)} > Del </Button>
                </InputGroup.Append>
            </InputGroup>
        )
    }

    removeQuestion(i){
        let temp = this.state.modQuestions
        temp.splice(i,1)
        this.setState({modQuestions: temp})
    }

    display(i){
        let qType = this.state.modQuestions[i].qType
        switch (this.state.modType) {
            case "Text":
                switch (qType){
                    case "SLFT":    return <div> Single Line Free Text</div>
                    case "MLFT":    return <div> Multi Line Free Text</div>
                    default:        return <div> Select a Module Type </div>
                }
            case "Scale":
                switch (qType) {
                    case "SCABIN":  return <div> Binary Scale</div>
                    case "SCALIK":  return <div> Likert Scale</div>
                    case "SCACUS":  return <div> Custom Scale</div>
                    default:        return <div> Select a Module Type </div>
                }
            case "Choice":
                switch (qType) {
                    case "CHOSIN": return <div> Single Choice</div>
                    case "CHOMUL": return <div> Multiple Choice</div>
                    default:       return <div> Select a Module Type </div>
                }
            default:
                break;
        }
    }
    
    displayExtras(i){
        let qType = this.state.modQuestions[i].qType
        switch (this.state.modType) {
            case "Scale":
                switch (qType) {
                    case "SCABIN": return (<div> 
                                    <InputGroup >
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="mod-SCABIN-yes">Positive</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.modQuestions[i].qExtra.hasOwnProperty("yes") ? this.state.modQuestions[i].qExtra.yes : ""}
                                        aria-describedby="mod-SCABIN-yes" 
                                        onChange={ e => {
                                                    let temp = this.state.modQuestions
                                                    temp[i].qExtra.yes = e.target.value
                                                    this.setState({modQuestions: temp})
                                                } }/>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="mod-SCABIN-no">Negative</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.modQuestions[i].qExtra.hasOwnProperty("no") ? this.state.modQuestions[i].qExtra.no : ""}
                                        aria-describedby="mod-SCABIN-no" 
                                        onChange={ e => {
                                                    let temp = this.state.modQuestions
                                                    temp[i].qExtra.no = e.target.value
                                                    this.setState({modQuestions: temp})
                                                } }/>                                    
                                    </InputGroup>
                                    <Form.Check
                                        label='Add "Other" option' 
                                        value={this.state.modQuestions[i].qExtra.other}
                                        onChange={ e => {
                                            let temp = this.state.modQuestions
                                            temp[i].qExtra.other = e.target.value === "false" ? "true" : "false"
                                            this.setState({modQuestions: temp})
                                        } }
                                    />
                                </div>)
                    case "SCALIK": return (<div> 
                                    <InputGroup >
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="mod-SCALIK-min">Minimum Lable</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.modQuestions[i].qExtra.hasOwnProperty("min")? this.state.modQuestions[i].qExtra.min : ""}
                                        aria-describedby="mod-SCALIK-min" 
                                        onChange={ e => {
                                                    let temp = this.state.modQuestions
                                                    temp[i].qExtra.min = e.target.value
                                                    this.setState({modQuestions: temp})
                                                } }/>  
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="mod-SCALIK-max">Maximum Label</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.modQuestions[i].qExtra.hasOwnProperty("max")? this.state.modQuestions[i].qExtra.max : ""}
                                        aria-describedby="mod-SCALIK-max" 
                                        onChange={ e => {
                                                    let temp = this.state.modQuestions
                                                    temp[i].qExtra.max = e.target.value
                                                    this.setState({modQuestions: temp})
                                                } }/>                                
                                    </InputGroup>
                                </div>)
                    case "SCACUS": return (<div> 
                                    <InputGroup >
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="mod-SCACUS-min">Minimum Lable</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.modQuestions[i].qExtra.hasOwnProperty("min")? this.state.modQuestions[i].qExtra.min : ""}
                                        aria-describedby="mod-SCACUS-min" 
                                        onChange={ e => {
                                                    let temp = this.state.modQuestions
                                                    temp[i].qExtra.min = e.target.value
                                                    this.setState({modQuestions: temp})
                                                } }/>  
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="mod-SCACUS-max">Maximum Label</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.modQuestions[i].qExtra.hasOwnProperty("max")? this.state.modQuestions[i].qExtra.max : ""}
                                        aria-describedby="mod-SCACUS-max" 
                                        onChange={ e => {
                                                    let temp = this.state.modQuestions
                                                    temp[i].qExtra.max = e.target.value
                                                    this.setState({modQuestions: temp})
                                                } }/>                                
                                    </InputGroup>
                                    <InputGroup >
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="mod-SCACUS-step">Step count</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.modQuestions[i].qExtra.hasOwnProperty("step")? this.state.modQuestions[i].qExtra.step : 0}
                                        aria-describedby="mod-SCACUS-step" 
                                        onChange={ e => {
                                                    let newStep = e.target.value
                                                    if(!isNaN(newStep)){
                                                        globalError = false
                                                        let temp = this.state.modQuestions
                                                        temp[i].qExtra.step = newStep
                                                        this.setState({modQuestions: temp})
                                                    }
                                                    else{
                                                        globalError=true
                                                        this.forceUpdate()
                                                    }
                                                } }/>
                                    { globalError ? <Error>Please input numbers only</Error> : null }
                                    </InputGroup>
                                </div>)
                    default: break;
                }break;
            case "Choice": if(qType !== "") return(<div> {this.showChoice(i)} </div>); else break
                
            default: break;
        }
    }

    addToState(){
        return(
            <Button onClick={()=>{
                let temp = {qID: "", qTitle: "", qType: "", qExtra: {other:false}}
                let tempQs = this.state.modQuestions
                tempQs.push(temp)
                this.setState({modQuestions: tempQs})
            }} >Add Question</Button>
        )
    }

    showChoice(i){
        return(
            <div>
                <Button onClick={
                    () => {
                        let temp = this.state.modQuestions[i].qExtra
                        if(temp.hasOwnProperty("choiceList"))   temp.choiceList.push("")
                        else                                    temp.choiceList = [""]
                        this.forceUpdate()
                    }
                }> Add Choice </Button>
                {
                    this.state.modQuestions[i].qExtra.hasOwnProperty("choiceList") ?
                    this.state.modQuestions[i].qExtra.choiceList.map(
                        (item,c) =>{
                            return(<InputGroup key={c}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="mod-CHO-choiceList">Option {c+1}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    value={item}
                                    aria-describedby="mod-CHO-choiceList" 
                                    onChange={ e => {
                                                let temp = this.state.modQuestions
                                                temp[i].qExtra.choiceList[c] = e.target.value
                                                this.setState({modQuestions: temp})
                                            } }/>
                                <InputGroup.Append>
                                <Button variant="danger" onClick={()=>{
                                    let temp = this.state.modQuestions
                                    temp[i].qExtra.choiceList.splice(c,1)
                                    this.setState({modQuestions: temp})
                                }} > Del </Button>
                                </InputGroup.Append>  
                                </InputGroup>)
                        }) : null
                }
            </div>
        )
    }

}
const Body = styled.div`
    margin: 1rem auto;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`
const Info = styled.div`
    margin: 3rem auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`
const Error = styled.div`
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight:bold;
`