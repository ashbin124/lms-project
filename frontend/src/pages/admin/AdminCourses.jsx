import { useEffect, useState } from "react";
import { getAdminCourses, approveCourse, rejectCourse } from "../../services/courseService";

function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await getAdminCourses();
                setCourses(data);
            } catch (error) {
                setError("Failed to load courses.");
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);
    const handleApprove = async (courseId) => {
        try {
            const updatedCourse = await approveCourse(courseId);

            setCourses((currentCourses) =>
                currentCourses.map((course) =>
                    course.id === courseId ? updatedCourse : course
                )
            );
        } catch (error) {
            setError("Failed to approve course.");
        }
    };

    const handleReject = async (courseId) => {
        try {
            const updatedCourse = await rejectCourse(courseId);

            setCourses((currentCourses) =>
                currentCourses.map((course) =>
                    course.id === courseId ? updatedCourse : course
                )
            );
        } catch (error) {
            setError("Failed to reject course.");
        }
    };

    if (loading) {
        return <p>Loading courses...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Course Management</h1>

            {courses.length === 0 ? (
                <p>No courses available.</p>
            ) : (
                <div>
                    {courses.map((course) => (
                        <div key={course.id}>
                            <h2>{course.title}</h2>

                            <p>{course.description}</p>
                            <p>Instructor: {course.instructor_name}</p>
                            <p>Category: {course.category_name}</p>
                            <p>Level: {course.level}</p>
                            <p>Status: {course.status}</p>

                            {course.status === "PENDING" && (
                                <div>
                                    <button onClick={()=> handleApprove(course.id)}>Approve</button>

                                    <button onClick={()=> handleReject(course.id)}>Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminCourses;