
from django.contrib import admin

from .models import Course, CourseCategory


@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "instructor",
        "category",
        "level",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "level",
        "category",
    )

    search_fields = (
        "title",
        "instructor__email",
    )