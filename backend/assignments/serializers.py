from pathlib import Path

from django.utils import timezone
from rest_framework import serializers

from courses.models import Enrollment
from .models import Assignment, AssignmentSubmission


class AssignmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(
        source="course.title",
        read_only=True,
    )

    class Meta:
        model = Assignment

        fields = [
            "id",
            "course",
            "course_title",
            "title",
            "description",
            "attachment",
            "due_date",
            "max_marks",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    assignment_title = serializers.CharField(
        source="assignment.title",
        read_only=True,
    )

    class Meta:
        model = AssignmentSubmission

        fields = [
            "id",
            "assignment",
            "assignment_title",
            "student",
            "submission_file",
            "comment",
            "submitted_at",
            "marks",
            "feedback",
            "graded_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "submitted_at",
            "marks",
            "feedback",
            "graded_at",
        ]

    def validate_submission_file(self, file):
        allowed_extensions = {
            ".pdf",
            ".doc",
            ".docx",
            ".ppt",
            ".pptx",
            ".zip",
        }

        extension = Path(file.name).suffix.lower()

        if extension not in allowed_extensions:
            raise serializers.ValidationError(
                "Only PDF, DOC, DOCX, PPT, PPTX, and ZIP files are allowed."
            )

        if file.size > 10 * 1024 * 1024:
            raise serializers.ValidationError(
                "Submission file size must not exceed 10 MB."
            )

        return file

    def validate(self, attrs):
        request = self.context["request"]
        student = request.user

        assignment = attrs.get(
            "assignment",
            self.instance.assignment if self.instance else None,
        )

        if assignment.due_date <= timezone.now():
            raise serializers.ValidationError(
                "The deadline for this assignment has passed."
            )

        is_enrolled = Enrollment.objects.filter(
            student=student,
            course=assignment.course,
        ).exists()

        if not is_enrolled:
            raise serializers.ValidationError(
                "You are not enrolled in this course."
            )

        duplicate = AssignmentSubmission.objects.filter(
            assignment=assignment,
            student=student,
        )

        if self.instance:
            duplicate = duplicate.exclude(pk=self.instance.pk)

        if duplicate.exists():
            raise serializers.ValidationError(
                "You have already submitted this assignment."
            )

        return attrs


class AssignmentGradingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission

        fields = [
            "marks",
            "feedback",
            "graded_at",
        ]

        read_only_fields = ["graded_at"]

    def validate_marks(self, marks):
        if marks > self.instance.assignment.max_marks:
            raise serializers.ValidationError(
                f"Marks cannot exceed {self.instance.assignment.max_marks}."
            )

        return marks