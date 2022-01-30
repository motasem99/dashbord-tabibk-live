import { Fragment, useEffect, useState, useRef } from 'react';
import * as qs from 'query-string';
import { database } from '../firebase';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { Oval } from 'react-loader-spinner';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const Edit = () => {
  const moment = require('moment'); // require
  const [loading, setLoading] = useState(true);
  const [dataCon, setDataCon] = useState();
  const [dataAnswer, setDataAnswer] = useState();
  const parsed = qs.parse(window.location.search);
  const inputEl = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getConData = async () => {
      const docRef = doc(database, 'Consultations', parsed.id);
      const docSnap = await getDoc(docRef);

      setDataCon(docSnap.data());
      if (docSnap.exists()) {
        const docRefAnswer = doc(database, 'answers', docSnap.data().answerId);
        const docSnapAnswer = await getDoc(docRefAnswer);
        setDataAnswer(docSnapAnswer.data());
      } else {
        console.log('No such document!');
      }

      setLoading(false);
    };
    getConData();
  }, [parsed.id]);

  console.log(dataCon);
  console.log(dataAnswer);

  const handleUpdate = async () => {
    try {
      setLoadingProgress(true);
      const ref = doc(database, 'answers', dataCon.answerId);
      await updateDoc(ref, {
        Answer: inputEl.current.value,
        Date: Timestamp.fromDate(new Date()),
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h5' component='div'>
                تعديل على استشارة {dataCon.userName}
              </Typography>
            </div>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              {moment(dataAnswer.createdAt).subtract().calendar()}
            </Typography>
            <Typography variant='h5' component='div'>
              وصف الاستشارة
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
            <Typography style={{ fontSize: '25px' }} variant='body2'>
              الاستشارة :
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              {dataAnswer.Answer}
            </Typography>

            <Typography
              style={{ fontSize: '25px', marginTop: '2rem' }}
              variant='body2'
            >
              أدخل تعديلك
            </Typography>
            <TextareaAutosize
              aria-label='minimum height'
              name='answer'
              id='answer'
              minRows={5}
              ref={inputEl}
              placeholder='أدخل تعديلك'
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
                onClick={handleUpdate}
              >
                {loadingProgress ? (
                  <CircularProgress style={{ color: 'white' }} />
                ) : (
                  'تعديل'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Fragment>
  );
};

export default Edit;
