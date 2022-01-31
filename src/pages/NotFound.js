import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'grid',
    justifyContent: 'center',
    marginTop: '250px',
  },
  title: {
    fontSize: '60px',
  },
  para: {
    fontSize: '30px',
  },
}));

function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <h2 className={classes.title}> ! صفحة 404</h2>
      <p className={classes.para}>هذه الصفحة غير موجودة</p>
    </div>
  );
}

export default NotFound;
