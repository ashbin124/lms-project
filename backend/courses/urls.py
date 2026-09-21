from rest_framework.routers import DefaultRouter

from .views import CourseViewSet, AdminCourseViewSet, PublicCourseViewSet, CourseCategoryViewSet, EnrollmentViewSet


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

urlpatterns = router.urls