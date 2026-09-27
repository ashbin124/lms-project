from rest_framework.routers import DefaultRouter

from .views import (
    CourseViewSet,
    AdminCourseViewSet,
    PublicCourseViewSet,
    CourseCategoryViewSet,
    EnrollmentViewSet,
    LessonViewSet,
    StudyMaterialViewSet,
    StudentLessonViewSet,
    LessonProgressViewSet,
    InstructorProgressViewSet,
)


router = DefaultRouter()


router.register(
    "courses",
    CourseViewSet,
    basename="course",
)

router.register(
    "admin/courses",
    AdminCourseViewSet,
    basename="admin-course",
)

router.register(
    "public/courses",
    PublicCourseViewSet,
    basename="public-course",
)

router.register(
    "categories",
    CourseCategoryViewSet,
    basename="category",
)

router.register(
    "enrollments",
    EnrollmentViewSet,
    basename="enrollment",
)

router.register(
    "lessons",
    LessonViewSet,
    basename="lesson",
)

router.register(
    "study-materials",
    StudyMaterialViewSet,
    basename="study-material",
)

router.register(
    "student/lessons",
    StudentLessonViewSet,
    basename="student-lesson",
)

router.register(
    "lesson-progress",
    LessonProgressViewSet,
    basename="lesson-progress",
)

router.register(
    "instructor/progress",
    InstructorProgressViewSet,
    basename="instructor-progress",
)


urlpatterns = router.urls