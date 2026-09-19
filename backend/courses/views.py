from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from accounts.permissions import IsInstructor, IsAdmin
from .models import Course, CourseCategory
from .serializers import CourseSerializer, CourseCategorySerializer


class CourseViewSet(ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return Course.objects.filter(
            instructor=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            instructor=self.request.user,
            status=Course.Status.PENDING,
        )

class AdminCourseViewSet(ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return Course.objects.all()

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        course = self.get_object()
        course.status = Course.Status.APPROVED
        course.save()

        serializer = self.get_serializer(course)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        course = self.get_object()
        course.status = Course.Status.REJECTED
        course.save()

        serializer = self.get_serializer(course)
        return Response(serializer.data)

class PublicCourseViewSet(ReadOnlyModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Course.objects.filter(
            status=Course.Status.APPROVED
        )

class CourseCategoryViewSet(ReadOnlyModelViewSet):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [AllowAny]