import json, time
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.views.generic import ListView

from .models import User, Post, Like, Followed

# def locations:
# index - 31
# following_view - 53
# profile_view - 91
# login_view - 130
# logout_view - 150
# register - 155
# newpost - 183
# user_view - 213
# post - 227
# allpost - 257
# edit - 280
# like_view - 300
# followed_view - 375
# follow_view - 391

def index(request):

    # Authenticated users view allpage
    if request.user.is_authenticated:

        #Add pagination to models
        Pagin_List = Post.objects.all()
        paginator = Paginator(Pagin_List, 10)

        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        # successful complete of request
        print('page object:', page_obj)

        # Return to index
        return render(request, "network/index.html", {'page_obj': page_obj})

    # Everyone else will need to signin
    else:
        return HttpResponseRedirect(reverse("login"))

def following_view(request, user_name):

    # Authenticated users view follow_view
    if request.user.is_authenticated:
        try:
            IDprofile = User.objects.get(id=user_name)
        except:
            try:
                IDprofile = User.objects.get(username=user_name)
            except IntegrityError:
                if IDprofile == '':
                    return JsonResponse({"error": f"Unable to place {user_name} in page request."}, status=400)
        ProfileID = IDprofile.id
        print('User in IDprofile:', IDprofile)

        #Add pagination to models
        try:
            Follow_Pagin_List = Post.objects.filter(poster=IDprofile)
        except IntegrityError:
            if Follow_Pagin_List == '':
                return JsonResponse({"error": "Unable to find users."}, status=400)
        paginator = Paginator(Follow_Pagin_List, 10)

        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        # successful complete of request
        print('Follow page object:', page_obj)

        return render(request, "network/follow.html", {
            "IDprofile": ProfileID ,
            "follow_page_obj": page_obj
        })

    # Everyone else will need to signin
    else:
        return HttpResponseRedirect(reverse("login"))

def profile_view(request, user_name):

    # Authenticated users view profile page
    if request.user.is_authenticated:
        try:
            IdProfile = User.objects.get(id=user_name)
        except:
            try:
                IdProfile = User.objects.get(username=user_name)
            except IntegrityError:
                if idProfile == '':
                    return JsonResponse({"error": f"Unable to place {user_name} in page request."}, status=400)
        Profileid = IdProfile.id

        #Add pagination to models
        try:
            Profile_Pagin_List = Post.objects.filter(poster=IdProfile)
        except IntegrityError:
            if Profile_Pagin_List == '':
                return JsonResponse({"error": "Unable to find users."}, status=400)
        print('Profile pagin value:', Profile_Pagin_List)
        paginator = Paginator(Profile_Pagin_List, 10)

        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        # successful complete of request
        print('Profile page object:', page_obj)

        return render(request, "network/profile.html", {
            "idProfile": Profileid ,
            "profile_page_obj": page_obj
        })

    # Everyone else will need to signin
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def newpost(request):

    # Post needs to be POST method
    if request.method != "POST":
        return JsonResponse({"error": "Unable to process. Need to be a POST request."}, status=400)

    # Retrieve post data
    data = json.loads(request.body)
    try:
        poster = User.objects.get(username=data.get("poster", ""))
    except User.DoesNotExist:
        if poster == '':
            return JsonResponse({"error": f"User with name {poster} does not exist."}, status=400)

    content = data.get("content", "")
    if content == '':
        return JsonResponse({"error": "No content available."}, status=404)

    # Create post
    post = Post(
       user = poster,
       poster = poster,
       content = content
    )
    post.save()

    return JsonResponse({"message": "Post sent successfully."}, status=201)

@csrf_exempt
@login_required
def user_view(request, user_id):

    # Return user name
    if request.method == "GET":

        try:
            userName= User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist."}, status=404)

        return JsonResponse(userName.serialize())

@csrf_exempt
@login_required
def post(request, post_id):

    # Return post contents
    if request.method == "GET":
        posts = Post.objects.filter(
           id=post_id
        )
        # Return posts in reverse chronological order
        posts = posts.order_by("-timestamp").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)

    # Update whether user is followed
    elif request.method == "PUT":
        data = json.loads(request.body)
        # Query for requested post
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
        if data.get("content") is not None:
            post.content = data["content"]
        post.save()
        return HttpResponse(status=204)

    # Post must ve via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

def allpost(request, allpost):

    # Filter post returned based on page
    if allpost == "allpost":
        posts = Post.objects.all()
    elif allpost == "following":
        following_posts = Followed.objects.filter(
            user=request.user,
            followed=True
        )
        print("Following called.")
        return JsonResponse([following_post.serialize() for following_post in following_posts], safe=False)
    else:
        return JsonResponse({
            "error": "Invalid Page."
        }, status=400)

    # Return posts in reverse chronological order
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
@login_required
def edit(request, post_id):

    # Query for requested post
    try:
        post = Post.objects.get(user=request.user, pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Return post contents
    if request.method == "GET":
        return JsonResponse(post.serialize())

    # Post must be GET
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@csrf_exempt
@login_required
def like_view(request, post_id):

    # Fetch like for post
    if request.method == "GET":
        try:
            like_post = Like.objects.get(
                postLiked=post_id, user=request.user
            )
        except Like.DoesNotExist:
            like_post = 0
            return JsonResponse(like_post, safe=False)
        # Return like data
        return JsonResponse(like_post.serialize())

    # Update whether user is followed
    if request.method == "PUT":
        data = json.loads(request.body)
        # Query for requested post
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found."}, status=404)
        try:
            user = User.objects.get(id=post.poster_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)
        try:
            userLike = User.objects.get(id=data.get("currentuser", ""))
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)
        try:
            like = Like.objects.get(postLiked=post_id, user=data.get("currentuser", ""))
        except Like.DoesNotExist:
            newLike = Like(
                user = userLike,
                postLiked = post,
                liked = 1
            )
            newLike.save()
            post.post_like = (post.post_like + 1)
            post.save()
            user.likecount = (user.likecount + 1)
            user.save()
            return HttpResponse(status=204)

        # Give variable data
        likeCount = data.get("likecount", "")

        # Update user to reflex post liked & user like
        if likeCount == False:
            print("likeCount False.")
            like.liked = 0
            user.likecount = (user.likecount - 1)
            post.post_like = (post.post_like - 1)
            post.save()
            like.save()
            user.save()
        elif likeCount == True:
            print("likeCount True.")
            like.liked = 1
            user.likecount = (user.likecount + 1)
            post.post_like = (post.post_like + 1)
            post.save()
            like.save()
            user.save()

        return HttpResponse(status=204)

    # Post must ve via PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@csrf_exempt
@login_required
def followed_view(request, post_id):

    # Return post contents
    if request.method == "GET":
        print("Followed called.")
        try:
            following = Followed.objects.get(
                following_user=post_id, user=request.user
            )
        except Followed.DoesNotExist:
            return JsonResponse({"error": "Follow entry not found."}, status=404)
        # Return follow enteries in chronological order
        return JsonResponse(following.serialize())

@csrf_exempt
@login_required
def follow_view(request, post_id):

    # Return post contents
    if request.method == "GET":
        print("Follow with ID called.")
        try:
            posts = Post.objects.filter(
               poster=post_id
            )
        except Post.DoesNotExist:
            return JsonResponse({"error": "Follow entries were not found."}, status=404)
        # Return posts in reverse chronological order
        posts = posts.order_by("-timestamp").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)

    if request.method == "PUT":
        data = json.loads(request.body)
        # Query for requested users infromation
        try:
            user = User.objects.get(id=data.get("following_user", ""))
        except User.DoesNotExist:
            return JsonResponse({"error": "User following not found."}, status=404)
        try:
            user_followed = User.objects.get(id=data.get("followed_user", ""))
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found."}, status=404)
        try:
            follow = Followed.objects.get(user=user, following_user=data.get("followed_user"))
        except Followed.DoesNotExist:
             follow = Followed(
                 user = user,
                 following_user = user_followed,
                 followed = data.get("followed", "")
             )
             follow.save()
             user_followed.followed_count = data.get("followed_count", "")
             user_followed.save()
             user.follower_count = data.get("follower_count", "")
             user.save()
             print('Inside IntegrityError.')
             return HttpResponse(status=204)

        print('Outside IntegrityError.', data.get("follower_count", ""))
        user_followed.followed_count = data.get("followed_count", "")
        user.follower_count = data.get("follower_count", "")
        follow.followed = data.get("followed", "")
        user_followed.save()
        user.save()
        follow.save()
        return HttpResponse(status=204)

    # Post must ve via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
