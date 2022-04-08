// Pagination number per page
const profileNumberPerPage = 10;

document.addEventListener('DOMContentLoaded', function () {

  // Variable for profile
  const profileId = document.querySelector('#Idprofile').value;
  const currentUser = document.querySelector('#Idcheck').value;
  const profileTotal_Pages = document.querySelector('#ProfileTotalPages').value;
  const profileCurrent_Page = document.querySelector('#ProfileCurrentPage').value;

  document.querySelector('#profile_id').innerHTML = '';

  // Made to profile.js
  console.log(profileId);
  console.log(currentUser);

  // Retrieve data
  fetch(`/follow/${profileId}`)
  .then(response => response.json())
  .then(profile => {
    // Print profile
    console.log(profile);

    // Create ul element
    const ul = document.createElement('ul');
    ul.className = "list-group";

    // Run loop
    profile.forEach((profile, index) => {

      if(index >= (profileNumberPerPage * (profileCurrent_Page - 1)) && index < (profileNumberPerPage * profileCurrent_Page)) {
        if(document.querySelector('#profile_id').innerHTML == ''){

          // Variable of followers
          const user_current = document.createElement('div');
          user_current.className = "col-3";
          user_current.innerHTML = `<h1><strong>${profile.poster}</strong></h1>`;
          const follower = document.createElement('div');
          follower.className = "col-6";
          follower.innerHTML = `You have ${profile.poster_followed} followers!`;
          const followed = document.createElement('div');
          followed.className = "col-6";
          followed.innerHTML = `You follow ${profile.poster_follower} users!`;
          const thematic_break = document.createElement('hr');

          console.log(`follower:${profile.poster_follower} and followed:${profile.poster_followed}`);

          // Post followers user has
          document.querySelector('#profile_id').append(user_current, follower, followed, thematic_break);
        }

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
        if(`${currentUser}` != `${profile.poster_id}`){
          if(`${profile.post_like}` != '0'){
            pro_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${profile.id})" src="https://www.downloadclipart.net/large/11072-red-heart-design.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>1`;
          }
          else{
            pro_like.innerHTML = `<img id="like_post_img" onclick="like_of_post(${profile.id})" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
          }
        }
        else{
          if(`${profile.post_like}` != '0'){
            pro_like.innerHTML = `<img id="like_post_img" src="https://www.downloadclipart.net/large/11072-red-heart-design.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>1`;
          }
          else{
            pro_like.innerHTML = `<img id="like_post_img" src="https://maxcdn.icons8.com/Share/icon/win10/Gaming/hearts1600.png" width="15" height="15" class="d-inline-block align-top" alt=""></img>0`;
          }
        }
        pro_like.className = "col-9";
        const pro_button = document.createElement('div');
        pro_button.innerHTML = `<a id="edit_post" onclick="edit_of_post(${profile.id})">Edit</a>`;
        pro_button.className = "col-6";
        if(`${pro_sender}` !== `${profileId}`){
          li.append(pro_sender, pro_content, pro_timestamp, pro_like);
        }
        else{
          li.append(pro_sender, pro_button, pro_content, pro_timestamp, pro_like);
        }
        li.setAttribute("id", `${profile.id}`);

        ul.appendChild(li);
        ul.setAttribute("id", 'prolist');


        // Display post
        document.querySelector('#profile_id').append(ul);
      }
      else {
        return;
      }
    });
  });
});
