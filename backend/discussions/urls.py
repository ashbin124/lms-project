from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CommentViewSet,
    DiscussionViewSet,
)


router = DefaultRouter()

router.register(
    "discussions",
    DiscussionViewSet,
    basename="discussion",
)

router.register(
    "comments",
    CommentViewSet,
    basename="comment",
)


urlpatterns = [
    path("", include(router.urls)),
]