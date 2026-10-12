from rest_framework import serializers
from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    course_title = serializers.CharField(
        source="course.title",
        read_only=True
    )

    class Meta:
        model = Certificate
        fields = [
            "id",
            "certificate_id",
            "student_name",
            "course_title",
            "issued_at",
        ]
        read_only_fields = fields

    def get_student_name(self, obj):
        full_name = obj.student.get_full_name()
        return full_name or obj.student.email