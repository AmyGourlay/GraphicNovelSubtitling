import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ButtonBase from '@material-ui/core/ButtonBase';
import uploadImage from './assets/upload-3-256.png';
import uploadedImage from './assets/checkmark-256.png';
import Box from '@material-ui/core/Box';
import parseSRT from 'parse-srt';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true});

const msgArr = [];


const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(29),
    backgroundImage: 'url(${"backgroundImage"})',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  image: {
    paddingTop: '5%',
  },
  button: {
    paddingTop: '3%',
    paddingBottom: '3%'
  },
  resultLink: {
      display: 'none',
      paddingTop: '2%',
  },
  progress: {
    display: 'none',
    paddingTop: '1%',
  },
}));

export default function Album() {
  const classes = useStyles();

  //set state variables
  const[ready, setReady] = useState(false);
  const[progress, setProgress] = useState(0);
  const[video, setVideo] = useState();
  const[subtitle, setSubtitle] = useState([]);
  const[keyframe, setKeyframe] = useState([]);
  const[timestamp, setTimestamp] = useState([]);
  const[videoImage, setVideoImage] = useState(uploadImage);
  const[subtitleImage, setSubtitleImage] = useState(uploadImage);
  const[videoFilename, setVideoFilename] = useState("Upload your video file here (.mp4)");
  const[subtitleFilename, setSubtitleFilename] = useState("Upload your subtitle file here (.srt)");
  const[disabled, setDisabled] = useState(false);


  var re = /(?:\.([^.]+))?$/;
  var cardImage = uploadImage;

  const cards = [
    {
      heading: "Video",
      desc: "Upload your video file here (.mp4)",
      err: videoFilename,
      img: videoImage,
      index: 0,
      action: (e) => {var files = e.target.files; var fileName = files[0].name; if (re.exec(fileName) == ".mp4,mp4") {setVideoFilename(fileName); setVideoImage(uploadedImage); setVideo(e.target.files?.item(0)); document.getElementById("fileErr").style.display = "none"} else {document.getElementById("fileErr").style.display = "block"}} //set video file
    },
    {
      heading: "Subtitle",
      desc: "Upload your subtitle file here (.srt)",
      err: subtitleFilename,
      img: subtitleImage,
      index: 1,
      action: (e) => {var files = e.target.files; var fileName = files[0].name; if (re.exec(fileName) == ".srt,srt") {setSubtitleFilename(fileName); setSubtitleImage(uploadedImage); setSubtitle(e.target.files?.item(0)); document.getElementById("fileErr").style.display = "none"} else {document.getElementById("fileErr").style.display = "block"}} //set subtitle file
    },
  ];

  const load = async() => {
    if(!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    setReady(true);
    //Get number of subtitles from ffmpeg log
    ffmpeg.setLogger(({ type, message }) => {
      console.log("MESSAGE:::" + message);
      if(message.includes("frame="))
      {
          var frameTemp = message.substring(
              message.lastIndexOf("frame"), 
              message.lastIndexOf("fps")
          );
          var frame = frameTemp.match(/\d+/)
          msgArr.splice(0, 1, frame);
      }
    });
  }

  useEffect(() => {
    load();
  //   const timer = setInterval(() => {
  //     setProgress(oldProgress => {
  //       if (oldProgress === 100) {
  //         clearInterval(timer);
  //       }
  //       return Math.min(oldProgress + 0.5, 100);
  //     });
  //   }, 500);
  // return () => {
  //     clearInterval(timer);
  //   };
  }, [progress])


  const convertToKeyframe = async () => {
    // Write the video file to memory 
    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));

    // Read in the subtitle file to memory 
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      var srt = parseSRT(text) //function to parse SRT files
      var subtitleArr = [];
      var timestampArr = [];
      for (var i=0; i<srt.length; i++) {
        subtitleArr.push(srt[i].text) //array of subtitle text
        timestampArr.push(srt[i].start) //array of timestamp data
      } 
      setSubtitle(subtitleArr);
      setTimestamp(timestampArr);
    };
    reader.readAsText(subtitle)

    //FFmpeg code was adapted from: https://superuser.com/questions/669716/how-to-extract-all-key-frames-from-a-video-clip
    //force keyframes every 2 seconds
    await ffmpeg.run('-i', 'video.mp4', '-force_key_frames', 'expr:gte(t,n_forced*2)', '-preset', 'ultrafast', 'video1.mp4');
    //pull and save keyframes from video 
    await ffmpeg.run('-skip_frame', 'nokey', '-i', 'video1.mp4', '-vsync', '0', '-r', '30', '-f', 'image2', 'thumbnails-%02d.jpeg');

    //read the result
    const data = [];
    for (var i=1; i<9; i++) {
        data.push(ffmpeg.FS('readFile', 'thumbnails-0' + i + '.jpeg'));
    }
    for (var i=10; i<msgArr; i++) {
      data.push(ffmpeg.FS('readFile', 'thumbnails-' + i + '.jpeg'));
    }
    
    //create a URL
    const url = [];
    for (var i=0; i<data.length; i++) {
        url.push(URL.createObjectURL(new Blob([data[i].buffer])))
    }
    const keyframeArr = [];
    for (var i=0; i<data.length; i++) {
        keyframeArr.push(url[i])
    }
    setKeyframe(keyframeArr);
    console.log("MSGARR" + msgArr);
  }

  const call = async() => {
      console.log("VIDEO" + video)
      console.log("SUBTITLE" + subtitle)
      if (video == undefined || subtitle == undefined) {
        // alert("No file selected")
        document.getElementById('errorMsg').style.display = 'block';
      }
      else {
        //document.getElementById('fileBtn').disabled = 'true';
        setDisabled(true)
        document.getElementById('errorMsg').style.display = 'none';
        document.getElementById('circleProgress').style.display = 'block';
        document.getElementById('convertBtn').style.display = 'none';
        await convertToKeyframe();
        document.getElementById('circleProgress').style.display = 'none';
        document.getElementById('resultLink').style.display = 'block';
      }
  }

  return ready ? (

    <div className="App">
      {/* { video && <video
        controls
        width="250"
        src={URL.createObjectURL(video)}>

      </video>} */}

      <React.Fragment>
        <main>
          <Container className={classes.cardGrid} maxWidth="md">
            <Typography id="fileErr" style={{color: "red", paddingBottom: "2%", textAlign: "center", display: "none"}}>Incorrect file type uploaded. Please try again.</Typography>
            <Grid container spacing={10}>
              {cards.map((card) => (
                <Grid item key={card} xs={12} sm={12} md={6}>
                  <Card className={classes.card}>
                    <ButtonBase className={classes.image} type="file" variant="contained" component="label" disabled={disabled}>
                      <img className={classes.img} alt="complex" src={card.img} />
                      {/* {video && <video controls width="250" src={URL.createObjectURL(video)}></video>} */}
                      <input id="fileBtn" type="file" hidden onChange={card.action}/>
                    </ButtonBase>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.heading}
                      </Typography>
                      {/* <Typography>
                        {card.desc}
                      </Typography> */}
                      <Typography>
                        {card.err}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <div className={classes.button}>
              <Box textAlign='center'>
                <Typography id="errorMsg" style={{color: "red", paddingBottom: "2%", display: "none"}}>Please upload both a video and subtitle file before proceding.</Typography>
                <Button id="convertBtn" variant="contained" color="primary" style={{justifyContent: 'center', paddingTop: "10"}} onClick={call} >
                    Convert
                </Button>
                <Box id="circleProgress" style={{display: "none"}}>
                  <CircularProgress/>
                  <Typography>Please be patient. The conversion may take serveral minutes.</Typography>
                </Box>
                <Box id="resultLink" className={classes.resultLink}>
                  <Typography style={{paddingBottom: "2%"}}>Conversion successful! Click here to view your graphic novel.</Typography>
                  <Link to={{ pathname:"/result", state: {keyframe: keyframe, subtitle: subtitle, timestamp: timestamp}}}>
                      <Button variant="contained" color="primary" style={{justifyContent: 'center'}}>
                          Ready
                      </Button>
                  </Link>
                </Box>
              </Box>
            </div>
            {/* <LinearProgress id="progress" className={classes.progress} variant="determinate" value={progress} /> */}
          </Container>
        </main>
      </React.Fragment>
    </div>
  )
    :
    (
      <p>Loading...</p>
    );
}