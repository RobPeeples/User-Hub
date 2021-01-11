const BASE_URL = 'https://jsonplace-univclone.herokuapp.com';

const usersBaseUrl = `${BASE_URL}/users`


function fetchUsers() {
  return fetchData(usersBaseUrl);
};




function renderUser(user) {
  //use jquery templating
  
  return $(`<div class="user-card">
    <header>
      <h2>${user.name}</h2>
    </header>
    <section class="company-info">
      <p><b>Contact:</b>${user.email}</p>
      <p><b>Works for:</b>${user.company.name}</p>
      <p><b>Company creed:</b>${user.company.catchPhrase}</p>
    </section>
    <footer>
      <button class="load-posts"></button>
      <button class="load-albums"></button>
    </footer>
    </div>`).data('user', user);
};

function renderUserList(userList) {
  //use looping and appending
  $('#user-list').empty();

  userList.forEach(function (users) {
    $('#user-list').append(renderUser(users));
  });
};



function fetchUserPosts(userId) {
  return fetchData(`${BASE_URL}/users/${userId}/posts?_expand=user`);
}

function fetchPostComments(postId) {
  return fetchData(`${BASE_URL}/posts/${postId}/comments`);
}



function bootstrap() {
  // move the line about fetchUsers into here
  fetchUsers().then(renderUserList);
}

bootstrap();

$('#user-list').on('click', '.user-card .load-posts', function () {
  const user = $(this).closest('.user-card').data('user');

  fetchUserPosts(user.id)
    .then(renderPostList);
});

$('#user-list').on('click', '.user-card .load-albums', function () {
  const user = $(this).closest('.user-card').data('user');

  fetchUserAlbumList(user.id)
    .then(renderAlbumList);
});

/* get an album list, or an array of albums */
function fetchUserAlbumList(usersBaseUrl) {
  return fetchData(`${ usersBaseUrl }/users/${ userId }/albums?_expand=user&_embed=photos`);
}

fetchUserAlbumList(1).then(function (albumList) {
  
});

/* render a single album */
function renderAlbum(album) {
  const albumElement = $(`<div class="album-card">
  <header>
    <h3>${ album.title }, by ${ album.user.username } </h3>
  </header>
  <section class="photo-list"></section>
  </div>`);

const photoListElement = albumElement.find('.photo-list');

  album.photos.forEach(function (photo) {
  photoListElement.append( renderPhoto(photo) );
});

return albumElement;
}

/* render a single photo */
function renderPhoto(photo) {
  return $(`<div class="photo-card">
  <a href="${ photo.url }" target="_blank">
    <img src="${ photo.thumbnailUrl }" />
    <figure>${ photo.title }</figure>
  </a>
</div>`);
}

/* render an array of albums */
function renderAlbumList(albumList) {
  $('#app section.active').removeClass('active');

  const albumListElement = $('#album-list');
  albumListElement.empty().addClass('active');

  albumList.forEach(function (album) {
    albumListElement.append( renderAlbum(album) );
  });  
}

function fetchData(usersBaseUrl) {
  return fetch(usersBaseUrl)
  .then(function (result) {
    return result.json();
  }).catch(function (error) {
    console.log(error);
  })
}

fetchUserAlbumList(1).then(renderAlbumList);