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
import GetAppIcon from '@material-ui/icons/GetApp';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { isThisSecond } from 'date-fns';

const baseurl = process.env.REACT_APP_BASE_URL;

const jp={
 editstatus:"作品情報を編集中",
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
  selectanddownload:"選択してダウンロード",
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
  edit:"編集",
  save:"保存",
  delete:"作品を削除",
  ok:"確認",
  download:"ダウンロードメールを送信",
  downloadModalTitle:"ダウンロード確認",
  downloadModalContent:<span>データをダウンロードする時間が必要なため、<br/> 数分後にダウンロード用のリンクを登録いただいているメールにお送りします。<br/> メールにあるリンクをクリックいただければダウンロードが自動的に開始します。</span>,
  downloadsuccessModalTitle:"ダウンロードリンク送信完了",
  downloadsuccessModalContent:<span>ダウンロード用のリンクをご登録いただいているメールアドレスに送信が完了しました。<br/>メールにあるリンクをクリックいただければダウンロードが自動的に開始します。</span>,
  selectartworktodownload:"ダウンロードするデータを選択",
  selectall:"全て選択",
  reset:"選択リセット",
  backbtn:"＜ 前へ",
  nextbtn:"次へ ＞",
  downloadbtn:"ダウンロード",
  closebtn:"閉じる",
  downloadcache:"キャッシュからダウンロード",
  downloadfilecoin:"Filecoinからダウンロード",
  selectartworktodownloademessage:"ダウンロードしたい作品を一つ以上選択してください。",
  selectanartistmessage:"アーティストを選択してください。",
  downloadfilecoinstatus:["ファイル暗号化中です。", "Lotusサーバーへアップ中です。","Filecoin Netへアップ中です。"],
  dropboxUpload:"Dropbox Upload",
  dropboxPath:"Dropbox Path",
  dropboxsync:"Dropbox連携",
  dropboxfoldername:"フォルダー名",
  dropboxfilename:"ファイル名",
  success:"更新完了",
  successcontent:"作品の更新が完了しました。",
  error:"失敗",
  deletedartworksuccess:"作品の削除が完了しました。",
  deletedartworkfailed:"作品の削除に失敗しました。",
}

const en={
  editstatus:"Edit Artwork",
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
  selectanddownload:"SELECT AND DOWNLOAD",
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
  edit:"EDIT",
  save:"SAVE",
  delete:"DELETE",
  ok:"O K",
  download:"SEND DOWNLOAD LINK",
  downloadModalTitle:"Download confirmation",
  downloadModalContent:<span>It will need time to download the data.<br/>We will send you the download link in few minutes.<br/>Click download link in the email and the download will start automatically.</span>,
  selectartworktodownload:"Select to Download",
  downloadsuccessModalTitle:"Download Link Sent",
  downloadsuccessModalContent:<span>The download link has been sent to the regestered e-mail address.<br/>Click download link in the email and the download will start automatically.</span>,
  selectall:"SELECT ALL",
  reset:"RESET",
  backbtn:"< BACK",
  nextbtn:"NEXT >",
  downloadbtn:"DOWNLOAD",
  closebtn:"CLOSE",
  downloadcache:"Download from Cache",
  downloadfilecoin:"Download from Filecoin",
  selectartworktodownloademessage:"Please select one or more works you want to download.",
  selectanartistmessage:"Please select an artist.",
  downloadfilecoinstatus:["File encryption is in progress.", "Uploading to Lotus server.","Uploading to Filecoin Net."],
  dropboxUpload:"Dropbox Upload",
  dropboxPath:"Dropbox Path",
  dropboxsync:"Sync Dropbox",
  dropboxfoldername:"Folder Name",
  dropboxfilename:"File Name",
  success:"Success",
  successcontent:"Updated an artwork",
  error:"Error",  
  deletedartworksuccess:"Deleted an artwork.",
  deletedartworkfailed:"Failed to delete an artwork.",
}

const sex=["男","女","その他"];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ArtworkDetail extends Component {
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
      DownloadArtworkModal:false,
      ArtworkSelectModal:false,
      SingleArtWorkShowmodal:false,
      loadimage:true,
      alertTitle:"",
      alertContent:"",
      confirm:true,
      authorsdata:[],
      selectedArtistData:{},
      toggleitem:{},
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
      artworkId:"",
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
      workslistFromserver:[],
      workslistFromserverToshow:[],
      artworkTodelete:[],
      selectedIDsTodownload:[],
      selecAlltoDownload:false,
      Note:"",
      pageCount:0,
      totalRecords:0,     
      categoryList:[],
      imageList:[],
      seasonList:[],
      tintList:[],
      artworkStatusList:[],
      selectedArtImage:{},
      totalImgCount:0,
      imgPageCount:0,
      currentImgpageCount:1,
      listOpen:false,
      downloadfromCache:false,
      downloadfromFilecoin:false,
      downloadfilecoinstatus:4,
      blobimagesids:[],
      dorpboxPath:"",
      dropboxfilename:"",
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

  deleteWorkimage = (id)=>{
    var index, iterator = 0;
    var {workslistFromserver, artworkTodelete} = this.state;
    workslistFromserver.forEach(item=>{
      if(item.id===id){
        index = iterator
      }
      iterator++;
    });
    artworkTodelete.push(workslistFromserver[index]);
    workslistFromserver.splice(index,1);
    this.setState({
      workslistFromserver:workslistFromserver,
      artworkTodelete:artworkTodelete
    });
  } 

  selectArtworkImage = id => (event)=>{
     var index, iterator = 0;
     var {selectedArtImage} = this.state;
     var {workslistFromserver} = this.state;
     workslistFromserver.forEach(item=>{
      if(item.id===id){
         index = iterator
       }
       iterator++;
     });
     selectedArtImage = workslistFromserver[index];
     this.setState({
        selectedArtImage:selectedArtImage,
        SingleArtWorkShowmodal:true,
     });
  }

  handleGoback = (event) =>{
    const {confirm} = this.state;
    if(confirm)
    {
       window.history.back();
    }
    else
    {
      const {artworkId}=this.state
      this.getArtworkDetaildata(artworkId);
      this.setState({
        confirm:true,
        workslist:[],
      });
    }
  }

  handleConfirm = (event) =>{
    const {confirm} = this.state;
    const {toggleitem} = this.state;
    Object.entries(toggleitem).map(item => {
      toggleitem[item[0]] = false;
    });
    if(confirm)
    {
      this.setState({
        confirm:false
      });
    }
    else{
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token;
     
      const {language, ArtworkImage, artistID, Name, CategoryId, ImageId, SeasonId, TintId, dorpboxPath, dropboxfilename, Height, Width, Status, Description, OfficeComment, Note, artworkTodelete, artworkId, workslistFromserver} = this.state; 
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
     
       var index = 0;
       var deleteids=[];
       ArtworkImage.forEach(file=>{
         fd.append(`ArtworkImage[${index}].Id`, 0);
         fd.append(`ArtworkImage[${index}].image`, file);
         fd.append(`ArtworkImage[${index}].Delete`, false);
         index++;
      });

      artworkTodelete.forEach(deleteimage=>{
        fd.append(`ArtworkImage[${index}].Id`, deleteimage.id);
        fd.append(`ArtworkImage[${index}].image`, deleteimage.data);
        fd.append(`ArtworkImage[${index}].Delete`, true);
        deleteids.push(deleteimage.id);
        index++;
      });

      workslistFromserver.forEach(imagefromserver=>{
        if(deleteids.indexOf(imagefromserver.id) == -1)
        {        
          fd.append(`ArtworkImage[${index}].Id`, imagefromserver.id);
          fd.append(`ArtworkImage[${index}].image`, imagefromserver.data);
          fd.append(`ArtworkImage[${index}].Delete`, false);
          deleteids.push(imagefromserver.id);
          index++;
        }
      });
      this.setState({loadimage:true});
      axios.put(`${baseurl}/artworks/${artworkId}/update`, fd, {
         headers: {
           'Authorization': 'Bearer ' + token,
         }
       }).then((response)=>{
         this.setState({
           loadimage:false,
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
                loadimage:false,
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

  handleDelete =(event) =>{
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    const {artworkId,language} = this.state;
    var config = {
      method: 'delete',
      url: `${baseurl}/artworks/${artworkId}`,
      headers: { 
        'Authorization': 'Bearer ' + token,
     }
    }
    axios(config)
    .then((response) => {
      this.setState({
        alertTitle:eval(language).success,
        alertContent:eval(language).deletedartworksuccess,
        success:true,
        Alertmodal:true,
      });
    })
    .catch((error)=>{
      this.setState({
        alertTitle:eval(language).error,
        alertContent:eval(language).deletedartworkfailed,
        Alertmodal:true,
      });
    })
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

  handleCloseDownloadModal =(event)=>{
    this.setState({
      selectedIDsTodownload:[],
      DownloadArtworkModal:false,
      downloadfromCache:false,
      downloadfromFilecoin:false,
      downloadfilecoinstatus:4,
    });
  }

  handleCloseSelectArtworkModal=(event)=>{
    this.setState({
      selectedIDsTodownload:[],
      selecAlltoDownload:false,
      ArtworkSelectModal:false
    })
  }

  handleCloseSingleArtWorkShowmodal =(event)=>{
    this.setState({
      selectArtworkImage:{},
      SingleArtWorkShowmodal:false
    })
  }

  handleSelectAll = (event) => {
    let newselectedIDsTodownload;
    const {selecAlltoDownload, workslistFromserver, downloadfilecoinstatus} = this.state;
    this.setState({selecAlltoDownload:!selecAlltoDownload})
    if (!selecAlltoDownload) {
      newselectedIDsTodownload = workslistFromserver.map((work) =>
       work.status==4 ? work.id:null);
     
    } else {
      newselectedIDsTodownload = [];
     
    }
    this.setState({
      selectedIDsTodownload:newselectedIDsTodownload
    });
  };

  handleUnselectAll =(event)=>{
    this.setState({
      selectedIDsTodownload:[],
      selecAlltoDownload:false,
      downloadfilecoinstatus:4,
    })
  }

  handleSelectOne = (event, id) => {
    const {selectedIDsTodownload,workslistFromserver} = this.state;
    const selectedIndex = selectedIDsTodownload.indexOf(id);
    let newselectedIDsTodownload = [];
    if (selectedIndex === -1) {
      newselectedIDsTodownload = newselectedIDsTodownload.concat(selectedIDsTodownload, id);
    } else if (selectedIndex === 0) {
      newselectedIDsTodownload = newselectedIDsTodownload.concat(selectedIDsTodownload.slice(1));
    } else if (selectedIndex === selectedIDsTodownload.length - 1) {
      newselectedIDsTodownload = newselectedIDsTodownload.concat(selectedIDsTodownload.slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedIDsTodownload = newselectedIDsTodownload.concat(
        selectedIDsTodownload.slice(0, selectedIndex),
        selectedIDsTodownload.slice(selectedIndex + 1)
      );
    }
    var minstatus = 4;
    newselectedIDsTodownload.map((inid)=>{
      workslistFromserver.map((work)=>{
        if(work.id==inid && work.status<minstatus){
          minstatus = work.status;
        }
      })
    });    
    this.setState({downloadfilecoinstatus:minstatus});
    if(workslistFromserver.length===newselectedIDsTodownload.length)
    {
      this.setState({
        selectedIDsTodownload:newselectedIDsTodownload,
        selecAlltoDownload:true
      });
    }
    else{
      this.setState({
        selectedIDsTodownload:newselectedIDsTodownload,
        selecAlltoDownload:false
      });
    }
  };

  downloadOneFromFileCoinimage =id=>(event)=>{
    const {toggleitem} = this.state;
    Object.entries(toggleitem).map(item => {
      toggleitem[item[0]] = false;
    });
    this.setState({toggleitem:toggleitem});

    let newselectedIDsTodownload =new Array();
    newselectedIDsTodownload.push(id);
    this.setState({
      selectedIDsTodownload:newselectedIDsTodownload,
      DownloadArtworkModal:true,
      downloadfromFilecoin:true,
      downloadfromCache:false,
    });
  }

  downloadOneFromCacheimage = id =>(event)=>{
    const {toggleitem} = this.state;
    Object.entries(toggleitem).map(item => {
      toggleitem[item[0]] = false;
    });
    this.setState({toggleitem:toggleitem});
    let newselectedIDsTodownload =new Array();
    newselectedIDsTodownload.push(id);
    this.setState({
      selectedIDsTodownload:newselectedIDsTodownload,
      DownloadArtworkModal:true,
      downloadfromFilecoin:false,
      downloadfromCache:true,
    });
  }

  selectArtworkToDownload=(event)=>{
    this.setState(({
      ArtworkSelectModal:true
    }))
  }

  downloadByIdsFromCache = (event)=>{
    const {language, selectedIDsTodownload} =this.state
    if(selectedIDsTodownload.length>0)
    {
      this.setState(({
        ArtworkSelectModal:false,
        DownloadArtworkModal:true,
        downloadfromCache:true,
        downloadfromFilecoin:false,
      }));
    }
    else{
      this.setState({
        Alertmodal:true,
        alertTitle:eval(language).error,
        alertContent:eval(language).selectartworktodownloademessage,
      })
    } 
  }

  downloadByIdsFromFileCoin = (event)=>{
    const {language, selectedIDsTodownload} =this.state
    if(selectedIDsTodownload.length>0)
    {
      this.setState(({
        ArtworkSelectModal:false,
        DownloadArtworkModal:true,
        downloadfromCache:false,
        downloadfromFilecoin:true,
      }));
    }
    else{
      this.setState({
        Alertmodal:true,
        alertTitle:eval(language).error,
        alertContent:eval(language).selectartworktodownloademessage,
      })
    } 
  }

  handleDownload =(event)=>{
    const {downloadfromCache, downloadfromFilecoin, selectedIDsTodownload, artworkId, language} = this.state;
    if(downloadfromCache)
    {    
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token;
      var ArtworkImages=[];
      selectedIDsTodownload.forEach(item=>{
           var temp={};
           temp.Id = item;
           ArtworkImages.push(temp);
      })
      var  data = JSON.stringify({"ArtworkImages":ArtworkImages}); 
      
      var config = {
          method: 'post',           
          url: `${baseurl}/artworks/${artworkId}/image_download/cache/selected`,
          headers: { 
           'Authorization': 'Bearer ' + token,
           'Content-Type': 'application/json'
          },
          data : data
       };
       axios(config)
       .then((response)=>{
       
          this.setState({
            alertTitle:eval(language).downloadsuccessModalTitle,
            alertContent:eval(language).downloadsuccessModalContent,
            DownloadArtworkModal:false,
            Alertmodal:true,
            selectedIDsTodownload:[],
            downloadfilecoinstatus:4,
            DownloadArtworkModal:false,
            downloadfromCache:false,
            downloadfromFilecoin:false,
            selecAlltoDownload:false,
            
          }); 
       }).catch((error)=>{
          this.setState({
            alertTitle:eval(language).downloadsuccessModalTitle,
            alertContent:eval(language).error,
            DownloadArtworkModal:false,
            Alertmodal:true,
           
          }); 
       })

    }

    if(downloadfromFilecoin)
    {
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token;
      var ArtworkImages=[];
      selectedIDsTodownload.forEach(item=>{
           var temp={};
           temp.Id = item;
           ArtworkImages.push(temp);
      })
      var  data = JSON.stringify({"ArtworkImages":ArtworkImages}); 
      var config = {
          method: 'post',           
          url: `${baseurl}/artworks/${artworkId}/image_download/selected`,
          headers: { 
           'Authorization': 'Bearer ' + token,
           'Content-Type': 'application/json'
          },
          data : data
       };
       axios(config)
       .then((response)=>{
          this.setState({
            alertTitle:eval(language).downloadsuccessModalTitle,
            alertContent:eval(language).downloadsuccessModalContent,
            Alertmodal:true,
            selectedIDsTodownload:[],
            downloadfilecoinstatus:4,
            DownloadArtworkModal:false,
            downloadfromCache:false,
            downloadfromFilecoin:false,
            selecAlltoDownload:false,
          }); 
       }).catch((error)=>{
          this.setState({
            alertTitle:eval(language).downloadsuccessModalTitle,
            alertContent:eval(language).error,
            Alertmodal:true,
          }); 
       })
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

  handleBackImgpage = (event)=>{
    const {currentImgpageCount} = this.state;
    this.setState({
      currentImgpageCount:currentImgpageCount-1
    });
    this.setshowImagedata(currentImgpageCount-1);

  }

  handleNextImgpage = (event)=>{
    const {currentImgpageCount} = this.state;
    this.setState({
      currentImgpageCount:currentImgpageCount + 1
    });
    this.setshowImagedata(currentImgpageCount + 1);
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
      localStorage.setItem("editstate", JSON.stringify(state));
      localStorage.setItem("progress", "edit");
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

  searchbyKeywords = (event)=>{
    event.preventDefault();
    var {filter} = this.state;
    filter.PageNumber = 1;
    this.setState({filter:filter});    
    this.getartistdata(filter);
  }
 
  showArtistDetail = id=>event=>{
    var state = this.state;
    localStorage.setItem("editstate", JSON.stringify(state));
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

  getArtworkDetaildata(id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var config = {
      method: 'get',
      url: `${baseurl}/artworks/${id}/detail`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
          data : {},
      };  
    axios(config)
    .then((response) => {
      
        var artworkdata = response.data.artwork;
        var totalImgCount = artworkdata.images.length;
        var imgPageCount = Math.ceil(totalImgCount / 6);
        console.log(artworkdata)
        this.setState({
            selectedArtistData:response.data.artist,
            artworkId:artworkdata.id,
            Name:artworkdata.name,
            CategoryId:artworkdata.categoryId,
            ImageId:artworkdata.imageId,
            SeasonId:artworkdata.seasonId,
            TintId:artworkdata.tintId,
            Height:artworkdata.height,
            Width:artworkdata.width,
            Status:artworkdata.status,
            Description:artworkdata.description=="null"?"":artworkdata.description,
            OfficeComment:artworkdata.officeComment=="null"?"":artworkdata.officeComment,
            Note:artworkdata.note=="null"?"":artworkdata.note,
            artistID:response.data.artist.id,
            totalImgCount:totalImgCount,
            imgPageCount:imgPageCount,
            blobimagesids:artworkdata.images
        });
        if(totalImgCount > 0)
        {
          this.getImageData(this.state.artworkId, artworkdata.images);
        }
        else
        {
          this.setState({loadimage:false})
        }
        
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

  getImageData(artworkId, images){
   
    var workslistFromserver = new Array();
    var toggleitem = {};
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;

    var index=0;
   
    images.forEach(image=>{
          
      toggleitem[image.id]=false;
      this.setState({toggleitem:toggleitem});
      var config = {
        method: 'get',
        url: `${baseurl}/artworks/${artworkId}/detail/images/${image.id}`,
        headers: { 
          'Authorization': 'Bearer ' + token,
        },
        responseType: 'blob',
        data : {},
      };  
      axios(config)
      .then((response) => {
        index++;
        var temp={};
        let unit = 0;
        let size = image.size;
        var unitlist = ["byte","KB","MB","GB"];
        while(size > 1000)
        {
          unit = unit + 1; 
          size = Math.floor(size / 10)/100;
        }
        temp.id = image.id;
        temp.size = size + unitlist[unit];
        temp.type = image.type;
        temp.image = URL.createObjectURL(response.data);
        temp.data = response.data;
        temp.status = image.status;
        workslistFromserver.push(temp);
        if(index==images.length)
        {
          this.setState({
            workslistFromserver:workslistFromserver,
            loadimage:false
          })
          this.setshowImagedata(1);
        }       
          
      })
      .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
        }
        index++;
        var temp={};
        let unit = 0;
        let size = image.size;
        var unitlist = ["byte","KB","MB","GB"];
        while(size > 1000)
        {
          unit = unit + 1; 
          size = Math.floor(size / 10)/100;
        }
        temp.id = image.id;
        temp.size = size + unitlist[unit];
        temp.type = image.type;
        temp.image = "";
        temp.data = "";
        temp.status = image.status;
        workslistFromserver.push(temp);
        if(index==images.length)
        {
          this.setState({
            workslistFromserver:workslistFromserver,
            loadimage:false
          })
          this.setshowImagedata(1);
        }
      });
    })
  }

  setViewMenu  = id => (event)=>{
    const {toggleitem} = this.state;
    if(!toggleitem[id+""])
    {
      Object.entries(toggleitem).map(item => {
        toggleitem[item[0]] = false;
      });
    }    
    toggleitem[id+""] = !toggleitem[id+""];
    this.setState({toggleitem:toggleitem}); 
  } 

  setshowImagedata(currentImgpageCount){
    const {totalImgCount, imgPageCount, workslistFromserver} = this.state;
    var workslistFromserverToshow = [];
    for(var i=(currentImgpageCount-1) * 6; i<currentImgpageCount * 6; i++)
    {
      if(workslistFromserver[i])
      {
        workslistFromserverToshow.push(workslistFromserver[i]);
      } 
    }
    this.setState({workslistFromserverToshow:workslistFromserverToshow});
  }

  componentDidMount(){
    var state = JSON.parse(localStorage.getItem("editstate"));
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
        artworkId:state.artworkId,
        blobimagesids:state.blobimagesids,    
        dorpboxPath:"",
        uploaddropbox:false,
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
      this.getImageData(state.artworkId, state.blobimagesids);
      localStorage.removeItem("editstate");
    }
    else{
      var path = window.location.href;
      var tokens = path.split("/");
      var id = tokens[tokens.length-1];     
      this.getCategorylist();
      this.getImageList();
      this.getSeasonList();
      this.getTintList();
      this.getArtworkStatusList();
      if(id!=="null")
      {
        this.setState({artworkId:id});
        this.getArtworkDetaildata(id);
      }
    }   
  }

  componentDidUpdate(){
    // const {listOpen} = this.state;
    // if(listOpen){
    //     window.addEventListener('click', this.closeMenu)
    // }
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
   const {artworkId, workslist, language, searchArtistmodal, searchResultModal,totalRecords, pageCount, authorsdata, confirm, categoryList, imageList, seasonList, tintList, artworkStatusList, Alertmodal, workslistFromserverToshow,selectedArtImage,workslistFromserver,dorpboxPath} = this.state;
   const {Name, CategoryId, ImageId, SeasonId, TintId, Width, Height, Status, OfficeComment, Description, Note, dropboxfilename, selectedArtistData,alertTitle, alertContent, DownloadArtworkModal,ArtworkSelectModal, selectedIDsTodownload,SingleArtWorkShowmodal, currentImgpageCount, imgPageCount,toggleitem} = this.state;
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
                <span>{eval(language).artworkname} {Name} </span>
                <span className={confirm?"":"statues"}>{confirm?"":eval(language).editstatus}</span>
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
                            {confirm ? "" : <div style={{marginRight:"25px"}}>                              
                              <Button
                                className="btn btn-detail"
                                onClick={this.handleOpenSearchArtistModal}
                              >
                                {eval(language).changeartist}
                              </Button>
                            </div>}                          
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
                               {artworkId}
                            </div>                     
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).artworkname}
                            </label>
                            <div className='form-input-addnew'>
                                <input type='text' className='form-control-edit' disabled={confirm} value={Name} onChange={this.handleChangeSubmitdata("Name")}/>
                            </div>
                        </Box> 
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).category}
                            </label>
                            <div className='form-input-addnew'>
                                <select type='text' className='form-control-edit select' disabled={confirm} value={CategoryId} onChange={this.handleChangeSubmitdata("CategoryId")}>
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
                                <select type='text' className='form-control-edit select' disabled={confirm} value={ImageId} onChange={this.handleChangeSubmitdata("ImageId")}>
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
                                <select type='text' className='form-control-edit select' disabled={confirm} value={SeasonId} onChange={this.handleChangeSubmitdata("SeasonId")}>
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
                                <select type='text' className='form-control-edit select' disabled={confirm} value={TintId} onChange={this.handleChangeSubmitdata("TintId")}>
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
                                <input type='number' className="size-control-form-edit" disabled={confirm} value={Width} onChange={this.handleChangeSubmitdata("Width")}/><span style={{padding:"0px 10px"}}>mm x</span> <input className="size-control-form-edit" type='number' disabled={confirm} value={Height} onChange={this.handleChangeSubmitdata("Height")}/><span style={{padding:"0px 10px"}}>mm</span>
                            </div>
                        </Box> 
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).conditionStatus}
                            </label>
                            <div className='form-input-addnew'>
                                <select type='text' className='form-control-edit select' disabled={confirm} value={Status} onChange={this.handleChangeSubmitdata("Status")}>
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
                                  
                                  {(workslistFromserver).map(work => (
                                     work.id 
                                     ? 
                                     <div className="work_image_container">
                                        <Avatar
                                          className="work_image_addnew serverimg"
                                          src={work.image}
                                          onClick={this.selectArtworkImage(work.id)}
                                        >
                                          {"Uploading..."}
                                        </Avatar>
                                        
                                        <div style={{textTransform:"uppercase",textAlign:"left"}}>{work.type}</div>
                                        <div style={{textAlign:"left"}}>{work.size}</div>
                                        <div className="top-right" hidden={confirm}>           
                                          <IconButton className="unselectWork" edge="start" color="inherit" onClick={e=>this.deleteWorkimage(work.id)}  aria-label="close">
                                              <CloseIcon/>
                                          </IconButton>
                                        </div>
                                        <div className="download-icon" hidden={!confirm}>           
                                          <IconButton className="downloadWork" edge="start" color="inherit" aria-label="download" onClick={this.setViewMenu(work.id)}>
                                              <GetAppIcon/>
                                          </IconButton>
                                        </div>
                                        <div className="download-menu" hidden={!toggleitem[work.id+""]}>
                                        <Box>
                                          <Button className="btn btn-uploadimage" onClick={this.downloadOneFromCacheimage(work.id)} >
                                            {eval(language).downloadcache}
                                          </Button>
                                          </Box>
                                          <Box>
                                            <Button className="btn btn-uploadimage" disabled={work.status!=4} onClick={this.downloadOneFromFileCoinimage(work.id)}>
                                              {eval(language).downloadfilecoin}
                                            </Button>
                                          </Box>    
                                        </div>
                                     </div>                                     
                                     :
                                     ""
                                  ))}
                                  {(workslist).map(work => (
                                     work.file 
                                     ? 
                                     <div className="work_image_container">
                                        <img className="work_image_addnew" src={work.file} alt="Uploading"/>
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
                                <div hidden={!confirm}>
                                  <Button className="btn btn-new"
                                    onClick={this.selectArtworkToDownload}
                                  >
                                  {eval(language).selectanddownload}
                                  </Button>
                                </div> 
                            </div>
                        </Box>
                        <Box className="form-div" hidden={confirm}>
                            <label className='form-label-addnew'>
                            {eval(language).dropboxPath}
                                {/* <Button onClick={this.handleUploadFromDropbox}  style={{marginTop:"10px"}} className="btn btn-adddata dropboxbtn" >
                                  {eval(language).dropboxPath}
                                </Button>                           */}
                            </label>
                            <div className='form-input-addnew'>
                              <div className='form-control-addnew' style={{marginBottom:"10px", marginTop:"10px"}}>{eval(language).dropboxfoldername} <input type='text' className='form-control-addnew' value={dorpboxPath} onChange={this.handleChangeSubmitdata("dorpboxPath")}/></div>
                              <div className='form-control-addnew' style={{marginBottom:"10px", marginTop:"10px"}}>{eval(language).dropboxfilename} <input type='text' className='form-control-addnew' value={dropboxfilename} onChange={this.handleChangeSubmitdata("dropboxfilename")}/></div>
                            </div>
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).description}
                            </label>
                            <div className="form-textarea-addnew">
                                <textarea rows="4" className="form-control-edit" disabled={confirm}  value={Description} onChange={this.handleChangeSubmitdata("Description")}></textarea>
                            </div>
                        </Box>
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).backofficeComment}
                            </label>
                            <div className="form-textarea-addnew">
                                <textarea rows="4" className="form-control-edit" disabled={confirm}  value={OfficeComment} onChange={this.handleChangeSubmitdata("OfficeComment")}></textarea>
                            </div>                        
                        </Box>              
                        <Box className="form-div">
                            <label className='form-label-addnew'>
                            {eval(language).note}
                            </label>
                            <div className="form-textarea-addnew">
                                <textarea rows="4" className="form-control-edit" disabled={confirm} value={Note} onChange={this.handleChangeSubmitdata("Note")}></textarea>
                            </div>                        
                        </Box>  
                    </div>
                    <div style={{position:"relative", height:"50px"}}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                        >
                        <div>
                          {confirm ? "":
                        <Button className="btn btn-danger"
                            onClick={this.handleDelete}
                            style={{padding:"10px 30px"}}
                          >
                          {eval(language).delete}                        
                        </Button>}
                        </div>
                        <div>
                          <Button className="btn btn-back"
                            onClick={this.handleGoback}
                            style={{padding:"10px 30px"}}
                          >
                          {eval(language).back}                        
                          </Button>
                          <Button className="btn btn-new" style={{padding:"10px 30px"}} onClick={this.handleConfirm}>
                            {confirm ? eval(language).edit : eval(language).save}
                          </Button>
                        </div>
                        </Box>                     
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
          className="select-artworkmodal"
          open={ArtworkSelectModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleCloseSelectArtworkModal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          disableBackdropClick
       >
        <DialogTitle id="alert-dialog-slide-title" style={{textAlign:"center", fontWeight:"600"}}>{eval(language).selectartworktodownload}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box  fontWeight="600">
              <Button onClick={this.handleSelectAll} className="btn btn-selectall">
                {eval(language).selectall}
              </Button>
              <Button onClick={this.handleUnselectAll} className="btn btn-resetartwork">
                {eval(language).reset}
              </Button>
            </Box>
            <Box>
            <div style={{paddingLeft:"50px"}} className="workList">
              {(workslistFromserverToshow).map(work => (
                  work.id 
                  ? 
                  <div className="work_image_container">
                     <Avatar
                        className="work_image_addnew"
                        src={work.image}
                      >
                        {"Uploading..."}
                      </Avatar>              
                    <div style={{textTransform:"uppercase",textAlign:"left"}}>{work.type}</div>
                    <div style={{textAlign:"left"}}>{work.size}</div>
                    <div className="top-right">           
                      <IconButton className="unselectWork" disabled={work.status!=4} edge="start" color="inherit" onClick={(event) => this.handleSelectOne(event, work.id)}  aria-label="close">
                        {selectedIDsTodownload.indexOf(work.id) !== -1 ? <CheckCircleIcon /> : <FiberManualRecordIcon />}
                      </IconButton>
                    </div>
                    <div>
                    {/* {work.status!=4 ? <span style={{color:"#EA5514", fontSize:"12px", fontWeight:"600"}}>{eval(language).downloadfilecoinstatus[work.status-1]}</span> : <span style={{color:"white"}}>A</span>} */}
                    </div>                    
                  </div>                                     
                  :
                  ""
              ))}
            </div>
            </Box>
            <Box
            display="flex"
            justifyContent="space-between"
          >
            <div>              
            <Button className="btn btn-backimg"
              onClick={this.handleBackImgpage}
              disabled = {currentImgpageCount==1}
              >
              {eval(language).backbtn}                        
            </Button>
            </div>
            <div>
              <Box>
                <Button className="btn btn-nextimg" 
                  onClick={this.handleNextImgpage}
                  disabled = {currentImgpageCount==imgPageCount} >
                {eval(language).nextbtn}
               </Button>
              </Box>              
            </div>
          </Box>

          </DialogContentText>
          <Box
            display="flex"
            justifyContent="space-between"
          >
            <div>              
            <Button className="btn btn-back"
                onClick={this.handleCloseSelectArtworkModal}              >
              {eval(language).close}                        
            </Button>
            </div>
            <div>
              <Box>
                <Button className="btn btn-uploadimage" disabled={this.state.selectedIDsTodownload.length==0} onClick={this.downloadByIdsFromCache} >
                {eval(language).downloadcache}
               </Button>
              </Box>
              <Box>
                <Button className="btn btn-uploadimage" disabled={this.state.selectedIDsTodownload.length==0} onClick={this.downloadByIdsFromFileCoin}>
                  {eval(language).downloadfilecoin}
                </Button>
              </Box>              
            </div>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
          className="artworkshow-modal"
          open={SingleArtWorkShowmodal}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleCloseSingleArtWorkShowmodal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
       >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box margin="10px 28px" fontWeight="600" style={{textTransform:"uppercase"}}>{selectedArtImage.type}</Box>
            <Box margin="10px 28px" fontWeight="600" >{selectedArtImage.size}</Box>  
            <Box style={{width:"700px", margin:"auto"}}><img style={{width:"100%", borderRadius:"4px"}} src={selectedArtImage.image}/></Box>   
          </DialogContentText>
          <Box
            display="flex"
            justifyContent="space-between"
          >
            <div>              
            <Button className="btn btn-back"
                onClick={this.handleCloseSingleArtWorkShowmodal}              >
              {eval(language).close}                        
            </Button>
            </div>
            <div>
              <Box>
                <Button className="btn btn-uploadimage" onClick={this.downloadOneFromCacheimage(selectedArtImage.id)} >
                {eval(language).downloadcache}
               </Button>
              </Box>
              <Box>
                <Button className="btn btn-uploadimage" disabled={selectedArtImage.status!=4} onClick={this.downloadOneFromFileCoinimage(selectedArtImage.id)}>
                {eval(language).downloadfilecoin}
                </Button>
              </Box>              
            </div>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
          className="download-artworkmodal"
          open={DownloadArtworkModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleCloseDownloadModal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          disableBackdropClick
       >
        <DialogTitle id="alert-dialog-slide-title" style={{textAlign:"center", fontWeight:"600"}}>{eval(language).downloadModalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box textAlign="center" fontWeight="600">
              {eval(language).downloadModalContent}                     
            </Box>
          </DialogContentText>
          <div className="search-btn">  
            <Button onClick={this.handleDownload} className="btn btn-downloadlink">
              {eval(language).download}
            </Button>
          </div>
          <div className="search-btn">
            <Button onClick={this.handleCloseDownloadModal} className="btn btn-close">
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
              {eval(language).close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
          className="spin-modal"
          open={this.state.loadimage}      
          disableBackdropClick
       >
            <CircularProgress />
      </Dialog>
      </Page>
    );
 }
};

export default ArtworkDetail;