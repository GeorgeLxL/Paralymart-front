
import React, { Component } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;
const en={
  title:"Account Management",
  email:"Email",
  password:"Password",
  showbutton:"SHOW",
  editbutton:"EDIT",
  updateEmailmessage:"Your email has been updated successfully.",
  updatePasswordmessage:"Your password has been updated successfully.",
}

const jp={
  title:"アカウント管理",
  email:"メールアドレス",
  password:"ログインパスワード",
  showbutton:"表示",
  editbutton:"変更",
  updateEmailmessage:"メールが正常に更新されました。",
  updatePasswordmessage:"パスワードが正常に更新されました。"
}

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword:false,
      pass : "",
      email:"",
      language:JSON.parse(localStorage.language).language
    }
  }
  handleShowPassword = (event) =>{
    const{showPassword} = this.state;
    this.setState({showPassword:!showPassword});
  }
  componentDidMount(){
    this.getProfile();
  }
  getProfile()
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var config = {
      method: 'get',
      url: `${baseurl}/profile`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => { 
      this.setState({email:response.data.email});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
    });
  }

  handleEmail = (event) =>{
    this.setState({email:event.target.value});
  }

  handlePassword = (event) =>{
    this.setState({pass: event.target.value});
  }
  
  updateEmail = (event) =>{
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    const fd = new FormData();
    fd.append('Email', this.state.email);
    fd.append('_method', 'PATCH');
    axios.patch(
      `${baseurl}/profile/update/email`,
      fd,
      { headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
      } }
    ).then((response)=>{
        alert(eval(this.state.language).updateEmailmessage);
    }).catch((error)=>{
      if(error.response.status==401){
        localStorage.removeItem("userData");
        window.location.assign('/');
      }
      else{
        alert(error.response.data.errors.Email.message);
      }
    });
  }

  updatePassword = (event) =>{
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    const fd = new FormData();
    fd.append('Password', this.state.pass);
    fd.append('_method', 'PATCH');
    axios.patch(
      `${baseurl}/profile/update/password`,
      fd,
      { headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded' 
      } }
    ).then((response)=>{
        alert(eval(this.state.language).updatePasswordmessage);
    }).catch((error)=>{
      if(error.response.status==401){
        localStorage.removeItem("userData");
        window.location.assign('/');
      }
      else{
        alert(error.response.data.errors.Password.message);
      }
    });
  }

  render(){
    const {language,showPassword,pass,email} = this.state
    return (
      <Page
        className="root"
        title="Paralym|Account"
      >
        <Container maxWidth={false}>
          <div className="tool-bar">
              <div className="page-title">{eval(language).title}</div>
          </div>
          <Box mt={3}>
            <Card>
              <CardContent>
                <Box className="form-div" display="flex">
                    <label className='form-label-account'>
                    {eval(language).email}
                    </label>
                    <div className='form-input-account'>
                        <input onChange={this.handleEmail} value={email} type='text' className='form-control-account'/>
                    </div>
                    <Button
                      className="btn btn-danger"
                      onClick={this.updateEmail}
                    >
                        {eval(language).editbutton}
                    </Button>
                </Box>
                <Box className="form-div" display="flex">
                    <label className='form-label-account'>
                    {eval(language).password}
                    </label>
                    <div className='form-input-account'>
                        <input onChange={this.handlePassword} value={pass} type={showPassword ? 'text' :'password'} className='form-control-account'/>
                    </div>
                    <Button
                      className="btn btn-danger-outline"
                      onClick={this.handleShowPassword}
                    >
                      {eval(language).showbutton}
                    </Button>
                    <Button
                      className="btn btn-danger"
                      onClick={this.updatePassword}
                    >
                      {eval(language).editbutton}
                    </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Page>
    
    );
  }

};

export default Account;
