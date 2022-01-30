import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { database } from '../firebase';
import Modal from '@mui/material/Modal';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  open,
  handleClose,
  description,
  userName,
  mobile,
  id,
}) {
  console.log(id);
  console.log(mobile);

  const handleSend = async (e) => {
    e.preventDefault();
    console.log('send req');
    console.log(e.target.answer.value);
    try {
      const ref = doc(database, 'Consultations', `${id}`);
      await updateDoc(ref, {
        isReplay: true,
      });

      const docRef = await addDoc(collection(database, 'answers'), {
        Answer: e.target.answer.value,
        Date: Timestamp.fromDate(new Date()),
      });
      console.log('Document written with ID: ', docRef.id);

      handleClose(true);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <Modal
        dir='rtl'
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography
            style={{ fontSize: '28px' }}
            id='modal-modal-title'
            variant='h6'
            component='h2'
          >
            أجب على استشارة {userName}
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <span style={{ fontSize: '25px', color: 'blue' }}>الوصف:</span>{' '}
            {description}
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <span style={{ fontSize: '25px', color: 'blue' }}>رقم الجوال:</span>{' '}
            {mobile}
          </Typography>
          <Typography
            style={{ fontSize: '28px' }}
            id='modal-modal-description'
            sx={{ mt: 2 }}
          >
            أدخل اجابتك هنا :
          </Typography>
          <form onSubmit={handleSend}>
            <TextareaAutosize
              aria-label='minimum height'
              name='answer'
              id='answer'
              minRows={5}
              placeholder='أدخل اجابتك'
              style={{ width: 400, marginTop: '1rem' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <Button variant='contained' type='submit'>
                أرسل
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
