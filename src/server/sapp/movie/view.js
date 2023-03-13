
function render(movies) {
    return `
<!DOCTYPE html> <html lang="en"> <head>
<meta charset="UTF-8">
  <title>Movie list</title>
   <link rel="stylesheet" href="/app.css" /> 
</head>
<body>
  <table>
    <thead><tr><th>Id</th><th>Title</th></tr></thead>
    <tbody>
${movies
            // .map(movie => `<tr><td>${movie.id}</td><td>${movie.title}</td></tr>`).join('')}
            .map(movie => `<tr><td>${movie.object_id}</td><td>${movie.name}</td></tr>`).join('')}
    </tbody>
  </table>
</body> </html> `;
};

module.exports = {
    render,
};
