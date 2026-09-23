from django.db import models



class CourseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Course(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        INTERMEDIATE = "INTERMEDIATE", "Intermediate"
        ADVANCED = "ADVANCED", "Advanced"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    title = models.CharField(max_length=200)
    description = models.TextField()

    category = models.ForeignKey(
        CourseCategory,
        on_delete=models.PROTECT,
        related_name="courses"
    )

    instructor = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="courses"
    )

    thumbnail = models.ImageField(
        upload_to="course_thumbnails/",
        blank=True,
        null=True,
    )

    level = models.CharField(

        max_length=20,

        choices=Level.choices,

        default=Level.BEGINNER,

    )

    status = models.CharField(

        max_length=20,

        choices=Status.choices,

        default=Status.PENDING,

    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    student = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="enrollments",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course_enrollment",
            )
        ]

    def __str__(self):
        return f"{self.student.email} - {self.course.title}"


class Lesson(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="lessons",
    )

    title = models.CharField(max_length=200)

    content = models.TextField(
        blank=True,
    )

    video = models.FileField(
        upload_to="lesson_videos/",
        blank=True,
        null=True,
    )

    order = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class StudyMaterial(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="materials",
    )

    title = models.CharField(max_length=200)

    file = models.FileField(
        upload_to="study_materials/",
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"