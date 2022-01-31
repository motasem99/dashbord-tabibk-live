import { Fragment, useEffect, useState, useRef } from 'react';
import * as qs from 'query-string';
import { database } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Oval } from 'react-loader-spinner';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@material-ui/core/Container';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import 'react-voice-recorder/dist/index.css';
import MicRecorder from 'mic-recorder-to-mp3';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { collection, addDoc, Timestamp, updateDoc } from 'firebase/firestore';
import Logo from '../components/Logo';

const main = {
  marginBottom: '20px',
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  width: '30%',
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

const Answer = () => {
  const [loading, setLoading] = useState(true);
  const [dataCon, setDataCon] = useState();
  const parsed = qs.parse(window.location.search);
  const inputEl = useRef('');
  const navigate = useNavigate();
  const moment = require('moment'); // require
  const [loadingProgress, setLoadingProgress] = useState(false);

  const storage = getStorage();

  const [isRecording, setIsRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [blobURL, setBlobUrl] = useState('');
  const [voiceId, setVoiceId] = useState();
  const [blobListenRecord, setBlobListenRecord] = useState('');

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

  const handleSend = async () => {
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
              const docRef = await addDoc(collection(database, 'answers'), {
                Answer: url,
                answerType: 'voice',
                blobListenRecord,
                ConsultationsId: dataCon.id,
                Date: Timestamp.fromDate(new Date()),
              });

              const refCon = doc(database, 'Consultations', parsed.id);
              await updateDoc(refCon, {
                isReplay: true,
                answerId: docRef.id,
              })
                .then((res) => {
                  console.log(res);
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
        const docRef = await addDoc(collection(database, 'answers'), {
          Answer: inputEl.current.value,
          answerType: 'text',
          ConsultationsId: dataCon.id,
          Date: Timestamp.fromDate(new Date()),
        });
        const refCon = doc(database, 'Consultations', parsed.id);
        console.log(docRef.id);
        await updateDoc(refCon, {
          isReplay: true,
          answerId: docRef.id,
        })
          .then((res) => {
            console.log(res);
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

  useEffect(() => {
    const getConData = async () => {
      const docRef = doc(database, 'Consultations', parsed.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDataCon(docSnap.data());
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };
    getConData();
  }, [parsed.id]);

  return (
    <Fragment>
      {loading ? (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
          }}
        >
          <Oval heigth='800' width='800' color='grey' ariaLabel='loading' />
        </div>
      ) : (
        <Fragment>
          <Logo />
          <Card
            style={{ width: '80%', margin: '0 auto 3rem', marginTop: '3rem' }}
            dir='rtl'
          >
            <CardContent>
              <Typography variant='h5' component='div'>
                أجب على استشارة {dataCon.userName}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                {moment(dataCon.createdAt).subtract().calendar()}
              </Typography>
              <hr />
              <Typography style={{ fontSize: '25px' }} variant='body2'>
                الوصف :
              </Typography>
              {dataCon.mediaType === 'voice' ? (
                <div style={{ padding: '10px', fontSize: '20px' }}>
                  <a style={{ textDecoration: 'none' }} href={dataCon.mediaUrl}>
                    اضغط لتحميل التسجيل الصوتي
                  </a>
                </div>
              ) : (
                <Typography color='text.secondary' style={{ fontSize: '24px' }}>
                  {dataCon.consultationDescription}
                </Typography>
              )}
              <hr />

              <Typography
                style={{ fontSize: '25px', marginTop: '2rem' }}
                variant='body2'
              >
                أدخل اجابتك :
              </Typography>
              <TextareaAutosize
                aria-label='minimum height'
                name='answer'
                id='answer'
                minRows={5}
                disabled={showRecord}
                ref={inputEl}
                placeholder='أدخل اجابتك ...'
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
                أدخل تسجيل صوتي :
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
                      <MicIcon /> ابدا التسجيل
                    </Button>
                    <Button
                      variant='contained'
                      style={stopStyle}
                      color='primary'
                      onClick={stop}
                      disabled={!isRecording}
                    >
                      <MicOffIcon /> اوقف التسجيل
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
                  onClick={handleSend}
                >
                  {loadingProgress ? (
                    <CircularProgress style={{ color: 'white' }} />
                  ) : (
                    'أرسل'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Answer;
