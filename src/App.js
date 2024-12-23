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
  const [endpoint, setEndpoint] = useState(3);
  const [original, setOriginal] = useState('');
  const [replacement, setReplacement] = useState('');
  const [response, setResponse] = useState('');

  const getClip = useCallback(async () => {
    setUrl('');
    const response = await fetch('/stream', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ avatarId: currentAvatar, text })
      });
    const responseBlob = await response.blob()
    const objectURL = URL.createObjectURL(responseBlob);
    setUrl(objectURL);
  }, [currentAvatar, text])

  const createLibrary = useCallback(async () => {
    const response = await fetch('/replacement_libraries', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: text })
      });
      const responseBody = JSON.stringify(await response.json())

      setResponse(responseBody);
  }, [text])

  const getLibrary = useCallback(async () => {
    const response = await fetch('/replacement_libraries?id=' + text, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const responseBody = JSON.stringify(await response.json())

      setResponse(responseBody);
  }, [text])

  const addLibraryRespelling = useCallback(async () => {
    console.log('/replacement_libraries/' + text)
    const response = await fetch('/replacement_libraries/' + text, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ original, replacement, is_phonetic_respelling : false, enabled : true})
      });
      const responseBody = JSON.stringify(await response.json())

      setResponse(responseBody);
  }, [text, original, replacement])

  const getLookup = useCallback(async () => {
    const response = await fetch('respelling_suggestions/'+ text, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    const responseBody = JSON.stringify(await response.json())

    setResponse(responseBody);
  }, [text])

  const renderLayout = () => {
    switch (endpoint) {
      case "Stream":
        return (
        <div className="App App-header">
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
          <div style={{ marginBottom: url ? 24 : 0 }}>
            {url && (<audio controls src={url} />)}
          </div>
          <button className="input" onClick={getClip}>Get clip!</button>
        </div>);
      case "Add library":
        return (
          <div className="App App-header">
            <textarea 
              rows={1}
              placeholder="Enter library name here..."
              value={text}
              onChange={({ target }) => setText(target.value)}
            />
            <div style={{ marginBottom: response ? 24 : 0 }}>
              <p>{response}</p>
            </div>
            <button className="input" onClick={createLibrary}>Create replacement library!</button>
          </div>);
      case "Get library":
        return (
          <div className="App App-header">
            <textarea 
              rows={1}
              placeholder="Enter library id here..."
              value={text}
              onChange={({ target }) => setText(target.value)}
            />
            <div style={{ marginBottom: response ? 24 : 0 }}>
              <p>{response}</p>
            </div>
            <button className="input" onClick={getLibrary}>Get library!</button>
          </div>);
      case 'Add library respelling':
        return (
          <div className="App App-header">
            <textarea 
              rows={1}
              placeholder="Enter library id here..."
              value={text}
              onChange={({ target }) => setText(target.value)}
            />
            <textarea 
              rows={1}
              placeholder="Enter original here..."
              value={original}
              onChange={({ target }) => setOriginal(target.value)}
            />
            <textarea 
              rows={1}
              placeholder="Enter replacement here..."
              value={replacement}
              onChange={({ target }) => setReplacement(target.value)}
            />
            <div style={{ marginBottom: response ? 24 : 0 }}>
              <p>{response}</p>
            </div>
            <button className="input" onClick={addLibraryRespelling}>Add library respelling!</button>
          </div>);
      case "Use Oxford Lookup":
        return (
          <div className="App App-header">
            <textarea 
              rows={1}
              placeholder="Enter word here..."
              value={text}
              onChange={({ target }) => setText(target.value)}
            />
            <div style={{ marginBottom: response ? 24 : 0 }}>
              <p>{response}</p>
            </div>
            <button className="input" onClick={getLookup}>Get respelling suggestions!</button>
          </div>);
      default:
        return <div>Select a layout from the dropdown.</div>;
    }
  };

  return (
    <div>
      <select
        id="layoutSelector"
        value={endpoint}
        onChange={(e) => setEndpoint(e.target.value)}
      >
        <option value="Stream">Stream</option>
        <option value="Add library">Add library</option>
        <option value="Get library">Get library</option>
        <option value="Add library respelling">Add library respelling</option>
        <option value="Use Oxford Lookup">Use Oxford Lookup</option>
      </select>
      <div className="layout-container">{renderLayout()}</div>
    </div>
  );
}

export default App;
