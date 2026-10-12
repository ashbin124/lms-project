from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet

from courses.models import Course
from notifications.models import Notification

from .models import Comment, Discussion
from .permissions import IsStudentOrInstructor
from .serializers import (
    CommentSerializer,
    DiscussionSerializer,
)


def user_can_access_course(user, course):
    if user.role == "INSTRUCTOR":
        return course.instructor_id == user.id

    if user.role == "STUDENT":
        return (
            course.status == Course.Status.APPROVED
            and course.enrollments.filter(student=user).exists()
        )

    return False


class DiscussionViewSet(ModelViewSet):
    serializer_class = DiscussionSerializer
    permission_classes = [IsStudentOrInstructor]

    def get_queryset(self):
        user = self.request.user

        if user.role == "INSTRUCTOR":
            return (
                Discussion.objects.filter(
                    course__instructor=user
                )
                .select_related("course", "author")
                .prefetch_related("comments__author")
            )

        return (
            Discussion.objects.filter(
                course__status=Course.Status.APPROVED,
                course__enrollments__student=user,
            )
            .select_related("course", "author")
            .prefetch_related("comments__author")
            .distinct()
        )

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]

        if not user_can_access_course(self.request.user, course):
            raise PermissionDenied(
                "You do not have access to this course."
            )

        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        discussion = self.get_object()
        user = self.request.user

        if (
            discussion.author_id != user.id
            and not (
                user.role == "INSTRUCTOR"
                and discussion.course.instructor_id == user.id
            )
        ):
            raise PermissionDenied(
                "You cannot edit this discussion."
            )

        new_course = serializer.validated_data.get(
            "course",
            discussion.course,
        )

        if not user_can_access_course(user, new_course):
            raise PermissionDenied(
                "You do not have access to this course."
            )

        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user

        if (
            instance.author_id != user.id
            and not (
                user.role == "INSTRUCTOR"
                and instance.course.instructor_id == user.id
            )
        ):
            raise PermissionDenied(
                "You cannot delete this discussion."
            )

        instance.delete()


class CommentViewSet(ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsStudentOrInstructor]

    def get_queryset(self):
        user = self.request.user

        if user.role == "INSTRUCTOR":
            return (
                Comment.objects.filter(
                    discussion__course__instructor=user
                )
                .select_related(
                    "discussion",
                    "discussion__course",
                    "author",
                )
            )

        return (
            Comment.objects.filter(
                discussion__course__status=Course.Status.APPROVED,
                discussion__course__enrollments__student=user,
            )
            .select_related(
                "discussion",
                "discussion__course",
                "author",
            )
            .distinct()
        )

    def perform_create(self, serializer):
        discussion = serializer.validated_data["discussion"]
        user = self.request.user

        if not user_can_access_course(user, discussion.course):
            raise PermissionDenied(
                "You do not have access to this discussion."
            )

        serializer.save(author=user)

        # Notify the discussion author about a new reply.
        # Do not notify users about their own replies.
        if discussion.author_id != user.id:
            Notification.objects.create(
                recipient=discussion.author,
                notification_type=Notification.NotificationType.DISCUSSION,
                title="New Discussion Reply",
                message=(
                    f"{user.email} replied to your discussion "
                    f"'{discussion.title}'."
                ),
            )

    def perform_update(self, serializer):
        comment = self.get_object()
        user = self.request.user

        if (
            comment.author_id != user.id
            and not (
                user.role == "INSTRUCTOR"
                and comment.discussion.course.instructor_id == user.id
            )
        ):
            raise PermissionDenied(
                "You cannot edit this comment."
            )

        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user

        if (
            instance.author_id != user.id
            and not (
                user.role == "INSTRUCTOR"
                and instance.discussion.course.instructor_id == user.id
            )
        ):
            raise PermissionDenied(
                "You cannot delete this comment."
            )

        instance.delete()