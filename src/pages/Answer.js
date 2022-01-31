import { Fragment, useEffect, useState } from 'react';
import * as qs from 'query-string';
import { database } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Oval } from 'react-loader-spinner';
import Logo from '../components/Logo';
import AnswerCard from '../components/AnswerCard';

import 'react-voice-recorder/dist/index.css';

const Answer = () => {
  const [loading, setLoading] = useState(true);
  const [dataCon, setDataCon] = useState();
  const parsed = qs.parse(window.location.search);

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
          <AnswerCard dataCon={dataCon} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Answer;
