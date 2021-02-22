// import logo from './logo.svg';
// import backgroundImage from './assets/backgroundImage.jpg';
// import './App.css';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import Button from '@material-ui/core/Button';
// <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         { 
//           <Button variant="contained" color="primary">
//             Hello World
//           </Button>
      
//       /*<img src={backgroundImage} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a> */}
//       </header>
//     </div>
//   );
// }

// // function App() {
// //   return (
// //     <Button variant="contained" color="primary">
// //       Hello World
// //     </Button>
// //   );
// // }

// export default App;

import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
//import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import ButtonBase from '@material-ui/core/ButtonBase';
import backgroundImage from './assets/backgroundImage.jpg';
import attachImage from './assets/attach-2-256.png';
import uploadImage from './assets/upload-3-256.png';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
//import {parseSync} from 'subtitle';
//import fs from 'fs';
import SubtitleFile from './assets/DWSubtitles.srt';
import parseSRT from 'parse-srt'

import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log: true});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
    backgroundColor: theme.palette.background.paper,
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
    paddingBottom: '3%'
  }
}));



export default function Album() {
  const classes = useStyles();

  const[ready, setReady] = useState(false);
  const[video, setVideo] = useState();
  const[subtitle, setSubtitle] = useState([]);
  const [keyframe, setKeyframe] = useState([]);

  const cards = [

    {
      heading: "Video",
      desc: "Upload your video file here",
      index: 0,
      action: (e) => setVideo(e.target.files?.item(0))
    },
    {
      heading: "Subtitle",
      desc: "Upload your subtitle file here",
      index: 1,
      action: (e) => setSubtitle(e.target.files?.item(0))
    },
  
  ];

  const load = async() => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const addSubtitles = async () => {
    // Write the subtitle file to memory 
    //ffmpeg.FS('writeFile', 'subtitle.srt', await fetchFile(subtitle));

    //const input = ffmpeg.FS('readfile', './assets/subtitle.srt');

    //parseSync(input)

    //console.log(input);

    
  }


  const convertToKeyframe = async () => {
    // Write the video file to memory 
    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));

    // Write the subtitle file to memory 
    //ffmpeg.FS('writeFile', 'subtitle.srt', await fetchFile(subtitle));

    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      var srt = parseSRT(text)
      console.log(srt)
      console.log(srt.text)
      setSubtitle([srt[0].text, srt[1].text, srt[2].text, srt[3].text, srt[4].text, srt[5].text, srt[6].text, srt[7].text])
      console.log(subtitle)
    };
    reader.readAsText(subtitle)

    //var srt = parseSRT('./assets/DWSubtitles.srt');

    //const srt = [ffmpeg.FS('readFile', 'subtitle.srt')];

    //const input = ffmpeg.FS('readfile', 'subtitle.srt');

    //var fs = require('fs');
    //const parser = require('subtitles-parser');

    //var srt = fs.readFileSync('./assets/DWSubtitles.srt', 'utf8');

    //const input = parser.fromSrt(srt);

    //parseSync(input);

    //console.log(srt);

    //await ffmpeg.run('-i', 'test.mp4', '-i', 'infile.srt', '-c', 'copy', '-c:s', 'mov_text', 'outfile.mp4');
    // Run the FFMpeg command
    //await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'keyframe', 'out.keyframe');
    //code taken from: https://superuser.com/questions/669716/how-to-extract-all-key-frames-from-a-video-clip
    await ffmpeg.run('-skip_frame', 'nokey', '-i', 'video.mp4', '-vsync', '0', '-r', '30', '-f', 'image2', 'thumbnails-%02d.jpeg');

    // Read the result
    const data = [ffmpeg.FS('readFile', 'thumbnails-01.jpeg'), ffmpeg.FS('readFile', 'thumbnails-02.jpeg'), ffmpeg.FS('readFile', 'thumbnails-03.jpeg'), ffmpeg.FS('readFile', 'thumbnails-04.jpeg'), ffmpeg.FS('readFile', 'thumbnails-05.jpeg'), ffmpeg.FS('readFile', 'thumbnails-06.jpeg'), ffmpeg.FS('readFile', 'thumbnails-07.jpeg'), ffmpeg.FS('readFile', 'thumbnails-08.jpeg'), ffmpeg.FS('readFile', 'thumbnails-09.jpeg'),];
    const url = [URL.createObjectURL(new Blob([data[0].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[1].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[2].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[3].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[4].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[5].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[6].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[7].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[8].buffer], { type: 'image' })),];
      
    // Create a URL
    setKeyframe([url[0], url[1], url[2], url[3], url[4], url[5], url[6], url[7], url[8]]);
    
    
  }

  const tileData = [

    {
      img: keyframe[0],
      text: subtitle[0]
    },
    {
      img: keyframe[1],
      text: subtitle[1]
    },
    {
      img: keyframe[2],
      text: subtitle[2]
    },
    {
      img: keyframe[3],
      text: subtitle[3]
    },
    {
      img: keyframe[4],
      text: subtitle[4]
    },
    {
      img: keyframe[5],
      text: subtitle[5]
    },
    {
      img: keyframe[6],
      text: subtitle[6]
    },
    {
      img: keyframe[7],
      text: subtitle[7]
    },
  
  ];

  return ready ? (

    <div className="App">
      {/* { video && <video
        controls
        width="250"
        src={URL.createObjectURL(video)}>

      </video>} */}


      {/* <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} /> */}

      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            {/* <CameraIcon className={classes.icon} /> */}
            <Typography variant="h6" color="inherit" noWrap>
              Graphic Novel Subtitling
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={10}>
              {cards.map((card) => (
                <Grid item key={card} xs={12} sm={12} md={6}>
                  <Card className={classes.card}>
                    <ButtonBase className={classes.image} type="file" variant="contained" component="label">
                      <img className={classes.img} alt="complex" src={uploadImage} />
                      {/* {video && <video controls width="250" src={URL.createObjectURL(video)}></video>} */}
                      {/* if ({card.index} == 0) {
                        <input type="file" hidden onChange={(e) => setVideo(e.target.files?.item(0))}/>
                      } */}
                      <input type="file" hidden onChange={card.action}/>
                    </ButtonBase>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.heading}
                      </Typography>
                      <Typography>
                        {card.desc}
                        {/* {subtitle} */}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <div className={classes.button}>
              <Box textAlign='center'>
                <Button variant="contained" color="primary" style={{justifyContent: 'center'}} onClick={convertToKeyframe}>
                  Convert
                </Button>
              </Box>
              {/* <Box>
                <Typography>
                  {subtitle}
                </Typography>
              </Box> */}
            </div>
            <div className={classes.root}>
              <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                  <ListSubheader component="div">Graphic Novel</ListSubheader>
                </GridListTile>
                {tileData.map((tile) => (
                  <GridListTile key={tile.img}>
                    <img src={tile.img} alt={tile.title} />
                    <GridListTileBar
                      //title={tile.title}
                      subtitle={tile.text}
                      // actionIcon={
                      //   <IconButton aria-label={tile.text} className={classes.icon}>
                      //     {/* <InfoIcon /> */}
                      //   </IconButton>
                      // }
                    />
                  </GridListTile>
                ))}
              </GridList>
            </div>
          </Container>
          {/* <button onClick={convertToKeyframe}>Convert</button> */}
          
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            Something here to give the footer a purpose!
          </Typography>
          <Copyright />
        </footer>
        {/* End footer */}
      </React.Fragment>
    </div>
  )
    :
    (
      <p>Loading...</p>
    );
}

// import React, { useState, useEffect } from 'react';
// import './App.css';
// import { makeStyles } from '@material-ui/core/styles';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import IconButton from '@material-ui/core/IconButton';
// import uploadImage from './assets/upload-3-256.png';

// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// const ffmpeg = createFFmpeg({ log: true });

// function App() {
//   const [ready, setReady] = useState(false);
//   const [video, setVideo] = useState();
//   const [keyframe, setKeyframe] = useState([]);

//   const load = async () => {
//     await ffmpeg.load();
//     setReady(true);
//   }

//   useEffect(() => {
//     load();
//   }, [])

//   const convertToKeyframe = async () => {
//     // Write the file to memory 
//     ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

//     // Run the FFMpeg command
//     //await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'keyframe', 'out.keyframe');
//     await ffmpeg.run('-skip_frame', 'nokey', '-i', 'test.mp4', '-vsync', '0', '-r', '30', '-f', 'image2', 'thumbnails-%02d.jpeg');

//     // Read the result
//     const data = [ffmpeg.FS('readFile', 'thumbnails-01.jpeg'), ffmpeg.FS('readFile', 'thumbnails-02.jpeg'), ffmpeg.FS('readFile', 'thumbnails-03.jpeg'), ffmpeg.FS('readFile', 'thumbnails-04.jpeg'), ffmpeg.FS('readFile', 'thumbnails-05.jpeg'), ffmpeg.FS('readFile', 'thumbnails-06.jpeg'), ffmpeg.FS('readFile', 'thumbnails-07.jpeg'), ffmpeg.FS('readFile', 'thumbnails-08.jpeg'), ffmpeg.FS('readFile', 'thumbnails-09.jpeg'),];
//     const url = [URL.createObjectURL(new Blob([data[0].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[1].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[2].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[3].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[4].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[5].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[6].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[7].buffer], { type: 'image' })), URL.createObjectURL(new Blob([data[8].buffer], { type: 'image' })),];
      
//     // Create a URL
//     setKeyframe([url[0], url[1], url[2], url[3], url[4], url[5], url[6], url[7], url[8]])
    
//   }

//   const useStyles = makeStyles((theme) => ({
//     root: {
//       display: 'flex',
//       flexWrap: 'wrap',
//       justifyContent: 'space-around',
//       overflow: 'hidden',
//       backgroundColor: theme.palette.background.paper,
//     },
//     gridList: {
//       width: 600,
//       height: 790,
//     },
//     icon: {
//       color: 'rgba(255, 255, 255, 0.54)',
//     },
//   }));

//   const tileData = [

//   {
//     img: keyframe[0]
//   },
//   {
//     img: keyframe[1]
//   },
//   {
//     img: keyframe[2]
//   },
//   {
//     img: keyframe[3]
//   },
//   {
//     img: keyframe[4]
//   },
//   {
//     img: keyframe[5]
//   },
//   {
//     img: keyframe[6]
//   },
//   {
//     img: keyframe[7]
//   },

// ];

// const classes = useStyles();

//   return ready ? (
    
//     <div className="App">
//       { video && <video
//         controls
//         width="250"
//         src={URL.createObjectURL(video)}>

//       </video>}


//       <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

//       <h3>Result</h3>

//       <button onClick={convertToKeyframe}>Convert</button>

//       {/* { keyframe && <img src={keyframe[0]} width="250" />}
//       { keyframe && <img src={keyframe[1]} width="250" />}
//       { keyframe && <img src={keyframe[2]} width="250" />}
//       { keyframe && <img src={keyframe[3]} width="250" />}
//       { keyframe && <img src={keyframe[4]} width="250" />}
//       { keyframe && <img src={keyframe[5]} width="250" />}
//       { keyframe && <img src={keyframe[6]} width="250" />}
//       { keyframe && <img src={keyframe[7]} width="250" />}
//       { keyframe && <img src={keyframe[8]} width="250" />} */}

    //   <div className={classes.root}>
    //   <GridList cellHeight={180} className={classes.gridList}>
    //     <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
    //       <ListSubheader component="div">Graphic Novel</ListSubheader>
    //     </GridListTile>
    //     {tileData.map((tile) => (
    //       <GridListTile key={tile.img}>
    //         <img src={tile.img} alt={tile.title} />
    //         {/* <GridListTileBar
    //           title={tile.title}
    //           subtitle={<span>by: {tile.author}</span>}
    //           actionIcon={
    //             <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
    //               <InfoIcon />
    //             </IconButton>
    //           }
    //         /> */}
    //       </GridListTile>
    //     ))}
    //   </GridList>
    // </div>

//     </div>
//   )
//     :
//     (
//       <p>Loading...</p>
//     );
// }

// export default App;