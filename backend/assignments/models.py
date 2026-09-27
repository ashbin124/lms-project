
from django.db import models
from courses.models import Course
from django.conf import settings

class Assignment(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    attachment = models.FileField(
        upload_to="assignment_files/",
        blank=True,
        null=True,
    )

    due_date = models.DateTimeField()

    max_marks = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assignment_submissions",
    )

    submission_file = models.FileField(
        upload_to="assignment_submissions/",
    )

    comment = models.TextField(blank=True)

    submitted_at = models.DateTimeField(auto_now_add=True)

    marks = models.PositiveIntegerField(
        blank=True,
        null=True,
    )

    feedback = models.TextField(blank=True)

    graded_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["assignment", "student"],
                name="unique_assignment_student_submission",
            )
        ]

    def __str__(self):
        return f"{self.student.email} - {self.assignment.title}"