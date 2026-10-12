
import uuid

from django.conf import settings
from django.db import models

from courses.models import Course


class Certificate(models.Model):
    certificate_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="certificates",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="certificates",
    )

    issued_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-issued_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course_certificate",
            )
        ]

    def __str__(self):
        return f"{self.student.email} - {self.course.title}"