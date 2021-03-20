import React, { Component } from 'react';
import {
  Avatar,
  Box,
  Container,
  Button,
  Card,
  CardContent,
  TextField,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  ButtonGroup,
  Dialog,
  IconButton,
  Slide,
  SvgIcon,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Page from 'src/components/Page';
import { Search as SearchIcon } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Pagination from '@material-ui/lab/Pagination';
import getInitials from 'src/utils/getInitials';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Transitionalert = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const en={
  search:"Search",
  title:"Registered ArtWork List",
  csvDownloadbutton:"CSV DOWNLOAD",
  searchPlaceholder:"Search (Artist name, Pen name, Email, Etc...)",
  birthday:"Birthday",
  gender:"Gender",
  men:"Male",
  women:"Female",
  addfilter:"Add Filter",
  sort:"Sort",
  artistName:"Artist Name",
  penName:"Pen Name",
  email:"Email",
  regDate:<span>Registered <br/> Date</span>,
  regArtwork:<span>Registered <br/> ArtWork</span>,
  addworkButton:"ADD ARTWORK",
  detail:"DETAIL",
  prefecture:"Prefecture",
  CreateartworkfromS:"Crete Artwork from Scratch",
  Yes:"Yes",
  No:"No",
  registerdate:"Registered Date",
  applybutton:"APPLY",
  resetButton:"RESET",
  pageShow:"Show",
  ok:"確認",
  reflection:"REFLECTION",
  artistDataSyncTitle:"Synchronize Artist Data",
  artistDatasyncContent:"Sync data has been called",
  status:"Artist syncing",
  searchresult:"Search result",
  allrecord:"All record",
  csvdownloadrequest:"CSV DOWNLOAD REQUEST",
  csvdownloadsucess:"Email which contains the CSV file will be sent to your inbox once ready.",
  csvdownloadfailed:"CSV downlaod failed.",
  error:"Error",
  artistNameaz:"Artist Name (A - Z)",
  artistNameza:"Artist Name (Z - A)",

}

const jp={
  search:"検索",
  title:"登録作者一覧",
  csvDownloadbutton:"CSVダウンロード",
  searchPlaceholder:"フリーワード検索（作品名、アーティスト名、ペンネームなど…）",
  birthday:"生年月日",
  gender:"性別",
  men:"男性",
  women:"女性",
  addfilter:"フィルターを追加",
  sort:"ソート",
  artistName:"アーティスト名",
  penName:"ペンネーム",
  email:"メールアドレス",
  regDate:"登録日",
  regArtwork:"点数",
  addworkButton:"作品を追加",
  detail:"詳    細",
  prefecture:"都道府県",
  CreateartworkfromS:"描き下ろし対応",
  Yes:"はい",
  No:"いいえ",
  registerdate:"登録日",
  applybutton:"適  用",
  resetButton:"リセット",
  pageShow:"表示する行数",
  ok:"O K",
  reflection:"即 反 映",
  artistDataSyncTitle:"アーティストデータを同期",
  artistDatasyncContent:"同期データが呼び出されました。",
  status:"作者情報連携中",
  searchresult:"検索結果",
  allrecord:"全レコード",
  csvdownloadrequest:"CSVダウンロード",
  csvdownloadsucess:"CSVファイルを含むメールは、準備ができたら受信トレイに送信されます。",
  csvdownloadfailed:"CSVダウンロードが失敗しました。",
  error:"失敗",
  artistNameaz:"作者（A - Z）", 
  artistNameza:"作者（Z - A）",
}

class AuthorListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language:JSON.parse(localStorage.language).language,
      authorsdata:[],
      areas:[],
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
      CreateArtworkFromScratchYes:false,
      CreateArtworkFromScratchNo:false,
      StartDate:moment(),
      EndDate:moment(),
      selectedArea:"",
      pageCount:0,
      totalRecords:0,
      SelectedAuthorsids:[],
      open:false,
      initSelectedArray:true,
      selectedDate: moment(),
      Alertmodal:false,
      alertTitle:"",
      alertContent:"",
      syncstatus:false,
      all:true,
      spin:false,
    };
  }
  handleSelectAll = (event) => {
    const {authorsdata,SelectedAuthorsids,filter}=this.state;
    var pageNumber = filter.PageNumber-1;
    let newSelectedAuthorsids=[];
    if (event.target.checked) {
      newSelectedAuthorsids = authorsdata.map((author) => author.id);
    } else {
      newSelectedAuthorsids = [];
    }
    SelectedAuthorsids[pageNumber] = newSelectedAuthorsids
    this.setState({
      SelectedAuthorsids:SelectedAuthorsids
    });
  };

  handleSelectOne = (event, id) =>{
    const {SelectedAuthorsids,filter}=this.state;
    var pageNumber = filter.PageNumber-1;
    const selectedIndex = SelectedAuthorsids[pageNumber].indexOf(id);
    let newSelectedAuthorsids = [];

    if (selectedIndex === -1) {
      newSelectedAuthorsids = newSelectedAuthorsids.concat(SelectedAuthorsids[pageNumber], id);
    } else if (selectedIndex === 0) {
      newSelectedAuthorsids = newSelectedAuthorsids.concat(SelectedAuthorsids[pageNumber].slice(1));
    } else if (selectedIndex === SelectedAuthorsids[pageNumber].length - 1) {
      newSelectedAuthorsids = newSelectedAuthorsids.concat(SelectedAuthorsids[pageNumber].slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedAuthorsids = newSelectedAuthorsids.concat(
        SelectedAuthorsids[pageNumber].slice(0, selectedIndex),
        SelectedAuthorsids[pageNumber].slice(selectedIndex + 1)
      );
    }
    SelectedAuthorsids[pageNumber] = newSelectedAuthorsids;
    this.setState({
      SelectedAuthorsids:SelectedAuthorsids
    });
  };

  handleClose = (event)=>{
    this.setState({
      open:false
    })
  }

  handleCloseAlertModal =(event)=>{
    this.setState({
        Alertmodal:false
      });
  }

  handleOpen = (event)=>{
    this.setState({
      open:true
    })
  }

  handlePagenation = (events,PageNumber)=>{
    const {filter} = this.state;
    filter.PageNumber = PageNumber;
    this.setState({
        filter:filter
    });
    this.getdata(filter);
  }

  handlePagecount = (events)=>{
    const {filter} = this.state;
    var prevepageSize = filter.PageSize;
    var prevepageNumber = filter.PageNumber;
    var currentPagesize = events.target.value;
    filter.PageSize = currentPagesize; 
    filter.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        filter:filter,
        initSelectedArray:true
    });
    this.getdata(filter);
  }

  handleBirthdateChange = (date)=>{
    const {filter} = this.state;
    filter.BirthDate = date;
    this.setState({
      filter:filter,
      initSelectedArray:true,
    })
    this.getdata(filter);
  }

  handleStartDateChange = (date)=>{
    this.setState({
      StartDate:date
    })
  }

  handleEndDateChange = (date)=>{
    this.setState({
      EndDate:date
    })
  }  

  handleKeyword = (event)=>{
    const {filter} = this.state;
    filter.Keywords = event.target.value;
    this.setState({filter:filter});
  }
  
  handleGender = (event)=>{
    const {filter} = this.state;
    filter.sex = event.target.value;
    this.setState({
      filter:filter,
      initSelectedArray:true,
    });
    this.getdata(filter);
  }

  handleSort = (event)=>{
    const {filter} = this.state;
    var sort = event.target.value;
    if(sort!="")
    {
      filter.SortBy = sort.split(" ")[0];
      filter.SortType = sort.split(" ")[1];
    }
    else{
      filter.SortBy = "";
      filter.SortType = "";
    }
    this.setState({
      filter:filter,
      initSelectedArray:true,
    });
    this.getdata(filter);
  }

  handleArea = (event) =>{
    this.setState({selectedArea:event.target.value});
  }

  handleSelectYes =(event)=>{
    this.setState({CreateArtworkFromScratchYes:!this.state.CreateArtworkFromScratchYes});
  }

  handleSelectNo =(event)=>{
    this.setState({CreateArtworkFromScratchNo:!this.state.CreateArtworkFromScratchNo});
  }

  handleReset = (event)=>{
    this.setState({
      CreateArtworkFromScratchYes:false,
      CreateArtworkFromScratchNo:false,
      StartDate:moment(),
      EndDate:moment(),
      selectedArea:""
    })
  }

  handleApply = (event) =>{
    const {filter, CreateArtworkFromScratchNo, CreateArtworkFromScratchYes, StartDate, EndDate, selectedArea} = this.state;
    if(CreateArtworkFromScratchYes===CreateArtworkFromScratchNo)
    {
      filter.CreateArtworkFromScratch="";
    }
    else if(CreateArtworkFromScratchYes)
    {
      filter.CreateArtworkFromScratch=1;
    }
    else
    {
      filter.CreateArtworkFromScratch=0;
    }
    filter.areaId = selectedArea;
    let start = moment(StartDate).format('YYYY-MM-DD');
    let end = moment(EndDate).format('YYYY-MM-DD');
    let now = moment().format('YYYY-MM-DD');
    if(start===end && end===now)
    {
      filter.StartDate="";
      filter.EndDate="";
    }
    else{
      filter.StartDate = start;
      filter.EndDate = end;
    }      
    this.setState({
      filter:filter,
      open:false,
      initSelectedArray:true,
    });
    this.getdata(filter);
  }

  handleCSVdownload = (event)=>{
    var selectedIDs=[];
    var artists=[];
    const {SelectedAuthorsids, pageCount,language} = this.state;
    for(var i=0;i<pageCount;i++)
    {
      selectedIDs = selectedIDs.concat(SelectedAuthorsids[i]);
    }
  
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    selectedIDs.forEach(item=>{
         var temp={};
         temp.Id = item;
         artists.push(temp);
    })
    var  data = JSON.stringify({"Artists":artists}); 
    var config = {
        method: 'post',           
        url: `${baseurl}/artists/csv_download/selected`,
        headers: { 
         'Authorization': 'Bearer ' + token,
         'Content-Type': 'application/json'
        },
        data : data
     };
     axios(config)
     .then((response)=>{
      this.setState({
        alertTitle:eval(language).csvdownloadrequest,
        alertContent:eval(language).csvdownloadsucess,
        Alertmodal:true,
      }); 
     }).catch((error)=>{
      this.setState({
        alertTitle:eval(language).csvdownloadrequest,
        alertContent:eval(language).csvdownloadfailed,
        Alertmodal:true,
      }); 
     })
  }

  handleSync = (event)=>{
    const{language} = this.state;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var config = {
        method: 'post',           
        url: `${baseurl}/requests/artists/data/sync`,
        headers: { 
         'Authorization': 'Bearer ' + token,
         'Content-Type': 'application/json'
        },
        data : {}
     };
     axios(config)
     .then((response)=>{
        this.setState({
          alertTitle:eval(language).artistDataSyncTitle,
          alertContent:eval(language).artistDatasyncContent,
          Alertmodal:true,
          syncstatus:true,
        }); 
     }).catch((error)=>{
        this.setState({
          alertTitle:eval(language).artistDataSyncTitle,
          alertContent:eval(language).error,
          Alertmodal:true,
        }); 
     })
  }

  searchbyKeywords = (event) =>{
    event.preventDefault();
    var {filter} = this.state;
    this.setState({
      initSelectedArray:true,
    }) 
    this.getdata(filter);
  }

  searchbyKeywordsclick = (event)=>{
    var {filter} = this.state;
    this.setState({
      initSelectedArray:true,
    }) 
    this.getdata(filter);
  }


  componentDidMount()
  {
    const {filter} = this.state; 
    this.getdata(filter);
    this.getPrefectures();
  }

  getPrefectures()
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var data =new Array();
    var config = {
      method: 'get',
      url: `${baseurl}/areas/list`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      var responsedata = response.data.areas;
      responsedata.forEach(item=>{
        var temp={};
        temp.id = item.id;
        temp.name = item.name;
        data.push(temp);
      })
      this.setState({areas:data});
    })
    .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
      else{
        this.setState({areas:[]});
      }
    });
  }


  getdata(filter){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var pageCount, totalRecords;
    var data = new Array();
    console.log(filter)
    var config = {
      method: 'get',
      url: `${baseurl}/artists`,
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:filter
    };
    this.setState({
      spin:true
    });
    axios(config)
    .then((response) => {
  
      if(filter.BirthDate!="" || filter.CreateArtworkFromScratch!="" || filter.EndDate!="" || filter.Keywords !="" || filter.areaId != "" || filter.StartDate != "" || filter.sex!="" )
      {
        this.setState({all:false});
      }
      var responsedata = response.data.artists;
      pageCount = response.data.pageCount;
      if(this.state.initSelectedArray)
      {
        var SelectedAuthorsids = new Array();
        for(var i=0; i<pageCount; i++)
        {
          var temp= new Array();
          SelectedAuthorsids.push(temp);
        }
        this.setState({
          SelectedAuthorsids:SelectedAuthorsids,
          initSelectedArray:false
        });
      }

      totalRecords = response.data.totalRecords;
      if(totalRecords==0)
      {
        this.setState({
          spin:false
        });
      } 
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
        spin:false,
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
                  spin:false,
                  pageCount:0,
                  totalRecords:0,
                  authorsdata:[]
              });
          }
      } 
  }); 
  }

  render(){
    const {authorsdata, SelectedAuthorsids,open,selectedDate, language, pageCount,areas,selectedArea} = this.state;
    const {Alertmodal, alertTitle, alertContent} = this.state;
    let pageSize = this.state.filter.PageSize;
    let PageNumber = this.state.filter.PageNumber;
    var Selectedids = SelectedAuthorsids[PageNumber-1] ? SelectedAuthorsids[PageNumber-1] : [];
    return (
      <Page
        className="root"
        title="Paralym|Authors"
      >
        <Container maxWidth={false}>
          <div className="tool-bar">
              <Box
                display="flex"
                justifyContent="space-between"
              >
                <div className="page-title"> 
                <span>{eval(language).title} </span>
                  {this.state.syncstatus ? <span className="statues">{eval(language).status}</span>:""}
                </div>
                
          <div>
               
                <Button
                  className="btn btn-download"
                  onClick={this.handleCSVdownload}
                >
                 {eval(language).csvDownloadbutton}
                </Button>
                <Button
                  className="btn btn-new"
                  style={{paddingLeft:"20px", paddingRight:"20px"}}
                  disabled={this.state.syncstatus}
                  onClick={this.handleSync}
                >
                {eval(language).reflection}
                </Button>
                </div>              
              </Box>
              <Box mt={3}>
                <Card>
                  <CardContent>
                  <Box 
                    className="search-toolbar"
                  >
                        <form className="search-form" onSubmit={this.searchbyKeywords}>
                        <Box className="search-box" alignItems="center">
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
                            placeholder={eval(language).searchPlaceholder}
                            variant="outlined"
                            onChange={this.handleKeyword}
                            value={this.state.filter.Keywords}
                          />
                          <Button className="search-button" onClick={this.searchbyKeywordsclick}> {eval(language).search} </Button>
                        </Box>
                      </form>                   
                     
                      <Box display="flex" className="filter-buttons">
                        <ButtonGroup >
                          <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableToolbar
                              variant="inline"
                              className="datepicker"
                              label={this.state.filter.BirthDate?"":eval(language).birthday}
                              format="yyyy/MM/dd"                        
                              value={this.state.filter.BirthDate}
                              onChange={this.handleBirthdateChange}                            
                            />
                          </MuiPickersUtilsProvider>
                          <div>
                            <select className="select-gender" onChange={this.handleGender}>
                              <option value="">{eval(language).gender}&nbsp;&nbsp;</option>
                              <option value="1">{eval(language).men}&nbsp;&nbsp;</option>
                              <option value="2">{eval(language).women}&nbsp;&nbsp;</option>
                            </select>
                          </div>            
                        
                          <Button className="btn" onClick={this.handleOpen}>{eval(language).addfilter}&nbsp;&nbsp;</Button>
                        </ButtonGroup>
                        <Box>
                        <Box>
                            <select className="select-sort" onChange={this.handleSort}>
                              <option value="">&#8693;&nbsp;&nbsp;{eval(language).sort}</option>   
                              <option value="ArtistName 1">{eval(language).artistNameaz}</option>   
                              <option value="ArtistName 2">{eval(language).artistNameza}</option>                           
                            </select>                          
                        </Box>
                        </Box>
                      </Box>
                    </Box>
                    <div className="searchresult">{this.state.all ? eval(language).allrecord : eval(language).searchresult}:&nbsp;&nbsp;{this.state.totalRecords}</div>
                    <PerfectScrollbar>
                      <Box minWidth={1050} >
                        <Table className="result_table">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={Selectedids.length === authorsdata.length && authorsdata.length!==0}
                                  color="primary"
                                  indeterminate={
                                    Selectedids.length > 0
                                    && Selectedids.length < authorsdata.length
                                  }
                                  onChange={this.handleSelectAll}
                                />
                              </TableCell>
                              <TableCell>
                              {eval(language).artistName}
                              </TableCell>
                              <TableCell style={{whiteSpace:"nowrap"}}>
                              {eval(language).penName}
                              </TableCell>
                              <TableCell>
                              {eval(language).email}
                              </TableCell>
                              <TableCell>
                              {eval(language).regDate}
                              </TableCell>
                              <TableCell>
                              {eval(language).regArtwork}
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
                                selected={Selectedids.indexOf(author.id) !== -1}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={Selectedids.indexOf(author.id) !== -1}
                                    onChange={(event) => this.handleSelectOne(event, author.id)}
                                    value="true"
                                  />
                                </TableCell>
                                <TableCell>
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
                                <TableCell>
                                  {author.regDate}
                                </TableCell>
                                <TableCell>
                                  {author.regArtwork}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    className="btn btn-addwork"
                                    onClick={e=>{window.location.assign(`work/addnew/${author.id}`)}}
                                  >
                                    {eval(language).addworkButton}
                                  </Button>
                                  <Button
                                    className="btn btn-detail"
                                    onClick={e=>{window.location.assign(`author/detail/${author.id}`)}}
                                  >
                                    {eval(language).detail}
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
                  </CardContent>                  
                </Card>
              </Box>
          </div>

          <Dialog className="filter-modal" open={open} onClose={this.handleClose} TransitionComponent={Transition}>              
              <Box 
                display="flex" 
                justifyContent="space-between"
                alignItems="flex-end"
                bgcolor="white"
              >
                <div>
                  <Typography variant="h6" className="side-modal-title">
                  {eval(language).addfilter}
                  </Typography>
                </div>
                <div>
                  <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                </div>
              </Box>
              <hr/>
              <Box 
                bgcolor="#F6F6F7"
              >
                <div>
                  <Typography variant="h6" className="filter-title">
                  {eval(language).prefecture}
                  </Typography>
                </div>
                <Box>
                  <select className="filter-item select" value={selectedArea} onChange={this.handleArea}>
                  <option value=" "></option> 
                  {areas.map((area) => (
                   <option value={area.id}>{area.name}</option> 
                  ))}
                  </select> 
                </Box>         
                            
              </Box>
              <hr/>
              <Box 
                bgcolor="#F6F6F7"
              >
                <div>
                  <Typography variant="h6" className="filter-title">
                  {eval(language).CreateartworkfromS}
                  </Typography>
                </div>                
                <label className="filter-item"><input type="checkbox" checked={this.state.CreateArtworkFromScratchYes} onChange={this.handleSelectYes}/> &nbsp;&nbsp;{eval(language).Yes}</label>
                <label className="filter-item"><input type="checkbox" checked={this.state.CreateArtworkFromScratchNo} onChange={this.handleSelectNo}/> &nbsp;&nbsp;{eval(language).No}</label>
                            
              </Box>
              <hr/>
              <Box 
                bgcolor="#F6F6F7"
              >
                <div>
                  <Typography variant="h6" className="filter-title">
                  {eval(language).registerdate}
                  </Typography>
                </div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    className="filter-item"
                    format="yyyy/MM/dd"
                    margin="normal"
                    value={this.state.StartDate}
                    onChange={this.handleStartDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
                <label className="filter-item">~</label>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    className="filter-item"
                    format="yyyy/MM/dd"
                    margin="normal"
                    value={this.state.EndDate}
                    onChange={this.handleEndDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>         
              </Box>
              <hr/>
              <div className="dialog-footer">
                    <Button className="btn btn-apply" onClick={this.handleApply}>
                      {eval(language).applybutton}
                    </Button>
                    <Button className="btn btn-reset" onClick={this.handleReset}>
                      {eval(language).resetButton}
                    </Button>
              </div>
          </Dialog>      
        </Container>

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

export default AuthorListView;