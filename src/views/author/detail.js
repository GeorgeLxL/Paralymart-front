import { v4 as uuid } from 'uuid';
import React, {Component} from 'react';
import {
  Avatar,
  Box,
  Container,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tab,
  Tabs,
  AppBar  
} from '@material-ui/core';
import Page from 'src/components/Page';
import PerfectScrollbar from 'react-perfect-scrollbar';
import getInitials from 'src/utils/getInitials';
import Pagination from '@material-ui/lab/Pagination';
import moment from 'moment';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;
const en={
    back:"Back",
    Authordetail: "Artist Detail",
    artist:"Artist",
    artworklist:"Artwork List",
    artistid:"Artist ID",
    contractor:"Contractor",
    agent:"Agent",
    name:"Name",
    chargename:"Person in charge name",
    relationArtist:"Relationship whit the artist",
    artistname:"Artist",
    lastname:"Last name",
    firstname:"First name",
    lastnamekata:"Last name(katakana)",
    firstnamekata:"First name(katakana)",
    penName:"Pen name(nickname)",
    nickName:"Nickname",
    artistgender:"Artist gender",
    regotherOrg:<span>Registration of other<br/> organizations(services)</span>,
    loginId:"Login ID",
    password:"Password",
    address:"Address",
    prefecture:"Prefecture",
    postalCode:"Postal code",
    fullAddress:"Full address",
    phoneNumber:"Phone number",
    emailAddress:"Email address",
    birthDate:"Birth date",
    emergence:"Emergence",
    phoneNo:"Phone No.",
    relationship:"Relationship",
    authorsDisablitytype:"Authors disablity type",
    disclosureOfDisability:"Disclosure of disability",
    selfIntroduction:"Self-introduction",
    profilepictue:"Profile picture",
    certifications:<span>ID Data<br/> Certificate of disability /<br/>proof of agent</span>,
    CreateArtworkFromScratch:"Create artwork from scratch",
    bankAccount:"Bank account",
    bankName:"Name",
    bankNumber:"Number",
    bankBranchNmae:"Branch name",
    bankBranchNo:"Branch No",
    bankaccounttype:"Account type",
    bankaccountNo:"Account No",
    transferName:"Transfer name",
    transfernamekana:"Transfer name(Katakana)",
    commentsFromOffice:"Comments from office",
    memo1:"Memo1",
    memo2:"Memo2",
    reasonforUnsubscribe:"Reason for unsubscribe",
    maxNumtoRegArtwork:<span>Number of artistwork that<br/>can be registered</span>,
    status:"Status",
    regDate:"Registration Date",
    appDate:"Application Date",
    approvalDate:"Approval Date",
    unsubscribeDate:"Unsubscribe Date",
    latestUpdateDate:"Latest Updated Date"
  }
  
const jp={
  back:"戻る",
  Authordetail: "作者セイメイ",
  artist:"作者",
  artworklist:"作品一覧",
  artistid:"作者ID",
  contractor:"契約者情報",
  agent:"代理人",
  name:"氏名",
  chargename:"担当者名",
  relationArtist:"著作者の関係",
  artistname:"著作者名",
  lastname:"姓",
  firstname:"名",
  lastnamekata:"セイ((カナ))",
  firstnamekata:"メイ(カナ)",
  penName:"ペンネーム",
  nickName:"ペンネーム",
  artistgender:"著作者 性別",
  regotherOrg:"他団体(サービス)登録",
  loginId:"ログインID",
  password:"パスワード",
  address:"住所",
  prefecture:"都道府県",
  postalCode:"郵便番号",
  fullAddress:"住所",
  phoneNumber:"電話番号",
  emailAddress:"メールアドレス",
  birthDate:"生年月日",
  emergence:"緊急連絡先",
  phoneNo:"郵便番号.",
  relationship:"間柄",
  authorsDisablitytype:"著作者様の障がい種別",
  disclosureOfDisability:"障がい情報の公開",
  selfIntroduction:"自己紹介",
  profilepictue:"プロフィール写真",
  certifications:<span>証明画像データ<br/>障がい者証明/代理人証明</span>,
  CreateArtworkFromScratch:"描き下ろし対応",
  bankAccount:"銀行口座",
  bankName:"銀行名",
  bankNumber:"銀行番号",
  bankBranchNmae:"支店名",
  bankBranchNo:"支店番号",
  bankaccounttype:"口座の種類",
  bankaccountNo:"口座番号",
  transferName:"振込先名",
  transfernamekana:"振込先名カナ",
  commentsFromOffice:"事務局からのコメント",
  memo1:<span>フリーワード入力欄<br/>(事務局用備録)</span>,
  memo2:<span>イベント名入力欄<br/>(事務局用備録)</span>,
  reasonforUnsubscribe:"退会理由",
  maxNumtoRegArtwork:"作品登録可能数",
  status:"状態",
  regDate:"登録日",
  appDate:"申請日",
  approvalDate:"承認(公開)日",
  unsubscribeDate:"退会申請/承認日",
  latestUpdateDate:"最終編集日時"
}

const sex=["男","女","その他"];
const createbyscratch=["いいえ","はい"];
const disclosetype=["不可","可"];

function TabPanel(props) {
    const { children, value, index, ...other } = props;  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Box>{children}</Box>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index) {
return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
};
}

class AuthorDetail extends Component {


    state = {
        language:JSON.parse(localStorage.language).language,
        Statustype:[],
        Contractortype:[],
        BankAccountType:[],
        disabilityType:[],
        pageCount:0,
        totalRecords:0,
        filter: {
          PageSize: 10,
          PageNumber: 1
        },
        artistid:"",
        workdata:[],
        artistData:{},
        selectedDate: moment(),
        value:0,
    };
 
  handleDateChange = (date)=>{
    this.setState({
      selectedDate:date
    })
  }
  handleChange = (event,newValue)=>{
      this.setState({
          value:newValue
      })
  }
  handleGoback = (event) =>{
    window.history.back();
  }

  handlePagecount = (events)=>{
    const {filter,artistid} = this.state;
    var prevepageSize = filter.PageSize;
    var prevepageNumber = filter.PageNumber;
    var currentPagesize = events.target.value;
    filter.PageSize = currentPagesize; 
    filter.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        filter:filter
    });
    this.getArtistWorkData(filter,artistid);
  }

  handlePagenation = (events,PageNumber)=>{
    const {filter,artistid} = this.state;
    filter.PageNumber = PageNumber;
    this.setState({
        filter:filter
    });
    this.getArtistWorkData(filter,artistid);
  }

  componentDidMount(){
     var path = window.location.href;
     var tokens = path.split("/");
     var id = tokens[tokens.length-1];
     var {filter} =this.state;
     this.setState({artistid:id});
     this.getStatustype();
     this.getContractortype();
     this.getBankAccountType();
     this.getDisabilityType();
     this.getArtistData(id);
     this.getArtistWorkData(filter,id);
  }

  getArtistData(id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var config = {
      method: 'get',
      url: `${baseurl}/artists/${id}/detail`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
        data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({artistData:response.data});
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

  getArtistWorkData(filter,id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var pageCount, totalRecords;
    var data = new Array();
    console.log(filter,id);
    var config = {
      method: 'get',
      url: `${baseurl}/artists/${id}/artworks`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
          params:filter
      };  
    axios(config)
    .then((response) => {
      var responsedata = response.data.artworks;
      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      responsedata.forEach(item => {

        var artworkImageId = item.artworkImageId;
            var config = {
              method: 'get',
              url: `${baseurl}/artworks/${item.id}/detail/images/${artworkImageId}`,
              headers: { 
                'Authorization': 'Bearer ' + token,
              },
              responseType: 'blob',
              data : {},
            };  
            axios(config)
            .then((response1) => {          
              var temp={};
              temp.id = item.id;
              temp.name = item.name;
              temp.image_url = URL.createObjectURL(response1.data);
              temp.category = item.category;
              temp.image = item.image;
              temp.season = item.season
              temp.tint = item.tint;
              data.push(temp);
              this.setState({
                pageCount: pageCount,
                totalRecords:totalRecords,
                workdata:data,
              });
            })
            .catch((error)=> {
              var temp={};
              temp.id = item.id;
              temp.name = item.name;
              temp.image_url = ""
              temp.category = item.category;
              temp.image = item.image;
              temp.season = item.season
              temp.tint = item.tint;
              data.push(temp);  
              this.setState({
                pageCount: pageCount,
                totalRecords:totalRecords,
                workdata:data,
              });
            });         
        });
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

  getStatustype()
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/types/artist_status`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({Statustype:response.data.types});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({Statustype:[]});
      }
    });
  }
 
  getContractortype()
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/types/artist_contractor`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({Contractortype:response.data.types});     
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({Contractortype:[]});
      }
    });
  }

  getBankAccountType()
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/types/bank_account_type`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
     
      this.setState({BankAccountType:response.data.types});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({BankAccountType:[]});
      }
    });
  }

  getDisabilityType()
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/types/disability_type`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({disabilityType:response.data.types});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({BankAccountType:[]});
      }
    });
  }
 render() {
   const {workdata,selectedDate,value, artistData,language,disabilityType,BankAccountType,Statustype, pageCount, totalRecords} = this.state;
   let pageSize = this.state.filter.PageSize;
   let PageNumber = this.state.filter.PageNumber;
   var disabilityTypelabel="";
   disabilityType.map((item)=>{
    if(item.id===artistData.disabilityType)
    {
      disabilityTypelabel = item.name;
    }
   });
  var banktypelabel="";
 
   BankAccountType.map((item)=>{
    if(artistData.bankAccount)
    {
      var bankAccountType = artistData.bankAccount.bankAccountType;
      if(item.value==bankAccountType)
      {
        banktypelabel = item.name;
      }
    }
   });
   var statuslabel="";
   Statustype.map((item)=>{
    if(artistData.status)
    {
      if(item.value==artistData.status)
      {
        statuslabel = item.name;
      }
    }
   });
    return(
      <Page
        className="root"
        title="Paralym|Work"
      >
        <Container maxWidth={false}>
            <Box
                display="flex"
                justifyContent="space-between"
            >              
                <div className="page-title">
                    <a className="before-page" onClick={this.handleGoback} href="#">◀ {eval(language).back}</a>
                    <span>{eval(language).Authordetail} </span>
                </div>
            </Box>
            <Box mt={3}>
                <Card>
                  <CardContent className="tab-Card">
                    <AppBar className="tab-Header" position="static">
                        <Tabs value={value} onChange={this.handleChange} aria-label="">
                           
                            <Tab style={{color:"black", fontSize:"18px", fontWeight:"600"}} label="作者" {...a11yProps(0)} />
                            <Tab style={{color:"black",fontSize:"18px", fontWeight:"600"}} label="作品一覧" {...a11yProps(1)} />

                        </Tabs>
                        <Box>
                            {/* <Button className="btn btn-new"
                              onClick={e=>{window.location.assign("/admin/work/addnew")}}
                              style={{marginBottom:"10px"}}>
                             この作者に新規作品を登録
                            </Button> */}
                        </Box>
                    </AppBar>
                    <TabPanel value={value} index={0}>                        
                    <Box minWidth={1050} >
                            <Table className="artdetail_table">                           
                            <TableBody>                                
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).artistid}
                                    </TableCell>
                                    {artistData.id}
                                    <TableCell colSpan="4">

                                    </TableCell>                                    
                                </TableRow>    
                                <TableRow>
                                    <TableCell  className="filedname">
                                      {eval(language).contractor}
                                    </TableCell>
                                    <TableCell  colSpan="4">
                                    {this.state.Contractortype[artistData.contractor]?this.state.Contractortype[artistData.contractor].name:artistData.contractor}                          
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).agent}
                                    </TableCell>
                                    <TableCell className="filedname"> 
                                      {eval(language).name}
                                      <br/>
                                      {eval(language).chargename}
                                      <br/>
                                      {eval(language).relationArtist}                                    
                                    </TableCell>
                                    <TableCell  colSpan="3">
                                      {artistData.agent? artistData.agent.name:""}  
                                      <br/>
                                      {artistData.agent? artistData.agent.personInCharge:""}  
                                      <br/>
                                      {artistData.agent? artistData.agent.relationship:""}  
                                    </TableCell>                              
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).artistname}
                                    </TableCell>
                                    <TableCell className="filedname">
                                      {eval(language).lastname}
                                      <br/>
                                      {eval(language).firstname}
                                      <br/>
                                      {eval(language).lastnamekata}
                                      <br/>
                                      {eval(language).firstnamekata}                                    
                                    </TableCell>
                                    <TableCell  colSpan="3">
                                      {artistData.lastName}
                                      <br/>
                                      {artistData.firstName}
                                      <br/>  
                                      {artistData.lastName}
                                      <br/>
                                      {artistData.lastNameKana}
                                      <br/> 
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).penName}
                                    </TableCell>
                                    <TableCell className="filedname"> 
                                      {eval(language).nickName}                               
                                    </TableCell>
                                    <TableCell  colSpan="3">
                                    {artistData.nickName}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).artistgender}
                                    </TableCell>
                                    <TableCell  colSpan="4">
                                      {sex[artistData.sex-1]}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).regotherOrg}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.otherOrganizationService}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).loginId}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.loginId}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).password}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.password}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).address}
                                    </TableCell>
                                    <TableCell className="filedname"> 
                                      {eval(language).prefecture}
                                      <br/>
                                      {eval(language).postalCode}
                                      <br/>
                                      {eval(language).fullAddress}                                    
                                    </TableCell>
                                    <TableCell colSpan="3">
                                      {artistData.address? artistData.address.area:""}  
                                      <br/>
                                      {artistData.address? artistData.address.zip:""}  
                                      <br/>
                                      {artistData.address? artistData.address.address:""}  
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).phoneNumber}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.tel}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).emailAddress}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.email}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).birthDate}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.birthDate}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).emergence}
                                    </TableCell>
                                    <TableCell className="filedname"> 
                                      {eval(language).name}
                                      <br/>
                                      {eval(language).phoneNo}
                                      <br/>
                                      {eval(language).relationship}                                    
                                    </TableCell>
                                    <TableCell colSpan="3">
                                      {artistData.emergency? artistData.emergency.name:""}  
                                      <br/>
                                      {artistData.emergency? artistData.emergency.tel:""}  
                                      <br/>
                                      {artistData.emergency? artistData.emergency.relationship:""}  
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).authorsDisablitytype}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {disabilityTypelabel}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).disclosureOfDisability}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                      {disclosetype[artistData.discloseDisability]}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).selfIntroduction}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                      {artistData.selfIntroduction}
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).profilepictue}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                      <Avatar className="avatar"
                                        src={artistData.profilePicUrl}
                                      >
                                        {getInitials(artistData.lastName)}
                                      </Avatar>
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).certifications}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.certificates ? artistData.certificates.map((certificate) => (
                                     <Avatar
                                      className="certificate_image"
                                      src={certificate.url}
                                     >
                                      {getInitials(certificate.fileName)}
                                    </Avatar>                                    
                                    )):""}                                    
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).CreateArtworkFromScratch}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                      {createbyscratch[artistData.createArtworkFromScratch]} 
                                    </TableCell>                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).bankAccount}
                                    </TableCell>
                                    <TableCell className="filedname"> 
                                      {eval(language).bankName}
                                      <br/>
                                      {eval(language).bankNumber}
                                      <br/>
                                      {eval(language).bankBranchNmae}
                                      <br/>
                                      {eval(language).bankBranchNo}                                 
                                    </TableCell>                                
                                    <TableCell>
                                    {artistData.bankAccount? artistData.bankAccount.name:""}
                                    <br/>
                                    {artistData.bankAccount? artistData.bankAccount.number:""}
                                    <br/>
                                    {artistData.bankAccount? artistData.bankAccount.branchName:""}
                                    <br/>
                                    {artistData.bankAccount? artistData.bankAccount.branchNumber:""}
                                    </TableCell> 
                                    <TableCell className="filedname"> 
                                      {eval(language).bankaccounttype}
                                      <br/>
                                      {eval(language).bankaccountNo}
                                      <br/>
                                      {eval(language).transferName}
                                      <br/>
                                      {eval(language).transfernamekana}                                 
                                    </TableCell>
                                    <TableCell>
                                    {banktypelabel}
                                    <br/>
                                    {artistData.bankAccount? artistData.bankAccount.accountNumber:""}
                                    <br/>
                                    {artistData.bankAccount? artistData.bankAccount.transferName:""}
                                    <br/>
                                    {artistData.bankAccount? artistData.bankAccount.transferNameKana:""}
                                    </TableCell>                               
                                </TableRow>   
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).commentsFromOffice}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.officeComment}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).memo1}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.memo1}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).memo2}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.memo2}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).reasonforUnsubscribe}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.unsubscribeReason}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).maxNumtoRegArtwork}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {999}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).status}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {statuslabel}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).regDate}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.registrationDate}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).appDate}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.applicationDate}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).approvalDate}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.approvalDate}
                                    </TableCell>                                
                                </TableRow> 
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).unsubscribeDate}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.dateUnsubscribed}
                                    </TableCell>                                
                                </TableRow>
                                <TableRow>
                                    <TableCell className="filedname">
                                      {eval(language).latestUpdateDate}
                                    </TableCell>
                                    <TableCell colSpan="4">
                                    {artistData.dateUpdated}
                                    </TableCell>                                
                                </TableRow> 
                            </TableBody>
                            </Table>
                        </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <PerfectScrollbar>
                        <Box minWidth={1050} >
                            <Table className="result_table">
                            <TableHead>
                                <TableRow>
                                <TableCell>
                                作品名
                                </TableCell>
                                <TableCell>
                                カテゴリー
                                </TableCell>
                                <TableCell>
                                イメージ
                                </TableCell>
                                <TableCell>
                                季節
                                </TableCell>
                                <TableCell>
                                色合い
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workdata.map((work) => (
                                <TableRow
                                    hover
                                    key={work.id}
                                >
                                    <TableCell>
                                    <Box
                                        alignItems="center"
                                        display="flex"
                                    >
                                        <Avatar
                                        className="work_image"
                                        src={work.image_url}
                                        >
                                        {getInitials(work.name)}
                                        </Avatar>
                                        <Typography
                                        color="textPrimary"
                                        variant="body1"
                                        >
                                        {work.name}
                                        </Typography>
                                    </Box>
                                    </TableCell>
                                    <TableCell>
                                    {work.category}
                                    </TableCell>
                                    <TableCell>
                                    {work.image}
                                    </TableCell>
                                    <TableCell>
                                    {work.season}
                                    </TableCell>
                                    <TableCell>
                                    {work.tint}
                                    </TableCell>
                                    <TableCell>
                                    <Button
                                        className="btn btn-detail"
                                        onClick={e=>{window.location.assign(`/admin/work/detail/${work.id}`)}}
                                    >
                                        詳&nbsp;&nbsp;&nbsp;細
                                    </Button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </Box>
                        </PerfectScrollbar>
                        <Box className="pagination">
                        <Box className="pageCountarea">
                            <label>表示する行数:
                                <select className="pageCount" value={pageSize} onChange={this.handlePagecount}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </label>
                        </Box>
                        <Pagination className="paginationitem" count={pageCount} page={PageNumber} onChange={this.handlePagenation} variant="outlined" color="primary" />
                        </Box>                  
                    </TabPanel>
                  </CardContent>
                </Card>
            </Box>            
        </Container>
      </Page>    
    );
 }
};
export default AuthorDetail;