from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from accounts.permissions import IsInstructor, IsAdmin, IsStudent
from .models import (
    Course,
    CourseCategory,
    Enrollment,
    Lesson,
    StudyMaterial,
    LessonProgress,
)
from .serializers import (
    CourseSerializer,
    CourseCategorySerializer,
    EnrollmentSerializer,
    LessonSerializer,
    StudyMaterialSerializer,
    StudentLessonSerializer,
    LessonProgressSerializer,
)

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


class EnrollmentViewSet(ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Enrollment.objects.filter(
            student=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            student=self.request.user
        )

class LessonViewSet(ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return Lesson.objects.filter(
            course__instructor=self.request.user
        )
    
    def perform_create(self, serializer):
        course = serializer.validated_data["course"]

        if course.instructor != self.request.user:
            raise ValidationError(
                {"course": "You can only add lessons to your own courses."}
            )

        serializer.save()

    def perform_update(self, serializer):
        course = serializer.validated_data.get(
            "course",
            serializer.instance.course,
        )

        if course.instructor != self.request.user:
            raise ValidationError(
                {"course": "You can only move lessons to your own courses."}
            )

        serializer.save()

class StudyMaterialViewSet(ModelViewSet):
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return  StudyMaterial.objects.filter(
            lesson__course__instructor=self.request.user
        )

    def perform_create(self, serializer):
        lesson = serializer.validated_data["lesson"]

        if lesson.course.instructor != self.request.user:
            raise ValidationError(
                {
                    "lesson": "you can only add materials to lessons in your own courses."
                }
            )
        serializer.save()

    def perform_update(self, serializer):
        lesson = serializer.validated_data.get(
            "lesson",
            serializer.instance.lesson,
        )

        if lesson.course.instructor != self.request.user:
            raise ValidationError(
               {
                   "lesson": "You can only move materials to lessons in your own courses."
               }
            )

        serializer.save()

class StudentLessonViewSet(ReadOnlyModelViewSet):
    serializer_class = StudentLessonSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Lesson.objects.filter(
            course__status=Course.Status.APPROVED,
            course__enrollments__student=self.request.user,

        ).distinct()


class LessonProgressViewSet(ModelViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [IsStudent]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        return LessonProgress.objects.filter(
            student=self.request.user
        )

    def perform_create(self, serializer):
        lesson = serializer.validated_data["lesson"]
        student = self.request.user

        if lesson.course.status != Course.Status.APPROVED:
            raise ValidationError(
                {
                    "lesson": "You cannot complete a lesson from an unapproved course."
                }
            )

        is_enrolled = Enrollment.objects.filter(
            student=student,
            course=lesson.course,
        ).exists()

        if not is_enrolled:
            raise ValidationError(
                {
                    "lesson": "You are not enrolled in this course."
                }
            )

        already_completed = LessonProgress.objects.filter(
            student=student,
            lesson=lesson,
        ).exists()

        if already_completed:
            raise ValidationError(
                {
                    "lesson": "This lesson is already completed."
                }
            )

        serializer.save(
            student=student
        )

class InstructorProgressViewSet(ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return Enrollment.objects.filter(
            course__instructor=self.request.user
        ).select_related(
            "student",
            "course",
        )