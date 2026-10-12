from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas


def generate_certificate_pdf(certificate):
    buffer = BytesIO()

    width, height = landscape(A4)

    pdf = canvas.Canvas(buffer, pagesize=(width, height))

    # Background
    pdf.setFillColor(colors.HexColor("#F8FAFC"))
    pdf.rect(0, 0, width, height, fill=1, stroke=0)

    # Decorative border
    pdf.setStrokeColor(colors.HexColor("#1E3A8A"))
    pdf.setLineWidth(5)
    pdf.rect(25, 25, width - 50, height - 50)

    pdf.setStrokeColor(colors.HexColor("#D4AF37"))
    pdf.setLineWidth(2)
    pdf.rect(35, 35, width - 70, height - 70)

    # Branding
    pdf.setFillColor(colors.HexColor("#1E3A8A"))
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawCentredString(width / 2, height - 100, "LEARNING MANAGEMENT SYSTEM")

    # Certificate heading
    pdf.setFont("Helvetica-Bold", 34)
    pdf.drawCentredString(width / 2, height - 170, "CERTIFICATE OF COMPLETION")

    # Description
    pdf.setFillColor(colors.HexColor("#475569"))
    pdf.setFont("Helvetica", 16)
    pdf.drawCentredString(width / 2, height - 220, "This is proudly presented to")

    # Student name
    student_name = (
        certificate.student.get_full_name()
        or certificate.student.email
    )

    pdf.setFillColor(colors.HexColor("#0F172A"))
    pdf.setFont("Helvetica-Bold", 28)
    pdf.drawCentredString(width / 2, height - 270, student_name)

    # Course description
    pdf.setFillColor(colors.HexColor("#475569"))
    pdf.setFont("Helvetica", 16)
    pdf.drawCentredString(
        width / 2,
        height - 315,
        "For successfully completing the course"
    )

    # Course title
    pdf.setFillColor(colors.HexColor("#1E3A8A"))
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawCentredString(
        width / 2,
        height - 355,
        certificate.course.title
    )

    # Issue date
    issued_date = certificate.issued_at.strftime("%d %B %Y")

    pdf.setFillColor(colors.HexColor("#334155"))
    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(
        width / 2,
        115,
        f"Issued on: {issued_date}"
    )

    # Certificate ID
    pdf.setFont("Helvetica", 10)
    pdf.drawCentredString(
        width / 2,
        85,
        f"Certificate ID: {certificate.certificate_id}"
    )

    pdf.save()

    buffer.seek(0)
    return buffer