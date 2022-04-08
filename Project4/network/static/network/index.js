// Refresh count
var refresh = 0;

// Pagination variables
var numberPerPage = 10;

// When DOM loads, render the first 20 posts
document.addEventListener('DOMContentLoaded', function() {

  //Save a post
  post_log();
  //Load allpost
  post_comment('allpost');
});

// Add a new post with given contents to DOM
function add_post(contents) {

  // Create new post
  const scroll_post = document.createElement('div');
  scroll_post.className = 'post';
  scroll_post.innerHTML = contents;
  console.log(contents);

  // Add post to Dom
  document.querySelector('#Post_view').append(scroll_post);
};

  function post_log() {
    // Test
    console.log('Post called');

    // Post button
    document.querySelector('form').onsubmit = function() {

      // Temporarily store values
      const poster = document.querySelector('#Postuser').value;
      const content = document.querySelector('#Posttext').value;

      // Test point one
      console.log(poster,content);

      // Save comment via fetch
      fetch('/post', {
        method: 'POST',
        body: JSON.stringify({
          user: `${poster}`,
          poster: `${poster}`,
          content: `${content}`
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })

      // Clear temporal saved data
      if(document.querySelector('#Postuser').value !== poster){
        document.querySelector('#Postuser').value = '';
      }
      document.querySelector('#Posttext').value = '';

      // Refresh page
      window.setTimeout(refreshpage, 1000);
      return false;
    };
  }

  function post_comment(allpost) {

    // Display write post, recent post and hide other views
    document.querySelector('#NewPost').style.display = 'block';
    document.querySelector('#Post_view').style.display = 'block';
    document.querySelector('#Edit_view').style.display = 'none';
    document.querySelector('#Profile_view').style.display = 'none';
    document.querySelector('#pagin_view').style.display = 'block';

    // Checkpoint
    console.log('Post_comment called.');

    const current_user = document.querySelector('#UserId').value;
    const total_pages = document.querySelector('#TotalPage').value;
    const current_page = document.querySelector('#CurrentPage').value;

    console.log(`Pagination total pages: ${total_pages}`);
    console.log(`Pagination current page: ${current_page}`);

    // Pagination variables
    const currentPage = 1;

    fetch(`/post/${allpost}`)
    .then(response => response.json())
    .then(posts => {
      // Print posts
      console.log(posts);

      // Create ul element
      const ul = document.createElement('ul');
      ul.className = "list-group";

        // Posts loop
        posts.forEach((posts, index) => {

          if(index >= (numberPerPage * (current_page - 1)) && index < (numberPerPage * current_page)) {
            // Create li element
            const li = document.createElement('li');
            li.className = "list-group-item";

            // List elements
            const post_sender = document.createElement('div');
            post_sender.innerHTML = `<a id="proFile" onclick="load_profile(${posts.poster_id})"><strong>${posts.poster}</strong></a>`;
            post_sender.className = "col-3";
            const post_content = document.createElement('div');
            post_content.innerHTML = `${posts.content}`;
            post_content.className = "col-6";
            const post_timestamp = document.createElement('div');
            post_timestamp.innerHTML = `${posts.timestamp}`;
            post_timestamp.className = "col-9";
            const post_like = document.createElement('div');
            post_like.setAttribute("id", 'like_post');
            // Like post fetch
            fetch(`/like/${posts.id}`)
            .then(response => response.json())
            .then(posts_like => {

              // fix like

               if(`${posts_like.liked}` == '1' || `${posts_like.liked}` == '0'){
                 post_liked = posts_like.liked;
               }
               else{
                 post_liked = '0';
               }

             if(`${current_user}` != `${posts.poster_id}`){
               if(`${posts.post_like}` != '0' && `${post_liked}` != '0'){
                 post_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${posts.id},false)" src="https://www.downloadclipart.net/large/11072-red-heart-design.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${posts.post_like}`;
               }
               else if(`${posts.post_like}` != '0'){
                 post_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${posts.id},true)" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${posts.post_like}`;
               }
               else{
                 post_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${posts.id},true)" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
               }
              }
              else{
               if(`${posts.post_like}` != '0'){
                 post_like.innerHTML = `<img id="like_post_img" src="https://www.downloadclipart.net/large/11072-red-heart-design.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${posts.post_like}`;
                }
               else if(`${posts.post_like}` != '0'){
                 post_like.innerHTML = `<img id="like_post_img" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${posts.post_like}`;
               }
               else{
                 post_like.innerHTML = `<img id="like_post_img" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
                }
              }
              post_like.className = "col-9";
            });

            window.setTimeout(function(){

               const post_button = document.createElement('div');
               post_button.innerHTML = `<a id="edit_post" onclick="edit_of_post(${posts.id})">Edit</a>`;
               post_button.className = "col-6";

               if(`${posts.poster}` !== `${document.querySelector('#Postuser').value}`){
                 li.append(post_sender, post_content, post_timestamp, post_like);
               }
               else{
                 li.append(post_sender, post_button, post_content, post_timestamp, post_like);
               }
               li.setAttribute("id", `${posts.id}`);

               ul.appendChild(li);
               ul.setAttribute("id", 'postlist');

               // Display post
               document.querySelector('#Post_view').append(ul);
            }, 500);
          }
          else{
            return;
          }
        });

      console.log('End of comment fetch.');
    });

     // Refresh page
     if(refresh === 1){
       var refresh = 0;
       window.location.reload();
     }else{
       var refresh = 1;
     }
     console.log(refresh);
  }

  function load_profile(post_id) {

    // Display profile and hide other views
    document.querySelector('#NewPost').style.display = 'none';
    document.querySelector('#Post_view').style.display = 'none';
    document.querySelector('#Edit_view').style.display = 'none';
    document.querySelector('#Profile_view').style.display = 'block';
    document.querySelector('#pagin_view').style.display = 'none';


    console.log('Load profile called');

    // Clear viewing div
    document.querySelector('#Profile_view').innerHTML = '';

    // Variable for profile
    const profileId = `${post_id}`;
    const currentUser = document.querySelector('#UserId').value;
    // Made to profile.js
    console.log("Start fetch.");

    // Retrieve data
    fetch(`/follow/${profileId}`)
    .then(response => response.json())
    .then(profile => {
      // Print profile
      console.log(profile);
      console.log("Complete fetch.");

      // Run loop
      profile.forEach(profile => {

        if(document.querySelector('#Profile_view').innerHTML == ''){

          // Variable of followers
          const user = document.createElement('div');
          user.className = "col-3";
          user.innerHTML = `<h1><strong>${profile.poster}</strong></h1><br>`;
          const follower = document.createElement('div');
          follower.className = "col-6";
          follower.innerHTML = `You have ${profile.poster_followed} followers!`;
          const followed = document.createElement('div');
          followed.className = "col-6";
          followed.innerHTML = `You follow ${profile.poster_follower} users!`;
          const thematic_break = document.createElement('hr');

          // Display profile user
          document.querySelector('#Profile_view').append(user);

          console.log(`${profile.id}`);
          if(`${currentUser}` !== `${profileId}`){

            // Variable of followers viewed by others
            const follow_button = document.createElement('div');
            follow_button.className = "button";
            follow_button.innerHTML = `<button id="follow_user" class=" btn btn-sm btn-outline-secondary">Follow</button>`;
            const unfollow_button = document.createElement('div');
            unfollow_button.className = "button";
            unfollow_button.innerHTML = `<button id="unfollow_user" class=" btn btn-sm btn-outline-secondary">Unfollow</button>`;
            const follower = document.createElement('div');
            follower.className = "col-6";
            follower.innerHTML = `This user has ${profile.poster_followed} followers!`;
            const followed = document.createElement('div');
            followed.className = "col-6";
            followed.innerHTML = `This user follows ${profile.poster_follower} users!`;

            // To change follow button to unfollow button
            fetch(`/followed/${profileId}`)
            .then(response => response.json())
            .then(buttonCheck => {

              console.log(`Follow button check:${buttonCheck.followed}`);
              console.log(`User that is checked:${profileId}`);

              // Add follow and unfollow buttons
              if(`${buttonCheck.followed}` != 'true' || `${buttonCheck.followed}` == 'undefined'){
                document.querySelector('#Profile_view').append(follow_button);
              }
              else{
                document.querySelector('#Profile_view').append(unfollow_button);
              }

              // Post followers user has
              document.querySelector('#Profile_view').append(follower, followed, thematic_break);

            });
            }
            else{
              // Post followers user has
              document.querySelector('#Profile_view').append(follower, followed, thematic_break);
            }
          }

        // Wait for API to return before continue with program
        window.setTimeout(function(){
          // Create ul element
          const ul = document.createElement('ul');
          ul.className = "list-group";

          // Create li element
          const li = document.createElement('li');
          li.className = "list-group-item";

          // List elements
          const pro_sender = document.createElement('div');
          pro_sender.innerHTML = `<strong>${profile.poster}</strong>`;
          pro_sender.className = "col-3";
          const pro_content = document.createElement('div');
          pro_content.innerHTML = `${profile.content}`;
          pro_content.className = "col-6";
          const pro_timestamp = document.createElement('div');
          pro_timestamp.innerHTML = `${profile.timestamp}`;
          pro_timestamp.className = "col-9";
          const pro_like = document.createElement('div');
          pro_like.setAttribute("id", 'like_post');

          // Like post fetch
          fetch(`/like/${profile.id}`)
          .then(response => response.json())
          .then(profile_like => {

              if(`${profile_like.liked}` == '1' || `${profile_like.liked}` == '0'){
                profile_liked = profile_like.liked;
              }
              else{
                profile_liked = '0';
              }
              if(`${currentUser}` != `${profile.poster_id}`){
                if(`${profile.post_like}` != '0' && `${profile_liked}` != '0'){
                  pro_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${profile.id},false)" src="https://www.downloadclipart.net/large/11072-red-heart-design.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${profile.post_like}`;
                }
                else if(`${profile.post}` != '0'){
                  pro_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${profile.id},true)" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${profile.post_like}`;
                }
                else{
                  pro_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${profile.id},true)" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
                }
              }
              else{
                if(`${profile.post_like}` != '0' && `${profile_liked}` != '0'){
                  pro_like.innerHTML = `<img id="like_post_img" src="https://www.downloadclipart.net/large/11072-red-heart-design.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${profile.post_like}`;
                }
                else if(`${profile.post}` != '0'){
                  pro_like.innerHTML = `<img id="like_post_img" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>${profile.post_like}`;
                }
                else{
                  pro_like.innerHTML = `<img id="like_post_img" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
                }
              }
              pro_like.className = "col-9";
           });

           window.setTimeout(function(){
             const pro_button = document.createElement('div');
             pro_button.innerHTML = `<a id="edit_post" onclick="edit_of_post(${profile.id})">Edit</a>`;
             pro_button.className = "col-6";
             if(`${profile.id}` !== `${profileId}`){
               li.append(pro_sender, pro_content, pro_timestamp, pro_like);
             }
             else{
               li.append(pro_sender, pro_button, pro_content, pro_timestamp, pro_like);
             }
             li.setAttribute("id", `${profile.id}`);

             ul.appendChild(li);
             ul.setAttribute("id", 'prolist');

             // Display post
             document.querySelector('#Profile_view').append(ul);
           },500);
        },500);

        // To change follow button to unfollow button
        fetch(`/followed/${profileId}`)
        .then(response => response.json())
        .then(buttonCheck => {

          fetch(`/follow/${currentUser}`)
          .then(response => response.json())
          .then(update => {

            update.forEach(update => {

              // Update whether user is followed & user that is following
              if(`${buttonCheck.followed}` != 'true' || `${buttonCheck.followed}` == 'undefined'){
                console.log(`follower:${profile.poster_follower} and followed:${profile.poster_followed}`);
                // Update follow count, following count and follow
                document.querySelector('#follow_user').onclick = () => {
                  fetch(`/follow/${profile.poster_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                      followed_count: (update.poster_followed + 1),
                      follower_count: (update.poster_follower + 1),
                      followed_user: `${profile.poster_id}`,
                      following_user: `${currentUser}`,
                      followed: true
                    })
                  })

                  // Wait for API call
                   window.setTimeout(refreshpage, 1000);
                }
              }
              else{
                console.log(`follower:${profile.poster_follower} and followed:${profile.poster_followed}`);
                // Update to un-follow count, following count and follow
                document.querySelector('#unfollow_user').onclick = () => {
                  fetch(`/follow/${profile.poster_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                      followed_count: (update.poster_followed - 1),
                      follower_count: (update.poster_follower - 1),
                      followed_user: `${profile.poster_id}`,
                      following_user: `${currentUser}`,
                      followed: false
                    })
                  })

                  // Wait for API call
                  window.setTimeout(refreshpage, 1000);
                }
              }
            });
          });
        });
      });
    });
  }

  function like_of_post(post_id,value) {

    // Get current user id
    const currentUser = document.querySelector('#UserId').value;

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
          console.log(`Will take: ${posts.poster_like}, Value: ${value}`);
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
    document.querySelector('#pagin_view').style.display = 'none';

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
