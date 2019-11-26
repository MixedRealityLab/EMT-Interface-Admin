import React, {Component} from "react"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { navigate } from "gatsby";

export default class ExhibitItem extends Component{
    constructor(props){
        super(props)

        this.preview    = this.preview.bind(this)
    }

    preview(){
        let tempDesc = this.props.item.exhDesc
        let slicedDesc = ""
        if(tempDesc.length < 52){
            let dif = 52 - tempDesc.length
            console.log(dif)
            slicedDesc = tempDesc + "..."
        }
        else slicedDesc = tempDesc.substring(0,52) + "..."
        
        return( <Card.Text> {slicedDesc} </Card.Text> )
    }

    render(){
        const id = this.props.id
        const item = this.props.item
        return(
            <Card style={{ width: '250px', padding: '2px', flexWrap: 'wrap'}} >
                <div style={{
                    backgroundImage: 'url(' + item.exhIMG + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '150px',
                    width: '240px',
                    alignSelf: 'center'
                    }}/>

                <Card.Body>
                    <Card.Title style={{fontSize: '24px', maxWidth: '240px'}} >{item.exhName}</Card.Title>
                    {this.preview()}
                    <Button block active onClick={ () => navigate('/exhibits/exhibits/', { state: {id} } ) } >View Settings</Button>
                </Card.Body>
                <Card.Footer className="text-muted" >
                    <Button variant="danger" block active onClick={ () => this.props.remove(id) } >Remove</Button>
                </Card.Footer>
            </Card>
        )
    }
}
