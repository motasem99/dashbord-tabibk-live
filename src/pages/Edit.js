import { Fragment, useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import * as qs from 'query-string';
import { database } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

import Logo from '../components/Logo';
import EditCard from '../components/EditCard';

// import { collection, addDoc } from 'firebase/firestore';

const Edit = () => {
  const [loading, setLoading] = useState(true);
  const [dataCon, setDataCon] = useState();
  const [dataAnswer, setDataAnswer] = useState();
  const parsed = qs.parse(window.location.search);

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
          <EditCard dataCon={dataCon} dataAnswer={dataAnswer} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Edit;
