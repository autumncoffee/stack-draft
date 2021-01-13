import {HashMap} from 'ac-diskstructs';
import path from 'path';
import {PureComponent} from 'react';
import {Grid, Button, CircularProgress} from '@material-ui/core';
import {Wget} from 'ac-fetcher';

class IndexPage extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      backResponse: '',
      inProgress: false,
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(id) {
    const self = this;

    self.setState({
      backResponse: '',
      inProgress: true,
    });

    Wget({
      method: 'get',
      url: '/api/info/' + encodeURIComponent(id),
    })
      .then(function(response) {
        self.setState({
          backResponse: JSON.stringify(response.data),
          inProgress: false,
        });
      })
      .catch(function() {
        self.setState({
          inProgress: false,
        });

        alert('Error');
      })
    ;
  }

  render() {
    return (
      <>
        <div style={{
          margin: '10px 0px',
          padding: '5px',
        }}>
          {this.state.inProgress ? (
            <CircularProgress style={{
              margin: '10px auto',
            }} />
          ) :
            'Backstage back response: ' + this.props.backMessage
          }
        </div>

        {this.state.backResponse ? (
          <div style={{
            margin: '10px 0px',
            padding: '5px',
          }}>
            AJAX back response: {this.state.backResponse}
          </div>
        ) : null}

        <Grid container spacing={3}>
          {this.props.data.map((item) => (
            <Grid key={item.id} item xs={12} container spacing={3}>
              <Grid item xs={2}>
                {'#' + item.id}
              </Grid>
              <Grid item xs={6}>
                {item.msg}
              </Grid>
              <Grid item xs={4}>
                <Button onClick={() => this.onClick(item.id)}>
                  Request data from back
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </>
    );
  }
};

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

export default IndexPage;
