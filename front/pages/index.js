import {HashMap} from 'ac-diskstructs';
import path from 'path';

const IndexPage = (props) => {
  return (
    <div>
      {JSON.stringify(props.data, null, 2)}
    </div>
  );
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
    },
  };
}

export default IndexPage;
