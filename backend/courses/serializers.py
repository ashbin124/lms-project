from rest_framework import serializers

from .models import Course, CourseCategory, Enrollment, Lesson, StudyMaterial


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
        read_only=True,
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


class LessonSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    class Meta:
        model = Lesson
        fields = [
            "id",
            "course",
            "course_title",
            "title",
            "content",
            "video",
            "order",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "created_at",
            "updated_at",
        ]

    def validate_video(self, video):
        allowed_extensions = [
            "mp4",
            "webm",
            "mov",
        ]

        extension = video.name.split(".")[-1].lower()

        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Unsupported video type."
            )

        max_size = 100 * 1024 * 1024

        if video.size > max_size:
            raise serializers.ValidationError(
                "Video size cannot exceed 100 MB."
            )

        return video


class StudyMaterialSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(
        source="lesson.title",
        read_only=True,
    )

    class Meta:
        model = StudyMaterial
        fields = [
            "id",
            "lesson",
            "lesson_title",
            "title",
            "file",
            "uploaded_at",
        ]

        read_only_fields = [
            "uploaded_at",
        ]

    def validate_file(self, file):
        allowed_extensions = [
            "pdf",
            "doc",
            "docx",
            "ppt",
            "pptx",
            "zip",
        ]

        extension = file.name.split(".")[-1].lower()

        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Unsupported file type."
            )

        max_size = 10 * 1024 * 1024

        if file.size > max_size:
            raise serializers.ValidationError(
                "File size cannot exceed 10 MB."
            )

        return file


class StudentLessonSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    materials = StudyMaterialSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Lesson
        fields = [
            "id",
            "course",
            "course_title",
            "title",
            "content",
            "video",
            "order",
            "materials",
        ]

        read_only_fields = fields