import api from "../api/axios";

export const getCertificates = async () => {
  const response = await api.get("/certificates/");
  return response.data;
};

export const issueCertificate = async (courseId) => {
  const response = await api.post("/certificates/issue/", {
    course_id: courseId,
  });

  return response.data;
};

export const downloadCertificate = async (certificateId) => {
  const response = await api.get(
    `/certificates/${certificateId}/download/`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type: "application/pdf",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `certificate_${certificateId}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};