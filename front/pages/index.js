import {HashMap} from 'ac-diskstructs';
import path from 'path';
import {Wget} from 'ac-fetcher';
import {useState} from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';

export default function Home(props) {
    const [inProgress, setInProgress] = useState(false);
    const [backResponse, setBackResponse] = useState('');
  const onClick = (id) => {
    setInProgress(true);
    setBackResponse('');
    Wget({
      method: 'get',
      url: '/api/info/' + encodeURIComponent(id),
    })
      .then(function(response) {
        setBackResponse(JSON.stringify(response.data));
        setInProgress(false);
      })
      .catch(function() {
        setInProgress(false);
        alert('Error');
      })
    ;
  };
    return (
      <>
        <div style={{
          margin: '10px 0px',
          padding: '5px',
        }}>
          {inProgress ? (
            <CircularProgress style={{
              margin: '10px auto',
            }} />
          ) :
            'Backstage back response: ' + props.backMessage
          }
        </div>

        {backResponse ? (
          <div style={{
            margin: '10px 0px',
            padding: '5px',
          }}>
            AJAX back response: {backResponse}
          </div>
        ) : null}

        <Grid container spacing={3}>
          {props.data.map((item) => (
            <Grid key={item.id} item xs={12} container spacing={3}>
              <Grid item xs={2}>
                {'#' + item.id}
              </Grid>
              <Grid item xs={6}>
                {item.msg}
              </Grid>
              <Grid item xs={4}>
                <Button onClick={() => onClick(item.id)}>
                  Request data from back
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </>
    );
}

export async function getServerSideProps({ req, params }) {
  const ROOT = process.env.ROOT;
  const filePath = path.join(ROOT, 'data', 'example.hashmap');
  const hm = new HashMap(filePath);
  const data = [];

  for (let [id, msg] of hm.items()) {
    data.push({id, msg: msg.toString()});
  }

  hm.delete();

  return {
    props: {
      data,
      backMessage: req.getServiceResponse('back').content().toString(),
    },
  };
}
