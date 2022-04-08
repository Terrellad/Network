from django.contrib.auth.models import AbstractUser
from django.db import models
from django.views.generic import ListView


class User(AbstractUser):
    pass
    likecount = models.IntegerField(default=0)
    followed_count = models.IntegerField(default=0)
    follower_count = models.IntegerField(default=0)

    def serialize(self):
        return{
            "id": self.id,
            "username": self.username,
            "followed_count": self.followed_count,
            "follower_count": self.follower_count
        }

class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="post_user")
    poster = models.ForeignKey("User", on_delete=models.PROTECT, related_name="poster_post")
    content = models.CharField(max_length=225)
    post_like = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return{
            "id": self.id,
            "post_like": self.post_like,
            "poster_like": self.poster.likecount,
            "poster_followed": self.poster.followed_count,
            "poster_follower": self.poster.follower_count,
            "poster_id": self.poster.id,
            "poster": self.poster.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p"),
        }

class Like(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="like_user")
    postLiked = models.ForeignKey("Post", null=True, blank=True, on_delete=models.PROTECT, related_name="userlike")
    liked = models.IntegerField(default=0)

    def serialize(self):
        return{
            "id": self.id,
            "postLiked": self.postLiked.id,
            "liked": self.liked
        }

class Followed(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="followBy")
    following_user = models.ForeignKey("User", null=True, blank=True, on_delete=models.PROTECT, related_name="followingUser")
    followed = models.BooleanField(default=False)

    def serialize(self):
        return{
            "id": self.id,
            "following_user": self.following_user.id,
            "follow_count": self.following_user.followed_count,
            "following_count": self.following_user.follower_count,
            "followed": self.followed
        }
