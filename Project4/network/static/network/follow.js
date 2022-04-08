// Pagination elements per page
const followNumberPerPage = 10;

document.addEventListener('DOMContentLoaded', function () {

  // Load posts from followed users
  load_follow();
});

function load_follow() {

  // Display follow and hide other views.
  document.querySelector('#followAllPost').style.display = 'block';

  // Test
  console.log('Follow called');

  // Variable for profile
  const profileId = document.querySelector('#IDprofile').value;
  const currentUser = document.querySelector('#IdCheck').value;
  const followCurrent_Page = document.querySelector('#FollowCurrentPage').value;
  const followTotal_Page = document.querySelector('#FollowTotalPage').value;
  const allpost = 'following';

  console.log(`Total Pagin. Pages: ${followTotal_Page}`);
  console.log(`Current Pagin. Page: ${followCurrent_Page}`);

  // Returns follow user id
  fetch(`/post/${allpost}`)
  .then(response => response.json())
  .then(follow_User => {
    // Print post
    console.log(follow_User);

    if(`${follow_User}` == '') {
      
      // No users, no pagination
      document.querySelector('#followPagin_view').style.display = 'none';

      // No users followed
      const title_following = document.createElement('div');
      title_following.className = "col-3";
      title_following.innerHTML = `<h3>Sorry, you have not found any worthy to follow.</h3>`;

      // Display text
      document.querySelector('#follow_ID').append(title_following);

    }
    else{
      // Create ul element
      const ul = document.createElement('ul');
      ul.className = "list-group";

      // Heading of following page
      const title_following = document.createElement('div');
      title_following.className = "col-3";
      title_following.innerHTML = `<h3>Users you are following:</h3>`;

      // Display to HTML page
      document.querySelector('#follow_ID').append(title_following);

      // Run loops
      follow_User.forEach(follow_User => {

        const followID = `${follow_User.following_user}`;

        // Return username
        fetch(`/user/${followID}`)
        .then(response => response.json())
        .then(user_post => {
          // Add to heading
          const users_following = document.createElement('div');
          users_following.className = "col-6";
          users_following.innerHTML = `<h3><strong>${user_post.username}</strong></h3>`;

          // Display to HTML page
          document.querySelector('#follow_ID').append(users_following);
        });

        // Return follow post
        fetch(`/follow/${followID}`)
        .then(response => response.json())
        .then(follow_post => {
          // Print post
          console.log(follow_post);

          // Run loops
          follow_post.forEach((follow_post, index) => {

            // Pagination turn page display
            if(index < followNumberPerPage) {
              document.querySelector('#followPagin_view').style.display = 'none';
            }
            else {
              document.querySelector('#followPagin_view').style.display = 'block';
            }

            if(index >= (followNumberPerPage * (followCurrent_Page - 1)) && index < (followNumberPerPage * followCurrent_Page)) {
              // Create li element
              const li = document.createElement('li');
              li.className = "list-group-item";

              // List elements
              const follow_sender = document.createElement('div');
              follow_sender.innerHTML = `<strong>${follow_post.poster}</strong>`;
              follow_sender.className = "col-3";
              const follow_content = document.createElement('div');
              follow_content.innerHTML = `${follow_post.content}`;
              follow_content.className = "col-6";
              const follow_timestamp = document.createElement('div');
              follow_timestamp.innerHTML = `${follow_post.timestamp}`;
              follow_timestamp.className = "col-9";
              const follow_like = document.createElement('div');
              follow_like.setAttribute("id", 'like_follow');

              // Like post fetch
              fetch(`/like/${follow_post.id}`)
              .then(response => response.json())
              .then(follow_like => {

                  if(`${follow_like.liked}` == '1' || `${follow_like.liked}` == '0'){
                    follow_liked = follow_like.liked;
                  }
                  else{
                    console.log(`Went to else. ${follow_post.id}`);
                    follow_liked = '0';
                  }
                  if(`${currentUser}` != `${follow_post.poster_id}`){
                    if(`${follow_post.post_like}` != '0' && `${follow_liked}` != '0'){
                      follow_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${follow_post.id}, false)" src="https://www.downloadclipart.net/large/11072-red-heart-design.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${follow_post.post_like}`;
                    }
                    else if(`${follow_post.post_like}` != '0'){
                      follow_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${follow_post.id}, true)" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${follow_post.post_like}`;
                    }
                    else{
                      follow_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${follow_post.id}, true)" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
                    }
                  }
                  else{
                    if(`${follow_post.post_like}` != '0' && `${follow_liked}` != '0'){
                      follow_like.innerHTML = `<img id="like_post_img" src="https://www.downloadclipart.net/large/11072-red-heart-design.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${follow_post.post_like}`;
                    }
                    else if(`${follow_post.post_like}` != '0'){
                      follow_like.innerHTML = `<img id="like_post_img" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${follow_post.post_like}`;
                    }
                    else{
                      follow_like.innerHTML = `<img id="like_post_img" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
                    }
                  }
                  follow_like.className = "col-9";
                });

              const follow_button = document.createElement('div');
              follow_button.innerHTML = `<a id="edit_post" onclick="edit_of_post(${follow_post.id})">Edit</a>`;
              follow_button.className = "col-6";
              if(`${follow_sender}` !== `${profileId}`){
                li.append(follow_sender, follow_content, follow_timestamp, follow_like);
              }
              else{
                li.append(follow_sender, follow_button, follow_content, follow_timestamp, follow_like);
              }
              li.setAttribute("id", `${follow_post.id}`);

              ul.appendChild(li);
              ul.setAttribute("id", 'postlist');

              // Load to Page
              document.querySelector('#followAllPost').append(ul);
            }
            else {
              return;
            }
          });
        })
      });
    }
  })
}

function like_of_post(post_id) {

  // Get current user id
  const currentUser = document.querySelector('#IdCheck').value;

  console.log(post_id,value);

  // Gather post information
  fetch(`/post/${post_id}`)
  .then(response => response.json())
  .then(posts => {

    posts.forEach(posts =>{
      // Like called
      console.log('Like called.');
      console.log(`${posts.id}`);

      // Change like status on post
      if(`${posts.post_like}` >= `1` && `${value}` == 'false'){
        console.log(`Will take: ${posts.poster_like}`);
        fetch(`/like/${posts.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            currentuser: `${currentUser}`,
            likecount: false
          })
        })
      }
      else{
        console.log(posts.poster_like + 1);
        fetch(`/like/${posts.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            currentuser: `${currentUser}`,
            likecount: true
          })
        })
      }

      // Wait for API call
      window.setTimeout(refreshpage, 1000);

    });
  });
}

function refreshpage(){
  // Reload page
  window.location.reload();
}

function edit_of_post(post_id) {

  // Display edit and hide other views
  document.querySelector('#NewPost').style.display = 'none';
  document.querySelector('#Post_view').style.display = 'none';
  document.querySelector('#Edit_view').style.display = 'block';

  console.log('edit_of_post called');

  // Return post information
  fetch(`/edit/${post_id}`)
  .then(response => response.json())
  .then(editPost => {
    // Print post
    console.log(editPost);

    // Pre-fill text box with previous content
    document.querySelector('#Postuser').value = editPost.poster;
    document.querySelector('#Posttext').value = editPost.content;

    console.log(editPost.poster);

    // Fill HTML Page
    document.querySelector('#Edit_view').innerHTML = `<h3>Edit Post</h3>
    <form id="edit-form">
        <input type="hidden" id="Edituser" value="${document.querySelector('#Postuser').value}">
        <textarea id="Edittext" class="textstyle">${document.querySelector('#Posttext').value}</textarea>
        <button class="btn btn-sm btn-outline-secondary" id="edit">Re-post</button>
    </form>`;

    // Submitting & storing repost
    document.querySelector('#Edit_view').onsubmit = function () {

      // Temporarily store values
      const poster = document.querySelector('#Edituser').value;
      const content = document.querySelector('#Edittext').value;

      // Save repost data
      fetch(`/post/${editPost.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          content: `${content}`
        })
      })

      // Clear textarea
      document.querySelector('#Posttext').value = '';

      // Wait for API call
      window.setTimeout(refreshpage, 1000);
      return false;
    };
  });
}
