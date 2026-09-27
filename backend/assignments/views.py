from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from accounts.permissions import IsInstructor, IsStudent
from .models import Assignment, AssignmentSubmission
from .serializers import AssignmentSerializer, AssignmentSubmissionSerializer, AssignmentGradingSerializer


class AssignmentViewSet(ModelViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return Assignment.objects.filter(
            course__instructor=self.request.user
        )

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]

        if course.instructor != self.request.user:
            raise PermissionDenied(
                "You can only create assignments for your own courses."
            )

        serializer.save()

    def perform_update(self, serializer):
        course = serializer.validated_data.get(
            "course",
            serializer.instance.course,
        )

        if course.instructor != self.request.user:
            raise PermissionDenied(
                "You can only move assignments to your own courses."
            )

        serializer.save()


class StudentAssignmentViewSet(ReadOnlyModelViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Assignment.objects.filter(
            course__status="APPROVED",
            course__enrollments__student=self.request.user,
        ).distinct()

class AssignmentSubmissionViewSet(ModelViewSet):
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return AssignmentSubmission.objects.filter(
            student=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class InstructorSubmissionViewSet(ReadOnlyModelViewSet):
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return AssignmentSubmission.objects.filter(
            assignment__course__instructor=self.request.user
        )

    @action(detail=True, methods=["patch"])
    def grade(self, request, pk=None):
        submission = self.get_object()

        serializer = AssignmentGradingSerializer(
            submission,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save(graded_at=timezone.now())

        return Response(
            AssignmentSubmissionSerializer(
                submission,
                context={"request": request},
            ).data
        )