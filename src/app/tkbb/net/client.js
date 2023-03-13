//function requestData(operation, url, host) {
function requestData(operation, url) {
    return new Promise ( resolve => {
        let request = new XMLHttpRequest();
        // Event Handler  nach erfolgreicher Ausführung
        request.onload = () => {
          let json;
          if (request.responseType === 'json') {
            console.log("Request raus");
            json = request.response;
          } else {
            console.log("Response2 rein");
            json = JSON.parse(request.responseText);
          }
          // Verarbeitung in einer Tabelle
          resolve(json.data)
        }
        // request.open('GET', '/matrix', 'localhost:8080', true);
        console.log("Operation",operation);
        console.log("Url",url);
        // console.log("Host",host);
        //request.open(operation, url, host, true);
        request.open(operation, url);
        request.responseType = 'json';
        // request.responseType = responseType;
        request.setRequestHeader('Accept', 'application/json');
        // request.setRequestHeader('Accept', 'application/text');
        // request.setRequestHeader('Accept', acceptType);
        request.send();
        // return promise
      })
  }

  export { requestData };

  function postData(url) {
    return new Promise ( resolve => {
        let request = new XMLHttpRequest();
        // Event Handler  nach erfolgreicher Ausführung
        request.onload = () => {
          let json;
          if (request.responseType === 'json') {
            console.log("Request raus");
            json = request.response;
          } else {
            console.log("Response2 rein");
            json = JSON.parse(request.responseText);
          }
          // Verarbeitung in einer Tabelle
          resolve(json.data)
        }
        var formData = new FormData(document.getElementById("form1")); 
        // var formFields = document.getElementById("form1")
      
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}, ${pair[1]}`);
        }
        
        console.log("Url",url);
        request.open('POST', url);
        request.responseType = 'json';
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(formData);
        // return promise
      })
  }
  
  export { postData };

  