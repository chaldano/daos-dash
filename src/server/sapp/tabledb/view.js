
function render(request, data) {
  let moviesResponse = {
    data,
    links: [{ rel: 'self', href: request.baseUrl + '/' }],
  };
  console.log("Tabelle:" + moviesResponse.data[0].object_id)
  console.log("Tabelle:" + moviesResponse.data[0].name)
  console.log("Keys:" + Object.keys(moviesResponse.data[0]))
  return moviesResponse;
};


module.exports = {
  render,
};
