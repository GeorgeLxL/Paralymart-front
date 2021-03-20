import { v4 as uuid } from 'uuid';
import React, {Component} from 'react';
import {
  Avatar,
  Box,
  Container,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Slide,
  SvgIcon,  
} from '@material-ui/core';
import Page from 'src/components/Page';
import { Search as SearchIcon } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import getInitials from 'src/utils/getInitials';
import Pagination from '@material-ui/lab/Pagination';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;

const jp={
  registerNewartWork:"新規作品登録",
  registerNewartWorkstatus1:"新規作品登録中",
  registerNewartWorkstatus2:"保存中",
  artworkid:" 作品ID",
  artworkname:" 作品名",
  category:"カテゴリー",
  image:"イメージ",
  season:"季節",
  color:"色合い",
  size:"サイズ（長辺×短辺）",
  conditionStatus:"状態（ステータス）",
  data:"データ",
  addData:"+ データを追加",
  description:"概要",
  backofficeComment:"事務局コメント",
  note:"備考欄",
  back:"戻る",
  confirm: "確認する",
  artistinform:"作者情報",
  searchartist:"作者を検索して選択する",
  memo:<span>開発メモ：<br/>作者詳細から遷移した場合ここには、<br/>その作者の情報が自動的に入ります。</span>,
  searchArtistmodalTitle:"作品の作者設定",
  searchPlaceholder:"フリーワード検索（作品名、アーティスト名、ペンネームなど…）",
  search:"検  索",
  close:"閉じる",
  searchResult:"検索結果:",
  case:"件",
  artistName:"アーティスト名",
  penName:"ペンネーム",
  email:"メールアドレス",
  pageShow:"表示する行数",
  select:"選択",
  checkDetail:"詳細を確認",
  artistid:"作者ID",
  gender:"性別",
  phoneNumber:"電話番号",
  changeartist:"作者を変更",
  checkartist:"作者情報を確認",
  save:"保存",
  ok:"確認",
  selectanartistmessage:"アーティストを選択してください。",
  dropboxUpload:"Dropbox Upload",
  dropboxPath:"Dropbox Path",
  dropboxsync:"Dropbox連携",
  dropboxfoldername:"フォルダー名",
  dropboxfilename:"ファイル名",
  success:"Success",
  successcontent:"Added an artwork",
  error:"Error",  
}

const en={
  registerNewartWork:"Register New Artwork",
  registerNewartWorkstatus1:"Register New Artwork",
  registerNewartWorkstatus2:"DRAFT",
  artworkid:"Artwork ID",
  artworkname:"Artwork Name",
  category:"Category",
  image:"Image",
  season:"Season",
  color:"Color",
  size:"Size(Height x Width)",
  conditionStatus:"Condition Status",
  data:"Data",
  addData:"+ Add Data",
  description:"Description",
  backofficeComment:"Backoffice Comment",
  note:"Note",
  back:"BACK",
  confirm: "Confirm",
  artistinform:"Artist Information",
  searchartist:"Search and Add Artist",
  memo:<span>Memo:<br/>If redirected from artist detail page,<br/> artist  information will be auto filled</span>,
  searchArtistmodalTitle:"ArtWork Artist Settings",
  searchPlaceholder:"Search (Artist name, Pen name, Email, Etc...)",
  search:"Search",
  close:"Close",
  searchResult:"Search Result:",
  case:"",
  artistName:"Artist Name",
  penName:"Pen Name",
  email:"Email",
  pageShow:"Show",
  select:"Select",
  checkDetail:"Check details",
  artistid:"Artist ID",
  gender:"Gender",
  phoneNumber:"Phone",
  changeartist:"CHANGE ARTIST",
  checkartist:"CHECK ARTIST",
  save:"SAVE",
  ok:"O K",
  selectanartistmessage:"Please select an artist.",
  dropboxUpload:"Dropbox Upload",
  dropboxPath:"Dropbox Path",
  dropboxsync:"Sync Dropbox",
  dropboxfoldername:"Folder Name",
  dropboxfilename:"File Name",
  success:"更新完了",
  successcontent:"作品の新規登録が完了しました。",
  error:"失敗",
}
const sex=["男","女","その他"];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class AddNewWork extends Component {
  fileObj = [];
  fileArray = [];
  uploadFileArray=[];
  constructor(props) {
    super(props);    
    this.state = {
      language:JSON.parse(localStorage.language).language,
      searchArtistmodal:false,
      searchResultModal:false,
      Alertmodal:false,
      success:false,
      alertTitle:"",
      alertContent:"",
      confirm:false,
      authorsdata:[],
      selectedArtistData:{},
      filter: {
        Keywords: "",
        BirthDate: "",
        sex:"",
        areaId:"",
        CreateArtworkFromScratch: "",
        StartDate: "",
        EndDate: "",
        PageSize: 10,
        PageNumber: 1
      },
      artistID:"",
      Name:"",
      CategoryId:"",
      ImageId:"",
      SeasonId:"",
      TintId:"",
      Height:"",
      Width:"",
      Status:"",
      Description:"",
      OfficeComment:"",
      ArtworkImage:[],
      workslist:[],
      Note:"",
      dorpboxPath:"",
      dropboxfilename:"",
      uploaddropbox:false,
      pageCount:0,
      totalRecords:0,
      selectedDate: moment(),      
      categoryList:[],
      imageList:[],
      seasonList:[],
      tintList:[],
      artworkStatusList:[],
      spin:false,
    };
  }

  updateWorks=(event)=> {
    this.fileObj = event.target.files;
    var unitlist = ["byte","KB","MB","GB"];
    for (let i = 0; i < this.fileObj.length; i++) {
        var temp={};
        let unit = 0;
        let size =parseInt(this.fileObj[i].size);
        while(size > 1000)
        {
          unit = unit + 1; 
          size = Math.floor(size / 10)/100;
        }
        temp.id = uuid();
        temp.file = URL.createObjectURL(this.fileObj[i])
        temp.filesize = size + unitlist[unit];
        temp.filetype = this.fileObj[i].type;
        this.fileArray.push(temp);
        this.uploadFileArray.push(this.fileObj[i]);
    }
    this.setState({ 
      workslist: this.fileArray,
      ArtworkImage:this.uploadFileArray, 
    })
  }

  removeWork = (id)=>{    
    var index, iterator = 0;
    this.fileArray.forEach(item=>{
      if(item.id===id){
        index = iterator
      }
      iterator++;
    })
    this.fileArray.splice(index,1);
    this.uploadFileArray.splice(index,1);
    this.setState({
      workslist:this.fileArray,
      ArtworkImage:this.uploadFileArray
    });
  }


  handleGoback = (event) =>{
    const {confirm} = this.state;
    if(confirm)
    {
      this.setState({confirm:false});
    }
    else
    {
      window.history.back();
    }
  }

  handleConfirm = (event) =>{
    const {confirm} = this.state;
    if(!confirm)
    {
      this.setState({confirm:true});
    }
    else{
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token;
      const {language, ArtworkImage, artistID, Name, CategoryId, ImageId, SeasonId, TintId, Height, Width, dorpboxPath, Status, Description, OfficeComment, Note,dropboxfilename} = this.state; 
      if(artistID==="")
      {
        this.setState({
          alertTitle:eval(language).error,
          alertContent:eval(language).selectanartistmessage,
          success:false,
          Alertmodal:true,
        });
        return;
      }
      var DropboxUpload = false;
      const fd = new FormData();
      var postdropboxpath = "";
      if(dorpboxPath)
      {
        DropboxUpload = true;
        if(dorpboxPath.charAt(0)!="/")
        {
          postdropboxpath = "/" + dorpboxPath;
          this.setState({dorpboxPath:postdropboxpath});
        }
        else
        {
          postdropboxpath = dorpboxPath;
        }
        if(dropboxfilename)
        {
          postdropboxpath = postdropboxpath + "?preview=" + dropboxfilename;
        }
        fd.append('DropboxPath',postdropboxpath);
      }

      fd.append('Name', Name);
      fd.append('CategoryID', CategoryId);
      fd.append('ImageId', ImageId);
      fd.append('SeasonId', SeasonId);
      fd.append('TintId', TintId);
      fd.append('Height', Height);
      fd.append('Width', Width);
      fd.append('Status', Status);
      fd.append('Description', Description);
      fd.append('OfficeComment', OfficeComment);
      fd.append('Note', Note);
      fd.append('DropboxUpload', DropboxUpload);
      
      ArtworkImage.forEach(file=>{
        fd.append("ArtworkImage", file);
      });
      this.setState({
        spin:true
      })
      axios.post(`${baseurl}/artists/${artistID}/artworks`, fd, {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      }).then((response)=>{
        this.setState({
          spin:false,
          alertTitle:eval(language).success,
          alertContent:eval(language).successcontent,
          success:true,
          Alertmodal:true,
        });
      }).catch((error)=> {
        if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
          else{
            var errordata = error.response.data;
            var errormessage;
            if(errordata.errors)
            {
              var errorrdatas = errordata.errors;
              var errordatatpm = [];  
              Object.entries(errorrdatas).map(error => {
                var tmp={};
                tmp.field = error[1].field;
                tmp.message = error[1].message;
                errordatatpm.push(tmp);
              });

              errormessage=<span>
                {errordatatpm.map((data) => (
                  <span>{data.field}: {data.message}<br/></span>
                ))}
              </span>          
              this.setState({
                spin:false,
                alertTitle:eval(language).error,
                alertContent:errormessage,
                success:false,
                Alertmodal:true,
             });
            }
          }
        }        
      });
    }
  }

  handleCloseSearchArtistModal = (event)=>{
    const {filter} = this.state;
    filter.Keywords="";
    this.setState({
      filter:filter,
      searchArtistmodal:false
    })
  }
  
  handleOpenSearchArtistModal = (event)=>{
    this.setState({
      searchArtistmodal:true
    })
  }

  handleCloseSearchResultModal = (event)=>{
    const {filter} = this.state;
    filter.Keywords="";
    this.setState({
      filter:filter,
      searchResultModal:false
    })
  }

  handleCloseAlertModal =(event)=>{
    const {success}=this.state;
    if(success)
    {
      this.setState({
        Alertmodal:false
      });
      window.location.assign("/admin/work");
    }
    else{
      this.setState({
        Alertmodal:false
      });
    }
  }

  handleKeyword = (event)=>{
    const {filter} = this.state;
    filter.Keywords = event.target.value;
    this.setState({filter:filter});
  }

  handlePagenation = (events,PageNumber)=>{
    const {filter} = this.state;
    filter.PageNumber = PageNumber;
    this.setState({
        filter:filter
    });
    this.getartistdata(filter);
  }

  handlePagecount = (events)=>{
    const {filter} = this.state;
    var prevepageSize = filter.PageSize;
    var prevepageNumber = filter.PageNumber;
    var currentPagesize = events.target.value;
    filter.PageSize = currentPagesize; 
    filter.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        filter:filter
    });
    this.getartistdata(filter);
  }

  searchbyKeywords = (event)=>{
    event.preventDefault();
    var {filter} = this.state;
    filter.PageNumber = 1;
    this.setState({filter:filter});    
    this.getartistdata(filter);
  }
 
  showArtistDetail = id=>event=>{
    var state = this.state;
    localStorage.setItem("state", JSON.stringify(state));
    window.location.assign(`/admin/author/detail/${id}`);
  }

  selectArtist = author=>event=>{
    const {filter} = this.state;
    filter.Keywords="";
    this.setState({
      filter:filter,
      searchResultModal:false,
      artistID:author.id,
    });
    this.getArtistDetailData(author.id);
  }

  handleChangeSubmitdata = dataFiledName => event=>{
    this.setState({
      [dataFiledName]: event.target.value
    });
  }

  handleUploadFromDropbox = (event)=>{  

    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var config = {
      method: 'get',
      url: `${baseurl}/api/dropbox/account/link`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({
        uploaddropbox:true
      });
      var state = this.state;
      localStorage.setItem("state", JSON.stringify(state));
      localStorage.setItem("progress", "new");
      console.log(response.data);
      window.location.assign(response.data.url);
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

  RequestStep2(code){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var config = {
      method: 'POST',
      url: `${baseurl}/api/dropbox/account/link?code=${code}`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
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
 
  getartistdata(filter){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var pageCount, totalRecords;
    var data = new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/artists`,
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:filter
    };
    axios(config)
    .then((response) => {
      var responsedata = response.data.artists;
      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      responsedata.forEach(item => {
        var temp={};
        temp.id = item.id;
        temp.name = `${item.lastName}${item.firstName}(${item.lastNameKana}${item.firstNameKana})`;
        temp.image_url = item.profilePicUrl;
        temp.penName = item.nickName;
        temp.email = item.email;
        temp.regDate = item.dateCreated
        temp.regArtwork = item.totalArtworks;      
        data.push(temp);       
      });
      this.setState({
        pageCount: pageCount,
        totalRecords:totalRecords,
        authorsdata:data,
        searchArtistmodal:false,
        searchResultModal:true,
      });
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
          else{
              this.setState({
                  pageCount:0,
                  totalRecords:0,
                  authorsdata:[],
                  searchArtistmodal:false,
                  searchResultModal:true,
              });
          }
      } 
  });  
  }

  getArtistDetailData(id){
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
      this.setState({selectedArtistData:response.data});
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

  componentDidMount(){
    var state = JSON.parse(localStorage.getItem("state"));
    if(state)
    {
      this.setState({ 
        searchArtistmodal:state.searchArtistmodal,
        searchResultModal:state.searchResultModal,
        authorsdata:state.authorsdata,
        filter: state.filter,
        pageCount:state.pageCount,
        totalRecords:state.totalRecords,
        artistID:state.artistID,
        Name:state.Name,
        CategoryId:state.CategoryId,
        ImageId:state.ImageId,
        SeasonId:state.SeasonId,
        TintId:state.TintId,
        Height:state.Height,
        Width:state.Width,
        Status:state.Status,
        Description:state.Description,
        OfficeComment:state.OfficeComment,
        Note:state.Note,
        ArtworkImage:state.ArtworkImage,
        workslist:state.workslist,
        categoryList:state.categoryList,
        imageList:state.imageList,
        seasonList:state.seasonList,
        tintList:state.tintList,
        artworkStatusList:state.artworkStatusList,
        selectedArtistData:state.selectedArtistData,
        confirm:state.confirm,
      });
      if(state.uploaddropbox)
      {
        var path = window.location.href;
        var tokens = path.split("=");
        var code = tokens[tokens.length-1];
        if(code!="")
        {
          this.RequestStep2(code);
          this.setState({uploaddropbox:false});
        }
      }
      localStorage.removeItem("state");
    }
    else{
      var path = window.location.href;
      var tokens = path.split("/");
      var id = tokens[tokens.length-1];
      if(id!=="null")
      {
        this.setState({artistID:id});
        this.getArtistDetailData(id);
      }
      this.getCategorylist();
      this.getImageList();
      this.getSeasonList();
      this.getTintList();
      this.getArtworkStatusList();
    }   
  }

  getCategorylist(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/categories/list`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
       this.setState({categoryList:response.data.categories});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({categoryList:[]});
      }
    });
  }

  getImageList(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/images/list`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({imageList:response.data.images});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({imageList:[]});
      }
    });
  }

  getSeasonList(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/seasons/list`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({seasonList:response.data.seasons});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({seasonList:[]});
      }
    });
  }

  getTintList(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/tints/list`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({tintList:response.data.tints});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({tintList:[]});
      }
    });
  }

  getArtworkStatusList(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/types/artwork_status`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      this.setState({artworkStatusList:response.data.types});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({artworkStatusList:[]});
      }
    });
  }


  
 render() {
   const {selectedDate, workslist, language, searchArtistmodal, searchResultModal,totalRecords, pageCount, authorsdata, confirm, categoryList, imageList, seasonList, tintList, artworkStatusList, Alertmodal} = this.state;
   const {Name, CategoryId, ImageId, dorpboxPath, SeasonId, TintId, Width, Height, Status, OfficeComment, Description, Note, artistID, selectedArtistData,alertTitle, alertContent,dropboxfilename} = this.state;
   let pageSize = this.state.filter.PageSize;
   let PageNumber = this.state.filter.PageNumber;
    return(
      <Page
        className="root"
        title="Paralym|Work"
      >
        <Container maxWidth={false}>
          <div className="tool-bar">
              <Box
                display="flex"
                justifyContent="space-between"
              >              
                <div className="page-title">
                <span>{eval(language).registerNewartWork} </span>
                <span className="statues">{confirm?eval(language).registerNewartWorkstatus2:eval(language).registerNewartWorkstatus1}</span>
                </div>
              </Box>
              <Box mt={3}>
                <Card>
                  <CardContent>
                    <div className="add-form">
                      {selectedArtistData.id ?
                       <Box className="view-author">
                          <div>
                            <div style={{margin:"10px"}}  className="page-title">
                            {eval(language).artistinform}
                            </div>
                            <div style={{display:"flex", marginLeft:"10px", marginBottom:"10px"}}>
                              <div className="field-name">{eval(language).artistid}:</div>
                              <div className="field-value">{selectedArtistData.id}</div>
                            </div>
                            <div style={{display:"flex", marginLeft:"10px", marginBottom:"10px"}}>
                            <div className="field-name">{eval(language).artistName}:</div>
                            <div className="field-value">{selectedArtistData.lastName}{selectedArtistData.firstName}</div>
                            </div>
                            <div style={{display:"flex", marginLeft:"10px", marginBottom:"10px"}}>
                            <div className="field-name">{eval(language).penName}:</div>
                            <div className="field-value">{selectedArtistData.penName}</div>
                            </div>
                            <div style={{display:"flex", marginLeft:"10px", marginBottom:"10px"}}>
                              <div className="field-name">{eval(language).gender}:</div>
                              <div className="field-value">{sex[selectedArtistData.sex-1]}</div>
                            </div>
                            <div style={{display:"flex", marginLeft:"10px", marginBottom:"10px"}}>
                            <div className="field-name">{eval(language).phoneNumber}:</div>
                            <div className="field-value">{selectedArtistData.tel}</div>
                            </div>
                            <div style={{display:"flex", marginLeft:"10px", marginBottom:"10px"}}>
                            <div className="field-name">{eval(language).email}:</div>
                            <div className="field-value">{selectedArtistData.email}</div>
                            </div>
                          </div>
                          <div style={{display:"flex", justifyContent:"space-between", margin:"auto"}}>
                            <div style={{marginLeft:"25px"}}>
                              <Button
                                className="btn btn-addwork"
                                onClick={this.showArtistDetail(selectedArtistData.id)}
                              >
                                {eval(language).checkartist}
                              </Button>
                            </div>
                            <div style={{marginRight:"25px"}}>                              
                              <Button
                                className="btn btn-detail"
                                onClick={this.handleOpenSearchArtistModal}
                              >
                                {eval(language).changeartist}
                              </Button>
                            </div>                           
                          </div>                                       
                        </Box>
                        :
                        <Box className="set-author">
                        <div>
                          <div style={{margin:"10px"}}  className="page-title">
                            {eval(language).artistinform}
                          </div>
                          <Button
                            className="btn btn-new"
                            onClick={this.handleOpenSearchArtistModal}
                          >
                            {eval(language).searchartist}
                          </Button>
                        </div>                        
                      </Box>                       
                       }
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).artworkid}
                            </label>
                            <div className='form-input-addnew'>
                               {artistID}
                            </div>                     
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).artworkname}
                            </label>
                            <div className='form-input-addnew'>
                                <input type='text' className='form-control-addnew' disabled={confirm} value={Name} onChange={this.handleChangeSubmitdata("Name")}/>
                            </div>
                        </Box> 
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).category}
                            </label>
                            <div className='form-input-addnew'>
                                <select type='text' className='form-control-addnew select' disabled={confirm} value={CategoryId} onChange={this.handleChangeSubmitdata("CategoryId")}>
                                  <option value=""></option> 
                                  {categoryList.map((category) => (
                                    <option value={category.id}>{category.name}</option> 
                                  ))}
                                </select>
                            </div>
                        </Box> 
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).image}
                            </label>
                            <div className='form-input-addnew'>
                                <select type='text' className='form-control-addnew select' disabled={confirm} value={ImageId} onChange={this.handleChangeSubmitdata("ImageId")}>
                                  <option value=""></option> 
                                  {imageList.map((image) => (
                                    <option value={image.id}>{image.name}</option> 
                                  ))}
                                </select>
                            </div>
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).season}
                            </label>
                            <div className='form-input-addnew'>
                                <select type='text' className='form-control-addnew select' disabled={confirm} value={SeasonId} onChange={this.handleChangeSubmitdata("SeasonId")}>
                                  <option value=""></option> 
                                  {seasonList.map((season) => (
                                    <option value={season.id}>{season.name}</option> 
                                  ))}
                                </select>
                            </div>
                        </Box> 
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).color}
                            </label>
                            <div className='form-input-addnew'>
                                <select type='text' className='form-control-addnew select' disabled={confirm} value={TintId} onChange={this.handleChangeSubmitdata("TintId")}>
                                  <option value=""></option> 
                                  {tintList.map((tint) => (
                                    <option value={tint.id}>{tint.name}</option> 
                                  ))}
                                </select>
                            </div>
                        </Box> 
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).size}
                            </label>
                            <div className='form-input-addnew'>
                                <input type='number' className="size-control-form" disabled={confirm} value={Width} onChange={this.handleChangeSubmitdata("Width")}/><span style={{padding:"0px 10px"}}>mm x</span> <input className="size-control-form" type='number' disabled={confirm} value={Height} onChange={this.handleChangeSubmitdata("Height")}/><span style={{padding:"0px 10px"}}>mm</span>
                            </div>
                        </Box> 
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).conditionStatus}
                            </label>
                            <div className='form-input-addnew'>
                                <select type='text' className='form-control-addnew select' disabled={confirm} value={Status} onChange={this.handleChangeSubmitdata("Status")}>
                                  <option value=""></option> 
                                  {artworkStatusList.map((status) => (
                                    <option value={status.value}>{status.name}</option> 
                                  ))}
                                </select>
                            </div>
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).data}
                            </label>
                            <div className='form-textarea-addnew'>
                                <input type="file" onChange={this.updateWorks} ref={(ref) => this.upload = ref} style={{ display: 'none' }} multiple />
                                <div hidden={confirm}>
                                  <Button onClick={(e) => this.upload.click() } className="btn btn-adddata" >
                                  {eval(language).addData}
                                  </Button>
                                </div>                                
                                <div className="workList">
                                  {(workslist).map(work => (
                                     work.file 
                                     ? 
                                     <div className="work_image_container">
                                        <img className="work_image_addnew" src={work.file}/>
                                        <div style={{textTransform:"uppercase",textAlign:"left"}}>{work.filetype}</div>
                                        <div style={{textAlign:"left"}}>{work.filesize}</div>
                                        <div className="top-right" hidden={confirm}>           
                                          <IconButton className="unselectWork" edge="start" color="inherit" onClick={e=>this.removeWork(work.id)}  aria-label="close">
                                              <CloseIcon/>
                                          </IconButton>
                                        </div>
                                     </div>                                     
                                     :
                                     ""
                                  ))}
                                </div> 
                            </div>
                            
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).dropboxPath}
                                {/* <Button onClick={this.handleUploadFromDropbox}  style={{marginTop:"10px"}} className="btn btn-adddata dropboxbtn" >
                                  {eval(language).dropboxPath}
                                </Button>                           */}
                            </label>
                            <div className='form-input-addnew'>
                              <div className='form-control-addnew' style={{marginBottom:"10px", marginTop:"10px"}}>{eval(language).dropboxfoldername} <input type='text' disabled={confirm} className='form-control-addnew' value={dorpboxPath} onChange={this.handleChangeSubmitdata("dorpboxPath")}/></div>
                              <div className='form-control-addnew' style={{marginBottom:"10px", marginTop:"10px"}}>{eval(language).dropboxfilename} <input type='text' disabled={confirm} className='form-control-addnew' value={dropboxfilename} onChange={this.handleChangeSubmitdata("dropboxfilename")}/></div>
                            </div>
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).description}
                            </label>
                            <div className="form-textarea-addnew">
                                <textarea rows="4" className="form-control-addnew" disabled={confirm}  value={Description} onChange={this.handleChangeSubmitdata("Description")}></textarea>
                            </div>
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).backofficeComment}
                            </label>
                            <div className="form-textarea-addnew">
                                <textarea rows="4" className="form-control-addnew" disabled={confirm}  value={OfficeComment} onChange={this.handleChangeSubmitdata("OfficeComment")}></textarea>
                            </div>                        
                        </Box>              
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).note}
                            </label>
                            <div className="form-textarea-addnew">
                                <textarea rows="4" className="form-control-addnew" disabled={confirm} value={Note} onChange={this.handleChangeSubmitdata("Note")}></textarea>
                            </div>                        
                        </Box>  
                    </div>
                    <div style={{position:"relative", height:"50px"}}>
                      <div style={{position:"absolute", right:"0"}}>
                        <Button className="btn btn-back"
                          onClick={this.handleGoback}
                          style={{padding:"10px 30px"}}
                        >
                        {eval(language).back}                        
                        </Button>
                        <Button className="btn btn-new" style={{padding:"10px 30px"}} onClick={this.handleConfirm}>
                        {confirm ? eval(language).save : eval(language).confirm}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Box>
          </div>          
        </Container>
        <Dialog
          className="search-artistmodal"
          open={searchArtistmodal}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleCloseSearchArtistModal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
       >
        <DialogTitle id="alert-dialog-slide-title" style={{textAlign:"center"}}>{eval(language).searchArtistmodalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box>
              <form onSubmit={this.searchbyKeywords}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon
                          fontSize="small"
                          color="action"
                        >
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder= {eval(language).searchPlaceholder}
                  variant="outlined"
                  onChange={this.handleKeyword}
                  value={this.state.filter.Keywords}
                />
              </form>                        
            </Box>
          </DialogContentText>
          <div className="search-btn">  
            <Button onClick={this.searchbyKeywords} className="btn btn-search">
              {eval(language).search}
            </Button>
          </div>
          <div className="search-btn">
            <Button onClick={this.handleCloseSearchArtistModal} className="btn btn-close">
              {eval(language).close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
          className="search-artist-result-modal"
          open={searchResultModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleCloseSearchResultModal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
       >
        <DialogTitle id="alert-dialog-slide-title" style={{textAlign:"center"}}>{eval(language).searchArtistmodalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box>
              <form onSubmit={this.searchbyKeywords}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon
                          fontSize="small"
                          color="action"
                        >
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder= {eval(language).searchPlaceholder}
                  variant="outlined"
                  onChange={this.handleKeyword}
                  value={this.state.filter.Keywords}
                />
              </form>                        
            </Box>
            <Box className="result-num">
                  {`${eval(language).searchResult} ${totalRecords}${eval(language).case}`}
            </Box>
            <PerfectScrollbar>
              <Box minWidth={950} >
                <Table className="result_table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{paddingLeft:"50px"}}>
                      {eval(language).artistName}
                      </TableCell>
                      <TableCell>
                      {eval(language).penName}
                      </TableCell>
                      <TableCell>
                      {eval(language).email}
                      </TableCell>
                      <TableCell>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {authorsdata.map((author) => (
                      <TableRow
                        hover
                        key={author.id}
                      >
                          <TableCell style={{paddingLeft:"50px"}}>
                          <Box
                            alignItems="center"
                            display="flex"
                          >
                            <Avatar className="avatar"
                              src={author.image_url}
                            >
                              {getInitials(author.name)}
                            </Avatar>
                            <Typography
                              color="textPrimary"
                              variant="body1"
                            >
                              {author.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {author.penName}
                        </TableCell>
                        <TableCell>
                          {author.email}
                        </TableCell>

                        <TableCell style={{paddingRight:"50px"}}>
                          <Button
                            className="btn btn-detail"
                            onClick={this.selectArtist(author)}
                          >
                            {eval(language).select}
                          </Button>
                          <Button
                            className="btn btn-back"
                            onClick={this.showArtistDetail(author.id)}                           
                          >
                            {eval(language).checkDetail}
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
                  <label>{eval(language).pageShow}:
                      <select className="pageCount" value={pageSize} onChange={this.handlePagecount}>
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                      </select>
                  </label>
              </Box>
              <Pagination className="paginationitem" count={pageCount} page={PageNumber} onChange={this.handlePagenation} variant="outlined" color="primary" />
            </Box>
          </DialogContentText>
          <div className="search-btn">
            <Button onClick={this.handleCloseSearchResultModal} className="btn btn-search">
              {eval(language).close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog
          className="alert-modal"
          open={Alertmodal}
          TransitionComponent={Transition}
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
      <Dialog
          className="spin-modal"
          open={this.state.spin}      
          disableBackdropClick
       >
            <CircularProgress />
      </Dialog>
      </Page>
      
    
    );
 }
};

export default AddNewWork;