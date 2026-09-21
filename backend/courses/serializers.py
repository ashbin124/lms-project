from rest_framework import serializers

from .models import Course, CourseCategory, Enrollment


class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = [
            "id",
            "name",
        ]


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(
        source="instructor.email",
        read_only=True,
    )

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "category",
            "category_name",
            "instructor_name",
            "thumbnail",
            "level",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "status",
            "created_at",
            "updated_at",
        ]


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    student_email = serializers.CharField(
        source="student.email",
        read_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student_email",
            "course",
            "course_title",
            "enrolled_at",
        ]
        read_only_fields = [
            "student_email",
            "course_title",
            "enrolled_at",
        ]

    def validate_course(self, course):
     if course.status != Course.Status.APPROVED:
        raise serializers.ValidationError(
            "You can only enroll in approved courses."
        )

     return course

    def validate(self, attrs):
     request = self.context.get("request")
     course = attrs.get("course")

     if (
        request
        and request.user.is_authenticated
        and Enrollment.objects.filter(
            student=request.user,
            course=course,
        ).exists()
    ):
        raise serializers.ValidationError(
            "You are already enrolled in this course."
        )

     return attrs