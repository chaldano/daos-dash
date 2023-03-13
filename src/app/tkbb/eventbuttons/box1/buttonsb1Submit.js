import { postData } from 'TkbbFolder/net/client.js';
// import { postData2 } from 'TkbbFolder/net/client.js';

function RunForm(evt) {
  evt.preventDefault();
  console.log("RunForm ...")
  postData('http://localhost:8080/adressen')
}

export { RunForm };
