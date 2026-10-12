import { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  getInstructorCourse,
  getPublicCourse,
} from "../services/courseService";
import { useParams } from "react-router-dom";
import {
  getDiscussions,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  createComment,
  deleteComment,
} from "../services/discussionService";

export default function Discussions() {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const [courseInstructorId, setCourseInstructorId] = useState(null);

  // Discussions
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create discussion form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Reply form
  const [replyTexts, setReplyTexts] = useState({});
  const [replySubmitting, setReplySubmitting] = useState(null);
  const [replyErrors, setReplyErrors] = useState({});

  const [editingDiscussionId, setEditingDiscussionId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);


  // Fetch course instructor details
useEffect(() => {
  const fetchCourseInstructor = async () => {
    try {
      setCourseInstructorId(null);

      const course =
        user?.role === "INSTRUCTOR"
          ? await getInstructorCourse(courseId)
          : await getPublicCourse(courseId);

      setCourseInstructorId(course.instructor_id);
    } catch (err) {
      console.error("Failed to fetch course instructor:", err);
    }
  };

  if (user && courseId) {
    fetchCourseInstructor();
  }
}, [courseId, user?.id, user?.role]);
  // Fetch discussions
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDiscussions();

        const discussionList = Array.isArray(data)
          ? data
          : data.results || [];

        const filteredDiscussions = discussionList.filter(
          (discussion) =>
            Number(discussion.course) === Number(courseId)
        );

        setDiscussions(filteredDiscussions);
      } catch (err) {
        console.error(err);
        setError("Failed to load discussions.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [courseId]);

  // Create a discussion
  const handleCreateDiscussion = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setFormError("Please enter both a title and content.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const newDiscussion = await createDiscussion({
        course: Number(courseId),
        title: title.trim(),
        content: content.trim(),
      });

      setDiscussions((previous) => [
        newDiscussion,
        ...previous,
      ]);

      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);

      setFormError(
        err.response?.data?.detail ||
          "Failed to create discussion."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Create a reply
  const handleCreateReply = async (discussionId) => {
    const replyContent = replyTexts[discussionId]?.trim();

    if (!replyContent) {
      setReplyErrors((previous) => ({
        ...previous,
        [discussionId]: "Please enter a reply.",
      }));
      return;
    }

    try {
      setReplySubmitting(discussionId);

      setReplyErrors((previous) => ({
        ...previous,
        [discussionId]: "",
      }));

      const newComment = await createComment({
        discussion: discussionId,
        content: replyContent,
      });

      // Add reply to the correct discussion
      setDiscussions((previous) =>
        previous.map((discussion) =>
          discussion.id === discussionId
            ? {
                ...discussion,
                comments: [
                  ...discussion.comments,
                  newComment,
                ],
              }
            : discussion
        )
      );

      // Clear reply input
      setReplyTexts((previous) => ({
        ...previous,
        [discussionId]: "",
      }));
    } catch (err) {
      console.error(err);

      setReplyErrors((previous) => ({
        ...previous,
        [discussionId]:
          err.response?.data?.detail ||
          "Failed to post reply.",
      }));
    } finally {
      setReplySubmitting(null);
    }
  };

  // Start editing a discussion
const handleStartEdit = (discussion) => {
  setEditingDiscussionId(discussion.id);
  setEditTitle(discussion.title);
  setEditContent(discussion.content);
  setEditError("");
};

// Cancel editing
const handleCancelEdit = () => {
  setEditingDiscussionId(null);
  setEditTitle("");
  setEditContent("");
  setEditError("");
};

// Save edited discussion
const handleSaveEdit = async (discussionId) => {
  if (!editTitle.trim() || !editContent.trim()) {
    setEditError("Title and content are required.");
    return;
  }

  try {
    setEditSubmitting(true);
    setEditError("");

    const updatedDiscussion = await updateDiscussion(discussionId, {
      title: editTitle.trim(),
      content: editContent.trim(),
    });

    setDiscussions((previous) =>
      previous.map((discussion) =>
        discussion.id === discussionId
          ? { ...discussion, ...updatedDiscussion }
          : discussion
      )
    );

    handleCancelEdit();
  } catch (err) {
    console.error(err);
    setEditError(
      err.response?.data?.detail || "Failed to update discussion."
    );
  } finally {
    setEditSubmitting(false);
  }
};

// Delete a discussion
const handleDeleteDiscussion = async (discussionId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this discussion and all its replies?"
  );

  if (!confirmed) return;

  try {
    await deleteDiscussion(discussionId);

    setDiscussions((previous) =>
      previous.filter(
        (discussion) => discussion.id !== discussionId
      )
    );

    if (editingDiscussionId === discussionId) {
      handleCancelEdit();
    }
  } catch (err) {
    console.error("Failed to delete discussion:", err);
    alert(
      err.response?.data?.detail ||
        "Failed to delete discussion."
    );
  }
};
// Delete a reply
const handleDeleteReply = async (discussionId, commentId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this reply?"
  );

  if (!confirmed) return;

  try {
    await deleteComment(commentId);

    setDiscussions((previous) =>
      previous.map((discussion) =>
        discussion.id === discussionId
          ? {
              ...discussion,
              comments: discussion.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }
          : discussion
      )
    );
  } catch (err) {
    console.error("Failed to delete reply:", err);

    alert(
      err.response?.data?.detail ||
        "Failed to delete reply."
    );
  }
};


// Check whether the user can delete a reply
const canDeleteReply = (comment) => {
  if (!user) return false;

  const isAuthor =
    Number(comment.author) === Number(user.id);

  const isCourseInstructor =
    user.role === "INSTRUCTOR" &&
    courseInstructorId !== null &&
    Number(courseInstructorId) === Number(user.id);

  return isAuthor || isCourseInstructor;
};

// Check whether the user can edit a discussion
const canEditDiscussion = (discussion) => {
  if (!user) return false;

  const isAuthor =
    Number(discussion.author) === Number(user.id);

  const isCourseInstructor =
    user.role === "INSTRUCTOR" &&
    courseInstructorId !== null &&
    Number(courseInstructorId) === Number(user.id);

  return isAuthor || isCourseInstructor;
};

  if (loading) {
    return <p className="p-6">Loading discussions...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Course Discussions
      </h1>

      {/* Create Discussion Form */}
      <form
        onSubmit={handleCreateDiscussion}
        className="border rounded-lg p-5 mb-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Create New Discussion
        </h2>

        <div>
          <label
            htmlFor="discussion-title"
            className="block mb-2 font-medium"
          >
            Discussion Title
          </label>

          <input
            id="discussion-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter discussion title"
            maxLength={200}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label
            htmlFor="discussion-content"
            className="block mb-2 font-medium"
          >
            Discussion Content
          </label>

          <textarea
            id="discussion-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your question or discussion..."
            rows={4}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {formError && (
          <p className="text-red-600">{formError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {submitting
            ? "Creating..."
            : "Create Discussion"}
        </button>
      </form>

      {/* Discussion List */}
      {discussions.length === 0 ? (
        <p>No discussions available for this course.</p>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="border rounded-lg p-4"
            >
              {/* Discussion Details */}
              <h2 className="text-lg font-semibold">
                {discussion.title}
              </h2>

              {canEditDiscussion(discussion) && (
  <div className="flex gap-4 mt-2">
    <button
      type="button"
      onClick={() => handleStartEdit(discussion)}
      className="text-blue-600 hover:underline"
    >
      Edit Discussion
    </button>

    <button
      type="button"
      onClick={() => handleDeleteDiscussion(discussion.id)}
      className="text-red-600 hover:underline"
    >
      Delete Discussion
    </button>
  </div>
)}

              <p className="text-sm text-gray-500">
                Posted by: {discussion.author_name}
              </p>

              <p className="mt-3">
                {discussion.content}
              </p>

              {editingDiscussionId === discussion.id && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSaveEdit(discussion.id);
    }}
    className="mt-4 border rounded-lg p-4 space-y-3 bg-gray-50"
  >
    <h3 className="font-semibold">Edit Discussion</h3>

    <input
      type="text"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      maxLength={200}
      required
      className="w-full border rounded p-2"
    />

    <textarea
      value={editContent}
      onChange={(e) => setEditContent(e.target.value)}
      rows={4}
      required
      className="w-full border rounded p-2"
    />

    {editError && (
      <p className="text-red-600 text-sm">{editError}</p>
    )}

    <div className="flex gap-3">
      <button
        type="submit"
        disabled={editSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {editSubmitting ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="button"
        onClick={handleCancelEdit}
        disabled={editSubmitting}
        className="bg-gray-300 px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  </form>
)}

              <p className="text-sm text-gray-500 mt-3">
                Comments: {discussion.comments.length}
              </p>

              {/* Replies Section */}
              <div className="mt-4 border-t pt-3">
                <h3 className="font-semibold mb-3">
                  Replies
                </h3>

                {discussion.comments.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No replies yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {discussion.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 rounded p-3"
                      >
                        <p className="text-sm font-semibold">
                          {comment.author_name}
                        </p>

                        <p className="mt-1">
                          {comment.content}
                        </p>

                        {canDeleteReply(comment) && (
  <button
    type="button"
    onClick={() =>
      handleDeleteReply(discussion.id, comment.id)
    }
    className="mt-2 text-sm text-red-600 hover:underline"
  >
    Delete Reply
  </button>
)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Reply Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateReply(discussion.id);
                  }}
                  className="mt-4 space-y-2"
                >
                  <textarea
                    value={
                      replyTexts[discussion.id] || ""
                    }
                    onChange={(e) =>
                      setReplyTexts((previous) => ({
                        ...previous,
                        [discussion.id]:
                          e.target.value,
                      }))
                    }
                    placeholder="Write your reply..."
                    rows={3}
                    required
                    className="w-full border rounded p-2"
                  />

                  {replyErrors[discussion.id] && (
                    <p className="text-red-600 text-sm">
                      {replyErrors[discussion.id]}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={replySubmitting !== null}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {replySubmitting === discussion.id
                      ? "Posting..."
                      : "Post Reply"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}