
function render(request, data) {
  let ccResponse = {
    data,
    links: [{ rel: 'self', href: request.baseUrl + '/' }],
  };

  return ccResponse;
};


module.exports = {
  render,
};