from courses.models import Course, Enrollment, LessonProgress
from assignments.models import Assignment, AssignmentSubmission
from django.db import transaction
from .models import Certificate

def check_certificate_eligibility(student, course):
    # 1. Course must be approved
    if course.status != Course.Status.APPROVED:
        return False, "Course is not approved."

    # 2. Student must be enrolled
    if not Enrollment.objects.filter(
        student=student,
        course=course
    ).exists():
        return False, "Student is not enrolled in this course."

    # 3. Course must contain at least one lesson
    total_lessons = course.lessons.count()

    if total_lessons == 0:
        return False, "Course has no lessons."

    # 4. All lessons must be completed
    completed_lessons = LessonProgress.objects.filter(
        student=student,
        lesson__course=course
    ).count()

    if completed_lessons < total_lessons:
        return False, "Not all lessons are completed."

    # 5. All assignments must be submitted and graded
    assignments = Assignment.objects.filter(course=course)

    for assignment in assignments:
        submission = AssignmentSubmission.objects.filter(
            assignment=assignment,
            student=student
        ).first()

        if submission is None:
            return False, "All assignments must be submitted."

        if submission.marks is None:
            return False, "All assignments must be graded."

    return True, "Student is eligible for a certificate."


@transaction.atomic
def issue_certificate(student, course):
    eligible, message = check_certificate_eligibility(
        student,
        course
    )

    if not eligible:
        raise ValueError(message)

    certificate, created = Certificate.objects.get_or_create(
        student=student,
        course=course
    )

    return certificate, created