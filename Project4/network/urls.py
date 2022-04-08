
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:user_name>", views.profile_view, name="profile"),
    path("following/<str:user_name>", views.following_view, name="following"),

    # API Routes
    path("user/<int:user_id>", views.user_view, name="user"),
    path("post", views.newpost, name="newpost"),
    path("post/<int:post_id>", views.post, name="post"),
    path("post/<str:allpost>", views.allpost, name="allpost"),
    path("edit/<int:post_id>", views.edit, name="edit"),
    path("like/<int:post_id>", views.like_view, name="like"),
    path("follow/<int:post_id>", views.follow_view, name="follow"),
    path("followed/<int:post_id>", views.followed_view, name="followed")
]
