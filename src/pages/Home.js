import { Fragment, useEffect, useState } from 'react';
import { database } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

import DataTable from '../components/Table';
import { makeStyles } from '@material-ui/core/styles';
import { Oval } from 'react-loader-spinner';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    margin: '0 auto',
    marginTop: '3rem',
  },
  lengthCount: {
    fontSize: '30px',
    marginLeft: '6rem',
    marginTop: '5rem',
    display: 'flex',
    alignItems: 'center',
  },
}));

const Home = () => {
  const classes = useStyles();

  const [dataCon, setDataCon] = useState();
  const [lengthCount, setLengthCount] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let listData = [];
    let lengthCon = [];
    const getDataAns = async () => {
      const querySnapshot = await getDocs(
        collection(database, 'Consultations')
      );
      // eslint-disable-next-line array-callback-return
      querySnapshot.docs.map((doc) => {
        listData.push(doc.data());
      });
    };
    setDataCon(listData);

    const getLengthCon = async () => {
      const q = query(
        collection(database, 'Consultations'),
        where('isReplay', '==', false)
      );
      const querySnapshot = await getDocs(q);
      // eslint-disable-next-line array-callback-return
      querySnapshot.docs.map((doc) => {
        lengthCon.push(doc.data());
      });
      setLoading(false);
    };
    setLengthCount(lengthCon);
    getDataAns();
    getLengthCon();
  }, []);

  return (
    <div dir=''>
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
          <p className={classes.lengthCount}>
            <MarkChatUnreadIcon
              style={{
                fontSize: '35px',
                color: '#4f4fcd',
                marginRight: '12px',
              }}
            />
            هناك {lengthCount.length} استشارات غير مقروئة
          </p>
          <div className={classes.root}>
            <DataTable dataCon={dataCon} dir='rtl' />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Home;
