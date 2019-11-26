import React, {Component} from "react"
import { Link } from "gatsby"
import styled from "styled-components"

export default class Nav extends Component{
    render(){
        return(
            <Header>
                <NavBar>
                    <NavItem> 
                        <Link to="/mainLobby/"> 
                            <NavText> Lobby </NavText>
                        </Link>  
                    </NavItem>
                    <NavItem> 
                        <Link to="/collections/">
                            <NavText> Collections </NavText>     
                        </Link> 
                    </NavItem>
                    <NavItem> 
                        <Link to="/modules/"> 
                            <NavText> Modules </NavText>
                        </Link> 
                    </NavItem> 
                    <NavItem> 
                        <Link to="/exhibits/"> 
                            <NavText> Exhibit </NavText>    
                        </Link> 
                    </NavItem>   
                </NavBar> 
                </Header>
        )
    }
}

const NavBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const NavItem = styled.div`
    flex: 1;
    padding: 5px;
`

const NavText = styled.h2`

`
const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`