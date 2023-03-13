const model = require('./../../common/models/model-box1-db');
const view = require('./view');


function listAction(request, response) {
    // response.send(model.getAll());
    let queryString = "Select object_id, name from t_object WHERE name LIKE 'TSFI%'";
    model.getAll(queryString, 'Movie1')
        .then(results => view.render(results))
        .then(results => response.send(results))
        .catch((reject) => {
            console.log("Movie1: Controller is unable to access the model : " + reject);
        })
}
module.exports = {
    listAction,
};
