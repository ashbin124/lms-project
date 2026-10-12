from django.http import FileResponse
from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from courses.models import Course

from .models import Certificate
from .serializers import CertificateSerializer
from .services import issue_certificate
from .pdf_generator import generate_certificate_pdf


class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

    # Students can access only their own certificates
    def get_queryset(self):
        return Certificate.objects.filter(
            student=self.request.user
        ).select_related("student", "course")

    # Issue a certificate
    @action(detail=False, methods=["post"])
    def issue(self, request):
        course_id = request.data.get("course_id")

        if not course_id:
            return Response(
                {"error": "course_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            course = Course.objects.get(id=course_id)
        except (Course.DoesNotExist, ValueError, TypeError):
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            certificate, created = issue_certificate(
                request.user,
                course
            )
        except ValueError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(certificate)

        return Response(
            {
                "created": created,
                "certificate": serializer.data
            },
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            )
        )

    # Download certificate PDF
    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        certificate = self.get_object()

        pdf_buffer = generate_certificate_pdf(certificate)

        return FileResponse(
            pdf_buffer,
            as_attachment=True,
            filename=f"certificate_{certificate.certificate_id}.pdf",
            content_type="application/pdf"
        )

    # Public certificate verification
    @action(
        detail=False,
        methods=["get"],
        url_path=r"verify/(?P<certificate_uuid>[0-9a-fA-F-]{36})",
        permission_classes=[AllowAny],
    )
    def verify(self, request, certificate_uuid=None):
        certificate = get_object_or_404(
            Certificate.objects.select_related("student", "course"),
            certificate_id=certificate_uuid,
        )

        serializer = self.get_serializer(certificate)

        return Response({
            "valid": True,
            "certificate": serializer.data,
        })