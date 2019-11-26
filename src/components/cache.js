import Axios from 'axios'
import {addr} from '../pages/config'
/**
 * Class to store cached data during the session
 * Class will be unique in the program
 */
class Cache{
  constructor(){
      this.state ={
          collection    : {},
          colIdNo       : 0 ,
          exhibit       : {},
          exhIdNo       : 0 ,
          module        : {},
          modIdNo       : 0 ,

      }
      this.idCheck = this.idCheck.bind(this)
      this.idCheck()

      this.newId = this.newId.bind(this)
      this.clear = this.clear.bind(this)
      this.cache = this.cache.bind(this)
  }
  /**
   * Checks the highest ID numbers
   * This is so that other entries are not overwritten
   */
  idCheck(){
    Axios.get(addr +"/DBCalls/")
        .then( res => {
                let temp = res.data
              temp.sort(function(a,b){
                if(parseInt(a.colID.substring(3)) < parseInt(b.colID.substring(3))) return -1
                if(parseInt(a.colID.substring(3)) > parseInt(b.colID.substring(3))) return 1
                return 0
              })
              let cID = parseInt(temp[temp.length-1].colID.substring(3))
              this.state.colIdNo = ++cID
            })
        .catch(err => console.log(err)) 
    Axios.get(addr +"/DBCalls/Exhibits/")
      .then( res => {
              let temp = res.data
              temp.sort(function(a,b){
                if(parseInt(a.exhID.substring(2)) < parseInt(b.exhID.substring(2))) return -1
                if(parseInt(a.exhID.substring(2)) > parseInt(b.exhID.substring(2))) return 1
                return 0
              })
              let eNum = parseInt(temp[temp.length-1].exhID.substring(2))
              this.state.exhIdNo = ++eNum
          })
        .catch(err => console.log(err))
    Axios.get(addr +"/DBCalls/Modules/")
      .then( res => {
              let temp = res.data
              temp.sort(function(a,b){
                if(parseInt(a.modID.substring(3)) < parseInt(b.modID.substring(3))) return -1
                if(parseInt(a.modID.substring(3)) > parseInt(b.modID.substring(3))) return 1
                return 0
              })
              let mNum = parseInt(temp[temp.length-1].modID.substring(3))
              this.state.modIdNo = ++mNum
          })
      .catch(err => console.log(err))
  }
  /**
   * Assign new ID to a component
   */
  newId(type){
    switch(type){
        case "COL": 
            let cId = this.state.colIdNo
            this.state.colIdNo++
        return "COL" + cId
        case "EX":
            let eId = this.state.exhIdNo
            this.state.exhIdNo++
        return "EX" + eId
        case "MOD": 
            let mId = this.state.modIdNo
            this.state.modIdNo++
        return "MOD" + mId
        default: console.log("Wrong Identifier")
    }
  }
  /**
   * Cache an item into volatile storage
   */
  cache(type, item){
    switch(type){
        case "COL": this.state.collection = item
        break
        case "EX": this.state.exhibit = item
        break
        case "MOD": this.state.module = item
        break
        default: console.log("Wrong Identifier")
    }
  }
  /**
   * Remove item from volatile storage
   */
  clear(type){
    switch(type){
        case "COL": this.state.collection = {}
        break
        case "EX": this.state.exhibit = {}
        break
        case "MOD": this.state.module = {}
        break
        case "ALL": 
          this.state.collection = {}
          this.state.exhibit = {}
          this.state.module = {}
        break
        default: console.log("Wrong Identifier")
    }
  }

}

export default Cache = new Cache();