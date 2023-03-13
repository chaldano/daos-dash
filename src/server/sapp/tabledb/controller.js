const model = require('../../common/models/model-box1-db');
const view = require('./view');

// function listAction(request, response) {
//     let queryString = "Select object_id, name from t_object WHERE name LIKE 'TSFI%'";
//     model.getAll(queryString)
//         model.getAll(queryString)
//         .then(results => view.render(request, results))
//         .then(results => response.json(results))        
//         .catch((reject) => {
//             console.log("Movie2: Controller is unable to access the model : " + reject);
//         })
// }
function listAction(request, response) {
    let queryString = "Select object_id, name from t_object WHERE name LIKE 'TSFI%'";
    // model.getAll(queryString)
        model.getAll(queryString, 'Movie2')
        .then(results => response.json(view.render(request, results)))
        .catch((reject) => {
            console.log("Table: Controller is unable to access the model : " + reject);
        })
}

module.exports = {
    listAction,
};