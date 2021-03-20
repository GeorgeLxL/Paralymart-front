import React, { Component } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Slide,
} from '@material-ui/core';
import Page from 'src/components/Page';
import { login } from '../../assets/login';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;
const en={
  Memobutton:"MEMO Japanese Version",
  loginid:"Email",
  password:"Password",
  title:"Storage Admin",
  loginbutton:"Login",
  error:"Error",
  errorcontent:"Login failed",
  ok:"確認",
}

const jp={
  Memobutton:"MEMO English Version",
  loginid:"ログインID",
  password:"パスワード",
  title:"ストレージ管理画面",
  loginbutton:"ログイン",
  error:"失敗",
  errorcontent:"ログインに失敗しました。",
  ok:"OK",
}

const Transitionalert = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state={
      language:"jp",
      Alertmodal:false,
      alertTitle:"",
      alertContent:"",
    }
  }

  handleLogin = (event)=>{
      event.preventDefault();
      var Email =  document.getElementById('email').value;
      var password = document.getElementById("password").value;
      var {language} = this.state;

      localStorage.setItem("language", JSON.stringify({language:language}))
      if(Email && password){        
          var data = JSON.stringify({"Email":Email,"Password":password});        
          var config = {
            method: 'post',
            url: `${baseurl}/login`,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then((response)=>{
              localStorage.setItem("userData", JSON.stringify(response.data))
              window.location.assign('/app');
          })
          .catch((error)=>{
            this.setState({
              alertTitle:eval(language).error,
              alertContent:eval(language).errorcontent,
              Alertmodal:true,
            }); 
          });
      }
     
  }

  setLanguage = (event) => {
    var {language} = this.state;
    if(language==="jp")
    {
      language = "en";
    }
    else
    {
      language = "jp"; 
    }
    this.setState({language:language});
  }

  handleCloseAlertModal =(event)=>{
    this.setState({
        Alertmodal:false
      });
  }

  render(){
    const {language, alertTitle, alertContent,Alertmodal} = this.state;
    return (
      <Page
        className="root"
        title="Paralym|Login"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <div className="logo_tagline">
              <img
                alt="Logo"
                src="/static/images/logo_tagline.svg"
              />
            </div>
          <Container style={{maxWidth:"500px"}}>         
                <form>
                  <Box mb={3}>
                    <Typography
                      className="text-3xl text-center font-semibold"                
                      color="textPrimary"
                      variant="h2"
                    >
                      {eval(language).title}
                    </Typography>
                  </Box>
                  <div>
                    <label className="for-form">
                    {eval(language).loginid}
                    </label>
                  </div>
                  <div>
                    <input
                      className="form-input"
                      name="email"
                      type="text"
                      id="email"
                    />
                  </div>
                  <div>
                    <label className="for-form">
                    {eval(language).password}
                    </label>
                  </div>
                  <div>
                    <input
                      className="form-input"
                      name="password"
                      type="password"
                      id="password"
                    />
                  </div>
                
                  <Box my={2}>
                    <Button
                      className="btn-new"
                      color="primary"
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      onClick={this.handleLogin}
                    >
                       {eval(language).loginbutton}
                    </Button>
                  </Box>
                </form>
          </Container>
          <div className="setlanguage">
            <Button
              className="btn btn-language"
              onClick={this.setLanguage}
            >
            {eval(language).Memobutton}
            </Button>
          </div>
        </Box>
        <Dialog
          className="alert-modal"
          open={Alertmodal}
          TransitionComponent={Transitionalert}
          keepMounted
          onClose={this.handleCloseAlertModal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
       >
        <DialogTitle id="alert-dialog-slide-title" style={{textAlign:"center"}}>{alertTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {alertContent}
          </DialogContentText>
          <div className="search-btn">
            <Button onClick={this.handleCloseAlertModal} className="btn btn-search">
              {eval(language).ok}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </Page>
      
    );
  }
};

export default LoginView;
