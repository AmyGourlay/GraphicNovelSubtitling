import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import {parseSync} from 'subtitle';
import fs from 'fs';
import parseSRT from 'parse-srt';
import Result from './Result';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import leftArrow from './assets/arrow-80-256.png';
import rightArrow from './assets/arrow-57-256.png';
import {exportComponentAsJPEG, exportComponentAsPDF} from 'react-component-export-image';
import {useRef} from 'react';
import { PDFDownloadLink, Document, Page, View, Text, Image as ImagePDF, Canvas } from '@react-pdf/renderer'
import html2canvas from 'html2canvas';
import domToPdf from 'dom-to-pdf';
import domtoimage from 'dom-to-image-more';
import Pdf from "react-to-pdf";
import {jsPDF} from "jspdf";
import layoutImg1 from './assets/Layout1Small.png';
import layoutImg2 from './assets/Layout2Small.png';
import layoutImg3 from './assets/Layout3SmallResize.png';
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
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(20),
    backgroundImage: 'url(${"backgroundImage"})',
    '@media print' : {
      // display: 'none',
      // '@page' : {
      //   margin: '50px'
      // }
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
    // margin: 'auto',
    // display: 'block',
    // maxWidth: '100%',
    // maxHeight: '100%',
    // objectFit: 'cover'
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
    // justifyContent: 'center',
    // paddingLeft: '100',
    // paddingBottom: '100'
    height: '100'
  },
  frame: {

  },
  tileImg: {
    width: '100%',
    height: '100%'
  },
  textTile: {
    position: 'absolute'
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
    console.log("LAYOUT1")
  }

  //function to set Layout 2
  const layout2 = () => {
    document.getElementById("bb1").style.border = "none"
    document.getElementById("bb2").style.border = "3px solid black"
    document.getElementById("bb3").style.border = "none"
    setnewLayout(1)
    console.log("LAYOUT2")
  }

  //function to set Layout 3
  const layout3 = () => {
    document.getElementById("bb1").style.border = "none"
    document.getElementById("bb2").style.border = "none"
    document.getElementById("bb3").style.border = "3px solid black"
    setnewLayout(2)
    console.log("LAYOUT3")
  }

  //function to set subtitle placement
  const placement = () => {
    if (newPlacement == 0) {
      setnewPlacement(1)
      document.getElementById('grid1').style.display = 'none';
      document.getElementById('grid2').style.removeProperty('display');
      document.getElementById("overlapBtn").style.border = "none"
      document.getElementById("belowBtn").style.border = "3px solid black"
    } 
    else if (newPlacement == 1) {
      setnewPlacement(0)
      document.getElementById('grid2').style.display = 'none';
      document.getElementById('grid1').style.removeProperty('display');
      document.getElementById("overlapBtn").style.border = "3px solid black"
      document.getElementById("belowBtn").style.border = "none"
    }
    console.log("PLACEMENT" + newPlacement)
  }
  

  // html2canvas(document.querySelector("#grid1")).then(canvas => {
  //   img = canvas.toDataURL("image/png")
  // });

  // var node = document.getElementById('grid1');
 
  // domtoimage.toPng(node)
  //   .then(function (dataUrl) {
  //       //img = new Image();
  //       img.src = dataUrl;
  //       document.body.appendChild(img);
  //       // setPdfImage(img)
  //   })
  //   .catch(function (error) {
  //       console.error('oops, something went wrong!', error);
  // });

  

  const imgArr = []

  const call = async() => {
    await pdfFunction()
    await pdfSave()
  }

  const pdfPage = () => {
    for (var i=0; i<2; i++) {
      setPageReady(i)
    }
  }

  const toPNG = () => {

    for(var i=0; i<(noOfPages-1); i++) {
      var node = document.getElementById('grid3');

      domtoimage.toPng(node)
        .then(function (dataUrl) {
            //img = new Image();

          
            setPageReady(i)
            const img = new Image()
            img.src = dataUrl;
            //document.body.appendChild(img).setAttribute('textAlign', 'center')
            // document.body.appendChild("<div style={{paddingBottom: '100'}}>{img}</div>");
            document.getElementById('hiddenImage').appendChild(img).setAttribute('justifyContent', 'center')
            imgArr.push(img)
          

          

            // var doc = new jsPDF()
            // doc.text("Hello world!", 10, 10);
            // doc.addImage(img, 'PNG', 15, 40, 180, 660)
            // doc.save("a4.pdf");
            
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
      });
    }
    setPdfImage(imgArr)
  }

  const pdfFunction = async() => {
    // var element = document.getElementById('grid1');
    // var options = {
    //   filename: 'test.pdf'
    // };
    // domToPdf(element, options, function() {
    //   console.log('done');
    // });
    
    
    // await toPNG()

    
    
    

    // domtoimage.toBlob(document.getElementById('grid1'))
    // .then(function (blob) {
    //     img.push(blob)
    // });
  }


  const pdfSave = () => {
  }

  // doc.setFontSize(40)
  // doc.text(35, 25, 'Paranyan loves jsPDF')
  // doc.addImage(img, 'PNG', 15, 40, 180, 160)
  // doc.save("a4.pdf");

  //setPdfImage(img)

  // document.body.appendChild(img);

  // const MyDoc = () => (
  //   <Document>
  //     <Page>
  //       <Text>Hello</Text>
  //     </Page>
  //   </Document>
  // )

  return (

    <div className="App">
      <React.Fragment>
        <main>
          <Box style={{}}>
          <Container className={classes.cardGrid} >
            <div className={classes.root} >
              <input type="image" id="image" className={classes.arrow} alt="Login" src={leftArrow} onClick={changePageBackward}></input>
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
              <input type="image" id="image" className={classes.arrow} alt="Login" src={rightArrow} onClick={changePageForward}></input>
            </div>
            <ListSubheader style={{textAlign: "center"}} className={classes.heading}>Page {pageReady+1} / {noOfPages}</ListSubheader>
            <Typography style={{paddingBottom: "1%"}}>Layout Options:</Typography>
            <div style={{alignItems: "flex-end", paddingBottom: "2%"}}>
              <ButtonBase id="bb1" variant="contained" color="primary" style={{marginRight: 10, border: "3px solid black"}} onClick={layout1} >
                <img className={classes.img} alt="complex" src={layoutImg1} />
              </ButtonBase>
              <ButtonBase id="bb2" variant="contained" color="primary" style={{marginRight: 10}} onClick={layout2} >
                <img src={layoutImg2} />
              </ButtonBase>
              <ButtonBase id="bb3" ariant="contained" color="primary" style={{marginRight: 250}} onClick={layout3} >
                <img src={layoutImg3} />
              </ButtonBase>
              <Button variant="contained" color="primary" style={{marginRight: 5}} onClick={toPNG} >
                PDF
              </Button>
              <Button variant="contained" color="primary" style={{marginRight: 5}} onClick={() => exportComponentAsJPEG(componentRef, {})} >
                Export As JPEG
              </Button>
              <Link className={classes.linkColour} to="/" exact key="index">
                <Button variant="contained" color="primary" style={{marginRight: 5}}>
                    Create another graphic novel
                </Button>
              </Link>
            </div>
            <Typography style={{paddingBottom: "1%"}}>Subtitle Options</Typography>
            <div>
              <Button id="overlapBtn" variant="contained" color="primary" style={{marginRight: 5, border: "3px solid black"}} onClick={placement} >
                Subtitle Overlap
              </Button>
              <Button id="belowBtn" variant="contained" color="primary" style={{marginRight: 5}} onClick={placement} >
                Subtitle Below
              </Button>
            </div>
            {/* <PDFDownloadLink document={<MyDoc />} fileName="somename.pdf">
              {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
            </PDFDownloadLink>
            <Pdf targetRef={ref} filename="code-example.pdf">
              {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
            </Pdf> */}
          </Container>
          </Box>
          <div id="hiddenImage" className={classes.hiddenImage}>
          </div>
        </main>
        {/* <GridList id="grid3" ref={ref} cellHeight={height} style={{width: width}} cols={col} >
          {final.map((page) => ( 
            <GridListTile id="imgTile" cols={page.layout || 1}>
              <img id="tileImg" src={page.img}/>
              <GridListTileBar id="textTile" key={page.text}
                title={page.text}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
                style={{position: 'absolute'}}
              />
            </GridListTile>
          ))}
        </GridList> */}
      </React.Fragment>
    </div>
  )
    
}