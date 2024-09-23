import { useCallback, useState } from 'react';
import './App.css';

const Avatars = [
  { id: 3, name: 'Alana B.' },
  { id: 4, name: 'Ramona J.' },
  { id: 7, name: 'Wade C.' },
  { id: 8, name: 'Sofia H.' },
  { id: 9, name: 'David D.' },
  { id: 10, name: 'Vanessa N.' },
  { id: 11, name: 'Isabel V.' },
  { id: 12, name: 'Ava M.' },
  { id: 13, name: 'Jeremy G.' },
  { id: 14, name: 'Nicole L.' },
  { id: 15, name: 'Paige L.' },
  { id: 16, name: 'Tobin A.' },
  { id: 17, name: 'Kai M.' },
  { id: 18, name: 'Tristan F.' },
  { id: 19, name: 'Patrick K.' }
];

function App() {
  const [currentAvatar, setCurrentAvatar] = useState(3);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [createdClip, setCreatedClip] = useState(null)

  // const getClip = useCallback(async () => {
  //   setUrl('');
  //   const response = await fetch('/stream', { 
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ avatarId: currentAvatar, text })
  //     });
  //   const responseBlob = await response.blob()
  //   const objectURL = URL.createObjectURL(responseBlob);
  //   setUrl(objectURL);
  // }, [currentAvatar, text])

  const [clipsList, setClipsList] = useState([])

  async function fetchClips() {

    console.info("Fetching clips")
    const clips_response= await fetch('/clips', {
      method: 'GET',
    })
    console.info(clips_response.headers)
    const clips = await clips_response.json()
    console.info(clips)
    setClipsList(clips);
  }

  async function createClip() {
    console.log("create a clip")
    const response = await fetch('/create_clip', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatarId: parseInt(currentAvatar), text })
    });
    const response_body = await response.json()
    console.info("got response body")
    console.info(response_body)
    setCreatedClip({id:response_body.clip_id, status: "WAITING"})
    // const responseBlob = await response.blob()
    // const objectURL = URL.createObjectURL(responseBlob);
    // setUrl(objectURL);
  }

  async function updateClipStatus() {
    console.info("update clip please")
    const response = await fetch('/clips/' + createdClip.id)

    const body = await response.json()
    console.info(body)
    setCreatedClip(body)
  }

  return (
    <div className="App App-header" >
        <select 
          className="input"
          name='avatars'
          value={currentAvatar}
          onChange={({ target }) => { setCurrentAvatar(target.value); }}
          style={{ marginBottom: 24 }}
        >
          {Avatars.map(avatar => (<option key={avatar.id} value={avatar.id}>{avatar.name}</option>))}
        </select>
        <textarea 
          rows={8}
          placeholder="Enter text here..."
          value={text}
          onChange={({ target }) => setText(target.value)}
        />
        {/* <div style={{ marginBottom: url ? 24 : 0 }}>
          {url && (<audio controls src={url} />)}
        </div> */}
        <button className="input" onClick={createClip} disabled={text.trim().length == 0}>Create clip!</button>
        <button className="input" onClick={fetchClips}>Fetch Clips</button>

        { createdClip && (
          <div>
            Created Clip
            <div> id: {createdClip.id} </div>
            <div> status: {createdClip.status}</div>
            {createdClip.status == "COMPLETE" && (<div style={{ marginBottom: url ? 24 : 0 }}>
          <audio controls src={createdClip.url} />
        </div>)}
            <button onClick={updateClipStatus}>Update</button>
          </div>
          )}
      <div>
        {clipsList.map(clip => (<div>{clip.status}  {clip.id} {clip.status == "COMPLETE" && (<div style={{ marginBottom: clip.url ? 24 : 0 }}><audio controls src={clip.url} /></div>)}</div>))}
      </div>
    </div>
  );
}

export default App;
