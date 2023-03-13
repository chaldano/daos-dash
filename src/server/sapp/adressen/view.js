
function render(request, data) {
  let AdresseResponse = {
    data,
    links: [{ rel: 'self', href: request.baseUrl + '/' }],
  };

  return AdresseResponse;
};


module.exports = {
  render,
};
