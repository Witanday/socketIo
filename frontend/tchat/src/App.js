import React,{Component} from 'react';
import io from "socket.io-client";
import './App.css';
import axios from 'axios';

const urlaxios= axios.create ({
    baseURL: 'http://localhost:8080'
});

export default class App extends Component {
  constructor(props){
    super(props)
    this.state={
      username:"",
      message:"",
      messages:[]
    }
    this.socket = io('localhost:8080');
    this.sendMessage = ev => {
      ev.preventDefault();
      console.log("ddddd")
      this.socket.emit('SEND_MESSAGE', {
          username: this.state.username,
          message: this.state.message
      });
      this.setState({message: ''});
  }
  const addMessage = data => {
    console.log(data);
    //this.setState({messages: [...this.state.messages, data]});
    this.setState({messages:data})
    console.log(this.state.messages);
};
  this.socket.on('RECEIVE_MESSAGE', function(data){
    console.log('receive')
    addMessage(data);
});
  }

  handleChange= (e)=>{
    e.preventDefault();
    this.setState({
      [e.target.name]:e.target.value
    })
    
  }

  handleSubmit= async(e)=>{

    e.preventDefault();
    const {username,message}=this.state;
    try{
      const data = {username,message};
      const response =  await urlaxios.post ('/msg',  data);
      this.setState({
        messages :response.data
      })
     console.log(this.state.messages)
    
    
    }catch(err){
      console.log(err)
    }
  }

  renderMessages=()=>{
    if(this.state.messages.length!==0){
     return this.state.messages.map((m,index)=>{
        return <li  key={index}className="card" width='18rem'>
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">Username:{m.username}</h6>
          <p className="card-text">tweet :{m.message}</p>
        </div>
      </li>
      })
    }
  }
 
  render() {
   
      return (
        <div className="container">
         <ul>
           {this.renderMessages()}
         </ul>
    
    <form onSubmit={this.sendMessage}>
      <div className="form-group" >
        <label for="exampleInputEmail1">Username</label>
        <input value={this.state.username} name ="username" type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" onChange={this.handleChange} />
      </div>
      <div className="form-group">
        <label for="exampleInputPassword1">Message</label>
        <input value={this.state.message} name ="message" type="text" className="form-control" id="exampleInputPassword1" placeholder="message" onChange={this.handleChange}/>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
        </div>
    
    )
  }
}


