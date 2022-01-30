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

import { collection, addDoc, Timestamp, updateDoc } from 'firebase/firestore';

const Answer = () => {
  const [loading, setLoading] = useState(true);
  const [dataCon, setDataCon] = useState();
  const parsed = qs.parse(window.location.search);
  const inputEl = useRef(null);
  const navigate = useNavigate();
  const moment = require('moment'); // require
  const [loadingProgress, setLoadingProgress] = useState(false);

  const handleSend = async () => {
    try {
      setLoadingProgress(true);
      const docRef = await addDoc(collection(database, 'answers'), {
        Answer: inputEl.current.value,
        ConsultationsId: dataCon.id,
        Date: Timestamp.fromDate(new Date()),
      });
      console.log('Document written with ID: ', docRef.id);

      const ref = doc(database, 'Consultations', parsed.id);
      console.log(docRef.id);
      await updateDoc(ref, {
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
        <Card
          style={{ width: '80%', margin: '0 auto', marginTop: '10rem' }}
          dir='rtl'
        >
          <CardContent>
            <Typography variant='h5' component='div'>
              أجب على استشارة {dataCon.userName}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              {moment(dataCon.createdAt).subtract().calendar()}
            </Typography>
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

            <Typography
              style={{ fontSize: '25px', marginTop: '2rem' }}
              variant='body2'
            >
              أدخل اجابتك
            </Typography>
            <TextareaAutosize
              aria-label='minimum height'
              name='answer'
              id='answer'
              minRows={5}
              ref={inputEl}
              placeholder='أدخل اجابتك'
              style={{
                width: '90%',
                marginTop: '1rem',
                height: '100px',
                fontSize: '20px',
                outline: 'none',
              }}
            />
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
      )}
    </Fragment>
  );
};

export default Answer;
