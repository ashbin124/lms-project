from rest_framework.routers import DefaultRouter

from .views import (
    AssignmentViewSet,
    StudentAssignmentViewSet,
    AssignmentSubmissionViewSet,
    InstructorSubmissionViewSet,
)


router = DefaultRouter()

router.register(
    "assignments",
    AssignmentViewSet,
    basename="assignment",
)

router.register(
    "student/assignments",
    StudentAssignmentViewSet,
    basename="student-assignment",
)

router.register(
    "submissions",
    AssignmentSubmissionViewSet,
    basename="assignment-submission",
)

router.register(
    "instructor/submissions",
    InstructorSubmissionViewSet,
    basename="instructor-submission",
)


urlpatterns = router.urls