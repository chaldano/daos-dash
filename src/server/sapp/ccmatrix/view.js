
function render(request, data) {
  let moviesResponse = {
    data,
    links: [{ rel: 'self', href: request.baseUrl + '/' }],
  };

  return moviesResponse;
};


module.exports = {
  render,
};