const model = require('./../../common/models/model-box0-cvs');
const view = require('./view');

function listAction(request, response) {
    // let queryString = "Select object_id, name from t_object WHERE name LIKE 'TSFI%'";

    //    let data =  model.getAll()

    // console.log("Rufe CSV ab:");
    model.getAll()
    .then(results => {
        // console.log("Habe CSV erhalten:");
        // console.log(results);
        response.json(view.render(request, results))
        })
    .catch((reject) => console.log("Matrix: Controller is unable to access the model : " + reject));
}


module.exports = {
    listAction,
};