
const model = require('./../../common/models/model-box1-adressen');
const view = require('./view');


function listPostAction(request, response) {
    // let data = request.FormData
    // let name = data.get('lnachname')
    console.dir(Object.keys(request))
    console.log(Object.keys(request.body))
    console.dir(request.params)
    console.dir(request.body)
    // let vorname = request.body.lvorname
    // let nachname = reqest.body.lnachname
    // let queryString = "INSERT INTO public.namen (id, name, vorname) VALUES ('10',"+vorname+","+nachname+")";
    // // let data =  model.getAll()

    // console.log("Request :"+ Object.keys(request));
    // console.log("Url :"+ request.url);
    // console.log("BaseUrl :"+ request.baseUrl);
    // console.log("OriginalUrl :"+ request.OriginalUrl);
    // console.log("Header :"+ Object.keys(request.headers));
    // console.log("Method :"+ request.method);
    // console.log("Body-Params :"+ Object.keys(request.body));
    // console.log("Url :"+ request);
    // model.getAll(queryString, 'Adressen')
    // .then(results => {
    //     // console.log("Adresse erhalten:");
    //     console.log(results);
    //     let data = "Data has been inserted"
    //     response.json(view.render(request, data))
    //     })
    // .catch((reject) => console.log("Adressen: Controller is unable to insert data : " + reject));
    
    // response.json(view.render(request, request.body.lvorname))
    // response.json(view.render(request, request.body))

    // response.json(request.body.lvorname)
    // response.json(request.body)
    
}


module.exports = {
    listPostAction,
};