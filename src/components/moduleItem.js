import React, {Component} from "react"
import Card from 'react-bootstrap/Card'

export default class ModuleItem extends Component{
    constructor(props){
        super(props)
        this.state ={
            question: this.props.item,
            id: this.props.id
        }

        this.displayExtras  = this.displayExtras.bind(this)
        this.displayType    = this.displayType.bind(this)
    }

    displayExtras(){
        switch (this.props.modType) {
            case "Scale":
                switch (this.state.question.qType) {
                    case "SCABIN":  return (
                        <>
                        <Card.Text> Answer 1: {this.state.question.qExtra.yes}</Card.Text>
                        <Card.Text> Answer 2: {this.state.question.qExtra.no}</Card.Text>
                        <Card.Text> Other Enabled: {this.state.question.qExtra.other ? "True" : "False"}</Card.Text>
                        </>
                    )
                    case "SCALIK":  return (
                        <>
                        <Card.Text> Minimum Value: {this.state.question.qExtra.min}</Card.Text>
                        <Card.Text> Maximum Value: {this.state.question.qExtra.max}</Card.Text>
                        <Card.Text> Other Enabled: {this.state.question.qExtra.other ? "True" : "False"}</Card.Text>
                        </>
                    )
                    case "SCACUS":  return (
                        <>
                        <Card.Text> Minimum Value: {this.state.question.qExtra.min}</Card.Text>
                        <Card.Text> Maximum Value: {this.state.question.qExtra.max}</Card.Text>
                        <Card.Text> Step Count: {this.state.question.qExtra.step}</Card.Text>
                        <Card.Text> Other Enabled: {this.state.question.qExtra.other ? "True" : "False"}</Card.Text>
                        </>
                    )
                    default:        return null
                }
            case "Choice": return(
                <>
                    {this.state.question.qExtra.choiceList.map(
                            (item,i) =>{
                                return( <Card.Text key={i} > Answer {i+1}: {item}</Card.Text> )
                            }
                        )}
                </>
            )
            default: break; 
        }
    }

    displayType(){
        switch (this.props.modType) {
            case "Text":
                switch (this.state.question.qType){
                    case "SLFT":    return <Card.Text> Question Type: Single Line Free Text</Card.Text>
                    case "MLFT":    return <Card.Text> Question Type: Multi Line Free Text</Card.Text>
                    default:        return null
                }
            case "Scale":
                switch (this.state.question.qType) {
                    case "SCABIN":  return <Card.Text> Question Type: Binary Scale</Card.Text>
                    case "SCALIK":  return <Card.Text> Question Type: Likert Scale</Card.Text>
                    case "SCACUS":  return <Card.Text> Question Type: Custom Scale</Card.Text>
                    default:        return null
                }
            case "Choice":
                switch (this.state.question.qType) {
                    case "CHOSIN": return <Card.Text> Question Type: Single Choice</Card.Text>
                    case "CHOMUL": return <Card.Text> Question Type: Multiple Choice</Card.Text>
                    default:       return null
                }
            default: break;
        }
    }

    render(){
        console.log(this.state)
        return(
            <Card style={{ width: '300px', padding: '2px', flexWrap: 'wrap'}} >

                <Card.Body>
                    <Card.Title style={{fontSize: '24px', maxWidth: '240px'}} >Question: </Card.Title>
                    <Card.Subtitle>{this.state.question.qTitle}</Card.Subtitle>
                    {this.displayType()}
                    <Card.Text>Extras: </Card.Text>
                    {this.displayExtras()}
                </Card.Body>
            </Card>
        )
    }
}
