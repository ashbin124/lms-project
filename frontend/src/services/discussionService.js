import api from "../api/axios";

export const getDiscussions = async () => {
    const response = await api.get("discussions/");
    return response.data;
};

export const getDiscussion = async (discussionId) => {
    const response = await api.get(`discussions/${discussionId}/`);
    return response.data;
};

export const createDiscussion = async (discussionData) => {
    const response = await api.post("discussions/",discussionData);
    return response.data;
};

export const updateDiscussion = async (discussionId, discussionData) => {
    const response = await api.patch(
        `discussions/${discussionId}/`,
        discussionData
    );
    return response.data;
};

export const deleteDiscussion = async (discussionId) => {
    await api.delete(`discussions/${discussionId}/`);
};

export const createComment = async (commentData) => {
    const response = await api.post("comments/", commentData);
    return response.data;
};

export const updateComment = async (commentId, commentData) => {
    const response = await api.patch(`comments/${commentId}/`,commentData);
    return response.data;
};

export const deleteComment = async (commentId) => {
    await api.delete(`comments/${commentId}/`);
};