import { useState, useRef, Fragment } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@material-ui/core/Container';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { database } from '../firebase';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import MicRecorder from 'mic-recorder-to-mp3';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GetApp } from '@mui/icons-material';

const main = {
  marginBottom: '20px',
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  width: '50%',
};
const record = {
  position: 'relative',
  right: '60px',
  borderRadius: '50px',
};
const stopStyle = {
  position: 'relative',
  left: '60px',
  borderRadius: '50px',
};

const Mp3Recorder = new MicRecorder({
  bitRate: 64,
  prefix: 'data:audio/wav;base64,',
});

const EditCard = ({ dataCon, dataAnswer }) => {
  const inputEl = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobUrl] = useState('');
  const [voiceId, setVoiceId] = useState();
  const [blobListenRecord, setBlobListenRecord] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const storage = getStorage();
  const moment = require('moment'); // require

  const handleShowRecord = () => {
    if (showRecord === false) {
      setShowRecord(true);
    } else {
      setShowRecord(false);
    }
  };

  const start = () => {
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e) => console.error(e));
    }
  };

  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        const binaryString = btoa(blobURL);

        setBlobListenRecord(blobURL);
        setBlobUrl(blob);
        setVoiceId(binaryString);
        setIsRecording(false);
      })
      .catch((e) => console.log(e));
  };

  const sendEditNotification = async () => {
    await axios.post(
      `https://fcm.googleapis.com/fcm/send`,
      {
        to: `/topics/${dataCon.deviceId}`,
        notification: {
          title: '??????????',
          body: '?????? ???? ?????????????? ?????? ????????????????',
        },
      },
      {
        headers: {
          Authorization:
            'key = AAAAwV6lu5g:APA91bFxGVUSQN3-4IjYsXJLOoUmVIjB-vd53oibOGZq1k2PUBANqHLlrwhqy8nRIfcQmiWe9JtDKb8GRYMkrpBbL7fvN4tww9pDKflhW1Q_AdqQG-hayFTZnT5Q3Jz9RLHe4EUBR29c',
          'Content-Type': 'application/json',
        },
      }
    );
  };

  const handleUpdate = async () => {
    try {
      if (inputEl.current.value === '' && blobURL) {
        const storageRef = ref(storage, 'answerVoice/' + voiceId);
        const uploadTask = uploadBytesResumable(storageRef, blobURL);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setLoadingProgress(true);
            console.log('Upload is ' + progress + '% done');
          },
          (err) => console.log(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              const ref = doc(database, 'answers', dataCon.answerId);
              await updateDoc(ref, {
                Answer: url,
                answerType: 'voice',
                deviceId: dataCon.deviceId,
                Date: Timestamp.fromDate(new Date()),
              })
                .then((res) => {
                  console.log(res);
                  sendEditNotification();
                })
                .catch((error) => {
                  console.log(error);
                });
              setLoadingProgress(false);
              navigate('/');
            });
          }
        );
      } else {
        setLoadingProgress(true);
        const ref = doc(database, 'answers', dataCon.answerId);
        await updateDoc(ref, {
          Answer: inputEl.current.value,
          answerType: 'text',
          deviceId: dataCon.deviceId,
          Date: Timestamp.fromDate(new Date()),
        })
          .then((res) => {
            console.log(res);
            sendEditNotification();
          })
          .catch((error) => {
            console.log(error);
          });
        setLoadingProgress(false);
        navigate('/');
      }
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Card
      style={{ width: '80%', margin: '0 auto 3rem', marginTop: '3rem' }}
      dir='rtl'
    >
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h5' component='div'>
            ?????????? ?????? ?????????????? {dataCon.userName}
          </Typography>
        </div>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {moment(dataAnswer?.createdAt).subtract().calendar()}
        </Typography>

        <hr />

        <Typography variant='h5' component='div'>
          ?????? ?????????????????? :
        </Typography>

        {dataCon.mediaType === 'voice' ? (
          <Fragment>
            {dataCon.consultationDescription && (
              <Typography
                color='text.secondary'
                style={{
                  fontSize: '24px',
                  backgroundColor: '#efefef',
                  padding: '1rem',
                }}
              >
                {dataCon.consultationDescription}
              </Typography>
            )}
            <div style={{ fontSize: '20px', margin: '2rem 0' }}>
              <a
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#efefef',
                  padding: '1rem',
                }}
                href={dataCon.mediaUrl}
              >
                ???????? ???????????? ?????????????? ????????????
              </a>
            </div>
          </Fragment>
        ) : (
          <Typography
            color='text.secondary'
            style={{
              fontSize: '24px',
              backgroundColor: '#efefef',
              padding: '1rem',
            }}
          >
            {dataCon.consultationDescription}
          </Typography>
        )}

        <hr />

        {dataCon.files && (
          <div>
            <Typography
              variant='h3'
              style={{ marginTop: '2rem', marginBottom: '1rem' }}
              component='div'
            >
              ?????????? ?????????? :
            </Typography>
            {dataCon.files.map((item) => {
              return (
                <div key={item}>
                  <a href={item} style={{ textDecoration: 'none' }}>
                    <Button
                      style={{ marginBottom: '1rem', fontSize: '18px' }}
                      variant='contained'
                      startIcon={<GetApp style={{ marginLeft: '10px' }} />}
                    >
                      ?????? ????????????
                    </Button>
                  </a>
                </div>
              );
            })}
            <hr />
          </div>
        )}

        <Typography style={{ fontSize: '25px' }} variant='body2'>
          ?????????????? ?????? ?????????????????? :
        </Typography>

        {dataAnswer?.answerType === 'voice' ? (
          <div style={{ padding: '10px', fontSize: '20px' }}>
            <audio src={dataAnswer?.Answer} controls />
          </div>
        ) : (
          <Typography
            color='text.secondary'
            style={{
              fontSize: '24px',
              backgroundColor: '#efefef',
              padding: '1rem',
            }}
          >
            {dataAnswer?.Answer}
          </Typography>
        )}

        <hr />

        <Typography
          style={{ fontSize: '25px', marginTop: '2rem' }}
          variant='body2'
        >
          ???????? ???????????? :
        </Typography>
        <TextareaAutosize
          aria-label='minimum height'
          name='answer'
          id='answer'
          disabled={showRecord}
          minRows={5}
          ref={inputEl}
          placeholder='???????? ???????????? ...'
          style={{
            width: '90%',
            marginTop: '1rem',
            height: '100px',
            fontSize: '20px',
            outline: 'none',
          }}
        />

        <Typography
          style={{ fontSize: '25px', marginTop: '2rem' }}
          variant='body2'
        >
          ???????? ?????????? ???????? :
          <Button
            variant='contained'
            style={{ marginRight: '20px', borderRadius: '50px' }}
            color='primary'
            onClick={handleShowRecord}
          >
            <MicIcon />
          </Button>
        </Typography>

        {showRecord && (
          <div className='App' style={{ justifyContent: 'center' }}>
            <Container maxWidth='sm' style={main}>
              <Button
                variant='contained'
                style={record}
                color='primary'
                onClick={start}
                disabled={isRecording}
              >
                <MicIcon /> ???????? ??????????????
              </Button>
              <Button
                variant='contained'
                style={stopStyle}
                color='primary'
                onClick={stop}
                disabled={!isRecording}
              >
                <MicOffIcon /> ???????? ??????????????
              </Button>
            </Container>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <audio src={blobListenRecord} controls='controls' />
            </div>
          </div>
        )}

        <hr style={{ marginTop: '30px' }} />

        <div
          style={{
            display: 'flex',
            marginTop: '1rem',
          }}
        >
          <Button
            style={{ width: '120px', fontSize: '20px' }}
            variant='contained'
            onClick={handleUpdate}
          >
            {loadingProgress ? (
              <CircularProgress style={{ color: 'white' }} />
            ) : (
              '??????????'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditCard;
