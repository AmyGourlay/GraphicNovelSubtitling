import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import ButtonBase from '@material-ui/core/ButtonBase';
import Box from '@material-ui/core/Box';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import leftArrow from './assets/arrow-80-256.png';
import rightArrow from './assets/arrow-57-256.png';
import {useRef} from 'react';
import domtoimage from 'dom-to-image-more';
import layoutImg1 from './assets/Layout1Small.png';
import layoutImg2 from './assets/Layout2Small.png';
import layoutImg3 from './assets/Layout3SmallResize.png';
import TextField from '@material-ui/core/TextField';
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true});

var imgUrl = {leftArrow};
const ref = React.createRef();

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(20),
    backgroundImage: 'url(${"backgroundImage"})',
    '@media print' : {
      display: 'none',
    }
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  image: {
    paddingTop: '5%',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    width: '100%',
  },
  comic: {
    width: 700
  },
  gridList: {
    width: 600,
    height: 790,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  button: {
    paddingTop: '3%',
    paddingBottom: '3%',
    padding: '1%'
  },
  arrow: {
    blockSize: '1%',
    paddingTop: '20%',
    paddingBottom: '20%',
    outline: 'none',
  },
  heading: {
    WebkitTextFillColor: 'black'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  img: {
    '@media print' : {
      pageBreakAfter: 'always',
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: '15',
      top: '50%',
      left: '50%',
      margin: '-150px 0 0 -150px'
      
    },
  },
  title: {
    color: 'white',
    fontSize: 12,
    whiteSpace: 'normal !important',
    overflow: 'visible'
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    whiteSpace: 'normal !important'
  },
  hiddenImage: {
    display: 'none',
    '@media print' : {
      display: 'block',
      position: 'absolute',
    },
    
  },
  novelTitle: {
    display: 'none',
    '@media print' : {
      pageBreakAfter: 'always',
      display: 'block',
      fontSize: '500%',
      textAlign: 'center',
      paddingTop: '45%',
    }
  },
  textField: {
    '@media print' : {
      display: 'none'
    }
  }
}));

//Set subtitle text
const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF",
  }
})(Typography);


export default function Album() {
  
  const componentRef = useRef();

  const classes = useStyles();
  const location = useLocation();

  //set state variables
  const[pageReady, setPageReady] = useState(0);
  const[newLayout, setnewLayout] = useState(0);
  const[newPlacement, setnewPlacement] = useState(0);
  const[pdfImage, setPdfImage] = useState([]);
  const[title, setTitle] = useState('My Graphic Novel');
  const[disabled, setDisabled] = useState(false);


  //get data from upload page
  const {keyframe, subtitle, timestamp} = location.state;
  const tileData = [];

  console.log("K LENGTH: " + keyframe.length)
  console.log("T LENGTH: " + timestamp.length)

  //create array of undefined values for each keyframe
  for (var i=0; i<(keyframe.length+1); i++)
  {
    tileData.push(undefined)
  }

  //create subtitle array
  for (var i=0; i<timestamp.length; i++) { //for each subtitle
    for (var j=0; j<keyframe.length; j++) { //for each keyframe
      if ((timestamp[i] >= j*2) && (timestamp[i] < (j+1)*2)) { //if subtitle within keyframe timestamp
        while (tileData[j] != undefined) { //while position already filled, move forward 1
          j++
        }
        tileData.splice(j, 1, subtitle[i]) //replace undefined with subtitle
      }
    }
  }

  //set different layouts
  const l1 = [1, 1, 1, 1, 1, 1]
  const l1_2 = [1, 1, 1, 1, 1, 1, 1, 1]
  const l2 = [2, 1, 1, 2]
  const l2_2 = [2, 1, 1, 2, 1, 1]
  const l3 = [2, 1, 1, 1, 1, 1, 2]
  let layout = []
  let col = 2
  let height = 190
  let width = 600

  //change properties depending on layout type
  if (newLayout == 0) {
    if (newPlacement == 0) {
      layout = l1_2
      height = 190
    }
    else if (newPlacement == 1)
    {
      layout = l1
      height = 250
    }
    col = 2
    width = 600
    console.log("SET LAYOUT1")
  }
  if (newLayout == 1) {
    if (newPlacement == 0) {
      layout = l2_2
      height = 190
    }
    else if (newPlacement == 1)
    {
      layout = l2
      height = 250
    }
    col = 2
    width = 600
    console.log("SET LAYOUT2")
  }
  if (newLayout == 2) {
    if (newPlacement == 0) {
      height = 250
    }
    else if (newPlacement == 1)
    {
      height = 250
    }
    layout = l3
    col = 3
    width = 700
    console.log("SET LAYOUT3")
  }

  let page = [];
  const final = [];
  const noOfPagesTemp = keyframe.length/layout.length
  const noOfPages = Math.ceil(noOfPagesTemp)

  //create mappable array depending on number of pages and panels per page
  for (var j=(noOfPages-noOfPages); j<noOfPages; j++) {
    for (var i=0; i<layout.length; i++) {
      final.push({
        img: keyframe[i+(j*layout.length)],
        text: tileData[i+(j*layout.length)],
        layout: layout[i]
      })
    }
  }

  //fill the page array with current page data
  for (var i=(layout.length*pageReady); i<(layout.length*pageReady)+layout.length; i++) {
    console.log("FINAL: " * final[i])
    page.push(final[i])
  }

  //function to get next page
  const changePageForward = () => {
    if (pageReady == (noOfPages-1)) { //if on last page, don't change
      setPageReady(pageReady);
    }
    else{
      setPageReady(pageReady+1);
    } 
  }
  
  //function to get previous page
  const changePageBackward = () => {
    if (pageReady == 0) { //if on last page, don't change
      setPageReady(pageReady);
    }
    else{
      setPageReady(pageReady-1);
    }
  }

  //function to set Layout 1
  const layout1 = () => {
    document.getElementById("bb1").style.border = "3px solid black"
    document.getElementById("bb2").style.border = "none"
    document.getElementById("bb3").style.border = "none"
    setnewLayout(0)
    setPageReady(0)
    console.log("LAYOUT1")
  }

  //function to set Layout 2
  const layout2 = () => {
    document.getElementById("bb1").style.border = "none"
    document.getElementById("bb2").style.border = "3px solid black"
    document.getElementById("bb3").style.border = "none"
    setnewLayout(1)
    setPageReady(0)
    console.log("LAYOUT2")
  }

  //function to set Layout 3
  const layout3 = () => {
    document.getElementById("bb1").style.border = "none"
    document.getElementById("bb2").style.border = "none"
    document.getElementById("bb3").style.border = "3px solid black"
    setnewLayout(2)
    setPageReady(0)
    console.log("LAYOUT3")
  }

  //function to set subtitle placement 1
  const placement1 = () => {
    setnewPlacement(1)
    setPageReady(0)
    document.getElementById('grid1').style.display = 'none';
    document.getElementById('grid2').style.removeProperty('display');
    document.getElementById("overlapBtn").style.border = "none"
    document.getElementById("belowBtn").style.border = "3px solid black"
    console.log("PLACEMENT" + newPlacement)
  }


  //function to set subtitle placement 2
  const placement2 = () => {
    setnewPlacement(0)
    setPageReady(0)
    document.getElementById('grid2').style.display = 'none';
    document.getElementById('grid1').style.removeProperty('display');
    document.getElementById("overlapBtn").style.border = "3px solid black"
    document.getElementById("belowBtn").style.border = "none"
    console.log("PLACEMENT" + newPlacement)
  }
  
  
  const imgArr = []

  const call = async() => {
    setDisabled(true)
    setPageReady(0)
    await toPNG()
    setDisabled(false)
    setPageReady(0)
  }

  //function to print hidden images on the page for printing
  const toPNG = async () => {

    await setPageReady(0)
    var node
    const img = new Array()
    var hiddenDiv = document.getElementById('hiddenImage')
    hiddenDiv.innerHTML = '';
    var title = document.getElementById('standard-helperText')

    for(var i=0; i<(noOfPages); i++) {
      await setPageReady(i)
      console.log("PAGE READY: " + pageReady)

      if (newPlacement == 0) { 
        node = document.getElementById('grid1');
      }
      else if (newPlacement == 1) {
        node = document.getElementById('grid2');
      }

      console.log("NODE: " + node)

      //create images of each page
      await domtoimage.toPng(node)
        .then(function (dataUrl) {
            console.log("IN PNG")
            img[i] = new Image;
            img[i].src = dataUrl;
            document.getElementById('hiddenImage').appendChild(img[i]).setAttribute('width', '100%')
            imgArr.push(img[i])
            
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
      });

      console.log("OUT PNG")
    }
    console.log("OUT LOOP")
    setPdfImage(imgArr)
    window.print()
  }

  return (

    <div className="App">
      <React.Fragment>
        <main>
          <Box style={{paddingTop: "2%"}}>
          <TextField
            className={classes.textField}
            style={{paddingTop: "0%", width: "30%"}}
            id="standard-helperText"
            label="Name your graphic novel here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={disabled}
          />
          <Typography className={classes.novelTitle}>{title}</Typography>
          <Container className={classes.cardGrid} >
            <div className={classes.root} >
              <input type="image" id="image" className={classes.arrow} alt="Login" src={leftArrow} onClick={changePageBackward} disabled={disabled}></input>
              <GridList id="grid1" ref={ref} cellHeight={height} style={{width: width}} cols={col} >
              {page.map((page) => ( 
                <GridListTile cols={page.layout || 1}>
                  <img src={page.img}/>
                  <GridListTileBar  key={page.text}
                      title={page.text}
                      classes={{
                        root: classes.titleBar,
                        title: classes.title,
                      }}
                      style={{position: "absolute", width: "100%"}}
                    />
                </GridListTile>
                ))}
                </GridList>
                <GridList id="grid2" style={{display: "none", width: width}} cellHeight={height} cols={col}>
                {page.map((page) => ( 
                <GridListTile key={page.text} cols={page.layout || 1}>
                      <Card variant="outlined" style={{border: 'none', borderRadius: 0, pointerEvents: 'none'}}>
                        <CardActionArea>
                          <CardMedia
                            style={{ height: 185 }}
                            image={page.img}
                            title={page.text}
                          />
                          <CardContent style={{ height: 68, backgroundColor: 'black'}}>
                            <WhiteTextTypography
                              variant="body2"
                              component="p"
                            >
                              {page.text}
                            </WhiteTextTypography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </GridListTile>
                ))}
              </GridList>
              <input type="image" id="image" className={classes.arrow} alt="Login" src={rightArrow} onClick={changePageForward} disabled={disabled}></input>
            </div>
            <ListSubheader style={{textAlign: "center", paddingBottom: '2%'}} className={classes.heading}>Page {pageReady+1} / {noOfPages}</ListSubheader>
            <Grid style={{border: '1px solid black'}} container spacing={4}>
              <Grid item xs={5}>
                <Typography style={{paddingBottom: "0%", fontSize: '30px'}}>Layout Options:</Typography>
              </Grid>
              <Grid item xs>
                <Typography style={{paddingBottom: "0%", fontSize: '30px'}}>Subtitle Options:</Typography>
              </Grid>
              <Grid item xs>
                <Typography style={{paddingBottom: "0%", fontSize: '30px'}}>Other Options:</Typography>
              </Grid>
              <Grid item xs={5}>
                <div style={{paddingBottom: "0%"}}>
                  <ButtonBase id="bb1" variant="contained" color="primary" style={{marginRight: 10, border: "3px solid black"}} onClick={layout1} disabled={disabled}>
                    <img className={classes.img} alt="complex" src={layoutImg1} />
                  </ButtonBase>
                  <ButtonBase id="bb2" variant="contained" color="primary" style={{marginRight: 10}} onClick={layout2} disabled={disabled}>
                    <img src={layoutImg2} />
                  </ButtonBase>
                  <ButtonBase id="bb3" ariant="contained" color="primary" style={{marginRight: 10}} onClick={layout3} disabled={disabled}>
                    <img src={layoutImg3} />
                  </ButtonBase>
                </div>
              </Grid>
              <Grid item xs>
                <div style={{paddingBottom: '0%'}}>
                  <div style={{paddingBottom: '5%'}}>
                    <Button id="overlapBtn" variant="contained" color="primary" style={{marginRight: 5, border: "3px solid black"}} onClick={placement2} disabled={disabled}>
                      Subtitle Overlap
                    </Button>
                  </div>
                  <Button id="belowBtn" variant="contained" color="primary" style={{marginRight: 5}} onClick={placement1} disabled={disabled}>
                    Subtitle Below
                  </Button>
                </div>
              </Grid>
              <Grid item xs>
                <div>
                  <div style={{paddingBottom: '5%'}}>
                    <Button variant="contained" color="primary" style={{marginRight: 5}} onClick={call} disabled={disabled}>
                      Create a PDF
                    </Button>
                  </div>
                  <Link className={classes.linkColour} to="/" exact key="index" disabled={disabled}>
                    <Button variant="contained" color="primary" style={{marginRight: 5}} disabled={disabled}>
                        Create another graphic novel
                    </Button>
                  </Link>
                </div>
              </Grid>
            </Grid>
          </Container>
          </Box>
        </main>
        <div id="hiddenImage" className={classes.hiddenImage}>
        </div>
      </React.Fragment>
    </div>
  )
    
}