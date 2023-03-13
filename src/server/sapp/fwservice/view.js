
function render(request, data) {
  let matrixResponse = {
    data,
    links: [{ rel: 'self', href: request.baseUrl + '/' }],
  };

  return matrixResponse;
};


module.exports = {
  render,
};
