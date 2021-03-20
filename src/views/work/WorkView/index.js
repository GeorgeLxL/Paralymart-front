
import React, {Component} from 'react';

import {
  Avatar,
  Box,
  Container,
  ButtonGroup,
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
import getInitials from 'src/utils/getInitials';
import Pagination from '@material-ui/lab/Pagination';
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
  addNewArtwork:"REGISTER ARTWORK",
  csvDownloadbutton:"CSV DOWNLOAD",
  searchPlaceholder:"Search (Artwork name, Artist name, Pen name, Etc...)",
  category:"Category",
  image:"Image",
  addfilter:"Add Filter",
  sort:"Sort",
  artWorkname:"Artwork Name",
  season:"Season",
  color:"Color",
  detail:"DETAIL",
  conditionStatus:"Condition Status",
  regDate:"Registered Date",
  applybutton:"APPLY",
  resetButton:"RESET",
  pageShow:"Show",
  ok:"O K",
  reflection:"REFLECTION",
  artistDataSyncTitle:"Synchronize artwork data",
  artistDatasyncContent:"Sync data has been called",
  status:"Artwork syncing",
  searchresult:"Search result",
  allrecord:"All record",
  csvdownloadrequest:"CSV DOWNLOAD REQUEST",
  csvdownloadsucess:"Email which contains the CSV file will be sent to your inbox once ready.",
  csvdownloadfailed:"CSV downlaod failed.",
  error:"error",  
  regDateNO:"Registration Date (New - Old)",
  regDateON:"Registration Date (Old - New)",
  updateDateNO:"Updated Date (New - Old)",
  updateDateON:"Updated Date (Old - New)",
  artworkNameaz:"Artwork Name (A - Z)",
  artworkNameza:"Artwork Name (Z - A)",

}

const jp={
  search:"検索",
  title:"登録作品一覧",
  csvDownloadbutton:"CSVダウンロード",
  addNewArtwork:"新規作品を登録",
  searchPlaceholder:"フリーワード検索（作品名、アーティスト名、ペンネームなど…）",
  category:"カテゴリー",
  image:"イメージ",
  addfilter:"フィルターを追加",
  sort:"ソート",
  artWorkname:"作品名",
  season:"季節",
  color:"色合い",
  detail:"詳    細",
  conditionStatus:"状態（ステータス）",
  regDate:"登録日",
  applybutton:"適  用",
  resetButton:"リセット",
  pageShow:"表示する行数",
  ok:"確認",
  reflection:"即 反 映",
  artistDataSyncTitle:"作品データを同期",
  artistDatasyncContent:"同期データが呼び出されました。",
  status:"作品情報連携中",
  searchresult:"検索結果",
  allrecord:"全レコード",
  csvdownloadrequest:"CSVダウンロード",
  csvdownloadsucess:"CSVファイルを含むメールは、準備ができたら受信トレイに送信されます。",
  csvdownloadfailed:"CSVダウンロードが失敗しました。",
  error:"失敗", 
  regDateNO:"登録日（新 - 古）",
  regDateON:"登録日（古 - 新）",  
  updateDateNO:"更新日（新 - 古）",  
  updateDateON:"更新日（古 - 新）", 
  artworkNameaz:"作品（A - Z）",
  artworkNameza:"作品（Z - A）",
}

class WorkView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language:JSON.parse(localStorage.language).language,
      filter: {
        Keywords: "",
        CategoryId: "",
        ImageId:"",
        SeasonId:"",
        TintId:"",
        Status: "",
        StartDate: "",
        EndDate: "",
        PageSize: 10,
        PageNumber: 1,
        SortBy:"",
        SortType:"",
      },
      SeasonId:"",
      statusId:"",
      TintId:"",
      EndDate:moment(),
      StartDate:moment(),
      pageCount:0,
      totalRecords:0,
      workdata:[],
      SelectedWorkids:[],
      open:false,
      workslist:[],
      categoryList:[],
      imageList:[],
      seasonList:[],
      tintList:[],
      artworkStatusList:[],
      initSelectedArray:true,
      Alertmodal:false,
      alertTitle:"",
      alertContent:"",
      spin:false,
      syncstatus:false,
      all:true,
    };
  }

  handleSelectAll = (event) => {   
    const {workdata,SelectedWorkids,filter}=this.state;
    var pageNumber = filter.PageNumber-1;
    let newselectedWorksIds=[];
    if (event.target.checked) {
      newselectedWorksIds = workdata.map((work) => work.id);
    } else {
      newselectedWorksIds = [];
    }
    SelectedWorkids[pageNumber] = newselectedWorksIds
    this.setState({
      SelectedWorkids:SelectedWorkids
    });
  };

  handleSelectOne = (event, id) =>{
    const {SelectedWorkids,filter}=this.state;
    var pageNumber = filter.PageNumber-1;
    const selectedIndex = SelectedWorkids[pageNumber].indexOf(id);
    let newselectedWorksIds = [];
    if (selectedIndex === -1) {
      newselectedWorksIds = newselectedWorksIds.concat(SelectedWorkids[pageNumber], id);
    } else if (selectedIndex === 0) {
      newselectedWorksIds = newselectedWorksIds.concat(SelectedWorkids[pageNumber].slice(1));
    } else if (selectedIndex === SelectedWorkids[pageNumber].length - 1) {
      newselectedWorksIds = newselectedWorksIds.concat(SelectedWorkids[pageNumber].slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedWorksIds = newselectedWorksIds.concat(
        SelectedWorkids[pageNumber].slice(0, selectedIndex),
        SelectedWorkids[pageNumber].slice(selectedIndex + 1)
      );
    }
    SelectedWorkids[pageNumber] = newselectedWorksIds;
    this.setState({
      SelectedWorkids:SelectedWorkids
    });
  };

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

  handleFilterChange = dataFiledName => event=>{
    this.setState({
      [dataFiledName]: event.target.value
    });
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

  handleApply = (event) =>{
    const {filter, SeasonId, statusId, TintId, StartDate, EndDate} = this.state;
    filter.SeasonId = SeasonId;
    filter.Status = statusId;
    filter.TintId = TintId;
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

  handleReset = (event)=>{
    this.setState({
      SeasonId:"",
      statusId:"",
      TintId:"",
      EndDate:moment(),
      StartDate:moment(),
    })
  }

  handleCategory = (event)=>{
    const {filter} = this.state;
    filter.CategoryId = event.target.value;
    this.setState({
      filter:filter,
      initSelectedArray:true,
    });
    this.getdata(filter);
  }

  handleIamge = (event) =>{
    const {filter} = this.state;
    filter.ImageId = event.target.value;
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

  handleKeyword = (event)=>{
    const {filter} = this.state;
    filter.Keywords = event.target.value;
    this.setState({filter:filter});
  }

  handleCSVdownload = (event)=>{
    var selectedIDs=[];
    var artworks=[];
    const {SelectedWorkids, pageCount,language} = this.state;
    for(var i=0;i<pageCount;i++)
    {
      selectedIDs = selectedIDs.concat(SelectedWorkids[i]);
    }
  
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    selectedIDs.forEach(item=>{
         var temp={};
         temp.Id = item;
         artworks.push(temp);
    })
    var  data = JSON.stringify({"Artworks":artworks}); 
    var config = {
        method: 'post',           
        url: `${baseurl}/artworks/csv_download/selected`,
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
        url: `${baseurl}/requests/artworks/data/sync`,
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

  searchbyKeywordsclick = (event) =>{
    var {filter} = this.state;
    this.setState({
      initSelectedArray:true,
    }) 
    this.getdata(filter);
  }

  componentDidMount(){
    const {filter} = this.state;
    this.getCategorylist();
    this.getImageList();
    this.getSeasonList();
    this.getTintList();
    this.getArtworkStatusList();
    this.getdata(filter);
 
  } 
 
  getdata(filter){
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token;
      var pageCount, totalRecords;
     
      var data = new Array();
      var config = {
        method: 'get',
        url: `${baseurl}/artworks`,
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
        var responsedata = response.data.artworks;       
        pageCount = response.data.pageCount;
        if(this.state.initSelectedArray)
        {
          var SelectedWorkids = new Array();
          for(var i=0; i<=pageCount; i++)
          {
            var temp= new Array();
            SelectedWorkids.push(temp);
          }
          this.setState({
            SelectedWorkids:SelectedWorkids,
            initSelectedArray:false
          });
          if(filter.CategoryId!="" || filter.EndDate!="" || filter.ImageId!="" || filter.Keywords !="" || filter.SeasonId != "" || filter.StartDate != "" || filter.Status!="" || filter.TintId != "")
          {
            this.setState({all:false});
          }
        }
        totalRecords = response.data.totalRecords;      
        var artworkimageids = new Array();
        if(totalRecords==0)
        {
          this.setState({
            spin:false
          });
          this.getImageDetaildatafromid(artworkimageids);
        }        
        responsedata.forEach(item => {
            var id={};
            id.workid= item.id;
            id.artworkimageid = item.artworkImageId;            
            artworkimageids.push(id);
            var temp={};
            temp.id = item.id;
            temp.artist = item.artist;
            temp.name = item.name;
            temp.image_url = item.artworkImageId ? "false" : "";
            temp.category = item.category;
            temp.image = item.image;
            temp.season = item.season
            temp.tint = item.tint;
            data.push(temp);              
        });
       
        this.setState({
          pageCount: pageCount,
          totalRecords:totalRecords,
          workdata:data,
          spin:false
        });
        this.getImageDetaildatafromid(artworkimageids);
      })
      .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var artworkimageids = new Array();
                this.getImageDetaildatafromid(artworkimageids);
                this.setState({
                    spin:false,
                    pageCount:0,
                    totalRecords:0,
                    workdata:[]
              });
            }
        } 
    }); 
  }

  getImageDetaildatafromid(artworkimageids){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    artworkimageids.forEach(id=>{
      if(id.artworkimageid){
          var config = {
            method: 'get',
            url: `${baseurl}/artworks/${id.workid}/detail/images/${id.artworkimageid}/for_list`,
            headers: { 
              'Authorization': 'Bearer ' + token,
            },
            responseType: 'blob',
            data : {},
          };  
          axios(config)
          .then((response1) => {
            const {workdata} = this.state;
            workdata.forEach(work=>{
              if(work.id==id.workid)
              {
                work.image_url =  URL.createObjectURL(response1.data);
                this.setState({
                  workdata:workdata,
                });
              }
            });
          })
          .catch((error)=> {
            const {workdata} = this.state;
            workdata.forEach(work=>{
              if(work.id==id.workid)
              {
                work.image_url =  "";
                this.setState({
                  workdata:workdata,
                });
              }
            });
          });  
      }
    });
    
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
   const {workdata, totalRecords, SelectedWorkids, open, language, pageCount,categoryList, imageList, seasonList, tintList, artworkStatusList, alertContent, alertTitle, Alertmodal} = this.state;
   let pageSize = this.state.filter.PageSize;
   let PageNumber = this.state.filter.PageNumber;
   var Selectedids = SelectedWorkids[PageNumber-1] ? SelectedWorkids[PageNumber-1] : [];

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
                    onClick={e=>{window.location.assign("work/addnew/null")}}
                  >
                  {eval(language).addNewArtwork}
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
                          <div>
                            <select className="select-gender" onChange={this.handleCategory}>
                              <option value="">{eval(language).category}</option>
                              {categoryList.map((category) => (
                                  <option value={category.id}>{category.name}</option> 
                              ))}
                            </select>
                          </div>
                          <div>
                            <select className="select-gender" onChange={this.handleIamge}>
                              <option value="">{eval(language).image}</option>
                              {imageList.map((image) => (
                                <option value={image.id}>{image.name}</option> 
                              ))}
                            </select>
                          </div>
                          <Button className ="btn" onClick={this.handleOpen}>{eval(language).addfilter}&nbsp;&nbsp;</Button>
                        </ButtonGroup>
                        <Box>
                            <select className="select-sort" onChange={this.handleSort}>
                              <option value="">&#8693;&nbsp;&nbsp;{eval(language).sort}</option>   
                              <option value="RegistrationDate 1">{eval(language).regDateNO}</option>   
                              <option value="RegistrationDate 2">{eval(language).regDateON}</option>                              
                              <option value="DateUpdated 1">{eval(language).updateDateNO}</option>
                              <option value="DateUpdated 2">{eval(language).updateDateON}</option>   
                              <option value="ArtistName 1">{eval(language).artworkNameaz}</option>                              
                              <option value="ArtistName 2">{eval(language).artworkNameza}</option>
                            </select>                          
                        </Box>
                      </Box>
                    </Box>
                    <div className="searchresult">{this.state.all ? eval(language).allrecord : eval(language).searchresult}:&nbsp;&nbsp;{totalRecords}</div>
                    {totalRecords==0 ? "":
                    <PerfectScrollbar>
                      <Box minWidth={1050} >
                        <Table className="result_table">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={Selectedids.length === workdata.length && workdata.length!==0}
                                  color="primary"
                                  indeterminate={
                                    Selectedids.length > 0
                                    && Selectedids.length < workdata.length
                                  }
                                  onChange={this.handleSelectAll}
                                />
                              </TableCell>
                              <TableCell>
                              {eval(language).artWorkname}
                              </TableCell>
                              <TableCell>
                              {eval(language).category}
                              </TableCell>
                              <TableCell>
                              {eval(language).image}
                              </TableCell>
                              <TableCell>
                              {eval(language).season}
                              </TableCell>
                              <TableCell>
                              {eval(language).color}
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
                                selected={Selectedids.indexOf(work.id) !== -1}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={Selectedids.indexOf(work.id) !== -1}
                                    onChange={(event) => this.handleSelectOne(event, work.id)}
                                    value="true"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box
                                    alignItems="center"
                                    display="flex"
                                  >
                                    <Avatar
                                      className="work_image"
                                      src={work.image_url}
                                    >
                                      {work.image_url=="false" ? "Loading" : getInitials(work.name)}
                                    </Avatar>
                                    <Typography
                                      color="textPrimary"
                                      variant="body1"
                                    >
                                      <span className="artworkname-label">{work.name}<br/></span><span className="artistname-label">{work.artist.firstName} {work.artist.lastName}</span>
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
                                    onClick={e=>{window.location.assign(`work/detail/${work.id}`)}}
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
                    }
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
                      <Pagination count={pageCount} page={PageNumber} className="paginationitem"  onChange={this.handlePagenation} variant="outlined" color="primary" />
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
                  {eval(language).season}
                  </Typography>
                </div>                
                  <select className="filter-item select" value={this.state.SeasonId} onChange={this.handleFilterChange("SeasonId")}>
                  <option value=" "></option> 
                    {seasonList.map((season) => (
                    <option value={season.id}>{season.name}</option> 
                    ))}
                  </select>              
              </Box>
              <hr/>
              <Box 
                bgcolor="#F6F6F7"
              >
                <div>
                  <Typography variant="h6" className="filter-title">
                  {eval(language).conditionStatus}
                  </Typography>
                </div>                
                  <select className="filter-item select" value={this.state.statusId} onChange={this.handleFilterChange("statusId")}>
                  <option value=" "></option> 
                    {artworkStatusList.map((status) => (
                    <option value={status.id}>{status.name}</option> 
                    ))}
                  </select>              
              </Box>
              <hr/>
              <Box 
                bgcolor="#F6F6F7"
              >
                <div>
                  <Typography variant="h6" className="filter-title">
                  {eval(language).color}
                  </Typography>
                </div>                
                  <select className="filter-item select" value={this.state.TintId} onChange={this.handleFilterChange("TintId")}>
                    <option value=" "></option> 
                    {tintList.map((tint) => (
                    <option value={tint.id}>{tint.name}</option> 
                    ))}
                  </select>               
              </Box>
              <hr/>
              <Box 
                bgcolor="#F6F6F7"
              >
                <div>
                  <Typography variant="h6" className="filter-title">
                  {eval(language).regDate}
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
                    <Button className="btn btn-apply"  onClick={this.handleApply}>
                      {eval(language).applybutton}
                    </Button>
                    <Button className="btn btn-reset" onClick={this.handleReset}>
                      {eval(language).resetButton}
                    </Button>
              </div>
          </Dialog>

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
      </Container>
    </Page>
    
    );
 }
};
export default WorkView;